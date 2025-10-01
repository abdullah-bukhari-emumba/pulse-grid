#!/bin/bash

# PulseGrid Module Federation Test Script
# This script verifies that the Module Federation setup is working correctly

echo "🚀 Starting PulseGrid Module Federation Test"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ "$2" == "SUCCESS" ]; then
        echo -e "${GREEN}✅ $1${NC}"
    elif [ "$2" == "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $1${NC}"
    elif [ "$2" == "ERROR" ]; then
        echo -e "${RED}❌ $1${NC}"
    else
        echo -e "ℹ️  $1"
    fi
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_status "Please run this script from the project root directory" "ERROR"
    exit 1
fi

print_status "Project root directory verified" "SUCCESS"

# Check if required files exist
print_status "Checking Module Federation configuration files..." "INFO"

# Check host configuration
if [ -f "apps/dashboard-shell/next.config.ts" ]; then
    if grep -q "NextFederationPlugin" "apps/dashboard-shell/next.config.ts"; then
        print_status "Host (dashboard-shell) Module Federation config found" "SUCCESS"
    else
        print_status "Host Module Federation config not configured" "ERROR"
    fi
else
    print_status "Host next.config.ts not found" "ERROR"
fi

# Check remote configuration
if [ -f "apps/clinical-flags-mfe/next.config.ts" ]; then
    if grep -q "NextFederationPlugin" "apps/clinical-flags-mfe/next.config.ts"; then
        print_status "Remote (clinical-flags-mfe) Module Federation config found" "SUCCESS"
    else
        print_status "Remote Module Federation config not configured" "ERROR"
    fi
else
    print_status "Remote next.config.ts not found" "ERROR"
fi

# Check if remote component exists
if [ -f "apps/clinical-flags-mfe/src/components/ClinicalFlagsWidget.tsx" ]; then
    print_status "Remote component (ClinicalFlagsWidget) found" "SUCCESS"
else
    print_status "Remote component not found" "ERROR"
fi

# Check if host demo component exists
if [ -f "apps/dashboard-shell/src/components/SimpleMFEDemo.tsx" ]; then
    print_status "Host demo component found" "SUCCESS"
else
    print_status "Host demo component not found" "ERROR"
fi

# Check if type definitions exist
if [ -f "apps/dashboard-shell/src/types/module-federation.d.ts" ]; then
    print_status "Module Federation type definitions found" "SUCCESS"
else
    print_status "Module Federation type definitions not found" "WARNING"
fi

echo ""
print_status "Module Federation Setup Analysis Complete" "INFO"
echo ""
echo "📋 Next Steps:"
echo "1. Run 'pnpm dev' to start both applications"
echo "2. Open http://localhost:3003 to view the host application"
echo "3. Verify that the Clinical Flags MFE loads correctly"
echo "4. Check browser console for any federation errors"
echo ""
echo "🔧 Manual Verification:"
echo "- Host app should run on localhost:3003"
echo "- Remote MFE should run on localhost:3002"
echo "- Check browser Network tab for remoteEntry.js loading"
echo "- Verify shared dependencies are not duplicated"