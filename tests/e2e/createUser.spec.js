const { getWebAuth } = require('../../src/config/environment');
const { test, expect } = require('@playwright/test');
const { LandingPage } = require('../../pages/LandingPage');
const { RegistrationPage } = require('../../pages/RegistrationPage');

test.describe('Create User functionality', () => {

    test('Succsessful user creation', async ({ page }) => {
        const auth = getWebAuth();
        if (!auth.email) throw new Error('Set WEB_EMAIL in .env.auth for registration.');
        const landingPage = new LandingPage(page);
        await landingPage.page.goto(auth.baseURL);
        await landingPage.registerLink.click();
        const registrationPage = new RegistrationPage(page);
        //!!!User and Email Must be incremented +1 for each test run in order to avoid "User already exists" error!!!  
        await registrationPage.register(auth.username, auth.password, auth.email);
        await landingPage.accountMenu.waitFor();
        await expect(landingPage.accountMenu).toBeVisible();
    });


});