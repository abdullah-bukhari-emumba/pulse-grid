/**
 * _app.tsx - Clinical Flags MFE Application Root Component
 * 
 * This file serves as the root component for the clinical-flags-mfe (micro-frontend).
 * It replaces the App Router layout.tsx and provides the foundation for all pages
 * in this independently deployable micro-frontend.
 * 
 * Key responsibilities:
 * - Initialize fonts and global styling for the MFE
 * - Provide consistent layout for MFE pages
 * - Ensure independence from host application styling
 * - Handle MFE-specific global configurations
 * 
 * Micro-Frontend Considerations:
 * - Must be self-contained and not depend on host styling
 * - Font loading should be independent of host application
 * - Global styles should not conflict with host or other MFEs
 * - Should work both standalone and when loaded via Module Federation
 * 
 * Migration Notes:
 * - Converted from App Router layout.tsx
 * - Maintains same font configuration as host for consistency
 * - Global CSS scoped to this MFE
 * - Designed for both standalone and federated operation
 */

import type { AppProps } from 'next/app';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';

// Font configurations for the MFE
// These should match the host application for visual consistency
// but are loaded independently to ensure MFE autonomy
const geistSans = Geist({
  variable: '--font-geist-sans',  // CSS custom property for consistent typography
  subsets: ['latin'],             // Optimized for Latin characters
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',  // CSS custom property for monospace elements
  subsets: ['latin'],             // Optimized for Latin characters
});

/**
 * Clinical Flags MFE Root Component
 * 
 * This component wraps all pages in the clinical-flags-mfe and provides:
 * - Independent font loading and styling
 * - Self-contained global configuration
 * - Consistent visual foundation
 * - Isolation from host application dependencies
 * 
 * Design Principles:
 * - Self-sufficient: Works without host application
 * - Consistent: Matches host design system
 * - Isolated: Doesn't interfere with other applications
 * - Scalable: Can be extended with additional MFE-specific providers
 * 
 * @param Component - The active page component (index.tsx or other routes)
 * @param pageProps - Props passed to the page component
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    // Apply MFE-specific font variables and styling
    // These CSS custom properties are available throughout the MFE component tree
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* 
        Render the active page component
        - In standalone mode: renders the MFE's own pages
        - In federated mode: this structure supports the exposed components
        - Component and pageProps are provided by Next.js routing
      */}
      <Component {...pageProps} />
    </div>
  );
}