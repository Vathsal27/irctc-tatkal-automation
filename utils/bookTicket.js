import { BotBooking } from "../class/ticketClass.js";
import { readFile } from "fs/promises";
import { waitForExpectedResponse, monthMap } from "../helpers.js";
const data = JSON.parse(await readFile(new URL("../data.json", import.meta.url)));

export async function bookTatkalTicket(page) {
    const bot = new BotBooking(page);

    await bot.preSignIn(data);

    await bot.clearPassengerList();

    await bot.fillStationDetails(monthMap, data);

    await waitForExpectedResponse(page, 'bot/editTrains', 200);

    await bot.selectTrainAndCoach(data.trainNum, data.coachType);

    await bot.bookTicketButton.click();

    for (const [index, passenger] of data.passengerDetails.entries()) {
        if (index > 0) {
            await bot.addPassenger.click();
        }
        await bot.addPassengerDetails(passenger);
        await bot.addPassenger.click();
        await bot.page.waitForTimeout(1500);
    }

    await bot.additionalDetails(data);

    await bot.reviewAndPay();
}