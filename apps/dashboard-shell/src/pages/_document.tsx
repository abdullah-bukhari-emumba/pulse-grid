/**
 * _document.tsx - Pages Router HTML Document Structure
 * 
 * This file defines the HTML document structure for the entire application.
 * It's the Pages Router equivalent of the HTML structure that was in App Router's layout.tsx.
 * 
 * Key responsibilities:
 * - Define the HTML document structure (<html>, <head>, <body>)
 * - Set HTML attributes (lang, className)
 * - Handle server-side rendering document modifications
 * - Add meta tags, scripts, or other document-level elements
 * 
 * Important Notes:
 * - Only rendered on the server side
 * - Cannot use React hooks or event handlers
 * - Changes here require server restart in development
 * - Used for adding third-party scripts, custom fonts, meta tags
 * 
 * Migration Notes:
 * - Extracted HTML structure from App Router layout.tsx
 * - Maintains same lang="en" attribute
 * - Body styling will be handled by _app.tsx
 */

import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Custom Document Component
 * 
 * Extends the default Next.js document to customize the HTML document structure.
 * This is where you can:
 * - Add custom meta tags
 * - Include third-party scripts
 * - Modify HTML or body attributes
 * - Add custom fonts from external sources
 */
export default function Document() {
  return (
    <Html lang="en">
      {/* 
        Head component for document head elements
        - Automatically includes Next.js required head elements
        - Add custom meta tags, external scripts, fonts here
        - Don't use this for page-specific meta (use next/head in pages instead)
      */}
      <Head>
        {/* 
          Custom meta tags, external fonts, or third-party scripts can be added here
          Example:
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <script src="https://example.com/script.js" />
        */}
      </Head>
      
      {/* 
        Body element with consistent structure
        - Main: Contains the page content (required)
        - NextScript: Contains Next.js client-side scripts (required)
        - Font variables and antialiasing are applied in _app.tsx
      */}
      <body>
        {/* Main component renders the page content */}
        <Main />
        
        {/* NextScript component loads Next.js client-side JavaScript */}
        <NextScript />
      </body>
    </Html>
  );
}