export class BotBooking {
    constructor(page) {
        this.page = page;

        this.sourceStation = this.page.getByText('Select Your Source Station');
        this.sourceSearchBox = this.page.getByRole('textbox', { name: 'Search your Station or City' });

        this.destinationStation = this.page.getByText('ToSelect Your Destination');
        this.destinationSearchBox = this.page.getByRole('textbox', { name: 'Search your Station or City' });

        this.selectStation = this.page.locator('//div[@class="stations"]/div[1]');

        this.journeyDate = this.page.getByLabel('Select Your Journey Date');
        this.selectDate = (date, month, year) => this.page.locator(`#${month}-${year}`).getByText(`${date}`, { exact: true });  // Update dynamically if needed

        this.quota = this.page.getByLabel('Select Your Quota');
        this.selectQuota = (quota) => this.page.locator(`#${quota}`);

        this.bookTicketButton = this.page.getByRole('button', { name: 'Book Ticket' });

        // Select coach for the required train
        this.trainSelector = (trainNum) => {
            const trainRegex = new RegExp(`\\b${trainNum}\\b`);
            return this.page.getByText(trainRegex).locator('..').locator('..');
        };

        this.coachSelector = (trainNum, coachType) => {
            const trainContainer = this.trainSelector(trainNum);
            return trainContainer.locator('.ticket-new').filter({ hasText: coachType }).first();
        };

        // Login and Passenger details locators
        this.bookTicketButtonOnBot = this.page.getByRole('button', { name: 'BOOK TICKET' });
        this.mobileNumberInput = this.page.getByPlaceholder('Enter mobile number');
        this.getOtpButton = this.page.getByRole('button', { name: 'Get OTP' });
        this.irctcUserIdInput = this.page.getByRole('textbox', { name: 'Enter IRCTC User ID Here...' });
        this.verifyAndProceedButton = this.page.getByRole('button', { name: 'Verify and Proceed' });
        this.addNewPassengerButton = this.page.getByRole('button', { name: 'Add New Passenger' });

        // Passenger details
        this.passengerNameInput = this.page.getByRole('textbox', { name: 'Enter Full Name' });
        this.passengerAgeInput = this.page.getByPlaceholder('Enter Age');
        this.passengerGenderOption = (gender) => this.page.locator('#disha-drawer-1').getByText(gender, { exact: true });
        this.savePassengerButton = this.page.getByRole('button', { name: 'Save Passenger' });
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });

        // Berth choice locators
        this.passengerBlock = (data) => this.page.getByText(`${data.name}Adult|${data.gender}|${data.age} yearsBerth Choice: Any Berth`);
        this.berthChoiceLocator = (data) => this.passengerBlock(data).locator('div', { hasText: /^Any Berth$/ });

        // Dynamic pricing window
        this.dynamicPricingLocator = this.page.getByText('Dynamic Pricing is applicable');
        this.confirmButtonLocator = this.page.getByRole('button', { name: 'Confirm' });

        // Final confirmation
        this.autoUpgradationCheckbox = this.page.getByText('Consider for Auto Upgrade');
        this.fillEmailID = (emailID) => this.page.getByRole('textbox', { name: 'Enter your Email ID' }).fill(emailID);
        this.continueButtonV2 = this.page.locator('#drawer-footer').getByRole('button', { name: 'Continue' });
        this.agreeToPolicy = this.page.getByRole('button', { name: 'Yes, I understand' });
    }

    async fillStationDetails(monthMap, data) {
        await this.page.goto(data.url);

        await this.sourceStation.click();
        await this.sourceSearchBox.fill(data.srcStationCode);
        await this.selectStation.click();

        await this.destinationStation.click();
        await this.destinationSearchBox.fill(data.destStationCode);
        await this.selectStation.click();

        await this.journeyDate.click();
        await this.selectDate(data.date, monthMap[data.month], data.year).click();

        await this.quota.click();
        await this.selectQuota(data.quota).click();

        await this.bookTicketButton.click();
    }

    async loginViaOTP(data) {
        await this.bookTicketButtonOnBot.click();
        if (await this.dynamicPricingLocator.isVisible()) {
            await this.confirmButtonLocator.click();
        }
        await this.mobileNumberInput.fill(data.mobileNumber);
        await this.getOtpButton.click();
        await this.irctcUserIdInput.fill(data.irctcUserId);
        await this.verifyAndProceedButton.click();
    }

    async selectTrainAndCoach(trainNum, coachType) {
        const trainContainer = this.trainSelector(trainNum);
        const trainCount = await trainContainer.count();

        if (trainCount === 0) {
            throw new Error(`Train number "${trainNum}" not found.`);
        } else if (trainCount > 1) {
            throw new Error(`Multiple matches for train number "${trainNum}".`);
        }

        await trainContainer.first().waitFor();

        const coachContainer = this.coachSelector(trainNum, coachType);
        const coachCount = await coachContainer.count();

        if (coachCount === 0) {
            throw new Error(`No coach "${coachType}" found for train number "${trainNum}".`);
        }

        await coachContainer.click();
    }

    async addPassengerDetails(data) {
        await this.addNewPassengerButton.click();
        await this.passengerNameInput.fill(data.name);
        await this.passengerAgeInput.fill(data.age);
        await this.passengerGenderOption(data.gender).click();
        await this.savePassengerButton.click();
    }

    async selectBerthChoice(berthMapping, data) {
        if (data.berthPreference !== 'NA') {
            await this.berthChoiceLocator(data).first().click();
            await this.page.getByText(berthMapping[data.berthPreference]).click();
        }
    }

    async proceedTowardsPayment(data) {
        await this.autoUpgradationCheckbox.click();
        await this.fillEmailID(data.emailID);
        await this.continueButton.click();
        await this.continueButtonV2.click();
        await this.agreeToPolicy.click();
    }
}