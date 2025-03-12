export class BotBooking {
    constructor(page) {
        this.page = page;

        this.askDishaLauncher = this.page.locator('#askDishaLuncher').getByRole('img').first();
        this.bookTrainTicket = this.page.getByText('Book Train Ticket');
        this.dishaBotFrame = this.page.locator('#Disha-Bot').contentFrame();

        this.sourceStation = this.dishaBotFrame.getByText('Select Your Source Station');
        this.sourceSearchBox = this.dishaBotFrame.getByRole('textbox', { name: 'Search your Station or City' });

        this.destinationStation = this.dishaBotFrame.getByText('ToSelect Your Destination');
        this.destinationSearchBox = this.dishaBotFrame.getByRole('textbox', { name: 'Search your Station or City' });

        this.selectStation = this.dishaBotFrame.locator('//div[@class="stations"]/div[1]');

        this.journeyDate = this.dishaBotFrame.getByLabel('Select Your Journey Date');
        this.selectDate = (date, month, year) => this.dishaBotFrame.locator(`#${month}-${year}`).getByText(`${date}`);  // Update dynamically if needed

        this.quota = this.dishaBotFrame.getByLabel('Select Your Quota');
        this.selectQuota = (quota) => this.dishaBotFrame.locator(`#${quota}`);

        this.bookTicketButton = this.dishaBotFrame.getByRole('button', { name: 'Book Ticket' });

        // Select coach for the required train
        this.trainSelector = (trainNum) => {
            const trainRegex = new RegExp(`\\b${trainNum}\\b`);
            return this.dishaBotFrame.getByText(trainRegex).locator('..').locator('..');
        };

        this.coachSelector = (trainNum, coachType) => {
            const trainContainer = this.trainSelector(trainNum);
            return trainContainer.locator('.ticket-new').filter({ hasText: coachType }).first();
        };

        // Login and Passenger details locators
        this.bookTicketButtonOnBot = this.dishaBotFrame.getByRole('button', { name: 'BOOK TICKET' });
        this.mobileNumberInput = this.dishaBotFrame.getByPlaceholder('Enter mobile number');
        this.getOtpButton = this.dishaBotFrame.getByRole('button', { name: 'Get OTP' });
        this.irctcUserIdInput = this.dishaBotFrame.getByRole('textbox', { name: 'Enter IRCTC User ID Here...' });
        this.verifyAndProceedButton = this.dishaBotFrame.getByRole('button', { name: 'Verify and Proceed' });
        this.addNewPassengerButton = this.dishaBotFrame.getByRole('button', { name: 'Add New Passenger' });

        this.passengerNameInput = this.dishaBotFrame.getByRole('textbox', { name: 'Enter Full Name' });
        this.passengerAgeInput = this.dishaBotFrame.getByPlaceholder('Enter Age');
        this.passengerGenderOption = (gender) => this.dishaBotFrame.locator('#disha-drawer-1').getByText(gender, { exact: true });
        this.savePassengerButton = this.dishaBotFrame.getByRole('button', { name: 'Save Passenger' });
        this.continueButton = this.dishaBotFrame.getByRole('button', { name: 'Continue' });

        // Dynamic pricing window
        this.dynamicPricingLocator = this.dishaBotFrame.getByText('Dynamic Pricing is applicable');
        this.confirmButtonLocator = this.dishaBotFrame.getByRole('button', { name: 'Confirm' });


        // Final confirmation
        this.autoUpgradationCheckbox = this.dishaBotFrame.locator('div:nth-child(4) > div');
        this.fillEmailID = (emailID) => this.dishaBotFrame.getByRole('textbox', { name: 'Enter your Email ID' }).fill(emailID);
        this.continueButtonV2 = this.dishaBotFrame.locator('#drawer-footer').getByRole('button', { name: 'Continue' });
        this.agreeToPolicy = this.dishaBotFrame.getByRole('button', { name: 'Yes, I understand' });
    }

    async fillStationDetails(data) {
        await this.page.goto(data.url);

        await this.askDishaLauncher.click();
        await this.bookTrainTicket.click();

        await this.sourceStation.click();
        await this.sourceSearchBox.fill(data.srcStationCode);
        await this.selectStation.click();

        await this.destinationStation.click();
        await this.destinationSearchBox.fill(data.destStationCode);
        await this.selectStation.click();

        await this.journeyDate.click();
        await this.selectDate(data.date, data.month, data.year).click();

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

    async proceedTowardsPayment(data) {
        await this.autoUpgradationCheckbox.click();
        await this.fillEmailID(data.emailID);
        await this.continueButton.click();
        await this.continueButtonV2.click();
        await this.agreeToPolicy.click();
    }
}