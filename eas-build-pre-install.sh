#!/usr/bin/env bash

set -euo pipefail

# This script runs before npm install during EAS Build.
# Firebase config files (GoogleService-Info.plist, google-services.json) are
# tracked in git and should already be present. This script is a fallback
# that recreates them from EAS secrets if they're missing (e.g., in CI
# environments that strip certain files).

echo "=== Verifying Google Services files ==="

# For iOS
IOS_TARGET="ios/Usetri/GoogleService-Info.plist"
ROOT_PLIST="./GoogleService-Info.plist"

if [ -f "$IOS_TARGET" ]; then
  echo "✓ $IOS_TARGET exists"
elif [ -f "$ROOT_PLIST" ]; then
  echo "$IOS_TARGET missing, copying from root..."
  mkdir -p ios/Usetri
  cp "$ROOT_PLIST" "$IOS_TARGET"
elif [ -n "${GOOGLE_SERVICES_PLIST:-}" ]; then
  echo "Restoring GoogleService-Info.plist from EAS secret..."
  mkdir -p ios/Usetri
  if [ -f "$GOOGLE_SERVICES_PLIST" ]; then
    cp "$GOOGLE_SERVICES_PLIST" "$ROOT_PLIST"
    cp "$GOOGLE_SERVICES_PLIST" "$IOS_TARGET"
  else
    echo "$GOOGLE_SERVICES_PLIST" | base64 -d > "$ROOT_PLIST"
    echo "$GOOGLE_SERVICES_PLIST" | base64 -d > "$IOS_TARGET"
  fi
else
  echo "ERROR: GoogleService-Info.plist not found and no secret available!"
  exit 1
fi

# For Android
ANDROID_TARGET="android/app/google-services.json"
ROOT_JSON="./google-services.json"

if [ -f "$ANDROID_TARGET" ]; then
  echo "✓ $ANDROID_TARGET exists"
elif [ -f "$ROOT_JSON" ]; then
  echo "$ANDROID_TARGET missing, copying from root..."
  mkdir -p android/app
  cp "$ROOT_JSON" "$ANDROID_TARGET"
elif [ -n "${GOOGLE_SERVICES_JSON:-}" ]; then
  echo "Restoring google-services.json from EAS secret..."
  mkdir -p android/app
  if [ -f "$GOOGLE_SERVICES_JSON" ]; then
    cp "$GOOGLE_SERVICES_JSON" "$ROOT_JSON"
    cp "$GOOGLE_SERVICES_JSON" "$ANDROID_TARGET"
  else
    echo "$GOOGLE_SERVICES_JSON" | base64 -d > "$ROOT_JSON"
    echo "$GOOGLE_SERVICES_JSON" | base64 -d > "$ANDROID_TARGET"
  fi
else
  echo "ERROR: google-services.json not found and no secret available!"
  exit 1
fi

echo "=== Google Services verification complete ==="
