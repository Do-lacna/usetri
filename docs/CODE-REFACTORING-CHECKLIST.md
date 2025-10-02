# Code Refactoring Checklist

This document outlines all the code changes needed to remove hardcoded secrets and use environment variables instead.

## ✅ Files to Modify

### 1. `firebase.config.js`

**Before:**

```javascript
export const firebaseConfig = {
  apiKey: "AIzaSyD-bsRkMTX6GYvp7CNEiqkcWEJsIhtdiec",
  authDomain: "dolacna-388d4.firebaseapp.com",
  projectId: "dolacna-388d4",
  storageBucket: "dolacna-388d4.appspot.com",
  messagingSenderId: "504961053140",
  appId: "1:504961053140:android:a31a3f46a792c807fbe641",
};
```

**After:**

```javascript
export const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};
```

---

### 2. `context/revenue-cat-provider.tsx`

**Before:**

```typescript
const APIKeys = {
  apple: "appl_fDaggXpWHKktWRRTrtIaKYSJFQT",
  google: "goog_MfhxZabLgqWiOyplBAiWLWKAUQj",
};
```

**After:**

```typescript
const APIKeys = {
  apple: process.env.EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY || "",
  google: process.env.EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY || "",
};
```

---

### 3. `components/google-authentication/google-sign-in.tsx`

**Before:**

```typescript
const [_, response, promptAsync] = useAuthRequest(
  {
    androidClientId:
      "504961053140-o0ue7qneapk7ch614i13i14p1s28ud0h.apps.googleusercontent.com",
    iosClientId:
      "504961053140-oveffkqr0tkt5mbj0ksfkggv055n7i33.apps.googleusercontent.com",
    webClientId:
      "504961053140-5fb7kj7fg852n3nhuaadn0hopblh6djl.apps.googleusercontent.com",
  },
  {
    path: "/(app)/(auth)/sign-in",
    scheme: "usetri",
  }
);
```

**After:**

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

---

### 4. `lib/constants.ts`

**Before:**

```typescript
// export const BASE_API_URL = "https://dolacna-admin-api.default.offli.eu/";
export const BASE_API_URL =
  "https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/";
```

**After:**

```typescript
export const BASE_API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  "https://usetri-api.livelypond-189c8f13.polandcentral.azurecontainerapps.io/";
```

---

### 5. `eas.json` (Enhancement)

Add environment variable configuration for each profile:

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
        "ascAppId": "YOUR_APP_STORE_CONNECT_ID",
        "appleTeamId": "YOUR_TEAM_ID"
      },
      "android": {
        "serviceAccountKeyPath": "./service-account-key.json",
        "track": "internal"
      }
    }
  }
}
```

---

## 📝 Optional Enhancements

### 6. Add Environment Type Checking

Create `lib/env.ts`:

```typescript
/**
 * Environment variables configuration with type safety
 */

const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
  }
  return value || "";
};

export const ENV = {
  // API
  API_URL: getEnvVar("EXPO_PUBLIC_API_URL"),

  // Firebase
  FIREBASE_API_KEY: getEnvVar("EXPO_PUBLIC_FIREBASE_API_KEY"),
  FIREBASE_AUTH_DOMAIN: getEnvVar("EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"),
  FIREBASE_PROJECT_ID: getEnvVar("EXPO_PUBLIC_FIREBASE_PROJECT_ID"),
  FIREBASE_STORAGE_BUCKET: getEnvVar("EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"),
  FIREBASE_MESSAGING_SENDER_ID: getEnvVar(
    "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
  ),
  FIREBASE_APP_ID: getEnvVar("EXPO_PUBLIC_FIREBASE_APP_ID"),

  // Google OAuth
  GOOGLE_ANDROID_CLIENT_ID: getEnvVar("EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID"),
  GOOGLE_IOS_CLIENT_ID: getEnvVar("EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"),
  GOOGLE_WEB_CLIENT_ID: getEnvVar("EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"),

  // RevenueCat
  REVENUECAT_APPLE_KEY: getEnvVar("EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY"),
  REVENUECAT_GOOGLE_KEY: getEnvVar("EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY"),

  // Project
  EAS_PROJECT_ID: getEnvVar("EXPO_PUBLIC_EAS_PROJECT_ID"),
} as const;

