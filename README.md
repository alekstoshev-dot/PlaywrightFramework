# 🎭 Playwright Test Framework — JavaScript

> Автоматизирано end-to-end тестване с Playwright и JavaScript — пълен гайд от нула до публикуване в GitHub.

---

## 📋 Съдържание

- [Изисквания](#-изисквания)
- [Стъпка 1 — Инсталиране на Node.js](#стъпка-1--инсталиране-на-nodejs)
- [Стъпка 2 — Инсталиране на VS Code](#стъпка-2--инсталиране-на-vs-code)
- [Стъпка 3 — Инсталиране на Git](#стъпка-3--инсталиране-на-git)
- [Стъпка 4 — Създаване на проекта](#стъпка-4--създаване-на-проекта)
- [Стъпка 5 — Инсталиране на Playwright](#стъпка-5--инсталиране-на-playwright)
- [Стъпка 6 — Структура на проекта](#стъпка-6--структура-на-проекта)
- [Стъпка 7 — Конфигурация](#стъпка-7--конфигурация)
- [Стъпка 8 — Писане на тестове](#стъпка-8--писане-на-тестове)
- [Стъпка 9 — Стартиране на тестовете](#стъпка-9--стартиране-на-тестовете)
- [Стъпка 10 — Публикуване в GitHub](#стъпка-10--публикуване-в-github)
- [Стъпка 11 — GitHub Actions CI/CD](#стъпка-11--github-actions-cicd)
- [Полезни команди](#-полезни-команди)
- [Структура на проекта](#-финална-структура-на-проекта)

---

## 🔧 Изисквания

Преди да започнете, се уверете, че следния софтуер е инсталиран:

| Инструмент | Версия | Линк |
| Node.js | >= 18.x | https://nodejs.org |
| npm | >= 9.x (идва с Node) | — |
| Git | последна | https://git-scm.com |
| VS Code | последна | https://code.visualstudio.com |
| GitHub акаунт | — | https://github.com |

---

## Стъпка 1 — Инсталиране на Node.js

1. Отидете на **https://nodejs.org**
2. Изтеглете **LTS** версията (препоръчително)
3. Стартирайте инсталатора и следвайте стъпките
4. Проверете инсталацията:

```bash
node --version
# Очаквано: v18.x.x или по-нова

npm --version
# Очаквано: 9.x.x или по-нова
```

---

## Стъпка 2 — Инсталиране на VS Code

1. Отидете на **https://code.visualstudio.com**
2. Изтеглете и инсталирайте за съответния ОС
3. Препоръчани разширения (Extensions):
   - **Playwright Test for VSCode** — от Microsoft
   - **ESLint** — за качество на кода
   - **Prettier** — за форматиране

---

## Стъпка 3 — Инсталиране на Git

### Windows
1. Отидете на **https://git-scm.com/download/win**
2. Изтеглете и инсталирайте (изберете default настройките)

### macOS
```bash
# Чрез Homebrew
brew install git

# или чрез Xcode Command Line Tools
xcode-select --install
```

### Linux (Ubuntu/Debian)
```bash
sudo apt update
sudo apt install git
```

### Конфигурирай Git (задължително!)
```bash
git config --global user.name "Твоето Име"
git config --global user.email "твоят@email.com"

# Проверете конфигурацията
git config --list
```

---

## Стъпка 4 — Създаване на проекта

```bash
# Създайте папка за проекта
mkdir playwright-framework
cd playwright-framework

# Инициализирайте npm проект
npm init -y
```

Файлът `package.json` ще бъде създаден автоматично.

---

## Стъпка 5 — Инсталиране на Playwright

```bash
# Инсталирайте Playwright и автоматично конфигурирайте проекта
npm init playwright@latest
```

По време на инсталацията ще бъдете попитани:
- **Do you want to use TypeScript or JavaScript?** → изберете `JavaScript`
- **Where to put your end-to-end tests?** → `tests` (default)
- **Add a GitHub Actions workflow?** → `true` (препоръчително)
- **Install Playwright browsers?** → `true`

> ⏳ Инсталацията на браузърите отнема няколко минути.

### Алтернативна инсталация (ръчна):
```bash
npm install --save-dev @playwright/test
npx playwright install
npx playwright install-deps
```

---

## Стъпка 6 — Структура на проекта

След инсталацията структурата трябва изглежда така:

```
playwright-framework/
├── tests/
│   └── example.spec.js        # Примерен тест
├── tests-examples/
│   └── demo-todo-app.spec.js  # Demo тестове
├── playwright.config.js        # Главна конфигурация
├── package.json
└── .gitignore
```

**Препоръчана структура за по-голям framework:**

```
playwright-framework/
├── tests/
│   ├── e2e/                   # End-to-end тестове
│   │   ├── login.spec.js
│   │   └── dashboard.spec.js
│   └── api/                   # API тестове
│       └── users.spec.js
├── pages/                     # Page Object Models
│   ├── BasePage.js
│   ├── LoginPage.js
│   └── DashboardPage.js
├── fixtures/                  # Тестови данни
│   └── testData.json
├── utils/                     # Помощни функции
│   └── helpers.js
├── .github/
│   └── workflows/
│       └── playwright.yml     # CI/CD
├── playwright.config.js
├── package.json
├── .gitignore
└── README.md
```

---

## Стъпка 7 — Конфигурация

Редактирайете `playwright.config.js`:

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  // Папка с тестовете
  testDir: './tests',

  // Паралелно изпълнение
  fullyParallel: true,

  // Забранете случайното публикуване на focused тестове
  forbidOnly: !!process.env.CI,

  // Брой повторения при провал (само в CI)
  retries: process.env.CI ? 2 : 0,

  // Брой worker-и (паралелни процеси)
  workers: process.env.CI ? 1 : undefined,

  // Репортер за резултатите
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list'],
  ],

  use: {
    // Base URL на приложението
    baseURL: 'http://localhost:3000',

    // Запис на trace при провал
    trace: 'on-first-retry',

    // Снимки при провал
    screenshot: 'only-on-failure',

    // Видео при провал
    video: 'retain-on-failure',

    // Headless режим (без видим браузър)
    headless: true,
  },

  // Конфигурация на браузъри
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    // Мобилни устройства
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
});
```

---

## Стъпка 8 — Писане на тестове

### 8.1 Прост тест

```javascript
// tests/e2e/example.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Начална страница', () => {

  test('трябва да зареди заглавието', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await expect(page).toHaveTitle(/Playwright/);
  });

  test('трябва да намери линк Get Started', async ({ page }) => {
    await page.goto('https://playwright.dev');
    await page.getByRole('link', { name: 'Get started' }).click();
    await expect(page).toHaveURL(/intro/);
  });

});
```

### 8.2 Page Object Model (POM)

```javascript
// pages/LoginPage.js
class LoginPage {
  constructor(page) {
    this.page = page;
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton   = page.locator('button[type="submit"]');
    this.errorMessage  = page.locator('.error-message');
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
```

```javascript
// tests/e2e/login.spec.js
const { test, expect } = require('@playwright/test');
const { LoginPage } = require('../../pages/LoginPage');

test.describe('Login функционалност', () => {

  test('успешен вход', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'password123');
    await expect(page).toHaveURL('/dashboard');
  });

  test('грешна парола показва грешка', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('admin', 'wrong');
    await expect(loginPage.errorMessage).toBeVisible();
  });

});
```

### 8.3 API тест

```javascript
// tests/api/users.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Users API', () => {

  test('GET /users връща списък', async ({ request }) => {
    const response = await request.get('https://jsonplaceholder.typicode.com/users');
    expect(response.status()).toBe(200);

    const users = await response.json();
    expect(users).toHaveLength(10);
    expect(users[0]).toHaveProperty('id');
    expect(users[0]).toHaveProperty('email');
  });

  test('POST /users създава потребител', async ({ request }) => {
    const response = await request.post('https://jsonplaceholder.typicode.com/users', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });
    expect(response.status()).toBe(201);

    const user = await response.json();
    expect(user.name).toBe('Test User');
  });

});
```

---

## Стъпка 9 — Стартиране на тестовете

```bash
# Стартирай всички тестове
npx playwright test

# Стартирай в headed режим (вижда се браузърът)
npx playwright test --headed

# Стартирай само определен файл
npx playwright test tests/e2e/login.spec.js

# Стартирай само в Chrome
npx playwright test --project=chromium

# Стартирай с debug режим (стъпка по стъпка)
npx playwright test --debug

# Отвори HTML репорт
npx playwright show-report

# Запис на нови тестове (codegen)
npx playwright codegen https://example.com
```

---

## Стъпка 10 — Публикуване в GitHub

### 10.1 Създай .gitignore

```bash
# .gitignore
node_modules/
playwright-report/
test-results/
.env
*.log
```

### 10.2 Инициализирай Git репо

```bash
# В папката на проекта
git init
git add .
git commit -m "feat: initial Playwright framework setup"
```

### 10.3 Създай репо в GitHub

1. Отиди на **https://github.com/new**
2. Попълни **Repository name** → например `playwright-framework`
3. Избери **Public** или **Private**
4. **НЕ** слагай отметки на README, .gitignore или License (вече ги имаш локално)
5. Натисни **Create repository**

### 10.4 Свържи локалното репо с GitHub

```bash
# Добави remote origin (замени YOUR_USERNAME с твоето GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/playwright-framework.git

# Преименувай branch-а на main
git branch -M main

# Публикувай кода
git push -u origin main
```

### 10.5 Последващи промени

```bash
# Добави нови файлове
git add .

# Запази промените
git commit -m "feat: add login page tests"

# Публикувай
git push
```

---

## Стъпка 11 — GitHub Actions CI/CD

Ако по време на инсталацията е избрано да се добави GitHub Actions, файлът `.github/workflows/playwright.yml` вече съществува. Ако не — създава се ръчно:

```yaml
# .github/workflows/playwright.yml
name: Playwright Tests

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test:
    timeout-minutes: 60
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npx playwright test

      - name: Upload HTML Report
        uses: actions/upload-artifact@v4
        if: ${{ !cancelled() }}
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
```

След като се push-не на GitHub, тестовете ще се стартират автоматично при всеки `push` или `pull request`.

---

## 📌 Полезни команди

| Команда | Описание |
|---|---|
| `npx playwright test` | Стартира всички тестове |
| `npx playwright test --headed` | Тестове с видим браузър |
| `npx playwright test --debug` | Debug режим |
| `npx playwright test --ui` | Интерактивен UI режим |
| `npx playwright codegen` | Записва действия и генерира тест |
| `npx playwright show-report` | Отваря HTML репорта |
| `npx playwright install` | Инсталира браузъри |
| `npx playwright --version` | Показва версията |

---

## 📁 Финална структура на проекта

```
playwright-framework/
├── .github/
│   └── workflows/
│       └── playwright.yml
├── pages/
│   ├── BasePage.js
│   ├── LoginPage.js
│   └── DashboardPage.js
├── tests/
│   ├── e2e/
│   │   ├── login.spec.js
│   │   └── dashboard.spec.js
│   └── api/
│       └── users.spec.js
├── fixtures/
│   └── testData.json
├── utils/
│   └── helpers.js
├── playwright-report/       # Автоматично генериран (gitignore)
├── test-results/            # Автоматично генериран (gitignore)
├── .gitignore
├── package.json
├── playwright.config.js
└── README.md
```

---

## 🔗 Полезни ресурси

- [Официална документация на Playwright](https://playwright.dev/docs/intro)
- [Playwright API Reference](https://playwright.dev/docs/api/class-playwright)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions за Playwright](https://playwright.dev/docs/ci-intro)


