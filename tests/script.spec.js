import { test } from '@playwright/test';
import { bookTatkalTicket } from "../utils/bookTicket.js";

test("Booking Train Ticket...", async ({ page }) => {
    test.setTimeout(300000);
    await bookTatkalTicket(page);
    await page.waitForTimeout(600000);
});