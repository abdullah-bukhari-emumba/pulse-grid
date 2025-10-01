/**
 * index.tsx - Clinical Flags MFE Home Page Component
 * 
 * This file serves as the home page for the clinical-flags-mfe when accessed
 * directly as a standalone application. It replaces the App Router page.tsx
 * and provides a demonstration/testing interface for the MFE.
 * 
 * Key responsibilities:
 * - Provide standalone access to the MFE for development/testing
 * - Demonstrate the ClinicalFlagsWidget in isolation
 * - Enable independent development and debugging
 * - Serve as a showcase for the MFE capabilities
 * 
 * Usage Scenarios:
 * 1. Development: Direct access at http://localhost:3002
 * 2. Testing: Isolated testing of clinical flags functionality
 * 3. Documentation: Live demo of MFE capabilities
 * 4. Quality Assurance: Independent validation of MFE features
 * 
 * Route Mapping:
 * - pages/index.tsx → / (root route for MFE)
 * - Accessible at http://localhost:3002/
 * 
 * Migration Notes:
 * - Converted from App Router app/page.tsx
 * - Maintains demonstration functionality
 * - Import path adjusted for Pages Router structure
 * - Added MFE-specific context and documentation
 */

import ClinicalFlagsWidget from '../components/ClinicalFlagsWidget';

/**
 * Clinical Flags MFE Home Page Component
 * 
 * This page provides a standalone interface for the clinical-flags-mfe,
 * allowing independent development, testing, and demonstration of the
 * clinical flags functionality.
 * 
 * Features:
 * - Direct demonstration of ClinicalFlagsWidget
 * - Sample patient data for testing
 * - MFE branding and identification
 * - Development-friendly interface
 * - Responsive design matching host application
 * 
 * Development Benefits:
 * - Independent testing without host application
 * - Isolated debugging of clinical flags logic
 * - Visual validation of component styling
 * - Performance testing of MFE in isolation
 * 
 * @returns JSX element representing the MFE home page
 */
export default function Home() {
  // Sample flag click handler for standalone demonstration
  const handleFlagClick = (flag: { message: string; type: string; patientId: string }) => {
    console.log('Clinical Flag clicked in standalone mode:', flag);
    alert(`Clinical Flag: ${flag.message}\nType: ${flag.type}\nPatient: ${flag.patientId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-6">
        {/* MFE Header - Identifies this as standalone mode */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏥 Clinical Flags Micro-Frontend
          </h1>
          <p className="text-gray-600 mb-4">
            Standalone Development & Testing Interface
          </p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            Running on localhost:3002
          </div>
        </div>

        {/* MFE Status Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">
            🔧 MFE Development Status
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong className="text-gray-700">Application:</strong>
              <p className="text-gray-600">clinical-flags-mfe</p>
            </div>
            <div>
              <strong className="text-gray-700">Mode:</strong>
              <p className="text-gray-600">Standalone Development</p>
            </div>
            <div>
              <strong className="text-gray-700">Exposed Component:</strong>
              <p className="text-gray-600">ClinicalFlagsWidget</p>
            </div>
            <div>
              <strong className="text-gray-700">Module Federation:</strong>
              <p className="text-gray-600">Enabled (Remote)</p>
            </div>
          </div>
        </div>

        {/* Clinical Flags Widget Demonstration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            🧩 Component Demo
          </h2>
          <p className="text-gray-600 mb-6">
            This is the ClinicalFlagsWidget component that will be consumed 
            by the host application via Module Federation.
          </p>
          
          {/* 
            ClinicalFlagsWidget Component Demo
            - Shows the component in isolation
            - Uses sample data for demonstration
            - Handles interactions independently
            - Demonstrates styling and functionality
          */}
          <ClinicalFlagsWidget
            patientId="demo-patient-standalone"
            onFlagClick={handleFlagClick}
            className="max-w-2xl mx-auto"
          />
        </div>

        {/* Development Information */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            This MFE can be consumed by the host application at{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">
              clinicalFlagsMfe/ClinicalFlagsWidget
            </code>
          </p>
          <p className="mt-2">
            Module Federation Remote Entry:{' '}
            <code className="bg-gray-100 px-2 py-1 rounded">
              /_next/static/chunks/remoteEntry.js
            </code>
          </p>
        </div>
      </div>
    </div>
  );
}