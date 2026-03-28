#!/usr/bin/env bash

set -euo pipefail

# This script runs before npm install during EAS Build
# EAS FILE_BASE64 secrets provide a file path in the env var

echo "=== Setting up Google Services files ==="

# For iOS
if [ -n "${GOOGLE_SERVICES_PLIST:-}" ]; then
  echo "GOOGLE_SERVICES_PLIST is set to: $GOOGLE_SERVICES_PLIST"

  if [ -f "$GOOGLE_SERVICES_PLIST" ]; then
    echo "Source file exists, copying..."
    cp "$GOOGLE_SERVICES_PLIST" ./GoogleService-Info.plist
    mkdir -p ios/Usetri
    cp "$GOOGLE_SERVICES_PLIST" ios/Usetri/GoogleService-Info.plist
    echo "Copied to ./GoogleService-Info.plist and ios/Usetri/GoogleService-Info.plist"
    ls -la ./GoogleService-Info.plist ios/Usetri/GoogleService-Info.plist
  else
    # Might be raw base64 string instead of a file path
    echo "Not a file path, trying base64 decode..."
    echo "$GOOGLE_SERVICES_PLIST" | base64 -d > ./GoogleService-Info.plist
    mkdir -p ios/Usetri
    echo "$GOOGLE_SERVICES_PLIST" | base64 -d > ios/Usetri/GoogleService-Info.plist
    echo "Decoded and written to ./GoogleService-Info.plist and ios/Usetri/GoogleService-Info.plist"
    ls -la ./GoogleService-Info.plist ios/Usetri/GoogleService-Info.plist
  fi
else
  echo "WARNING: GOOGLE_SERVICES_PLIST is not set!"
fi

# For Android
if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "GOOGLE_SERVICES_JSON is set"

  if [ -f "$GOOGLE_SERVICES_JSON" ]; then
    cp "$GOOGLE_SERVICES_JSON" ./google-services.json
    mkdir -p android/app android/app/src/release android/app/src/debug
    cp "$GOOGLE_SERVICES_JSON" android/app/google-services.json
    cp "$GOOGLE_SERVICES_JSON" android/app/src/release/google-services.json
    cp "$GOOGLE_SERVICES_JSON" android/app/src/debug/google-services.json
  else
    echo "$GOOGLE_SERVICES_JSON" | base64 -d > ./google-services.json
    mkdir -p android/app android/app/src/release android/app/src/debug
    echo "$GOOGLE_SERVICES_JSON" | base64 -d > android/app/google-services.json
    echo "$GOOGLE_SERVICES_JSON" | base64 -d > android/app/src/release/google-services.json
    echo "$GOOGLE_SERVICES_JSON" | base64 -d > android/app/src/debug/google-services.json
  fi
  echo "google-services.json setup complete"
else
  echo "WARNING: GOOGLE_SERVICES_JSON is not set!"
fi

echo "=== Google Services files setup complete ==="
echo "Working directory contents:"
ls -la ./GoogleService-Info.plist 2>/dev/null || echo "GoogleService-Info.plist NOT FOUND in root"
ls -la ios/Usetri/GoogleService-Info.plist 2>/dev/null || echo "GoogleService-Info.plist NOT FOUND in ios/Usetri/"
