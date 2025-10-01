'use client';

import React, { Suspense, lazy, useState, useCallback } from 'react';

/**
 * MicroFrontendDemo - Demonstrates Module Federation integration
 * 
 * This component showcases how the dashboard-shell (host) application
 * dynamically loads and consumes micro-frontend components at runtime.
 * 
 * Key demonstrations:
 * - Dynamic import of remote micro-frontend components
 * - Error boundary handling for micro-frontend isolation
 * - Loading states and fallback UI
 * - Communication between host and remote components
 * - Independent deployability verification
 */

// Lazy load the remote micro-frontend component
// This creates a dynamic import that will be resolved by Module Federation at runtime
// The component will be loaded from the clinical-flags-mfe remote application
const ClinicalFlagsWidget = lazy(() => 
  // @ts-expect-error - Module Federation types are resolved at runtime
  import('clinicalFlagsMfe/ClinicalFlagsWidget')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((module: { default: React.ComponentType<any> }) => ({ default: module.default }))
    .catch((error: Error) => {
      console.error('Failed to load Clinical Flags MFE:', error);
      // Return a fallback component in case the MFE is unavailable
      return { 
        default: () => (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h3 className="text-red-800 font-semibold mb-2">⚠️ MFE Unavailable</h3>
            <p className="text-red-700 text-sm">
              The Clinical Flags micro-frontend could not be loaded. 
              Please ensure it&apos;s running on localhost:3002.
            </p>
            <p className="text-red-600 text-xs mt-2">
              Error: {error.message}
            </p>
          </div>
        )
      };
    })
);

/**
 * Error Boundary Component for Micro-Frontend Isolation
 * Ensures that errors in remote components don't crash the host application
 */
class MicroFrontendErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Micro-frontend error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Loading Fallback Component
 * Displays while the micro-frontend is being loaded
 */
const LoadingFallback: React.FC = () => (
  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-6 bg-gray-300 rounded w-40"></div>
      <div className="h-4 bg-gray-300 rounded w-20"></div>
    </div>
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-3 bg-white rounded border">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gray-300 rounded"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
    <div className="mt-4 text-center text-sm text-gray-500">
      Loading Clinical Flags MFE...
    </div>
  </div>
);

/**
 * Error Fallback Component
 * Displays when the micro-frontend fails to load or crashes
 */
const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => (
  <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xl">💥</span>
      <h3 className="text-red-800 font-semibold">Micro-Frontend Error</h3>
    </div>
    <p className="text-red-700 text-sm mb-3">
      The Clinical Flags micro-frontend encountered an error and could not be displayed.
      This error has been isolated and doesnt affect the rest of the application.
    </p>
    {error && (
      <details className="text-xs text-red-600 bg-red-100 p-2 rounded">
        <summary className="cursor-pointer font-medium">Error Details</summary>
        <pre className="mt-2 whitespace-pre-wrap">{error.message}</pre>
      </details>
    )}
    <div className="mt-4 text-xs text-red-500">
      <strong>Troubleshooting:</strong>
      <ul className="mt-1 ml-4 list-disc">
        <li>Ensure clinical-flags-mfe is running on localhost:3002</li>
        <li>Check browser console for detailed error messages</li>
        <li>Verify Module Federation configuration</li>
      </ul>
    </div>
  </div>
);

const MicroFrontendDemo: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState('demo-patient-001');
  const [mfeKey, setMfeKey] = useState(0); // Force re-render key

  // Sample patients for demonstration
  const patients = [
    { id: 'demo-patient-001', name: 'John Doe' },
    { id: 'demo-patient-002', name: 'Jane Smith' },
    { id: 'demo-patient-003', name: 'Bob Johnson' },
  ];

  // Handle flag clicks from the micro-frontend
  const handleFlagClick = useCallback((flag: { message: string; patientId: string; type: string }) => {
    alert(`Flag clicked: ${flag.message}\nPatient: ${flag.patientId}\nType: ${flag.type}`);
  }, []);

  // Force reload the micro-frontend (useful for development)
  const reloadMFE = useCallback(() => {
    setMfeKey(prev => prev + 1);
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          🏥 Micro-Frontend Integration Demo
        </h1>
        <p className="text-gray-600">
          This demonstrates the dynamic loading of the Clinical Flags micro-frontend 
          using Module Federation. The MFE is independently deployable and isolated from the host.
        </p>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label htmlFor="patient-select" className="text-sm font-medium text-gray-700">
              Selected Patient:
            </label>
            <select
              id="patient-select"
              value={selectedPatient}
              onChange={(e) => setSelectedPatient(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.name} ({patient.id})
                </option>
              ))}
            </select>
          </div>
          
          <button
            onClick={reloadMFE}
            className="px-4 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
          >
            🔄 Reload MFE
          </button>
        </div>
      </div>

      {/* Module Federation Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
          <span>🔗</span>
          Module Federation Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <strong className="text-blue-800">Host Application:</strong>
            <p className="text-blue-700">dashboard-shell (localhost:3003)</p>
          </div>
          <div>
            <strong className="text-blue-800">Remote MFE:</strong>
            <p className="text-blue-700">clinical-flags-mfe (localhost:3002)</p>
          </div>
          <div>
            <strong className="text-blue-800">Shared Dependencies:</strong>
            <p className="text-blue-700">React 19.1.0, Next.js 15.5.4</p>
          </div>
        </div>
      </div>

      {/* Micro-Frontend Component */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <span>🧩</span>
          Clinical Flags Micro-Frontend
        </h2>
        
        {/* Error Boundary wraps the lazy-loaded component for isolation */}
        <MicroFrontendErrorBoundary 
          fallback={<ErrorFallback />}
        >
          <Suspense fallback={<LoadingFallback />}>
            <ClinicalFlagsWidget
              key={mfeKey} // Force re-render when key changes
              patientId={selectedPatient}
              onFlagClick={handleFlagClick}
              className="max-w-2xl"
            />
          </Suspense>
        </MicroFrontendErrorBoundary>
      </div>

      {/* Technical Information */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm">
        <h3 className="font-semibold text-gray-800 mb-2">🔧 Technical Implementation Details</h3>
        <ul className="space-y-1 text-gray-700 list-disc list-inside">
          <li><strong>Dynamic Import:</strong> Component loaded via <code>import(`clinicalFlagsMfe/ClinicalFlagsWidget`)</code></li>
          <li><strong>Error Isolation:</strong> Error boundary prevents MFE crashes from affecting host</li>
          <li><strong>Loading States:</strong> Suspense provides smooth loading experience</li>
          <li><strong>Shared Dependencies:</strong> React and ReactDOM shared to prevent duplication</li>
          <li><strong>Independent Deployment:</strong> MFE can be deployed and updated independently</li>
        </ul>
      </div>
    </div>
  );
};

export default MicroFrontendDemo;