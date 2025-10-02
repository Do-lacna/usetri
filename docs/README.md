# 📚 Documentation Index

Welcome to the Usetri CI/CD documentation! This folder contains all the guides you need to set up and maintain a secure, automated deployment pipeline for your Expo React Native application.

## 📖 Documentation Files

### 1. [CI/CD Setup Guide](./CI-CD-SETUP-GUIDE.md) 📘

**Complete step-by-step guide for setting up CI/CD from scratch**

Read this first! This comprehensive guide covers:

- Prerequisites and requirements
- Security audit and best practices
- Environment variable configuration
- GitHub Secrets setup
- EAS configuration
- Testing and troubleshooting

**When to use:** Setting up CI/CD for the first time or major configuration changes

---

### 2. [CI/CD Quick Reference](./CI-CD-QUICK-REFERENCE.md) ⚡

**Quick commands and common tasks**

Your daily companion! Includes:

- Common CLI commands
- Workflow triggers
- Build profiles
- Environment variables checklist
- Troubleshooting quick fixes
- Useful links

**When to use:** Day-to-day operations, quick lookups, troubleshooting

---

### 3. [Code Refactoring Checklist](./CODE-REFACTORING-CHECKLIST.md) ✅

**Specific code changes needed to implement environment variables**

Detailed code modifications for:

- Firebase configuration
- RevenueCat setup
- Google authentication
- API constants
- Security checklists

**When to use:** Making the actual code changes to remove hardcoded secrets

---

## 🚀 Getting Started

### New to CI/CD?

1. Read the [CI/CD Setup Guide](./CI-CD-SETUP-GUIDE.md) completely
2. Follow the [Code Refactoring Checklist](./CODE-REFACTORING-CHECKLIST.md) to update your code
3. Bookmark the [Quick Reference](./CI-CD-QUICK-REFERENCE.md) for daily use

### Already have CI/CD set up?

- Use the [Quick Reference](./CI-CD-QUICK-REFERENCE.md) for commands and troubleshooting
- Refer to the [Setup Guide](./CI-CD-SETUP-GUIDE.md) for advanced configuration

---

## 🔒 Security Overview

Your application uses the following services that require secure credential management:

| Service          | Purpose                     | Credentials Needed             |
| ---------------- | --------------------------- | ------------------------------ |
| **Firebase**     | Authentication, Crashlytics | API Key, Project ID, App ID    |
| **RevenueCat**   | In-app purchases            | Apple & Google API Keys        |
| **Google OAuth** | Social login                | Client IDs (Android, iOS, Web) |
| **Backend API**  | Data services               | API URL                        |
| **EAS/Expo**     | Build & deployment          | Access tokens                  |
| **Apple**        | iOS distribution            | App-Specific Password, Team ID |
| **Google Play**  | Android distribution        | Service Account Key            |

All credentials are managed through:

- **Local Development:** `.env` file (gitignored)
- **CI/CD:** GitHub Secrets
- **Runtime:** Environment variables injected during build

---

## 📊 Workflow Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Git Repository                       │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Push to branch                                          │
│    ↓                                                     │
│  ┌──────────────────────────────────────────────┐       │
│  │  PR Checks (Automatic)                       │       │
│  │  ├─ Run linter                                │       │
│  │  ├─ Run tests                                 │       │
│  │  ├─ Type checking                             │       │
│  │  └─ Optional: Preview build (with label)     │       │
│  └──────────────────────────────────────────────┘       │
│    ↓                                                     │
│  Merge to main                                           │
│    ↓                                                     │
│  ┌──────────────────────────────────────────────┐       │
│  │  Manual Workflow Dispatch                    │       │
│  │  Choose:                                      │       │
│  │  ├─ Platform (iOS/Android/All)               │       │
│  │  ├─ Profile (dev/preview/production)         │       │
│  │  └─ Submit to stores (production only)       │       │
│  └──────────────────────────────────────────────┘       │
│    ↓                                                     │
│  ┌──────────────────────────────────────────────┐       │
│  │  EAS Build                                    │       │
│  │  ├─ Inject environment variables              │       │
│  │  ├─ Create Google Services files             │       │
│  │  ├─ Build app                                 │       │
│  │  └─ Upload to EAS                             │       │
│  └──────────────────────────────────────────────┘       │
│    ↓                                                     │
│  ┌──────────────────────────────────────────────┐       │
│  │  EAS Submit (production only)                 │       │
│  │  ├─ Submit to App Store                       │       │
│  │  └─ Submit to Play Store                      │       │
│  └──────────────────────────────────────────────┘       │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🎯 Common Tasks

### Task: Build for Testing

```bash
# Via GitHub Actions
Go to Actions → EAS Build → Run workflow → Select preview profile

# Via CLI
eas build --platform all --profile preview
```

