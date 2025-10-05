#!/usr/bin/env bash

set -euo pipefail

# This script runs before npm install during EAS Build
# It places the Google Services files from EAS environment variables into the correct locations

echo "📦 Setting up Google Services files..."

# For iOS
if [ -n "${GOOGLE_SERVICES_PLIST:-}" ]; then
  echo "✅ Decoding and copying GoogleService-Info.plist"
  echo "$GOOGLE_SERVICES_PLIST" | base64 -d > GoogleService-Info.plist
  echo "$GOOGLE_SERVICES_PLIST" | base64 -d > ios/Usetri/GoogleService-Info.plist
fi

# For Android
if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "✅ Decoding and copying google-services.json"
  echo "$GOOGLE_SERVICES_JSON" | base64 -d > google-services.json
  echo "$GOOGLE_SERVICES_JSON" | base64 -d > android/app/google-services.json
  
  # Also copy to release flavor directories that Gradle checks
  mkdir -p android/app/src/release
  mkdir -p android/app/src/debug
  echo "$GOOGLE_SERVICES_JSON" | base64 -d > android/app/src/release/google-services.json
  echo "$GOOGLE_SERVICES_JSON" | base64 -d > android/app/src/debug/google-services.json
fi

echo "✅ Google Services files setup complete"
