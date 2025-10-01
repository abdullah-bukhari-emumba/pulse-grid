# Turborepo Configuration Documentation

This document explains the configuration settings in `turbo.json` and the reasoning behind each choice.

## Schema and UI Configuration

```json
"$schema": "https://turborepo.com/schema.json"
```
**Purpose**: Provides JSON Schema validation and IntelliSense support in IDEs
**Benefit**: Prevents configuration errors and provides autocomplete for valid options

```json
"ui": "tui"
```
**Purpose**: Enables Terminal User Interface for better development experience
**Benefit**: Shows progress bars, task logs, and execution status in a clean terminal interface

## Global Settings

### Global Dependencies
```json
"globalDependencies": ["**/.env*"]
```
**Purpose**: Files that affect all tasks across the monorepo
**Reasoning**: Environment files can affect any application's behavior, so changes to them should invalidate all caches
**Impact**: When any .env file changes, all dependent tasks will be re-executed

### Global Environment Variables
```json
"globalEnv": ["NODE_ENV", "PORT"]
```
**Purpose**: Environment variables that affect caching decisions across all tasks
**Reasoning**: These variables fundamentally change how applications build and run
**Impact**: Changes to NODE_ENV or PORT will invalidate caches for all tasks

## Task Configurations

### Build Task
```json
"build": {
  "dependsOn": ["^build"],
  "inputs": ["$TURBO_DEFAULT$", ".env*"],
  "outputs": [".next/**", "!.next/cache/**", "dist/**", "build/**"],
  "env": ["NODE_ENV", "NEXT_TELEMETRY_DISABLED"]
}
```

**dependsOn: ["^build"]**: 
- Ensures upstream packages (like @pulsegrid/ui, @pulsegrid/types) are built first
- The "^" prefix means "dependencies of this workspace"
- Critical for monorepo where apps depend on shared packages

**inputs**: 
- `$TURBO_DEFAULT$`: Includes all source files, package.json, and other standard inputs
- `.env*`: Environment files that can affect build output

**outputs**: 
- `.next/**`: Next.js build output directory
- `!.next/cache/**`: Excludes cache directory to avoid caching temporary files
- `dist/**`, `build/**`: Common build output directories for packages

**env**: 
- `NODE_ENV`: Affects build optimization and feature flags
- `NEXT_TELEMETRY_DISABLED`: Controls Next.js telemetry collection

### Development Task
```json
"dev": {
  "cache": false,
  "persistent": true,
  "dependsOn": ["^build"]
}
```

**cache: false**: 
- Development servers have side effects and should always run fresh
- Prevents serving stale development builds

**persistent: true**: 
- Dev servers run continuously until manually stopped
- Prevents Turbo from thinking the task failed when it keeps running

**dependsOn: ["^build"]**: 
- Ensures all shared packages are built before starting development
- Critical for apps that import from workspace packages

### Lint Task
```json
"lint": {
  "dependsOn": ["^build"],
  "inputs": ["$TURBO_DEFAULT$", ".eslintrc*", "eslint.config.*"],
  "outputs": []
}
```

**dependsOn: ["^build"]**: 
- Some lint rules might depend on built artifacts (e.g., generated types)
- Ensures consistent linting results

**inputs**: 
- Includes ESLint configuration files that affect linting results
- Changes to ESLint config will invalidate the lint cache

**outputs: []**: 
- Linting doesn't produce cacheable output files
- Results are reported to terminal/console

### Lint Fix Task
```json
"lint:fix": {
  "dependsOn": ["^build"],
  "inputs": ["$TURBO_DEFAULT$", ".eslintrc*", "eslint.config.*"],
  "outputs": [],
  "cache": false
}
```

**cache: false**: 
- This task modifies source files in place
- Caching could lead to inconsistent states where fixes aren't applied

### Type Check Task
```json
"type-check": {
  "dependsOn": ["^build"],
  "inputs": ["$TURBO_DEFAULT$", "tsconfig.json"],
  "outputs": []
}
```

**dependsOn: ["^build"]**: 
- Type checking requires all type definitions from dependencies to be available
- Critical when packages export types that apps consume

**inputs**: 
- `tsconfig.json`: TypeScript configuration affects type checking behavior

### Clean Task
```json
"clean": {
  "cache": false,
  "outputs": []
}
```

**cache: false**: 
- Clean should always run and remove files
- Caching would defeat the purpose of cleaning build artifacts

**outputs: []**: 
- This task deletes files rather than creating them

### Test Task (Future Implementation)
```json
"test": {
  "dependsOn": ["^build"],
  "inputs": ["$TURBO_DEFAULT$", "jest.config.*", "vitest.config.*"],
  "outputs": ["coverage/**"]
}
```

**dependsOn: ["^build"]**: 
- Tests might import from built packages
- Ensures consistent test results

**inputs**: 
- Test configuration files affect test execution and results

**outputs**: 
- Coverage reports can be cached for performance
- Helps avoid re-running unchanged tests

### Storybook Tasks
```json
"storybook": {
  "cache": false,
  "persistent": true,
  "inputs": ["$TURBO_DEFAULT$", ".storybook/**"]
}

"build-storybook": {
  "dependsOn": ["^build"],
  "inputs": ["$TURBO_DEFAULT$", ".storybook/**"],
  "outputs": ["storybook-static/**"]
}
```

**storybook (dev server)**: 
- `cache: false`: Development server should always start fresh
- `persistent: true`: Storybook runs continuously
- Includes Storybook configuration files in inputs

**build-storybook (static build)**: 
- `dependsOn: ["^build"]`: Needs built components from packages
- `outputs`: Static Storybook files can be cached for performance

## Performance Benefits

1. **Intelligent Caching**: Only rebuilds what has actually changed
2. **Parallel Execution**: Tasks run in parallel when dependencies allow
3. **Dependency Awareness**: Ensures correct build order in monorepo
4. **Environment Sensitivity**: Invalidates caches when environment changes
5. **Selective Task Running**: Can target specific packages or tasks

## Best Practices Implemented

1. **Explicit Dependencies**: Clear dependency chains prevent build issues
2. **Appropriate Caching**: Dev servers and file-modifying tasks don't cache
3. **Environment Awareness**: Global env variables properly tracked
4. **Input Specificity**: Only relevant files affect each task's cache
5. **Output Optimization**: Excludes temporary files from cache