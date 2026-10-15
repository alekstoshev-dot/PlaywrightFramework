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
## Стъпка Х - Клониране на проекта:
Отворете CMD и се уверете че сте в папката на проекта
Отворете конзолата (Ctrl + `) и въведете:
git clone https://github.com/alekstoshev-dot/PlaywrightFramework.git
след като приключи:
npm install

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

--

## Cross-platform portfolio

The new TypeScript web/Android/iOS/API suite is documented in [docs/PORTFOLIO.md](docs/PORTFOLIO.md). Start with `npm run test:web` or `npm run test:api`. The JavaScript tutorial above describes the legacy suite.
