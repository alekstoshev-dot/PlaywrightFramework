const { getWebAuth } = require('../../src/config/environment');
const { test, expect } = require('@playwright/test');
const { LandingPage } = require('../../pages/LandingPage');

test.describe('Login functionality', () => {

    test('Succsessful login and history check', async ({ page }) => {
        const auth = getWebAuth();
        const landingPage = new LandingPage(page);
        await landingPage.page.goto(auth.baseURL);
        await landingPage.login(auth.username, auth.password);
        await expect(landingPage.accountMenu).toBeVisible();
        await landingPage.accountMenu.click();
        await landingPage.accountHistory.click();
        await expect(landingPage.accountBonusHistoryLink).toBeVisible();
        await landingPage.accountBonusHistoryLink.click();
        await landingPage.page.waitForTimeout(4000);
        await expect(landingPage.accountWinnings).toBeVisible();
    });

});