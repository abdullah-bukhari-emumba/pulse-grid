/**
 * index.tsx - Pages Router Home Page Component
 * 
 * This file replaces the App Router page.tsx and serves as the home page (/) route.
 * In Pages Router, index.tsx automatically maps to the root route.
 * 
 * Key responsibilities:
 * - Render the main dashboard/home page content
 * - Demonstrate Module Federation integration
 * - Provide entry point for the PulseGrid application
 * 
 * Route Mapping:
 * - pages/index.tsx → / (root route)
 * - Accessible at http://localhost:3003/
 * 
 * Migration Notes:
 * - Converted from App Router app/page.tsx
 * - Functionality remains identical
 * - Import path adjusted for Pages Router structure
 * - Component logic unchanged
 * 
 * Module Federation Integration:
 * - Imports and renders SimpleMFEDemo component
 * - SimpleMFEDemo handles dynamic loading of clinical-flags-mfe
 * - Maintains error boundaries and loading states
 */

import SimpleMFEDemo from '../components/SimpleMFEDemo';

/**
 * Home Page Component
 * 
 * The main landing page for the PulseGrid application that demonstrates
 * Module Federation integration by loading the clinical flags micro-frontend.
 * 
 * Features:
 * - Clean, minimal layout with gray background
 * - Full viewport height for proper presentation
 * - Hosts the Module Federation demonstration component
 * 
 * @returns JSX element representing the home page
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 
        SimpleMFEDemo Component
        - Demonstrates Module Federation integration
        - Dynamically loads ClinicalFlagsWidget from clinical-flags-mfe
        - Handles loading states, error boundaries, and fallbacks
        - Provides interactive demo of micro-frontend architecture
      */}
      <SimpleMFEDemo />
    </div>
  );
}