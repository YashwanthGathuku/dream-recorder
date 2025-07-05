# Mobile Build Guide

This document explains how to run and build the Dream Recorder mobile application.

## Prerequisites

- **Node.js** 18 or higher with npm installed.
- **Android Studio** with the Android SDK and platform tools.
- **Xcode** for iOS development (macOS only).
- **Java Development Kit** (JDK) 11 or newer for Android builds.
- Optionally, **Watchman** is recommended on macOS.

## Running the app in development

1. Install dependencies:
   ```bash
   cd DreamRecorderMobile
   npm install
   ```
2. Start Metro:
   ```bash
   npx react-native start
   ```
3. In another terminal run the app:
   - **Android**
     ```bash
     npx react-native run-android
     ```
   - **iOS** (requires macOS and Xcode)
     ```bash
     npx react-native run-ios
     ```

## Building release versions

### Android

1. Assemble the release build:
   ```bash
   cd DreamRecorderMobile/android
   ./gradlew assembleRelease
   ```
   The APK will be in `DreamRecorderMobile/android/app/build/outputs/apk/release/`.
2. For Google Play distribution the APK or AAB must be signed with a release keystore.
   Configure signing in `android/app/build.gradle` before building.

### iOS

1. Build a release configuration:
   ```bash
   npx react-native run-ios --configuration Release
   ```
   Or open the Xcode workspace in `DreamRecorderMobile/ios` and build the `Release` scheme.
2. To publish on the App Store you need an Apple Developer account with a valid
   signing certificate and provisioning profile configured in Xcode.
