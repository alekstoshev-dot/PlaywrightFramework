class LandingPage {
    constructor(page) {
        this.page = page;
        this.usernameInput = page.locator('[data-qa="email"]');
        this.passwordInput = page.locator('[data-qa="login_password"]');
        this.loginButtonLanding = page.locator('[data-qa="login_btn"]');
        this.loginButton = page.locator('[data-qa="login_submit_btn"]');
        this.registerLink = page.locator('a', { hasText: 'Sign up' });
        this.accountMenu = page.locator('[data-qa="expand_account_menu"]');
        this.userIcon = page.locator('."SocialXpWheel_socialXpWheel__251N9"');
        this.errorMessage = page.getByText('Something went wrong. Please try again.');
        this.accountHistory = page.getByText('Account History', { exact: true });
        this.accountBonusHistoryLink = page.locator('[data-qa="bonus"]');
        this.accountWinnings = page.getByRole('cell', { name: 'Daily Login - Bonus Credits' }).first();
    }

    async goto(url) {
        await this.page.goto(url);
    }

    async login(username, password) {
        await this.loginButtonLanding.click();
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }
}

module.exports = { LandingPage };