import { expect } from '@playwright/test';
import { time } from 'node:console';

class RegistrationPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('[data-qa="signup_username"]');
        this.userEmailInput = page.locator('[data-qa="signup_email"]');
        this.passwordInput = page.locator('[data-qa="signup_password"]');
        this.registerButton = page.locator('[data-qa="signup_submit_btn"]');
        this.termsHolder = page.locator('[data-qa="terms-and-conditions"]');
        this.termsWrap = page.locator('.RegistrationModal_termsWrap__t8wal');
        this.termsCheckBox = page.locator('.checkbox');
        this.continueButton = page.locator('[data-qa="signup_submit_btn"]').filter({ hasText: 'Continue' });
        this.closeCookiePopupButton = page.getByRole('button', { name: 'Close' });
        this.personalizeYAHeader = page.getByText('Personalize Your Account');
        this.errorMessage = page.locator('.alert');
        this.firstNameInput = page.locator('[data-qa="personalize_first_name"]');
        this.lastNameInput = page.locator('[data-qa="personalize_last_name"]');
        this.dateOfBirthInput = page.locator('[data-qa="personalize_dob_select"]');
        this.closeAdditionallInfo = page.locator('[data-qa="icon-close"]');
        this.personalizeYA = page.locator('[data-qa="personalize_submit_btn"]');
        this.firstPurchasePopup = page.locator('[data-qa="Added_chips_pop_up"]');
        this.firstPurchaseCloseIcon = page.locator('[class*="FirstPurchaseBonus_iconClose"]').click();
        this.welcomeBonusCloseIcon = page.locator('[class*="WelcomeBonus_iconClose"]').click();
        this.letsStartButton = page.locator('[data-qa="lets-start-btn"]');
    }

    async register(username, password, email) {
        try {
            await this.closeCookiePopupButton.click();
            await this.usernameInput.fill(username);
            await this.userEmailInput.fill(email);
            await this.passwordInput.fill(password);
            await this.registerButton.click();
            await expect(this.termsHolder).toBeVisible();
            await this.termsWrap.evaluate(el => {
                el.scrollTop = el.scrollHeight;
            });
            await expect(this.termsCheckBox).toBeEnabled();
            await this.termsCheckBox.check();
            await this.continueButton.click();
            await this.closeAdditionallInfo.click();
            await this.page.waitForTimeout(4000);
            console.log('Registration successful');
        } catch (error) {
            console.error('Error during registration:', error);
            throw error;
        }
    }
}

module.exports = { RegistrationPage };