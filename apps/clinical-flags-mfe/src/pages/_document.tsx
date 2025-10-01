/**
 * _document.tsx - Clinical Flags MFE HTML Document Structure
 * 
 * This file defines the HTML document structure for the clinical-flags-mfe.
 * It provides the foundation for server-side rendering and ensures the MFE
 * can operate independently while maintaining consistency with the host application.
 * 
 * Key responsibilities:
 * - Define HTML document structure for the MFE
 * - Set language and accessibility attributes
 * - Provide foundation for server-side rendering
 * - Enable standalone MFE operation
 * 
 * Micro-Frontend Considerations:
 * - Must work independently when accessed directly
 * - Should not conflict with host application document structure
 * - Provides fallback structure when MFE runs standalone
 * - Maintains consistency with overall application architecture
 * 
 * Independence Features:
 * - Self-contained HTML structure
 * - Language settings for accessibility
 * - Proper document foundation for SEO
 * - Server-side rendering support
 * 
 * Migration Notes:
 * - Extracted from App Router layout.tsx HTML structure
 * - Maintains same language setting (en)
 * - Provides standalone operation capability
 * - Consistent with host application document structure
 */

import { Html, Head, Main, NextScript } from 'next/document';

/**
 * Clinical Flags MFE Custom Document Component
 * 
 * Provides the HTML document foundation for the clinical-flags-mfe.
 * This ensures the MFE can operate both as a standalone application
 * and as a federated micro-frontend consumed by the host.
 * 
 * Features:
 * - Standalone HTML document structure
 * - Accessibility-compliant language settings
 * - Server-side rendering support
 * - Consistent document foundation
 * 
 * Usage Scenarios:
 * 1. Standalone: Direct access to http://localhost:3002
 * 2. Federated: Components loaded via Module Federation
 * 3. Development: Independent development and testing
 * 4. Production: Independent deployment and operation
 */
export default function Document() {
  return (
    <Html lang="en">
      {/* 
        Document Head for the MFE
        - Contains MFE-specific meta information
        - Handles server-side rendering requirements
        - Can include MFE-specific external resources
        - Independent of host application head configuration
      */}
      <Head>
        {/* 
          MFE-specific head elements can be added here:
          - Custom meta tags for the clinical flags functionality
          - External scripts needed for clinical data processing
          - Third-party integrations specific to clinical workflows
          - Performance monitoring for this specific MFE
          
          Example:
          <meta name="description" content="Clinical Flags Micro-Frontend" />
          <link rel="icon" href="/clinical-flags-favicon.ico" />
        */}
      </Head>
      
      {/* 
        Document Body Structure
        - Provides container for MFE content
        - Supports both standalone and federated operation
        - Font and styling variables applied in _app.tsx
        - Independent rendering context
      */}
      <body>
        {/* Main component renders the active page content */}
        <Main />
        
        {/* NextScript loads the necessary client-side JavaScript */}
        <NextScript />
      </body>
    </Html>
  );
}