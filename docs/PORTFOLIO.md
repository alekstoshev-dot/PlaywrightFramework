# Cross-platform automation portfolio

TypeScript + Playwright Test orchestration, Playwright web/API, WebdriverIO client + Appium 3 for native Android/iOS.

## Setup

Use Node compatible with Appium 3 (25.6.1 is in range); CI uses Node 24. npm >=10.

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm run test:web
npm run test:api
npm run report
```

Copy `.env.example` to `.env` for local overrides. No secrets belong in Git.

## Native execution

Download and pin a release from https://github.com/saucelabs/my-demo-app-android/releases and https://github.com/saucelabs/my-demo-app-ios/releases. Use an APK for Android, a simulator-compatible .app for iOS, or a signed IPA for a real iOS device. Appium must be able to access the configured app path.

```sh
npx appium driver install uiautomator2
npx appium driver doctor uiautomator2
npm run appium
# Separate terminal, with ANDROID_APP configured and emulator/device running:
npm run test:android
```

For iOS install the XCUITest driver on a Mac with Xcode:

```sh
npx appium driver install xcuitest
npx appium driver doctor xcuitest
npm run appium
npm run test:ios
```

Use APPIUM_URL for a remote Mac. Real devices require signing/WebDriverAgent configuration. Android requires Android SDK, Java and adb. Set MOBILE_UDID when selecting a particular device. Each mobile project runs one worker; fullReset reinstalls the demo app for each test. Do not use this configuration against personal apps.

## Design

`src/contracts/Shop.ts` defines business behavior. `tests/portfolio/shared` contains a single scenario executed unchanged for web/Android/iOS. The fixture selects the platform adapter; platform selectors and interactions stay outside tests. Web authenticates before opening the catalog; native demos open directly in the catalog. Mobile selectors are derived from official native source and still require device validation against a pinned release.

`src/api` contains separate HTTP clients. DummyJSON is independent of SauceDemo; these are API examples, not checks of the SauceDemo backend. No simulated API write is treated as persistent state.

## Coverage and status

- Shared: catalog â†’ add backpack â†’ cart â†’ verify product. Web also verifies quantity.
- API: product read/schema subset and unknown-product 404.
- Platform-specific tests can be added separately. Checkout is not implemented yet.
- Web/API run in hosted CI. Native execution requires device infrastructure; there is no claim that mobile tests have passed until device runs are recorded.
- Legacy `tests/e2e`, JS page objects and `playwright.config.js` are retained outside the portfolio suite. Their old workflow is manual only.

`npm test` runs web and API. Use explicit mobile commands for device execution. Failure attachments include screenshots, web trace, and native XML source.

## Dependency maintenance

`shell-quote` is overridden to >=1.11.0 to resolve the advisory in Appium 3 transitive dependencies. Review this override on Appium upgrades.

## Validation — 2026-10-14

TypeScript check passed. Two live DummyJSON API tests passed. All five platform test instances are discovered. Appium 3.8.0 CLI starts. npm audit reports zero vulnerabilities. Web execution could not start Chromium in the authoring sandbox (`spawn EPERM`); native tests have not been executed on devices. The local system npm launcher points at a missing npm-cli.js; installation/checks used a temporary npm 10 CLI without changing the global installation.

## Watch runs in VS Code

Open this repository folder in VS Code. Terminal > Run Task > Portfolio: Web visible opens the VS Code terminal and launches a visible Chromium browser. Portfolio: Web debug opens Playwright Inspector for stepping through actions. API tests have no browser.

The tasks invoke Node directly, so the broken system npm launcher does not block test execution. Alternatively run in the VS Code terminal:

```powershell
node node_modules/@playwright/test/cli.js test -c portfolio.config.ts --project=web --headed --workers=1
```

Once npm is repaired, `npm run test:web` is the equivalent. The web adapter honors Playwright's `--headed`/`--debug` flags; local browser actions are slowed by 400ms. CI uses `test:web:ci` headlessly.

If Chromium is missing, run the Portfolio: Install Chromium task. VS Code and Node are installed. The system npm launcher needs repair (Node installer Repair/reinstall with npm selected). Android SDK/adb was not found on PATH; native execution still needs SDK/emulator, Appium driver, and demo APK. iOS execution requires a configured Mac/Appium host.

## Product-based interface — 2026-10-15

`Product` contains a stable web id and a shared display name. `src/data/products.ts` is the test catalog. The Shop contract exposes `addProduct(product)`, `removeProduct(product)`, and `expectCartProducts(products)`. An empty array means the cart must be empty; nonempty arrays check exact contents without depending on order. Product locators are scoped to the matching row; Android opens the clickable product image rather than its non-clickable title.

Six shared scenarios run unchanged on each UI platform. Mobile add returns to the catalog and Android reveals offscreen products with UiScrollable. Native quantity changes remain platform-specific and are not part of this contract. Each test receives an isolated session. No checkout implementation is included.

Validation for this increment: TypeScript and discovery passed (18 UI instances + 2 existing API tests). New scenario execution still needs visible web and Android runs from VS Code; iOS selectors and interactions remain unverified on a device. Run `npm run test:web` first, then `npm run test:android` with Appium and the emulator running.

## Web authentication configuration

Local web URL and credentials live in `.env.auth` (ignored by Git). `.env.auth.example` lists the field names. General API/device settings remain in `.env`. Priority is process/pipeline environment, then `.env.auth`, then `.env`. No URL/user/password defaults are embedded in the web adapter. Missing required values fail before a browser is launched, with variable names only.

Required for web: `WEB_BASE_URL`, `WEB_USERNAME`, `WEB_PASSWORD`. `WEB_EMAIL` is optional and currently unused because SauceDemo login has no email field. Set it to your test email for future scenarios; no address is invented.

In GitHub repository Settings > Secrets and variables > Actions, create repository secrets with those same four names (email can remain unset for current tests). The workflow injects them directly into the web step; it never writes or uploads an auth file. API and native runs do not require web credentials. Fork pull requests do not receive repository secrets, so their web job will fail the explicit missing-variable check until a suitable trusted CI strategy is configured. Secrets have not been created remotely by this change.

## Default discovery and legacy tests

`npx playwright test` and default VS Code discovery now load the portfolio configuration and select web/API. Native npm commands continue to use explicit Android/iOS projects. `tests/e2e` are legacy scenarios for a different application; they now read auth via `getWebAuth()` but remain excluded from the active suite because their flows are not supported by SauceDemo. Their registration scenario requires WEB_EMAIL and a fresh account identity.

## Allure and Spotless

All UI/API projects use `allure-playwright`. Existing `test.step` blocks and attachments are captured in `allure-results`. Local commands:

```sh
npm run test:web
npm run allure:generate
npm run allure:open
# Or generate a temporary report and serve it:
npm run allure:serve
npm run format
npm run format:check
```

Allure CLI 2 and Gradle Wrapper require Java 17+; Java 17 is configured in CI. No global Gradle install is needed. The wrapper downloads pinned Gradle 8.14.3 and verifies its distribution checksum. Spotless 7.2.1 invokes pinned Prettier 3.6.2 using `.prettierrc.json`. `format` changes source formatting; `format:check` only verifies it. The target list includes active TypeScript, root config, scripts, JSON and workflow files. Auth files, app binaries, reports and legacy tests are excluded.

CI checks Spotless before tests, generates an Allure HTML report even after test failures, and uploads both raw results and HTML. Allure results accumulate across invocations, allowing separate web/API CI runs in one report. Use a fresh results directory when starting a new independent reporting cycle. No auth values are added as Allure environment metadata. Screenshots/traces can still contain application/test data.

Dependency audit after integration: npm reports findings in bundled UiAutomator2 8.7.0 dependencies. Automatic non-breaking fixes cannot replace bundled dependencies; the working native driver was retained. Review a compatible upstream driver update separately.

## Verbose execution logging

The first reporter prints test/step START, END, FAIL, duration, project, worker and retry. It observes hooks, fixtures, assertions, browser actions and business steps. Native find/wait/tap, product reveal and Back navigation have explicit nested steps; API calls log method/resource and response status. WebdriverIO raw debug logs are disabled (`warn`) to keep output focused.

A per-test `verbose.log` is saved under portfolio-results/verbose-*/ and attached to Allure as `verbose-log`, including failed runs and session-creation failures. Reporter order is deliberate: the log attachment is added before Allure consumes the result. Credentials loaded in environment (passwords/tokens/user/email/access keys) are redacted from this custom log, and URL credentials/query/fragment are removed. Built-in Playwright/Allure traces and screenshots are separate artifacts and are not sanitized by the logger.

Android has reverted to the official Downloads/mda-2.3.0-27.apk. Clear any previously exported ANDROID_APP override or set it explicitly before the run. Known app defects remain visible as failures; the logger does not retry or suppress failures. The custom APK is retained as a separate experiment and is not used by .env.

## Disabled Android scenarios and API focus

Three Android scenarios are skipped before Appium setup, with android-disabled annotations and comments: Bike Light add, two products, and removal preserving the other product. ANDROID-001 records the official app catalog crash; ANDROID-INFRA-001 records UiAutomator2/ADB failure after Back with unconfirmed cause. These are not all classified as confirmed application bugs. Web/iOS variants stay enabled. Remove the annotations after a verified fix.

The API suite now has eight live DummyJSON scenarios: read, unknown-id 404, pagination, matching search, empty search, simulated create, simulated update/non-persistence and simulated delete/non-persistence. POST/PUT/DELETE do not mutate the shared service; no create-to-update persistent chain is assumed. Documentation: https://dummyjson.com/docs/products . Run `npm run test:api`; Appium/emulator/browser are not required. Existing verbose logging and Allure apply.
