#!/bin/bash

# 🚀 CI/CD Setup Helper Script
# This script helps you set up environment variables and validate your configuration

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "\n${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Main script
print_header "Usetri CI/CD Setup Helper"

# Check prerequisites
print_info "Checking prerequisites..."

if ! command_exists node; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi
print_success "Node.js found: $(node --version)"

if ! command_exists npm; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi
print_success "npm found: $(npm --version)"

if ! command_exists git; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi
print_success "Git found: $(git --version)"

# Check if in correct directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi
print_success "Running in project root"

# Step 1: Create .env file
print_header "Step 1: Environment File Setup"

if [ -f ".env" ]; then
    print_warning ".env file already exists"
    read -p "Do you want to backup and recreate it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
        print_success "Backed up existing .env file"
        cp .env.example .env
        print_success "Created new .env from template"
    fi
else
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env from .env.example"
    else
        print_error ".env.example not found. Please create it first."
        exit 1
    fi
fi

print_info "Please edit .env file and fill in your actual values"
print_info "Then press Enter to continue..."
read

# Step 2: Validate .env file
print_header "Step 2: Validating Environment Variables"

REQUIRED_VARS=(
    "EXPO_PUBLIC_API_URL"
    "EXPO_PUBLIC_FIREBASE_API_KEY"
    "EXPO_PUBLIC_FIREBASE_PROJECT_ID"
    "EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID"
    "EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"
    "EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY"
    "EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY"
)

source .env 2>/dev/null || true

MISSING=()
for var in "${REQUIRED_VARS[@]}"; do
    if [ -z "${!var}" ]; then
        MISSING+=("$var")
        print_error "$var is not set or empty"
    else
        print_success "$var is set"
    fi
done

