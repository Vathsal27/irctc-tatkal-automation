import { berthMapping } from "../helpers";

export class BotBooking {
    constructor(page) {
        this.page = page;

        this.mobileNumberInputPreSignIn = this.page.getByRole('textbox', { name: 'Enter mobile number' });
        this.getOtpButtonPreSignIn = this.page.getByRole('button', { name: 'Get OTP' });
        this.otpInputPreSignIn = this.page.getByRole('textbox', { name: 'Enter your OTP' });

        this.sourceStation = this.page.getByLabel('From');
        this.sourceSearchBox = this.page.getByRole('textbox', { name: 'Search your Station or City' });

        this.destinationStation = this.page.getByLabel('To', { exact: true });
        this.destinationSearchBox = this.page.getByRole('textbox', { name: 'Search your Station or City' });

        this.selectStation = this.page.locator('//div[@class="stations"]/div[1]');

        this.journeyDate = this.page.getByLabel('Select Your Journey Date');
        this.selectDate = (date, month, year) => this.page.locator(`#${month}-${year}`).getByText(`${parseInt(date, 10)}`, { exact: true });  // Update dynamically if needed

        this.quota = this.page.getByLabel('Select Your Quota');
        this.selectQuota = (quota) => this.page.locator(`#${quota}`);

        this.searchTrain = this.page.getByRole('button', { name: 'Search Trains' });

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
        this.bookTicketButton = this.page.getByRole('button', { name: 'BOOK TICKET' });
        this.addNewPassengerButton = this.page.getByRole('button', { name: 'Add Passenger' });

        // Passenger details
        this.passengerNameInput = this.page.getByRole('textbox', { name: 'Enter Full Name' });
        this.passengerAgeInput = this.page.getByPlaceholder('Enter Age');
        this.passengerGenderOption = (gender) => this.page.getByText(gender, { exact: true });
        this.continueButton = this.page.getByRole('button', { name: 'Continue' });

        // Berth choice locators
        this.passengerBlock = (data) => this.page.getByText(`${data.name}Adult|${data.gender}|${data.age} yearsBerth Choice: Any Berth`);
        this.berthChoiceLocator = (data) => this.passengerBlock(data).locator('div', { hasText: /^Any Berth$/ });

        this.berthPreferenceButton = this.page.locator('div').filter({ hasText: /^Berth Preference$/ }).nth(2);
        this.berthOption = (berth) => this.page.locator('div').filter({ hasText: new RegExp(`^${berth}$`) })

        // Final confirmation
        this.fillEmailID = this.page.getByRole('textbox', { name: 'Enter your Email ID' });

        // Additional Locators for updated version of UI
        this.choosePreferenceButton = this.page.getByText('Choose Preference (optional)');
        this.addPassenger = this.page.getByRole('button', { name: 'Add Passenger' });

        this.reviewJourneyButton = this.page.getByRole('button', { name: 'Review Journey' });
        this.getOtpButtonPayment = this.page.getByRole('button', { name: 'Get OTP' });
        this.upiPaymentOption = this.page.locator('div').filter({ hasText: /^UPI$/ }).first();

        // Clearance of passenger list
        this.passengerList = this.page.getByLabel('My Passengers');
        this.passengerListDiv = this.page.locator('xpath=//*[@id="corover-body"]/div[1]/div[2]/div[2]/div[2]/div/div/div[1]/div');
        this.deleteBtn = this.page.getByRole('img', { name: 'Delete' });

        this.navigateBackButton = this.page.getByRole('img', { name: 'Back' });
    }

    async preSignIn(data) {
        await this.page.goto(data.url);
        await this.mobileNumberInputPreSignIn.fill(data.mobileNumber);
        await this.getOtpButtonPreSignIn.click();
        await this.otpInputPreSignIn.click();
    }

    async clearPassengerList() {
        await this.passengerList.click();

        await this.passengerListDiv.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});

        let divCount = await this.passengerListDiv.count();

        if (divCount === 0) {
            console.log("No passengers to delete.");
        } else {
            while ((divCount = await this.passengerListDiv.count()) > 0) {
                const deleteBtn = this.deleteBtn.first();
                await deleteBtn.click();
                await this.page.waitForTimeout(500);
            }
        }

        await this.navigateBackButton.waitFor({ state: 'visible', timeout: 1000 }).catch(() => {});
        await this.navigateBackButton.click();
    }

    async fillStationDetails(monthMap, data) {
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

        await this.searchTrain.click();
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
        await this.passengerGenderOption(data.gender).click();
        await this.passengerNameInput.fill(data.name);
        await this.passengerAgeInput.fill(data.age);

        if (data.berthPreference !== 'NA') {
            await this.berthPreferenceButton.click();
            await this.berthOption(berthMapping[data.berthPreference]).click();
        }
    }

    async selectBerthChoice(berthMapping, data) {
        if (data.berthPreference !== 'NA') {
            await this.berthChoiceLocator(data).first().click();
            await this.page.getByText(berthMapping[data.berthPreference]).click();
        }
    }

    async additionalDetails(data) {
        await this.choosePreferenceButton.click();
        if (data.quota === "tatkal") {
            await this.page.locator('//*[@id="corover-messages-box"]/div[3]/div[4]/div[2]/div[4]/div/img').click();
        } else {
            await this.page.locator('//*[@id="corover-messages-box"]/div[3]/div[4]/div[2]/div[3]/div/img').click();
        }
        await this.fillEmailID.fill(data.emailID);
    }

    async reviewAndPay() {
        await this.reviewJourneyButton.click();
        await this.getOtpButtonPayment.click();
        await this.upiPaymentOption.click();
    }
}