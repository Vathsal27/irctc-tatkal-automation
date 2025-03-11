import { BotBooking } from "../class/ticketClass.js";
import { readFile } from "fs/promises";
const data = JSON.parse(await readFile(new URL("../data.json", import.meta.url)));

export async function bookTatkalTicket(page) {
    const bot = new BotBooking(page);

    await bot.fillStationDetails(data);

    await page.waitForTimeout(3000);

    await bot.selectTrainAndCoach(data.trainNum, data.coachType);

    await bot.loginViaOTP(data);

    for (const passenger of data.passengerDetails) {
        await bot.addPassengerDetails(passenger);
    }

    await bot.continueButton.click();

    await bot.proceedTowardsPayment(data);
}