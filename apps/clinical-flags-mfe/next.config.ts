// Import NextFederationPlugin for micro-frontend architecture
// This plugin enables Webpack Module Federation in Next.js applications
import { NextFederationPlugin } from '@module-federation/nextjs-mf';
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * Module Federation Configuration for Clinical Flags MFE (REMOTE)
   * 
   * This configuration sets up the clinical-flags-mfe as a Module Federation remote
   * that exposes components for consumption by the host application (dashboard-shell).
   * 
   * Key components of this configuration:
   * - Exposes: Defines which components are available for external consumption
   * - Shared: Manages shared dependencies to prevent duplication and version conflicts
   * - Runtime: Handles dynamic loading and dependency resolution
   */
  webpack(config, options) {
    const { isServer } = options;
    
    // Apply Module Federation only to client-side builds
    // Server-side rendering doesn't support Module Federation due to runtime limitations
    if (!isServer) {
      config.plugins.push(
        new NextFederationPlugin({
          // Unique name for this micro-frontend in the federation network
          // This name will be used by host applications to reference this remote
          name: 'clinicalFlagsMfe',
          
          // Filename for the remote entry point that hosts will load
          // This file contains the runtime information and exposed modules
          filename: 'static/chunks/remoteEntry.js',
          
          /**
           * Exposes Configuration
           * Defines which components/modules are available for external consumption
           * Format: 'exposedName': './path/to/component'
           */
          exposes: {
            // Main widget component exposed for consumption by host applications
            // Host apps will import this as: import('clinicalFlagsMfe/ClinicalFlagsWidget')
            './ClinicalFlagsWidget': './src/components/ClinicalFlagsWidget.tsx',
          },
          
          /**
           * Shared Dependencies Configuration
           * Critical for preventing duplicate libraries and ensuring compatibility
           * 
           * Strategy:
           * - singleton: true = Only one version can exist in the runtime
           * - eager: true = Load immediately, don't wait for dynamic imports
           * - strictVersion: false = Allow version mismatches with warnings
           */
          shared: {
            // React core dependencies - must be shared to prevent multiple React instances
            react: {
              singleton: true,        // Prevent multiple React instances
              eager: true,           // Load React immediately
              requiredVersion: '^19.1.0',  // Minimum required version
              strictVersion: false,   // Allow minor version differences
            },
            'react-dom': {
              singleton: true,        // Prevent multiple ReactDOM instances
              eager: true,           // Load ReactDOM immediately  
              requiredVersion: '^19.1.0',  // Minimum required version
              strictVersion: false,   // Allow minor version differences
            },
            
            // Next.js dependencies that should be shared for optimal performance
            next: {
              singleton: true,        // Single Next.js instance across federation
              eager: false,          // Lazy load to avoid circular dependencies
              requiredVersion: '^15.5.4',  // Minimum required version
              strictVersion: false,   // Allow version flexibility
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
  
  // Transpile workspace packages to ensure consistent behavior across micro-frontends
  // These packages are shared across the monorepo and need transpilation for proper functioning
  transpilePackages: [
    '@pulsegrid/ui',     // Shared UI components - ensures consistent styling and behavior
    '@pulsegrid/types'   // Shared types - maintains type safety across micro-frontends
  ],
  
  // Performance optimizations specifically important for micro-frontends
  compress: true,           // Enable compression to reduce federated bundle sizes
  poweredByHeader: false,   // Remove framework headers for security and cleaner responses
  
  // Environment variables available at build time for this micro-frontend
  // These will be embedded in the client bundle during the build process
  env: {
    // Environment-specific configuration for the clinical flags module
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
