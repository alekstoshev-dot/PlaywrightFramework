const { test, expect } = require('@playwright/test');
const { LandingPage } = require('../../pages/LandingPage');
const { RegistrationPage } = require('../../pages/RegistrationPage');

test.describe('Create User functionality', () => {

    test('Succsessful user creation', async ({ page }) => {
        const landingPage = new LandingPage(page);
        await landingPage.page.goto('https://jackentertainment.lv-dev.gameaccount.com/');
        await landingPage.registerLink.click();
        const registrationPage = new RegistrationPage(page);
        //!!!User and Email Must be incremented +1 for each test run in order to avoid "User already exists" error!!!  
        await registrationPage.register('testuser200', 'Password123', 'testuser200@yopmail.com');
        await landingPage.accountMenu.waitFor();
        await expect(landingPage.accountMenu).toBeVisible();
    });


});