import { test } from '@playwright/test';
import { bookTatkalTicket } from "../utils/bookTicket.js";
import { waitUntilTargetTime } from '../helpers.js';

test("Booking Train Ticket...", async ({ page }) => {
    test.setTimeout(600000);

    const testStartTime = "11:00:05"; // HH:MM:SS format
    await waitUntilTargetTime(testStartTime);

    await bookTatkalTicket(page);

    await page.waitForTimeout(600000);
});