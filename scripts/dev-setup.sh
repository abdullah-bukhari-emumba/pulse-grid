#!/bin/bash

# ============================================================================
# PulseGrid Development Environment Setup Script
# ============================================================================
# 
# This script automates the setup process for the PulseGrid development
# environment, ensuring all prerequisites are met and dependencies are
# properly configured for the micro-frontend monorepo.
#
# What this script does:
# 1. Validates Node.js and pnpm versions
# 2. Installs all monorepo dependencies
# 3. Creates environment configuration files
# 4. Provides guidance for starting development
#
# Usage: ./scripts/dev-setup.sh
# ============================================================================

echo "🚀 Setting up PulseGrid development environment..."

# ============================================================================
# PREREQUISITE VALIDATION
# ============================================================================
# Ensures the development environment meets minimum requirements
# for running Next.js 15+ with Module Federation and pnpm workspaces

echo "📋 Checking prerequisites..."

# Check if Node.js is installed
# Node.js is required for running Next.js applications and build tools
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js >= 18.0.0"
    echo "   Download from: https://nodejs.org/"
    echo "   Or use a version manager like nvm: https://github.com/nvm-sh/nvm"
    exit 1
fi

# Validate Node.js version meets minimum requirements
# Node.js 18+ is required for:
# - Next.js 15 compatibility
# - Modern ES modules support
# - Improved performance and security features
NODE_VERSION=$(node -v | cut -d'v' -f2)
REQUIRED_VERSION="18.0.0"

if ! printf '%s\n%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V -C; then
    echo "❌ Node.js version $NODE_VERSION is too old. Please upgrade to >= $REQUIRED_VERSION"
    echo "   Current version: $NODE_VERSION"
    echo "   Required version: >= $REQUIRED_VERSION"
    echo "   Next.js 15 and Module Federation require Node.js 18+"
    exit 1
fi

echo "✅ Node.js version: $NODE_VERSION (meets requirements)"

# Check if pnpm is installed, install if missing
# pnpm is the preferred package manager for this monorepo because:
# - Efficient disk space usage with shared dependencies
# - Fast installation times
# - Better workspace support than npm/yarn
# - Strict dependency resolution prevents phantom dependencies
if ! command -v pnpm &> /dev/null; then
    echo "❌ pnpm is not installed. Installing pnpm..."
    echo "   pnpm provides better monorepo support and faster installs"
    npm install -g pnpm
    
    # Verify installation was successful
    if ! command -v pnpm &> /dev/null; then
        echo "❌ Failed to install pnpm. Please install manually:"
        echo "   npm install -g pnpm"
        echo "   Or visit: https://pnpm.io/installation"
        exit 1
    fi
fi

PNPM_VERSION=$(pnpm -v)
echo "✅ pnpm version: $PNPM_VERSION"

# ============================================================================
# DEPENDENCY INSTALLATION
# ============================================================================
# Install all dependencies across the monorepo using pnpm workspaces
# This installs dependencies for:
# - Root workspace (build tools, shared dev dependencies)
# - dashboard-shell application
# - clinical-flags-mfe application  
# - All packages (ui, types, config-custom)

echo "📦 Installing dependencies..."
echo "   This may take a few minutes for the initial install..."

# Install dependencies with pnpm
# --frozen-lockfile ensures reproducible installs in CI/production
# For development, we allow lockfile updates to incorporate new dependencies
pnpm install

# Check if installation was successful
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    echo "   Try clearing caches and reinstalling:"
    echo "   pnpm store prune"
    echo "   rm -rf node_modules"
    echo "   pnpm install"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# ============================================================================
# ENVIRONMENT CONFIGURATION SETUP
# ============================================================================
# Create environment configuration files from templates
# These files contain port configurations, feature flags, and other
# environment-specific settings needed for development

echo "🔧 Setting up environment files..."

# Create root environment file
# Contains global configuration used across all applications
if [ ! -f ".env.local" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env.local
        echo "✅ Created .env.local from template"
    else
        echo "⚠️  .env.example not found, skipping root .env.local creation"
        echo "   You may need to create .env.local manually if needed"
    fi
else
    echo "✅ .env.local already exists"
fi

# Create dashboard-shell environment file
# Contains configuration specific to the host application
if [ ! -f "apps/dashboard-shell/.env.local" ]; then
    if [ -f "apps/dashboard-shell/.env.example" ]; then
        cp apps/dashboard-shell/.env.example apps/dashboard-shell/.env.local
        echo "✅ Created dashboard-shell .env.local from template"
    else
        echo "⚠️  dashboard-shell .env.example not found"
        echo "   Dashboard shell may not have proper port configuration"
    fi
else
    echo "✅ dashboard-shell .env.local already exists"
fi

# Create clinical-flags-mfe environment file
# Contains configuration specific to the clinical flags micro-frontend
if [ ! -f "apps/clinical-flags-mfe/.env.local" ]; then
    if [ -f "apps/clinical-flags-mfe/.env.example" ]; then
        cp apps/clinical-flags-mfe/.env.example apps/clinical-flags-mfe/.env.local
        echo "✅ Created clinical-flags-mfe .env.local from template"
    else
        echo "⚠️  clinical-flags-mfe .env.example not found"
        echo "   Clinical flags MFE may not have proper port configuration"
    fi
else
    echo "✅ clinical-flags-mfe .env.local already exists"
fi

# ============================================================================
# SETUP COMPLETION AND GUIDANCE
# ============================================================================
# Provide clear instructions for starting development after setup

echo ""
echo "🎉 Development environment setup complete!"
echo ""
echo "� Next steps:"
echo ""
echo "�🚀 To start development:"
echo "   pnpm dev              # Start all applications in parallel"
echo "   pnpm storybook        # Start Storybook component library"
echo ""
echo "📱 Application access points:"
echo "   Dashboard Shell:      http://localhost:3000  (Host application)"
echo "   Clinical Flags MFE:   http://localhost:3001  (Micro-frontend)"
echo "   Storybook:            http://localhost:6006  (Component library)"
echo ""
echo "🔧 Development commands:"
echo "   pnpm dev --filter=dashboard-shell     # Start only dashboard shell"
echo "   pnpm dev --filter=clinical-flags-mfe  # Start only clinical flags MFE"
echo "   pnpm build                            # Build all applications"
echo "   pnpm lint                             # Lint all code"
echo "   pnpm type-check                       # Check TypeScript types"
echo ""
echo "📖 For more information, see:"
echo "   README.md                    # Project overview"
echo "   docs/DEVELOPMENT.md          # Development guide"
echo "   docs/TURBOREPO_CONFIG.md     # Turborepo configuration"
echo ""
echo "Happy coding! 🎯"