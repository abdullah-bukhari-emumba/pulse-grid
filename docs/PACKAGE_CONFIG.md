# Package.json Configuration Documentation

## Dashboard Shell Package Configuration

The dashboard-shell package.json is configured as the **HOST** application in our micro-frontend architecture. Here's the detailed reasoning behind each configuration choice:

### Basic Package Information
```json
{
  "name": "dashboard-shell",
  "version": "0.1.0",
  "private": true,
  "description": "Main host application for PulseGrid platform"
}
```

**name**: `dashboard-shell`
- **Purpose**: Identifies this as the main shell/host application
- **Reasoning**: Clear naming convention that indicates its role in the micro-frontend architecture

**version**: `0.1.0`
- **Purpose**: Semantic versioning for tracking releases
- **Reasoning**: Starts at 0.1.0 to indicate early development phase

**private**: `true` 
- **Purpose**: Prevents accidental publication to npm registry
- **Reasoning**: This is an application, not a library, and should never be published

**description**: Descriptive text explaining the application's purpose
- **Purpose**: Documentation and clarity for team members
- **Reasoning**: Makes the package's role clear in the monorepo context

### Scripts Configuration
```json
"scripts": {
  "dev": "next dev -p 3000",
  "build": "next build", 
  "start": "next start -p 3000",
  "lint": "eslint . --ext .ts,.tsx,.js,.jsx",
  "lint:fix": "eslint . --ext .ts,.tsx,.js,.jsx --fix",
  "type-check": "tsc --noEmit",
  "clean": "rm -rf .next .turbo node_modules/.cache"
}
```

**dev**: `next dev -p 3000`
- **Purpose**: Starts development server on port 3000
- **Reasoning**: Explicit port specification prevents conflicts with other apps
- **Port Choice**: 3000 is the standard web application port, appropriate for the main host

**build**: `next build`
- **Purpose**: Creates production build
- **Reasoning**: Standard Next.js build process for optimized production bundles

**start**: `next start -p 3000`
- **Purpose**: Starts production server on port 3000
- **Reasoning**: Matches development port for consistency across environments

**lint**: `eslint . --ext .ts,.tsx,.js,.jsx`
- **Purpose**: Lints all TypeScript and JavaScript files
- **Reasoning**: Comprehensive file extension coverage for React applications
- **Scope**: Current directory and subdirectories for complete coverage

**lint:fix**: `eslint . --ext .ts,.tsx,.js,.jsx --fix`
- **Purpose**: Automatically fixes linting issues where possible
- **Reasoning**: Improves developer productivity by auto-fixing formatting issues

**type-check**: `tsc --noEmit`
- **Purpose**: Type checking without emitting JavaScript files
- **Reasoning**: Validates TypeScript types without interfering with Next.js build process

**clean**: `rm -rf .next .turbo node_modules/.cache`
- **Purpose**: Removes build artifacts and caches
- **Reasoning**: Essential for troubleshooting build issues and starting fresh

### Dependencies Configuration
```json
"dependencies": {
  "@pulsegrid/types": "workspace:*",
  "@pulsegrid/ui": "workspace:*", 
  "next": "15.5.4",
  "react": "19.1.0",
  "react-dom": "19.1.0"
}
```

**@pulsegrid/types**: `workspace:*`
- **Purpose**: Shared TypeScript types from the monorepo
- **Reasoning**: Ensures type consistency across applications
- **workspace:***: Always uses the local workspace version

**@pulsegrid/ui**: `workspace:*`
- **Purpose**: Shared UI components from the monorepo
- **Reasoning**: Provides consistent design system components
- **workspace:***: Links to local package for development

**next**: `15.5.4`
- **Purpose**: Next.js framework for React applications
- **Version Choice**: Latest stable version with Module Federation support

**react**: `19.1.0`
- **Purpose**: React library for building user interfaces
- **Version Choice**: Latest stable React version for modern features

**react-dom**: `19.1.0`
- **Purpose**: React DOM rendering for web applications
- **Version Match**: Must match React version for compatibility

### Development Dependencies
```json
"devDependencies": {
  "@eslint/eslintrc": "^3",
  "@tailwindcss/postcss": "^4", 
  "@types/node": "^20",
  "@types/react": "^19",
  "@types/react-dom": "^19",
  "eslint": "^9",
  "eslint-config-next": "15.5.4",
  "tailwindcss": "^4",
  "typescript": "^5"
}
```

**@eslint/eslintrc**: `^3`
- **Purpose**: ESLint configuration system
- **Reasoning**: Required for ESLint 9+ configuration management

**@tailwindcss/postcss**: `^4`
- **Purpose**: Tailwind CSS PostCSS plugin
- **Reasoning**: Enables Tailwind CSS processing in the build pipeline

**@types/node**: `^20`
- **Purpose**: TypeScript definitions for Node.js
- **Reasoning**: Required for Node.js APIs used in Next.js applications

**@types/react**: `^19`
- **Purpose**: TypeScript definitions for React
- **Version Match**: Matches React runtime version for accurate types

**@types/react-dom**: `^19`
- **Purpose**: TypeScript definitions for React DOM
- **Version Match**: Matches React DOM runtime version

**eslint**: `^9`
- **Purpose**: JavaScript/TypeScript linting
- **Version Choice**: Latest major version for modern linting features

**eslint-config-next**: `15.5.4`
- **Purpose**: Next.js specific ESLint configuration
- **Version Match**: Matches Next.js version for compatibility

**tailwindcss**: `^4`
- **Purpose**: Utility-first CSS framework
- **Version Choice**: Latest major version for modern CSS features

**typescript**: `^5`
- **Purpose**: TypeScript compiler and language support
- **Version Choice**: Latest stable TypeScript for modern language features

### Engine Requirements
```json
"engines": {
  "node": ">=18.0.0",
  "pnpm": ">=9.0.0"
}
```

**node**: `>=18.0.0`
- **Purpose**: Minimum Node.js version requirement
- **Reasoning**: Node 18+ required for Next.js 15 and modern JavaScript features

**pnpm**: `>=9.0.0`
- **Purpose**: Minimum pnpm version requirement
- **Reasoning**: pnpm 9+ has improved workspace support and performance optimizations

## Clinical Flags MFE Package Configuration

Similar structure but configured as a **REMOTE** micro-frontend:

### Key Differences from Dashboard Shell

1. **Port Configuration**: Uses port 3001 to avoid conflicts
2. **Role**: Configured as a remote that exposes components
3. **Dependencies**: Same workspace packages but different runtime behavior
4. **Purpose**: Specialized for clinical flags functionality

### Scripts Specifics
- **dev**: `next dev -p 3001` - Different port for parallel development
- **start**: `next start -p 3001` - Production server on same port
- Same linting, type checking, and cleaning scripts for consistency

This configuration ensures both applications can run simultaneously during development while maintaining consistency in tooling and dependencies.