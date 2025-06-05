import { BotBooking } from "../class/ticketClass.js";
import { readFile } from "fs/promises";
import { waitForExpectedResponse, berthMapping, monthMap } from "../helpers.js";
const data = JSON.parse(await readFile(new URL("../data.json", import.meta.url)));

export async function bookTatkalTicket(page) {
    const bot = new BotBooking(page);

    await bot.fillStationDetails(monthMap, data);

    await waitForExpectedResponse(page, 'bot/editTrains', 200);

    await bot.selectTrainAndCoach(data.trainNum, data.coachType);

    await bot.loginViaOTP(data);

    for (const passenger of data.passengerDetails) {
        await bot.addPassengerDetails(passenger);
        await bot.selectBerthChoice(berthMapping, passenger);
    }
    
    await bot.continueButton.click();

    await bot.proceedTowardsPayment(data);
}