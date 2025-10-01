# PulseGrid Module Federation Setup

This document provides a comprehensive guide to the Module Federation implementation in the PulseGrid project, demonstrating how the `dashboard-shell` (host) dynamically loads components from the `clinical-flags-mfe` (remote) at runtime.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     PulseGrid Ecosystem                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐    ┌─────────────────────────────┐ │
│  │   dashboard-shell   │    │   clinical-flags-mfe        │ │
│  │   (HOST - :3003)    │    │   (REMOTE - :3002)          │ │
│  │                     │    │                             │ │
│  │ ┌─────────────────┐ │    │ ┌─────────────────────────┐ │ │
│  │ │ SimpleMFEDemo   │◄┼────┼►│ ClinicalFlagsWidget     │ │ │
│  │ │ Component       │ │    │ │ (Exposed)               │ │ │
│  │ └─────────────────┘ │    │ └─────────────────────────┘ │ │
│  │                     │    │                             │ │
│  │ • Dynamic Import    │    │ • Independent Deploy       │ │
│  │ • Error Isolation   │    │ • Self-contained            │ │
│  │ • Shared React      │    │ • Shared Dependencies       │ │
│  └─────────────────────┘    └─────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
apps/
├── dashboard-shell/                 # HOST APPLICATION
│   ├── next.config.ts              # Module Federation host config
│   ├── src/
│   │   ├── app/page.tsx            # Main page using MFE demo
│   │   ├── components/
│   │   │   └── SimpleMFEDemo.tsx   # Demo component consuming MFE
│   │   └── types/
│   │       └── module-federation.d.ts # TypeScript declarations
│   └── package.json                # Port 3003 configuration
│
└── clinical-flags-mfe/             # REMOTE APPLICATION
    ├── next.config.ts              # Module Federation remote config
    ├── src/
    │   └── components/
    │       └── ClinicalFlagsWidget.tsx # Exposed component
    └── package.json                # Port 3002 configuration
```

## ⚙️ Configuration Details

### Host Configuration (dashboard-shell)

**File:** `apps/dashboard-shell/next.config.ts`

```typescript
webpack(config, options) {
  const { isServer } = options;
  
  if (!isServer) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'dashboardShell',
        remotes: {
          clinicalFlagsMfe: 'clinicalFlagsMfe@http://localhost:3002/_next/static/chunks/remoteEntry.js',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: '^19.1.0' },
          'react-dom': { singleton: true, eager: true, requiredVersion: '^19.1.0' },
          next: { singleton: true, eager: false, requiredVersion: '^15.5.4' },
        },
        extraOptions: {
          skipSharingNextInternals: false,
          debug: process.env.NODE_ENV === 'development',
        }
      })
    );
  }
  
  return config;
}
```

### Remote Configuration (clinical-flags-mfe)

**File:** `apps/clinical-flags-mfe/next.config.ts`

```typescript
webpack(config, options) {
  const { isServer } = options;
  
  if (!isServer) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'clinicalFlagsMfe',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './ClinicalFlagsWidget': './src/components/ClinicalFlagsWidget.tsx',
        },
        shared: {
          react: { singleton: true, eager: true, requiredVersion: '^19.1.0' },
          'react-dom': { singleton: true, eager: true, requiredVersion: '^19.1.0' },
          next: { singleton: true, eager: false, requiredVersion: '^15.5.4' },
        },
        extraOptions: {
          skipSharingNextInternals: false,
          debug: process.env.NODE_ENV === 'development',
        }
      })
    );
  }
  
  return config;
}
```

## 🚀 Getting Started

### 1. Prerequisites

- Node.js 18+
- pnpm 9.0.0+
- Both applications configured with Module Federation

### 2. Install Dependencies

```bash
# From project root
pnpm install
```

### 3. Start Development Servers

```bash
# Start both applications simultaneously
pnpm dev

# Or start individually:
# Terminal 1 - Remote MFE
cd apps/clinical-flags-mfe
pnpm dev  # Runs on localhost:3002

# Terminal 2 - Host Application  
cd apps/dashboard-shell
pnpm dev  # Runs on localhost:3003
```

### 4. Verify Setup

1. **Open Host Application:** http://localhost:3003
2. **Check Remote is Running:** http://localhost:3002
3. **Verify MFE Loading:** Look for the Clinical Flags widget on the host page
4. **Browser Console:** Check for any federation errors

## 🔍 How It Works

### Dynamic Import Process

1. **Host Application** loads and initializes Module Federation runtime
2. **Remote Entry Loading:** Host fetches `remoteEntry.js` from `localhost:3002`
3. **Component Resolution:** Federation runtime resolves the exposed component
4. **Shared Dependencies:** React/ReactDOM shared between host and remote
5. **Error Isolation:** Errors in remote don't crash the host application

### Component Usage

```typescript
// In host application (dashboard-shell)
const ClinicalFlagsWidget = lazy(() => 
  // @ts-expect-error - Module Federation types resolved at runtime
  import('clinicalFlagsMfe/ClinicalFlagsWidget').catch(() => ({ 
    default: FallbackComponent 
  }))
);