if [ ${#MISSING[@]} -gt 0 ]; then
    print_error "Some required variables are missing. Please update .env file."
    print_info "Missing variables: ${MISSING[*]}"
    exit 1
fi

print_success "All required environment variables are set!"

# Step 3: Backup sensitive files
print_header "Step 3: Backup Sensitive Files"

FILES_TO_BACKUP=(
    "google-services.json"
    "GoogleService-Info.plist"
    "android/app/google-services.json"
)

BACKUP_DIR="backups/$(date +%Y%m%d_%H%M%S)"
mkdir -p "$BACKUP_DIR"

for file in "${FILES_TO_BACKUP[@]}"; do
    if [ -f "$file" ]; then
        cp "$file" "$BACKUP_DIR/"
        print_success "Backed up $file"
    else
        print_warning "$file not found (may not be needed for your setup)"
    fi
done

print_success "Backup created in $BACKUP_DIR"

# Step 4: Install dependencies
print_header "Step 4: Installing Dependencies"

print_info "Installing npm packages..."
npm install

if ! command_exists eas; then
    print_info "Installing EAS CLI globally..."
    npm install -g eas-cli
    print_success "EAS CLI installed"
else
    print_success "EAS CLI already installed: $(eas --version)"
fi

# Step 5: EAS Configuration
print_header "Step 5: EAS Configuration"

print_info "Checking EAS login status..."
if eas whoami >/dev/null 2>&1; then
    print_success "Already logged in to EAS: $(eas whoami)"
else
    print_info "Please log in to EAS..."
    eas login
fi

# Step 6: Base64 encode Google Services files
print_header "Step 6: Encode Google Services Files"

print_info "Encoding google-services.json for GitHub Secrets..."
if [ -f "google-services.json" ]; then
    ANDROID_ENCODED=$(cat google-services.json | base64)
    echo "$ANDROID_ENCODED" > google-services.json.base64
    print_success "Encoded android google-services.json"
    print_info "Copy content from google-services.json.base64 to GitHub Secret: ANDROID_GOOGLE_SERVICES_JSON"
else
    print_warning "google-services.json not found"
fi

print_info "Encoding GoogleService-Info.plist for GitHub Secrets..."
if [ -f "GoogleService-Info.plist" ]; then
    IOS_ENCODED=$(cat GoogleService-Info.plist | base64)
    echo "$IOS_ENCODED" > GoogleService-Info.plist.base64
    print_success "Encoded iOS GoogleService-Info.plist"
    print_info "Copy content from GoogleService-Info.plist.base64 to GitHub Secret: IOS_GOOGLE_SERVICES_PLIST"
else
    print_warning "GoogleService-Info.plist not found"
fi

# Step 7: Generate EXPO_TOKEN
print_header "Step 7: Generate Expo Token"

print_info "Getting your Expo access token..."
print_info "Visit: https://expo.dev/settings/access-tokens"
print_info "Or run: eas whoami --json"
print_info ""
print_info "Add this token to GitHub Secret: EXPO_TOKEN"
print_info "Press Enter to continue..."
read

# Step 8: Create GitHub Secrets checklist
print_header "Step 8: GitHub Secrets Checklist"

print_info "Go to: https://github.com/Do-lacna/usetri/settings/secrets/actions"
print_info ""
print_info "You need to add these secrets:"
echo ""
echo "Essential Secrets:"
echo "  ✓ EXPO_TOKEN"
echo "  ✓ EXPO_PUBLIC_API_URL = $EXPO_PUBLIC_API_URL"
echo "  ✓ EXPO_PUBLIC_FIREBASE_API_KEY = $EXPO_PUBLIC_FIREBASE_API_KEY"
echo "  ✓ EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN"
echo "  ✓ EXPO_PUBLIC_FIREBASE_PROJECT_ID"
echo "  ✓ EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET"
echo "  ✓ EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"
echo "  ✓ EXPO_PUBLIC_FIREBASE_APP_ID"
echo "  ✓ EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID"
echo "  ✓ EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID"
echo "  ✓ EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID"
echo "  ✓ EXPO_PUBLIC_REVENUECAT_APPLE_API_KEY"
echo "  ✓ EXPO_PUBLIC_REVENUECAT_GOOGLE_API_KEY"
echo "  ✓ EXPO_PUBLIC_EAS_PROJECT_ID"
echo "  ✓ ANDROID_GOOGLE_SERVICES_JSON (from google-services.json.base64)"
echo "  ✓ IOS_GOOGLE_SERVICES_PLIST (from GoogleService-Info.plist.base64)"
echo ""
echo "Optional (for store submission):"
echo "  ✓ EXPO_APPLE_APP_SPECIFIC_PASSWORD"
echo ""

# Step 9: Verification
print_header "Step 9: Local Verification"

print_info "Testing if app runs with environment variables..."
print_warning "This will start Expo dev server. Press Ctrl+C to exit after verification."
print_info "Press Enter to start..."
read

npx expo start --clear &
EXPO_PID=$!

sleep 5
print_info "If app starts without errors, environment variables are working!"
print_info "Press Ctrl+C to stop the server"

wait $EXPO_PID

# Final summary
print_header "Setup Complete! 🎉"

print_success "Environment file created and validated"
print_success "Sensitive files backed up"
print_success "Dependencies installed"
print_success "EAS CLI configured"
print_success "Google Services files encoded"

print_info "\n📋 Next Steps:"
echo "1. Add all secrets to GitHub (see checklist above)"
echo "2. Update code files per docs/CODE-REFACTORING-CHECKLIST.md"
echo "3. Test: npx expo start -c"
echo "4. Commit: git add . && git commit -m 'feat: setup CI/CD'"
echo "5. Push: git push origin develop"
echo "6. Test workflow: GitHub Actions → EAS Build → Run workflow"

print_info "\n📚 Documentation:"
echo "- Complete Guide: docs/CI-CD-SETUP-GUIDE.md"
echo "- Quick Reference: docs/CI-CD-QUICK-REFERENCE.md"
echo "- Code Changes: docs/CODE-REFACTORING-CHECKLIST.md"

print_info "\n🔐 Important Files Created:"
echo "- .env (KEEP SECRET, already gitignored)"
echo "- google-services.json.base64 (for GitHub Secrets)"
echo "- GoogleService-Info.plist.base64 (for GitHub Secrets)"
echo "- $BACKUP_DIR/ (backups of original files)"

print_warning "\n⚠️  Remember:"
echo "- Never commit .env file"
echo "- Keep backups safe"
echo "- Rotate secrets regularly"
echo "- Test locally before pushing"

print_success "\nAll done! Good luck with your CI/CD setup! 🚀"
