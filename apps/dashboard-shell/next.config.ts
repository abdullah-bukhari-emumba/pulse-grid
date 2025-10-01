// Import NextFederationPlugin for micro-frontend architecture
// This plugin enables Webpack Module Federation in Next.js applications
import { NextFederationPlugin } from '@module-federation/nextjs-mf';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Module Federation Configuration for Dashboard Shell (HOST) - Pages Router
   * 
   * This configuration sets up the dashboard-shell as a Module Federation host
   * that can dynamically consume remote micro-frontends at runtime.
   * 
   * IMPORTANT: Uses Pages Router architecture (src/pages/) for Module Federation compatibility.
   * The @module-federation/nextjs-mf plugin requires Pages Router and does not support App Router.
   * 
   * Key components of this configuration:
   * - Remotes: Defines which remote micro-frontends are available for consumption
   * - Shared: Manages shared dependencies to prevent duplication and ensure compatibility
   * - Runtime: Handles dynamic loading, dependency resolution, and error isolation
   * - Pages Router: Ensures compatibility with Module Federation plugin requirements
   */
  webpack(config, options) {
    const { isServer } = options;
    
    // Apply Module Federation only to client-side builds
    // Server-side rendering doesn't support Module Federation due to runtime limitations
    if (!isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          // Unique name for this host application in the federation network
          // This distinguishes this host from other potential hosts in the ecosystem
          name: 'dashboardShell',
          
          // WORKAROUND: Some versions of @module-federation/nextjs-mf require filename even for hosts
          // This is unusual but required by version 8.8.41 to prevent "filename is not defined" error
          // The filename for hosts is typically not used since they don't expose modules
          filename: 'static/chunks/hostEntry.js',
          
          /**
           * Remotes Configuration
           * Defines which remote micro-frontends are available for consumption
           * Format: 'remoteName': 'remoteUrl@http://localhost:port/remoteEntry.js'
           * 
           * Dynamic vs Static Loading:
           * - Static: Define URLs here for build-time optimization
           * - Dynamic: Use __webpack_init_sharing__ for runtime discovery
           */
          remotes: {
            // Clinical Flags MFE - provides clinical alert and warning components
            // Development URL points to the MFE running on localhost:3002
            // Production URL should point to the deployed MFE instance
            clinicalFlagsMfe: process.env.NODE_ENV === 'development'
              ? 'clinicalFlagsMfe@http://localhost:3002/_next/static/chunks/remoteEntry.js'
              : 'clinicalFlagsMfe@https://clinical-flags-mfe.your-domain.com/_next/static/chunks/remoteEntry.js',
          },
          
          /**
           * Shared Dependencies Configuration
           * Critical for preventing duplicate libraries and ensuring compatibility
           * Must match the shared configuration in remote applications
           * 
           * Strategy:
           * - singleton: true = Only one version can exist in the runtime
           * - eager: true = Load immediately, don't wait for dynamic imports
           * - strictVersion: false = Allow version mismatches with warnings
           */
          shared: {
            // React core dependencies - must be shared to prevent multiple React instances
            // These versions must be compatible with all remote micro-frontends
            react: {
              singleton: true,        // Prevent multiple React instances which cause hooks errors
              eager: true,           // Load React immediately to avoid loading delays
              requiredVersion: '^19.1.0',  // Minimum required version for compatibility
              strictVersion: false,   // Allow minor version differences between host and remotes
            },
            'react-dom': {
              singleton: true,        // Prevent multiple ReactDOM instances
              eager: true,           // Load ReactDOM immediately with React
              requiredVersion: '^19.1.0',  // Minimum required version for compatibility
              strictVersion: false,   // Allow minor version differences between host and remotes
            },
            
            // Next.js dependencies that should be shared for optimal performance
            // Sharing Next.js reduces bundle size and ensures consistent behavior
            next: {
              singleton: true,        // Single Next.js instance across all federation apps
              eager: false,          // Lazy load to avoid circular dependencies with Next.js internals
              requiredVersion: '^15.5.4',  // Minimum required version for compatibility
              strictVersion: false,   // Allow version flexibility between host and remotes
            },
            
            // Workspace-specific shared packages
            // These are internal packages that should be shared across micro-frontends
            '@pulsegrid/types': {
              singleton: true,        // Share type definitions across all MFEs
              eager: false,          // Load on-demand to reduce initial bundle size
              strictVersion: false,   // Allow version differences in development
            },
            '@pulsegrid/ui': {
              singleton: true,        // Share UI components to maintain consistent design
              eager: false,          // Load on-demand to reduce initial bundle size
              strictVersion: false,   // Allow version differences in development
            },
          },
          
          /**
           * Extra Options for Next.js Module Federation Integration
           * Required by NextFederationPlugin to ensure proper Next.js compatibility
           */
          extraOptions: {
            // Skip sharing Next.js internal modules that can cause conflicts
            // This prevents federation from interfering with Next.js core functionality
            skipSharingNextInternals: false,
            
            // Enable development mode optimizations for better debugging
            // This provides better error messages and development experience
            debug: process.env.NODE_ENV === 'development',
          }
        })
      );
    }
    
    return config;
  },
  
  // Transpile workspace packages to ensure they work correctly across the monorepo
  // These packages need transpilation because they're symlinked via workspace protocol
  transpilePackages: [
    '@pulsegrid/ui',     // Shared UI component library - needs transpilation for SSR compatibility
    '@pulsegrid/types'   // Shared TypeScript types - ensures proper type resolution
  ],
  
  // Performance optimizations for production builds
  compress: true,           // Enable gzip compression for smaller bundle sizes
  poweredByHeader: false,   // Remove "X-Powered-By: Next.js" header for security (reduces fingerprinting)
  
  // Environment variables that should be available at build time
  // These will be inlined into the client-side bundle at build time
  env: {
    // Example environment variable - replace with actual variables as needed
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