// Usage with Suspense and Error Boundary
<Suspense fallback={<LoadingComponent />}>
  <ClinicalFlagsWidget 
    patientId="demo-patient-001"
    onFlagClick={handleFlagClick}
  />
</Suspense>
```

## 🛡️ Error Handling & Isolation

### Built-in Safeguards

1. **Fallback Components:** Display when MFE fails to load
2. **Error Boundaries:** Isolate MFE errors from host application
3. **Suspense Loading:** Smooth loading states during MFE initialization
4. **Network Resilience:** Graceful handling of network failures

### Error Isolation Example

```typescript
// Error boundary prevents MFE crashes from affecting host
<MicroFrontendErrorBoundary fallback={<ErrorFallback />}>
  <Suspense fallback={<LoadingFallback />}>
    <ClinicalFlagsWidget />
  </Suspense>
</MicroFrontendErrorBoundary>
```

## 🔧 Development & Debugging

### Browser DevTools Inspection

1. **Network Tab:** Look for `remoteEntry.js` requests
2. **Console:** Check for federation runtime messages
3. **Elements Tab:** Verify component rendering
4. **Performance Tab:** Monitor bundle loading performance

### Common Debug Commands

```bash
# Check if applications are running on correct ports
curl http://localhost:3002/_next/static/chunks/remoteEntry.js
curl http://localhost:3003

# Verify build outputs
pnpm build  # Check for federation build errors

# Type checking
pnpm type-check
```

### Debug Configuration

Development mode includes enhanced debugging:

```typescript
extraOptions: {
  debug: process.env.NODE_ENV === 'development',  // Enables debug logs
}
```

## 📊 Performance Considerations

### Bundle Optimization

- **Shared Dependencies:** React/ReactDOM shared to prevent duplication
- **Code Splitting:** Each MFE loads independently
- **Lazy Loading:** Components loaded on-demand
- **Build Optimization:** Production builds optimized automatically

### Performance Metrics

| Metric | Target | Implementation |
|--------|--------|---------------|
| Initial Load | < 2s | Lazy loading + code splitting |
| MFE Load Time | < 500ms | Optimized remote entry |
| Bundle Size | Minimized | Shared dependencies |
| Runtime Performance | 60fps | React 19 optimizations |

## 🚢 Production Deployment

### Environment Configuration

```typescript
// Production remote URL configuration
remotes: {
  clinicalFlagsMfe: process.env.NODE_ENV === 'development'
    ? 'clinicalFlagsMfe@http://localhost:3002/_next/static/chunks/remoteEntry.js'
    : 'clinicalFlagsMfe@https://clinical-flags-mfe.your-domain.com/_next/static/chunks/remoteEntry.js',
}
```

### Deployment Strategy

1. **Independent Deployment:** Each MFE can be deployed separately
2. **Version Management:** Semantic versioning for compatibility
3. **Rollback Support:** Independent rollback capabilities
4. **Health Checks:** Monitor each MFE independently

## 🧪 Testing Strategy

### Test Coverage Areas

1. **Unit Tests:** Individual component testing
2. **Integration Tests:** Host-remote interaction testing
3. **E2E Tests:** Full user flow testing
4. **Load Tests:** MFE loading performance

### Test Commands

```bash
# Run all tests
pnpm test

# Test specific application
pnpm test --filter=dashboard-shell
pnpm test --filter=clinical-flags-mfe

# E2E tests
pnpm test:e2e
```

## 📋 Troubleshooting

### Common Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| **MFE Not Loading** | Fallback component shows | Check if remote app is running on :3002 |
| **Type Errors** | TypeScript compilation errors | Verify module-federation.d.ts types |
| **Shared Dependency Conflicts** | Runtime errors | Check shared dependency versions |
| **Network Errors** | Remote entry fails to load | Verify remote URL configuration |

### Debug Checklist

- [ ] Both applications running on correct ports (3002, 3003)
- [ ] RemoteEntry.js accessible at `localhost:3002/_next/static/chunks/remoteEntry.js`
- [ ] No TypeScript compilation errors
- [ ] Browser console shows no federation errors
- [ ] Shared dependencies configured identically

## 🔗 Useful Links

- [Module Federation Documentation](https://module-federation.github.io/)
- [Next.js Module Federation Plugin](https://github.com/module-federation/nextjs-mf)
- [PulseGrid Project Documentation](../docs/)

## 💡 KPI Alignment

This Module Federation implementation directly addresses **KPI Set 6: Micro-Frontend Demonstration**:

✅ **Independent Deployability:** Clinical flags MFE can be deployed separately  
✅ **Shared Dependency Management:** React/ReactDOM shared efficiently  
✅ **Error Isolation:** Host application protected from remote failures  
✅ **Runtime Integration:** Dynamic loading with fallback strategies

---

*For additional support or questions about the Module Federation setup, please refer to the project documentation or create an issue in the repository.*