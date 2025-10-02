# 🚀 CI/CD Setup Guide for Usetri Expo App

This guide will walk you through setting up a secure, production-ready CI/CD pipeline for your Expo React Native application using GitHub Actions and EAS Build.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Secure Your Codebase](#step-1-secure-your-codebase)
3. [Step 2: Configure Environment Variables](#step-2-configure-environment-variables)
4. [Step 3: Set Up GitHub Secrets](#step-3-set-up-github-secrets)
5. [Step 4: Update EAS Configuration](#step-4-update-eas-configuration)
6. [Step 5: Test Your Pipeline](#step-5-test-your-pipeline)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- ✅ GitHub repository with your Expo project
- ✅ Expo account (with EAS access)
- ✅ Apple Developer account (for iOS builds)
- ✅ Google Play Developer account (for Android builds)
- ✅ All third-party service accounts configured:
  - Firebase
  - RevenueCat
  - Google OAuth

---

## Step 1: Secure Your Codebase

### 1.1 Remove Hardcoded Secrets

**⚠️ CRITICAL:** Your codebase currently has hardcoded sensitive information that must be removed.

#### Files to Update:

1. **`firebase.config.js`** - Currently exposes Firebase API keys
2. **`context/revenue-cat-provider.tsx`** - Contains RevenueCat API keys
3. **`components/google-authentication/google-sign-in.tsx`** - Has Google OAuth client IDs
4. **`lib/constants.ts`** - API URL should be environment-specific

### 1.2 Create Local `.env` File

Create a `.env` file in your project root (this file is already gitignored):

```bash
# Copy the example file
cp .env.example .env
```

Fill in your actual values:

```env
# Backend API
EXPO_PUBLIC_API_URL=https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/

# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD-bsRkMTX6GYvp7CNEiqkcWEJsIhtdiec
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=dolacna-388d4.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=dolacna-388d4
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=dolacna-388d4.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=504961053140
EXPO_PUBLIC_FIREBASE_APP_ID=1:504961053140:android:a31a3f46a792c807fbe641

# Google OAuth
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=504961053140-o0ue7qneapk7ch614i13i14p1s28ud0h.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=504961053140-oveffkqr0tkt5mbj0ksfkggv055n7i33.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=504961053140-5fb7kj7fg852n3nhuaadn0hopblh6djl.apps.googleusercontent.com

# RevenueCat API Keys
EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY=appl_fDaggXpWHKktWRRTrtIaKYSJFQT
EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY=goog_MfhxZabLgqWiOyplBAiWLWKAUQj

# EAS Project ID
EXPO_PUBLIC_EAS_PROJECT_ID=791d2b8e-8cce-4c33-9378-6898f9ab1df7
```

### 1.3 Backup Sensitive Files

Before making changes, backup your current Google Services files:

```bash
# Backup files (don't commit these!)
cp google-services.json google-services.json.backup
cp GoogleService-Info.plist GoogleService-Info.plist.backup
cp android/app/google-services.json android/app/google-services.json.backup
```

---

## Step 2: Configure Environment Variables

### 2.1 Update `firebase.config.js`

Replace the hardcoded values with environment variables:

```javascript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### 2.2 Update `context/revenue-cat-provider.tsx`

```typescript
const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || "",
  google: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY || "",
};
```

### 2.3 Update `components/google-authentication/google-sign-in.tsx`

```typescript
const [_, response, promptAsync] = useAuthRequest(
  {
    androidClientId: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
  },
  {
    path: "/(app)/(auth)/sign-in",
    scheme: "usetri",
  }
);
```

### 2.4 Update `lib/constants.ts`

```typescript
export const BASE_API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/";
```

---

## Step 3: Set Up GitHub Secrets

### 3.1 Navigate to GitHub Repository Settings

1. Go to your repository on GitHub
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**

### 3.2 Add Required Secrets

Add the following secrets one by one:

#### EAS & Expo Secrets

```
EXPO_TOKEN
```

Get this by running: `npx expo login` then `npx eas whoami --json` or from [expo.dev/settings/access-tokens](https://expo.dev/settings/access-tokens)

#### Firebase Secrets

```
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyD-bsRkMTX6GYvp7CNEiqkcWEJsIhtdiec
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=dolacna-388d4.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=dolacna-388d4
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=dolacna-388d4.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=504961053140
EXPO_PUBLIC_FIREBASE_APP_ID=1:504961053140:android:a31a3f46a792c807fbe641
```

#### Google OAuth Secrets

```
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=504961053140-o0ue7qneapk7ch614i13i14p1s28ud0h.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=504961053140-oveffkqr0tkt5mbj0ksfkggv055n7i33.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=504961053140-5fb7kj7fg852n3nhuaadn0hopblh6djl.apps.googleusercontent.com
```

#### RevenueCat Secrets

```
EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY=appl_fDaggXpWHKktWRRTrtIaKYSJFQT
EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY=goog_MfhxZabLgqWiOyplBAiWLWKAUQj
```

#### API & Project Secrets

```
EXPO_PUBLIC_API_URL=https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/
EXPO_PUBLIC_EAS_PROJECT_ID=791d2b8e-8cce-4c33-9378-6898f9ab1df7
```

#### Google Services Files (Base64 Encoded)

**For Android:**

```bash
# Encode google-services.json to base64
cat google-services.json | base64 | pbcopy  # macOS
cat google-services.json | base64 -w 0      # Linux
```

Add as: `ANDROID_GOOGLE_SERVICES_JSON`

**For iOS:**

```bash
# Encode GoogleService-Info.plist to base64
cat GoogleService-Info.plist | base64 | pbcopy  # macOS
cat GoogleService-Info.plist | base64 -w 0      # Linux
```

Add as: `IOS_GOOGLE_SERVICES_PLIST`

#### App Store Credentials (for submission)

```
EXPO_APPLE_APP_SPECIFIC_PASSWORD
```

Generate from: [appleid.apple.com](https://appleid.apple.com/account/manage) → App-Specific Passwords

---

## Step 4: Update EAS Configuration

### 4.1 Update `eas.json`

Add environment variable support:

```json
{
  "cli": {
    "version": ">= 7.6.2",
    "appVersionSource": "remote"
  },
  "build": {
    "development": {
      "autoIncrement": true,
      "developmentClient": true,
      "distribution": "internal",
      "env": {
        "EAS_BUILD_DISABLE_NPM_CACHE": "1",
        "EAS_BUILD_DISABLE_COCOAPODS_CACHE": "1"
      }
    },
    "preview": {
      "autoIncrement": true,
      "distribution": "internal",
      "env": {}
    },
    "production": {
      "autoIncrement": true,
      "android": {
        "buildType": "app-bundle"
      },
      "env": {}
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@email.com",
        "ascAppId": "your-app-store-connect-id",
        "appleTeamId": "your-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

### 4.2 Install dotenv Support

```bash
npm install --save-dev dotenv
```

---

## Step 5: Test Your Pipeline

### 5.1 Local Testing

Test that your app works with environment variables:

```bash
# Start development server
npx expo start

# Test builds locally
eas build --platform ios --profile development --local
eas build --platform android --profile development --local
```

### 5.2 Test CI/CD Pipeline

#### Option A: Manual Workflow Dispatch

1. Go to GitHub → **Actions** tab
2. Select **EAS Build and Deploy** workflow
3. Click **Run workflow**
4. Choose platform and profile
5. Monitor the build

#### Option B: Push to Branch

```bash
git add .
git commit -m "feat: set up CI/CD with environment variables"
git push origin develop
```

The PR checks will run automatically.

---

## Best Practices

### 🔒 Security

1. **Never commit `.env` files** - They're gitignored for a reason
2. **Rotate secrets regularly** - Update API keys every 3-6 months
3. **Use different credentials per environment** - Development, staging, production
4. **Enable 2FA** - On all service accounts (GitHub, Expo, Apple, Google)
5. **Audit access** - Regularly review who has access to secrets

### 📊 Monitoring

1. **Set up Firebase Crashlytics** - Already configured in your app
2. **Monitor EAS build status** - Check [expo.dev/builds](https://expo.dev/builds)
3. **Track deployments** - Use GitHub Deployments feature
4. **Set up alerts** - Get notified when builds fail

### 🚀 Workflow Optimization

1. **Use caching** - Already configured in workflows for npm
2. **Parallel jobs** - Tests run before builds
3. **Conditional workflows** - Only build what's needed
4. **Preview builds** - Test PRs before merging

### 📝 Environment Strategy

Create separate environments:

```
- development   → develop branch
- preview       → PRs to main
- production    → main branch
```

---

## Troubleshooting

### Issue: "EXPO_TOKEN not found"

**Solution:**

```bash
# Generate a new token
npx expo login
npx eas whoami
# Or create token at: https://expo.dev/settings/access-tokens
```

### Issue: "Google Services file not found"

**Solution:**
Verify base64 encoding:

```bash
# Test decoding locally
echo "$YOUR_BASE64_STRING" | base64 -d > test-output.json
cat test-output.json  # Should be valid JSON
```

### Issue: "Environment variables undefined in app"

**Solution:**

- Ensure variables start with `EXPO_PUBLIC_` prefix
- Restart Expo dev server after changing `.env`
- Clear cache: `npx expo start -c`

### Issue: "Build fails on EAS"

**Solution:**

1. Check EAS build logs in dashboard
2. Verify all secrets are set in GitHub
3. Test build locally first: `eas build --platform <platform> --profile <profile> --local`

### Issue: "RevenueCat configuration error"

**Solution:**

- Verify API keys are correct in GitHub secrets
- Check that both Apple and Google keys are set
- Ensure keys match your RevenueCat project

---

## 🎯 Next Steps

After completing this setup:

1. ✅ **Test local development** - Ensure app works with `.env`
2. ✅ **Run a test build** - Use manual workflow dispatch
3. ✅ **Set up branch protection** - Require PR checks to pass
4. ✅ **Configure app store credentials** - For automatic submission
5. ✅ **Set up staging environment** - For testing before production
6. ✅ **Document deployment process** - For your team

---

## 📚 Additional Resources

- [Expo EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [RevenueCat Documentation](https://docs.revenuecat.com/)

---

## 🆘 Support

If you encounter issues:

1. Check EAS build logs: [expo.dev/accounts/adammartiska/projects/usetri/builds](https://expo.dev/accounts/adammartiska/projects/usetri/builds)
2. Review GitHub Actions logs: Repository → Actions tab
3. Expo Discord: [expo.dev/discord](https://expo.dev/discord)
4. GitHub Discussions: Create issue in repository

---

**Last Updated:** October 2025
**Version:** 1.0.0
