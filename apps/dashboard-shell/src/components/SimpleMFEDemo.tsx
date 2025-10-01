'use client';

import React, { Suspense, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Local duplicate of remote prop types (lightweight) to satisfy TS when using next/dynamic wrapper
interface ClinicalFlagsWidgetProps {
  patientId?: string;
  onFlagClick?: (flag: { message: string }) => void;
  flags?: { id: string; type: string; message: string; timestamp: string; patientId: string }[];
  className?: string;
}

/**
 * Simple Micro-Frontend Demo Component
 * 
 * Demonstrates basic Module Federation integration between dashboard-shell (host)
 * and clinical-flags-mfe (remote) without complex type checking.
 */

// Simple fallback component when MFE is unavailable
const MFEFallback: React.FC = () => (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-red-800 font-semibold mb-2">⚠️ MFE Unavailable</h3>
    <p className="text-red-700 text-sm">
      The Clinical Flags micro-frontend could not be loaded. 
      Please ensure it&apos;s running on localhost:3002.
    </p>
  </div>
);

// Dynamically load remote MFE only on client. Using next/dynamic with ssr:false prevents
// server from attempting to resolve the federated spec (eliminating hook runtime mismatch issues).
// We wrap in a factory to provide a graceful fallback when remote fails.
const ClinicalFlagsWidget = dynamic<ClinicalFlagsWidgetProps>(
  async () => {
    try {
      // @ts-expect-error - runtime federation resolution
      const mod = await import('clinicalFlagsMfe/ClinicalFlagsWidget');
      return mod;
    } catch {
      return MFEFallback;
    }
  },
  { ssr: false, loading: () => <LoadingComponent /> }
);

// Loading component while MFE loads
const LoadingComponent: React.FC = () => (
  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg animate-pulse">
    <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
    <div className="space-y-3">
      {[1, 2, 3].map(i => (
        <div key={i} className="p-3 bg-white rounded border">
          <div className="h-4 bg-gray-300 rounded mb-2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      ))}
    </div>
    <div className="mt-4 text-center text-sm text-gray-500">
      Loading Clinical Flags MFE...
    </div>
  </div>
);

const SimpleMFEDemo: React.FC = () => {
  const [selectedPatient, setSelectedPatient] = useState('demo-patient-001');

  // Sample patients
  const patients = [
    { id: 'demo-patient-001', name: 'John Doe' },
    { id: 'demo-patient-002', name: 'Jane Smith' },
    { id: 'demo-patient-003', name: 'Bob Johnson' },
  ];

  const handleFlagClick = useCallback((flag: { message: string }) => {
    alert(`Flag clicked: ${flag.message}`);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h1 className="text-2xl font-bold mb-2">🏥 Module Federation Demo</h1>
        <p className="text-gray-600">
          Demonstrating dynamic loading of Clinical Flags micro-frontend
        </p>
      </div>

      {/* Patient Selector */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <label className="block text-sm font-medium mb-2">Select Patient:</label>
        <select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
          className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {patients.map(patient => (
            <option key={patient.id} value={patient.id}>
              {patient.name} ({patient.id})
            </option>
          ))}
        </select>
      </div>

      {/* MFE Status */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-800 font-semibold mb-2">🔗 Federation Status</h3>
        <div className="text-sm text-blue-700 space-y-1">
          <p><strong>Host:</strong> dashboard-shell (localhost:3003)</p>
          <p><strong>Remote:</strong> clinical-flags-mfe (localhost:3002)</p>
          <p><strong>Component:</strong> ClinicalFlagsWidget</p>
        </div>
      </div>

      {/* Micro-Frontend Component */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">🧩 Clinical Flags MFE</h2>
        {/* Suspense retained in case future nested lazy components exist inside remote */}
        <Suspense fallback={<LoadingComponent />}>
          <ClinicalFlagsWidget patientId={selectedPatient} onFlagClick={handleFlagClick} />
        </Suspense>
      </div>

      {/* Implementation Notes */}
      <div className="bg-gray-50 border rounded-lg p-4 text-sm">
        <h3 className="font-semibold mb-2">🔧 Implementation Details</h3>
        <ul className="space-y-1 text-gray-700 list-disc list-inside">
          <li>Dynamic import via Module Federation</li>
          <li>Error isolation with fallback component</li>
          <li>Suspense loading states</li>
          <li>Shared React dependencies</li>
          <li>Independent deployability</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleMFEDemo;