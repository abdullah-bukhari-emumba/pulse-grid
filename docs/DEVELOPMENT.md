# Development Setup Guide

## Prerequisites

### System Requirements
- **Node.js**: >= 18.0.0
- **pnpm**: >= 9.0.0 (recommended package manager)
- **Git**: Latest version

### Recommended Tools
- **VS Code** with extensions:
  - ESLint
  - Prettier
  - TypeScript and JavaScript Language Features
  - Tailwind CSS IntelliSense

## Quick Setup

### 1. Clone and Install
```bash
git clone <repository-url>
cd plusegrid
pnpm install
```

### 2. Environment Configuration
```bash
# Copy environment templates
cp .env.example .env.local
cp apps/dashboard-shell/.env.example apps/dashboard-shell/.env.local
cp apps/clinical-flags-mfe/.env.example apps/clinical-flags-mfe/.env.local
```

### 3. Start Development
```bash
# Start all applications
pnpm dev

# Or start individual apps
pnpm dev --filter=dashboard-shell
pnpm dev --filter=clinical-flags-mfe
```

## Project Structure

```
plusegrid/
├── apps/
│   ├── dashboard-shell/         # Host application (Port: 3000)
│   └── clinical-flags-mfe/      # Micro-frontend (Port: 3001)
├── packages/
│   ├── ui/                      # Shared components + Storybook
│   ├── types/                   # TypeScript definitions
│   └── config-custom/           # Shared configurations
├── scripts/                     # Development scripts
└── docs/                        # Documentation
```

## Port Management

| Application | Port | URL |
|-------------|------|-----|
| Dashboard Shell | 3000 | http://localhost:3000 |
| Clinical Flags MFE | 3001 | http://localhost:3001 |
| Storybook | 6006 | http://localhost:6006 |

## Available Scripts

### Root Level
- `pnpm dev` - Start all applications in development
- `pnpm build` - Build all applications
- `pnpm lint` - Lint all packages
- `pnpm type-check` - Type check all packages
- `pnpm clean` - Clean build artifacts

### Application Level
- `pnpm dev --filter=<app-name>` - Start specific app
- `pnpm build --filter=<app-name>` - Build specific app
- `pnpm lint --filter=<app-name>` - Lint specific app

## Environment Variables

### Root (.env.local)
```env
NODE_ENV=development
DASHBOARD_SHELL_PORT=3000
CLINICAL_FLAGS_MFE_PORT=3001
STORYBOOK_PORT=6006
```

### Dashboard Shell (apps/dashboard-shell/.env.local)
```env
NODE_ENV=development
PORT=3000
CLINICAL_FLAGS_MFE_URL=http://localhost:3001
```

### Clinical Flags MFE (apps/clinical-flags-mfe/.env.local)
```env
NODE_ENV=development
PORT=3001
MFE_NAME=clinical_flags_mfe
```

## Development Workflow

### 1. Feature Development
1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes following coding standards
3. Test changes: `pnpm test` (when implemented)
4. Lint and format: `pnpm lint && pnpm format`
5. Commit changes with conventional commits
6. Create pull request

### 2. Code Quality
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and React
- **Prettier**: Consistent code formatting
- **Turbo**: Optimized builds and caching

### 3. Testing Strategy (to be implemented)
- **Unit Tests**: Jest + Testing Library
- **E2E Tests**: Playwright
- **Component Tests**: Storybook interactions

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different ports in .env.local files
```

#### Module Resolution Issues
```bash
# Clear caches
pnpm clean
rm -rf node_modules/.cache
pnpm install
```

#### TypeScript Errors
```bash
# Type check all packages
pnpm type-check

# Rebuild types package
pnpm --filter @pulsegrid/types build
```

### Performance Tips

1. **Use Turbo Cache**: Builds are cached automatically
2. **Parallel Development**: Use `pnpm dev` to start all apps
3. **Selective Building**: Use filters for specific packages
4. **Environment Optimization**: Use appropriate NODE_ENV

## Next Steps

After completing the infrastructure setup, the next phase will focus on:

1. **Module Federation Implementation**: Connect micro-frontends
2. **Component Development**: Build shared UI components
3. **API Integration**: Connect to backend services
4. **Testing Implementation**: Add comprehensive test suite
5. **CI/CD Pipeline**: Automated deployment setup