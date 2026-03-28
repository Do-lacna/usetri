#!/usr/bin/env bash

set -euo pipefail

# This script runs before npm install during EAS Build
# It ensures Google Services config files are in place.
# Priority: 1) already present on disk, 2) EAS FILE_BASE64 secret (file path), 3) raw base64 env var

echo "=== Setting up Google Services files ==="

# For iOS
IOS_TARGET="ios/Usetri/GoogleService-Info.plist"
ROOT_PLIST="./GoogleService-Info.plist"

if [ -f "$IOS_TARGET" ] && [ -f "$ROOT_PLIST" ]; then
  echo "GoogleService-Info.plist already exists at both locations — skipping."
else
  if [ -n "${GOOGLE_SERVICES_PLIST:-}" ]; then
    echo "GOOGLE_SERVICES_PLIST is set to: $GOOGLE_SERVICES_PLIST"

    if [ -f "$GOOGLE_SERVICES_PLIST" ]; then
      echo "Source is a file path, copying..."
      mkdir -p ios/Usetri
      cp "$GOOGLE_SERVICES_PLIST" "$ROOT_PLIST"
      cp "$GOOGLE_SERVICES_PLIST" "$IOS_TARGET"
    else
      echo "Not a file path, trying base64 decode..."
      mkdir -p ios/Usetri
      echo "$GOOGLE_SERVICES_PLIST" | base64 -d > "$ROOT_PLIST"
      echo "$GOOGLE_SERVICES_PLIST" | base64 -d > "$IOS_TARGET"
    fi
    echo "GoogleService-Info.plist setup complete"
    ls -la "$ROOT_PLIST" "$IOS_TARGET"
  else
    echo "WARNING: GOOGLE_SERVICES_PLIST is not set and files not found on disk!"
  fi
fi

# For Android
ANDROID_TARGET="android/app/google-services.json"
ROOT_JSON="./google-services.json"

if [ -f "$ANDROID_TARGET" ] && [ -f "$ROOT_JSON" ]; then
  echo "google-services.json already exists — skipping."
else
  if [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
    echo "GOOGLE_SERVICES_JSON is set"

    if [ -f "$GOOGLE_SERVICES_JSON" ]; then
      echo "Source is a file path, copying..."
      mkdir -p android/app android/app/src/release android/app/src/debug
      cp "$GOOGLE_SERVICES_JSON" "$ROOT_JSON"
      cp "$GOOGLE_SERVICES_JSON" "$ANDROID_TARGET"
      cp "$GOOGLE_SERVICES_JSON" android/app/src/release/google-services.json
      cp "$GOOGLE_SERVICES_JSON" android/app/src/debug/google-services.json
    else
      echo "Not a file path, trying base64 decode..."
      mkdir -p android/app android/app/src/release android/app/src/debug
      echo "$GOOGLE_SERVICES_JSON" | base64 -d > "$ROOT_JSON"
      echo "$GOOGLE_SERVICES_JSON" | base64 -d > "$ANDROID_TARGET"
      echo "$GOOGLE_SERVICES_JSON" | base64 -d > android/app/src/release/google-services.json
      echo "$GOOGLE_SERVICES_JSON" | base64 -d > android/app/src/debug/google-services.json
    fi
    echo "google-services.json setup complete"
  else
    echo "WARNING: GOOGLE_SERVICES_JSON is not set and files not found on disk!"
  fi
fi

echo "=== Google Services files setup complete ==="
echo "Verification:"
ls -la "$ROOT_PLIST" 2>/dev/null || echo "GoogleService-Info.plist NOT FOUND in root"
ls -la "$IOS_TARGET" 2>/dev/null || echo "GoogleService-Info.plist NOT FOUND in ios/Usetri/"
ls -la "$ROOT_JSON" 2>/dev/null || echo "google-services.json NOT FOUND in root"
ls -la "$ANDROID_TARGET" 2>/dev/null || echo "google-services.json NOT FOUND in android/app/"
