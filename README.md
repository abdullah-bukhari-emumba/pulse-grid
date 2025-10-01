# PulseGrid

A modern healthcare platform built with **Turborepo**, **Next.js**, and **Module Federation** architecture.

## 🏗️ Architecture

This monorepo implements a micro-frontend architecture using Webpack Module Federation, enabling independent development and deployment of healthcare modules.

### Project Structure

```
plusegrid/
├── apps/
│   ├── dashboard-shell/          # Host application (Shell)
│   └── clinical-flags-mfe/       # Clinical flags micro-frontend
├── packages/
│   ├── ui/                       # Shared UI components with Storybook
│   ├── types/                    # Shared TypeScript definitions
│   └── config-custom/            # Shared configuration files
└── docs/                         # Documentation (if applicable)
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **pnpm** >= 9.0.0 (recommended package manager)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd plusegrid

# Install dependencies

npm i pnpm -g

pnpm install
```

### Development

```bash
# Start all applications in development mode
pnpm dev

# Start specific applications
pnpm dev --filter=dashboard-shell
pnpm dev --filter=clinical-flags-mfe

# View UI components in Storybook
pnpm --filter @pulsegrid/ui storybook
```

### Build

```bash
# Build all applications
pnpm build

# Build specific application
pnpm build --filter=dashboard-shell
```

## 📦 Applications & Packages

### Applications

| Application | Port | Description | Status |
|-------------|------|-------------|--------|
| `dashboard-shell` | 3000 | Main host application | 🟢 Active |
| `clinical-flags-mfe` | 3001 | Clinical flags micro-frontend | 🟢 Active |

### Packages

| Package | Description | Version |
|---------|-------------|---------|
| `@pulsegrid/ui` | Shared UI component library | 1.0.0 |
| `@pulsegrid/types` | TypeScript type definitions | 1.0.0 |
| `@pulsegrid/config-custom` | Shared configurations | 1.0.0 |

## 🔧 Development Workflow

### Code Quality & Standards

- **TypeScript** for type safety
- **ESLint** for code linting
- **Prettier** for code formatting
- **Turborepo** for efficient builds and caching

### Available Scripts

```bash
# Development
pnpm dev                    # Start all apps in development
pnpm build                  # Build all applications
pnpm lint                   # Lint all packages
pnpm format                 # Format code with Prettier
pnpm check-types           # Type check all packages

# Testing (when implemented)
pnpm test                   # Run all tests
pnpm test:watch            # Run tests in watch mode
```

## 🌐 Module Federation

This project leverages **Webpack Module Federation** to enable:

- **Independent Development**: Each micro-frontend can be developed independently
- **Runtime Integration**: Components are loaded dynamically at runtime
- **Shared Dependencies**: Common libraries are shared between applications
- **Scalable Architecture**: Easy to add new micro-frontends

### Architecture Flow

```
Dashboard Shell (Host)
├── Consumes: Clinical Flags MFE
├── Consumes: Future MFEs
└── Provides: Shell Layout & Navigation
```

## 📱 Access Points

- **Dashboard Shell**: [http://localhost:3000](http://localhost:3000)
- **Clinical Flags MFE**: [http://localhost:3001](http://localhost:3001)
- **Storybook**: [http://localhost:6006](http://localhost:6006)

## 🤝 Contributing

1. Follow the established code style and conventions
2. Ensure all tests pass before submitting PRs
3. Update documentation for any new features
4. Use conventional commit messages

## 📄 License

[Add your license information here]

---

**Built with ❤️ for Healthcare Innovation**