### Task: Deploy to Production

```bash
# 1. Merge to main branch
git checkout main
git merge develop
git push origin main

# 2. Trigger workflow
Go to Actions → EAS Build → Run workflow → Select production profile

# 3. Wait for build completion
Monitor at: https://expo.dev/accounts/adammartiska/projects/usetri/builds

# 4. Submit to stores (automatic if configured)
```

### Task: Update Environment Variables

```bash
# 1. Update local .env file
# 2. Update GitHub Secrets (if changed)
# 3. Test locally
npx expo start -c

# 4. Commit other changes (not .env!)
git add .
git commit -m "feat: update configuration"
git push
```

### Task: Rollback Deployment

```bash
# Option 1: Submit previous build
eas build:list --platform <platform> --profile production
eas submit --platform <platform> --id <previous-build-id>

# Option 2: Revert and rebuild
git revert <commit-hash>
git push origin main
# Trigger workflow manually
```

---

## 🆘 Troubleshooting Guide

### Issue: Build fails with "Environment variable undefined"

**Solution:**

1. Check GitHub Secrets are set correctly
2. Verify variable names match exactly (case-sensitive)
3. Ensure variables start with `EXPO_PUBLIC_` for runtime access
4. Check workflow YAML for typos in environment variable injection

**See:** [Quick Reference - Troubleshooting](./CI-CD-QUICK-REFERENCE.md#troubleshooting-quick-fixes)

---

### Issue: "Google Services file not found"

**Solution:**

1. Verify base64-encoded file is in GitHub Secrets
2. Test decoding locally: `echo "$SECRET" | base64 -d`
3. Check workflow is creating files in correct location
4. Ensure no extra whitespace in secret value

**See:** [Setup Guide - Step 3.2](./CI-CD-SETUP-GUIDE.md#32-add-required-secrets)

---

### Issue: App crashes on launch after build

**Solution:**

1. Check Crashlytics logs in Firebase
2. Verify all environment variables are set
3. Test locally first: `eas build --local`
4. Check EAS build logs for warnings

**See:** [Setup Guide - Troubleshooting](./CI-CD-SETUP-GUIDE.md#troubleshooting)

---

## 📚 Additional Resources

### Official Documentation

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build](https://docs.expo.dev/build/introduction/)
- [EAS Submit](https://docs.expo.dev/submit/introduction/)
- [GitHub Actions](https://docs.github.com/en/actions)
- [React Native](https://reactnative.dev/)

### Third-Party Services

- [Firebase Console](https://console.firebase.google.com/)
- [RevenueCat Dashboard](https://app.revenuecat.com/)
- [Apple Developer](https://developer.apple.com/)
- [Google Play Console](https://play.google.com/console/)

### Tools

- [EAS CLI](https://github.com/expo/eas-cli)
- [Expo CLI](https://github.com/expo/expo-cli)
- [GitHub CLI](https://cli.github.com/)

---

## 🤝 Contributing

When updating these docs:

1. Keep all three documents in sync
2. Update version dates at bottom of files
3. Test all commands before documenting
4. Use clear, concise language
5. Include examples and screenshots when helpful

---

## 📞 Support Channels

- **Expo Discord:** [expo.dev/discord](https://expo.dev/discord)
- **GitHub Issues:** Repository issues tab
- **Stack Overflow:** Tag with `expo`, `eas-build`, `react-native`
- **Expo Forums:** [forums.expo.dev](https://forums.expo.dev/)

---

## 📅 Maintenance

### Regular Tasks

- [ ] **Monthly:** Review and rotate secrets
- [ ] **Quarterly:** Update dependencies and workflow versions
- [ ] **As needed:** Update docs when adding new services
- [ ] **After incidents:** Update troubleshooting sections

### Version History

| Version | Date     | Changes                           |
| ------- | -------- | --------------------------------- |
| 1.0.0   | Oct 2025 | Initial CI/CD setup documentation |

---

## ✨ Quick Start Checklist

Complete these steps to get your CI/CD running:

- [ ] Read the [Setup Guide](./CI-CD-SETUP-GUIDE.md)
- [ ] Create `.env` file with your credentials
- [ ] Update code per [Refactoring Checklist](./CODE-REFACTORING-CHECKLIST.md)
- [ ] Add all secrets to GitHub
- [ ] Test local build: `eas build --local`
- [ ] Test CI/CD: Manual workflow dispatch
- [ ] Monitor first build completion
- [ ] Verify app functionality
- [ ] Set up automatic triggers
- [ ] Bookmark [Quick Reference](./CI-CD-QUICK-REFERENCE.md)

---

**Happy Deploying! 🚀**

_Last updated: October 2025_
