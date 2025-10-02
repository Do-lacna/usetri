# 🚀 CI/CD Quick Reference

## Common Commands

### Local Development

```bash
# Start dev server
npx expo start

# Clear cache and start
npx expo start -c

# Run on iOS simulator
npx expo run:ios

# Run on Android emulator
npx expo run:android
```

### Environment Management

```bash
# Copy example environment file
cp .env.example .env

# Validate environment variables
node -e "console.log(process.env.EXPO_PUBLIC_API_URL)"
```

### EAS Build (Local)

```bash
# Build locally for testing
eas build --platform ios --profile development --local
eas build --platform android --profile development --local

# Build for preview
eas build --platform all --profile preview

# Build for production
eas build --platform all --profile production
```

### EAS Submit

```bash
# Submit to App Store
eas submit --platform ios --latest

# Submit to Play Store
eas submit --platform android --latest

# Submit specific build
eas submit --platform ios --id <build-id>
```

### GitHub Actions

```bash
# Manually trigger build workflow
# Go to: GitHub → Actions → EAS Build and Deploy → Run workflow

# View workflow runs
gh run list --workflow=eas-build.yml

# View specific run logs
gh run view <run-id> --log
```

### Secrets Management

```bash
# Encode file to base64 (for GitHub secrets)
# macOS
cat file.json | base64 | pbcopy

# Linux
cat file.json | base64 -w 0 | xclip -selection clipboard

# Decode base64 (for verification)
echo "BASE64_STRING" | base64 -d > output.json
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Commit changes
git add .
git commit -m "feat: description of changes"

# Push and create PR
git push origin feature/your-feature-name

# Create PR via GitHub CLI
gh pr create --base main --head feature/your-feature-name
```

## Workflow Triggers

### Automatic Triggers

- **Push to `main`** → Runs tests and linting
- **Push to `develop`** → Runs tests and linting
- **Pull Request** → Runs PR checks workflow

### Manual Triggers

- **GitHub Actions UI** → Run EAS Build workflow with custom options

## Build Profiles

| Profile       | Purpose        | Distribution  | Auto-increment |
| ------------- | -------------- | ------------- | -------------- |
| `development` | Dev builds     | Internal      | ✅             |
| `preview`     | Testing/QA     | Internal      | ✅             |
| `production`  | Store releases | Public stores | ✅             |

## Environment Variables Checklist

### Required for All Builds

- ✅ `EXPO_PUBLIC_API_URL`
- ✅ `EXPO_PUBLIC_EAS_PROJECT_ID`

### Firebase

- ✅ `EXPO_PUBLIC_FIREBASE_API_KEY`
- ✅ `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- ✅ `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- ✅ `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
- ✅ `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `EXPO_PUBLIC_FIREBASE_APP_ID`

### Google OAuth

- ✅ `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`
- ✅ `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- ✅ `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

### RevenueCat

- ✅ `EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY`
- ✅ `EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY`

### CI/CD Secrets (GitHub only)

- ✅ `EXPO_TOKEN`
- ✅ `ANDROID_GOOGLE_SERVICES_JSON` (base64)
- ✅ `IOS_GOOGLE_SERVICES_PLIST` (base64)
- ✅ `EXPO_APPLE_APP_SPECIFIC_PASSWORD` (for submission)

## Troubleshooting Quick Fixes

### Clear All Caches

```bash
# Clear Expo cache
npx expo start -c

# Clear npm cache
npm cache clean --force

# Clear CocoaPods cache (iOS)
cd ios && pod cache clean --all && cd ..

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Reset iOS Build

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

### Reset Android Build

```bash
cd android
./gradlew clean
cd ..
```

### Verify Environment Variables

```bash
# Check if variables are loaded
npx expo config --type public

# Test in Node
node -e "require('dotenv').config(); console.log(process.env)"
```

## Useful Links

- 📱 [Expo Dashboard](https://expo.dev/accounts/adammartiska/projects/usetri)
- 🔨 [EAS Builds](https://expo.dev/accounts/adammartiska/projects/usetri/builds)
- 🚀 [GitHub Actions](https://github.com/Do-lacna/usetri/actions)
- 📊 [Firebase Console](https://console.firebase.google.com/project/dolacna-388d4)
- 💰 [RevenueCat Dashboard](https://app.revenuecat.com/)
- 🍎 [App Store Connect](https://appstoreconnect.apple.com/)
- 🤖 [Google Play Console](https://play.google.com/console/)

## Status Check Commands

```bash
# Check EAS CLI version
eas --version

# Check current project
eas whoami

# View latest builds
eas build:list --limit 5

# View build details
eas build:view <build-id>

# Check update availability
npx expo-doctor
```

## Emergency Rollback

```bash
# If production build has issues:

# 1. Identify last known good build
eas build:list --platform <platform> --profile production

# 2. Submit that build instead
eas submit --platform <platform> --id <build-id>

# 3. Or revert code and rebuild
git revert <commit-hash>
git push origin main
# Workflow will auto-trigger
```

## Performance Tips

- 🔄 Use `--no-wait` flag for async builds
- 📦 Enable caching in workflows (already configured)
- 🎯 Build only changed platform with manual dispatch
- ⚡ Use `--local` flag for faster iteration during development

---

**Pro Tip:** Save this file to your bookmarks or pin it in your team's Slack/Discord!
