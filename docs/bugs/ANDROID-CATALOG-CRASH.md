# Android demo catalog crash

Observed APK: mda-2.3.0-27.apk. Android 15 x86_64 emulator; WebdriverIO/Appium 3 shared cart suite.

Steps: open catalog; select Sauce Labs Bike Light image. Expected: product detail page opens. Actual: process com.saucelabs.mydemoapp.android terminates and Android launcher appears. Reproduced twice in supplied crash log (2026-10-15 11:18:02 and 11:19:12).

Evidence: ArrayIndexOutOfBoundsException: length=6; index=6 in ProductCatalogFragment.java:156, via ProductsAdapter.java:57. Source contains an intentionally defective fixed array with a null entry and indexes it with catalog position. Larger catalogs exceed its bounds. Bundle key meta has no consumer in the inspected source.

Patch: remove unused meta array and bundle write. Keep product selection by productList[position].id. Upstream source: https://github.com/saucelabs/my-demo-app-android commit 3e514167ec715abf6ab93e148ef6f97b86752c05. Debug build disables optional Sauce Mobile Beta SDK. Gradle/AGP updated to 7.6.4/7.4.2 for Java 17; unused explicit NDK pin removed (native dependencies remain prebuilt).

Separate issues: supplied logs also show UiAutomator2 and Google Play Services failures. Their cause is not proven by this catalog defect. This patch does not claim 16 KB native compatibility.

Build and device validation status will be recorded after compilation. Required regression: open every catalog item, including index 1 and indices >=6; run all six shared cart scenarios on the fixed APK.


## Reproduce the build

Clone the upstream repository and checkout commit 3e514167ec715abf6ab93e148ef6f97b86752c05. Apply demo-fix.patch with git apply. Set sdk.dir in local.properties to the Android SDK path. Create a local debug key (public development credentials only):

```sh
keytool -genkeypair -keystore portfolio-debug.keystore -storepass android -keypass android -alias androiddebugkey -dname "CN=Portfolio Debug,O=Local Tests,C=BG" -keyalg RSA -keysize 2048 -validity 10000
```

With Java 17 run `gradlew.bat :app:assembleDebug -PsauceMobileBetaDisabled=true --no-daemon`. The APK is generated at app/build/outputs/apk/debug/app-debug.apk. This debug key is not a production signing identity. APK retains the upstream package id, so Appium fullReset replaces the previous demo installation.

The original supplied crash log is retained locally alongside this report. It also contains unrelated system crashes, so these are not attributed to the catalog defect.


## Authoring environment build workaround

Both JDK 17 and JDK 11 javac produced class outputs, then Gradle reported AccessDeniedException from jdk.zipfs ZipFileSystem.close / JavacFileManager.close on dependency JAR paths. Bytecode was inspected with javap: the product click lambda uses productList[position].getId() and no meta array. Packaging is run using the already generated class outputs with `:app:assembleDebug -PreuseCompiledClasses=true` (guarded reuse of verified javac output). This is an environment workaround, not a claim that the complete Gradle compilation task passed. A clean standard build should be repeated outside this restricted environment. No device regression has yet been run against the custom APK.

## Artifact validation

APK packaged successfully with the documented compiled-class reuse workaround. apksigner verification passed for v1 and v2 signatures. SHA256 is recorded in SHA256.txt. Source patch and source archive are included. Android regression tests still await visible device execution.
