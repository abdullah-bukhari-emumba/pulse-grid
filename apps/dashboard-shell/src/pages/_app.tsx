/**
 * _app.tsx - Pages Router Application Root Component
 * 
 * This file replaces the App Router layout.tsx and serves as the root component
 * for all pages in the Pages Router architecture. It wraps every page component
 * and is where you can add global providers, layouts, and configurations.
 * 
 * Key responsibilities:
 * - Initialize global fonts (Geist Sans and Geist Mono)
 * - Apply global CSS styles
 * - Provide consistent layout structure for all pages
 * - Handle global state providers (if needed)
 * - Configure global error boundaries (if needed)
 * 
 * Migration Notes:
 * - Converted from App Router layout.tsx
 * - Fonts remain the same (Geist Sans, Geist Mono)
 * - Global CSS import moved here from layout
 * - HTML structure moved to _document.tsx as per Pages Router convention
 */

import type { AppProps } from 'next/app';
import { Geist, Geist_Mono } from 'next/font/google';
import '../styles/globals.css';

// Font configurations - identical to App Router setup
// These fonts provide modern, clean typography for the application
const geistSans = Geist({
  variable: '--font-geist-sans',  // CSS custom property for Tailwind integration
  subsets: ['latin'],             // Load Latin character subset for performance
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',  // CSS custom property for monospace text
  subsets: ['latin'],             // Load Latin character subset for performance
});

/**
 * Root Application Component
 * 
 * This component wraps every page in the application and provides:
 * - Font loading and CSS custom properties
 * - Global styling via className
 * - Consistent structure across all pages
 * 
 * @param Component - The active page component
 * @param pageProps - Props passed to the page component
 */
export default function App({ Component, pageProps }: AppProps) {
  return (
    // Apply font CSS custom properties to the root div
    // This makes the fonts available throughout the component tree
    <div className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      {/* 
        Render the active page component with its props
        Component changes based on the current route
        pageProps contains any props passed from getStaticProps/getServerSideProps
      */}
      <Component {...pageProps} />
    </div>
  );
}