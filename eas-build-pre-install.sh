#!/usr/bin/env bash

set -euo pipefail

# This script runs before npm install during EAS Build
# It places the Google Services files from EAS secrets into the correct locations
# EAS FILE_BASE64 secrets are decoded and written to a temp file — the env var contains the file path

echo "Setting up Google Services files..."

# For iOS
if [ -n "${GOOGLE_SERVICES_PLIST:-}" ]; then
  echo "Copying GoogleService-Info.plist"
  cp "$GOOGLE_SERVICES_PLIST" GoogleService-Info.plist
  mkdir -p ios/Usetri
  cp "$GOOGLE_SERVICES_PLIST" ios/Usetri/GoogleService-Info.plist
fi

# For Android
if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "Copying google-services.json"
  cp "$GOOGLE_SERVICES_JSON" google-services.json
  mkdir -p android/app
  cp "$GOOGLE_SERVICES_JSON" android/app/google-services.json

  # Also copy to release/debug flavor directories that Gradle checks
  mkdir -p android/app/src/release
  mkdir -p android/app/src/debug
  cp "$GOOGLE_SERVICES_JSON" android/app/src/release/google-services.json
  cp "$GOOGLE_SERVICES_JSON" android/app/src/debug/google-services.json
fi

echo "Google Services files setup complete"