// Validate required environment variables
export const validateEnv = () => {
  const required = [
    "EXPO_PUBLIC_API_URL",
    "EXPO_PUBLIC_FIREBASE_API_KEY",
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missing.join("\n")}`
    );
  }
};
```

Then use it in your files:

```typescript
import { ENV } from "~/lib/env";

// Instead of process.env.EXPO_PUBLIC_API_URL
const apiUrl = ENV.API_URL;
```

---

### 7. Add Environment Validation Script

Create `scripts/validate-env.js`:

```javascript
#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const REQUIRED_VARS = [
  "EXPO_PUBLIC_API_URL",
  "EXPO_PUBLIC_FIREBASE_API_KEY",
  "EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "EXPO_PUBLIC_FIREBASE_PROJECT_ID",
  "EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "EXPO_PUBLIC_FIREBASE_APP_ID",
  "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID",
  "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID",
  "EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID",
  "EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY",
  "EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY",
  "EXPO_PUBLIC_EAS_PROJECT_ID",
];

// Load .env file
require("dotenv").config();

let hasErrors = false;
const missing = [];
const empty = [];

console.log("🔍 Validating environment variables...\n");

REQUIRED_VARS.forEach((varName) => {
  const value = process.env[varName];

  if (!value) {
    missing.push(varName);
    hasErrors = true;
  } else if (value.trim() === "") {
    empty.push(varName);
    hasErrors = true;
  } else {
    console.log(`✅ ${varName}`);
  }
});

if (missing.length > 0) {
  console.log("\n❌ Missing environment variables:");
  missing.forEach((v) => console.log(`   - ${v}`));
}

if (empty.length > 0) {
  console.log("\n⚠️  Empty environment variables:");
  empty.forEach((v) => console.log(`   - ${v}`));
}

if (!hasErrors) {
  console.log("\n✨ All environment variables are properly set!");
  process.exit(0);
} else {
  console.log("\n💡 Check your .env file and compare with .env.example");
  process.exit(1);
}
```

Add to `package.json`:

```json
{
  "scripts": {
    "validate-env": "node scripts/validate-env.js",
    "prebuild": "npm run validate-env"
  }
}
```

---

## 🔒 Security Checklist

Before committing:

- [ ] All hardcoded secrets removed from source files
- [ ] `.env` file created and filled with actual values
- [ ] `.env` is in `.gitignore` (already done ✅)
- [ ] `.env.example` has all required variables (with empty/placeholder values)
- [ ] `google-services.json` files are in `.gitignore`
- [ ] `GoogleService-Info.plist` is in `.gitignore`
- [ ] Backup of original files created (don't commit backups!)
- [ ] All team members informed about environment variable setup

---

## 🧪 Testing Checklist

After making changes:

- [ ] App runs locally with `npx expo start`
- [ ] Firebase authentication works
- [ ] Google Sign-In works
- [ ] RevenueCat initialization succeeds
- [ ] API calls work correctly
- [ ] No console errors about missing environment variables
- [ ] Test build with `eas build --platform <platform> --profile development --local`

---

## 📦 Deployment Checklist

Before deploying:

- [ ] All GitHub secrets configured
- [ ] Workflow files committed and pushed
- [ ] Test workflow runs successfully
- [ ] Build completes without errors
- [ ] App installs and runs on device
- [ ] All third-party services work in built app

---

## 🚨 Rollback Plan

If something goes wrong:

1. **Restore backup files:**

   ```bash
   cp google-services.json.backup google-services.json
   cp GoogleService-Info.plist.backup GoogleService-Info.plist
   ```

2. **Revert code changes:**

   ```bash
   git checkout HEAD~1 -- firebase.config.js
   git checkout HEAD~1 -- context/revenue-cat-provider.tsx
   git checkout HEAD~1 -- components/google-authentication/google-sign-in.tsx
   git checkout HEAD~1 -- lib/constants.ts
   ```

3. **Test locally** before pushing

---

## 📞 Support

If you need help:

1. Check the main [CI/CD Setup Guide](./CI-CD-SETUP-GUIDE.md)
2. Review [Quick Reference](./CI-CD-QUICK-REFERENCE.md)
3. Check EAS build logs
4. Review GitHub Actions logs
5. Consult Expo documentation
