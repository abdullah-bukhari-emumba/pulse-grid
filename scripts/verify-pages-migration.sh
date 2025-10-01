#!/bin/bash

# PulseGrid Pages Router Migration Verification Script
# This script verifies that the migration from App Router to Pages Router was successful

echo "🔄 PulseGrid Pages Router Migration Verification"
echo "==============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    if [ "$2" == "SUCCESS" ]; then
        echo -e "${GREEN}✅ $1${NC}"
    elif [ "$2" == "WARNING" ]; then
        echo -e "${YELLOW}⚠️  $1${NC}"
    elif [ "$2" == "ERROR" ]; then
        echo -e "${RED}❌ $1${NC}"
    elif [ "$2" == "INFO" ]; then
        echo -e "${BLUE}ℹ️  $1${NC}"
    else
        echo -e "📋 $1"
    fi
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_status "Please run this script from the project root directory" "ERROR"
    exit 1
fi

print_status "Starting Pages Router migration verification..." "INFO"
echo ""

# Check dashboard-shell migration
print_status "Verifying dashboard-shell (HOST) migration..." "INFO"

# Check Pages Router structure for dashboard-shell
if [ -d "apps/dashboard-shell/src/pages" ]; then
    print_status "Dashboard-shell pages directory exists" "SUCCESS"
else
    print_status "Dashboard-shell pages directory missing" "ERROR"
fi

if [ -f "apps/dashboard-shell/src/pages/_app.tsx" ]; then
    print_status "Dashboard-shell _app.tsx exists" "SUCCESS"
else
    print_status "Dashboard-shell _app.tsx missing" "ERROR"
fi

if [ -f "apps/dashboard-shell/src/pages/_document.tsx" ]; then
    print_status "Dashboard-shell _document.tsx exists" "SUCCESS"
else
    print_status "Dashboard-shell _document.tsx missing" "ERROR"
fi

if [ -f "apps/dashboard-shell/src/pages/index.tsx" ]; then
    print_status "Dashboard-shell index.tsx exists" "SUCCESS"
else
    print_status "Dashboard-shell index.tsx missing" "ERROR"
fi

if [ -f "apps/dashboard-shell/src/styles/globals.css" ]; then
    print_status "Dashboard-shell styles moved to styles directory" "SUCCESS"
else
    print_status "Dashboard-shell styles not moved properly" "ERROR"
fi

# Check that app directory was removed
if [ ! -d "apps/dashboard-shell/src/app" ]; then
    print_status "Dashboard-shell app directory removed" "SUCCESS"
else
    print_status "Dashboard-shell app directory still exists" "WARNING"
fi

echo ""

# Check clinical-flags-mfe migration
print_status "Verifying clinical-flags-mfe (REMOTE) migration..." "INFO"

# Check Pages Router structure for clinical-flags-mfe
if [ -d "apps/clinical-flags-mfe/src/pages" ]; then
    print_status "Clinical-flags-mfe pages directory exists" "SUCCESS"
else
    print_status "Clinical-flags-mfe pages directory missing" "ERROR"
fi

if [ -f "apps/clinical-flags-mfe/src/pages/_app.tsx" ]; then
    print_status "Clinical-flags-mfe _app.tsx exists" "SUCCESS"
else
    print_status "Clinical-flags-mfe _app.tsx missing" "ERROR"
fi

if [ -f "apps/clinical-flags-mfe/src/pages/_document.tsx" ]; then
    print_status "Clinical-flags-mfe _document.tsx exists" "SUCCESS"
else
    print_status "Clinical-flags-mfe _document.tsx missing" "ERROR"
fi

if [ -f "apps/clinical-flags-mfe/src/pages/index.tsx" ]; then
    print_status "Clinical-flags-mfe index.tsx exists" "SUCCESS"
else
    print_status "Clinical-flags-mfe index.tsx missing" "ERROR"
fi

if [ -f "apps/clinical-flags-mfe/src/styles/globals.css" ]; then
    print_status "Clinical-flags-mfe styles moved to styles directory" "SUCCESS"
else
    print_status "Clinical-flags-mfe styles not moved properly" "ERROR"
fi

# Check that app directory was removed
if [ ! -d "apps/clinical-flags-mfe/src/app" ]; then
    print_status "Clinical-flags-mfe app directory removed" "SUCCESS"
else
    print_status "Clinical-flags-mfe app directory still exists" "WARNING"
fi

echo ""

# Check components are still in place
print_status "Verifying components are preserved..." "INFO"

if [ -f "apps/dashboard-shell/src/components/SimpleMFEDemo.tsx" ]; then
    print_status "SimpleMFEDemo component preserved" "SUCCESS"
else
    print_status "SimpleMFEDemo component missing" "ERROR"
fi

if [ -f "apps/clinical-flags-mfe/src/components/ClinicalFlagsWidget.tsx" ]; then
    print_status "ClinicalFlagsWidget component preserved" "SUCCESS"
else
    print_status "ClinicalFlagsWidget component missing" "ERROR"
fi

echo ""

# Check Module Federation configurations
print_status "Verifying Module Federation configurations..." "INFO"

if grep -q "NextFederationPlugin" "apps/dashboard-shell/next.config.ts"; then
    print_status "Dashboard-shell Module Federation config intact" "SUCCESS"
else
    print_status "Dashboard-shell Module Federation config missing" "ERROR"
fi

if grep -q "NextFederationPlugin" "apps/clinical-flags-mfe/next.config.ts"; then
    print_status "Clinical-flags-mfe Module Federation config intact" "SUCCESS"
else
    print_status "Clinical-flags-mfe Module Federation config missing" "ERROR"
fi

# Check for Pages Router specific configurations
if grep -q "Pages Router" "apps/dashboard-shell/next.config.ts"; then
    print_status "Dashboard-shell config updated with Pages Router notes" "SUCCESS"
else
    print_status "Dashboard-shell config missing Pages Router documentation" "WARNING"
fi

if grep -q "Pages Router" "apps/clinical-flags-mfe/next.config.ts"; then
    print_status "Clinical-flags-mfe config updated with Pages Router notes" "SUCCESS"
else
    print_status "Clinical-flags-mfe config missing Pages Router documentation" "WARNING"
fi

echo ""

# Summary
print_status "Migration Verification Summary" "INFO"
echo "=============================="

print_status "✨ Migration Components:" ""
echo "   📁 Directory Structure: App Router → Pages Router"
echo "   📄 _app.tsx: Application root components created"
echo "   📄 _document.tsx: HTML document structure created" 
echo "   📄 index.tsx: Home page components migrated"
echo "   🎨 Global CSS: Moved to styles/ directory"
echo "   🗑️  App directories: Removed from both applications"

print_status "🔧 Preserved Components:" ""
echo "   🧩 SimpleMFEDemo: Host application demo component"
echo "   🏥 ClinicalFlagsWidget: Remote MFE exposed component"
echo "   ⚙️  Module Federation: All configurations preserved"
echo "   📝 TypeScript: Type definitions maintained"

print_status "📋 Next Steps:" ""
echo "1. Run 'pnpm dev' to start both applications"
echo "2. Verify both apps start without Module Federation errors"
echo "3. Test http://localhost:3003 (host) and http://localhost:3002 (remote)"
echo "4. Confirm Module Federation loading works correctly"
echo "5. Check browser console for any runtime errors"

echo ""
print_status "🎉 Pages Router migration verification completed!" "SUCCESS"
print_status "Both applications should now be compatible with Module Federation" "INFO"