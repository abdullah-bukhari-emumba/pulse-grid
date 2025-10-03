'use client';

import React, { Suspense, useState, useCallback } from 'react';
import dynamic from 'next/dynamic';

// Local duplicate of remote prop types (lightweight) to satisfy TS when using next/dynamic wrapper
interface ClinicalFlagsWidgetProps {
  patientId?: string;
  onFlagClick?: (flag: { message: string }) => void;
  flags?: { id: string; type: string; message: string; timestamp: string; patientId: string }[];
  className?: string;
  displayName?: string; // new prop to demonstrate host->remote communication
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
  const [displayName, setDisplayName] = useState('Dr. Alice HostRender');

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
    <main className="mx-auto flex max-w-5xl flex-col gap-6 p-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold text-gray-900">Module Federation Demo</h1>
        <p className="text-sm text-gray-500">Host ↔ Remote communication (simple, minimal UI)</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <form
          className="rounded-md border border-gray-200 bg-white p-4 shadow-sm"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Host Controls"
        >
          <h2 className="mb-4 text-sm font-medium tracking-wide text-gray-700">Host Controls</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-gray-500">Patient</label>
              <select
                value={selectedPatient}
                onChange={(e) => setSelectedPatient(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-400"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase text-gray-500">Display Name Sent to Remote</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 placeholder-gray-400"
                placeholder="e.g. Nurse Jenny"
              />
              <p className="mt-1 text-[11px] text-gray-500">Clear this field to show full flag list in remote.</p>
            </div>
            <div className="rounded-md bg-gray-50 p-2 text-[11px] leading-relaxed text-gray-600">
              Remote: <code className="font-mono">clinical-flags-mfe</code><br />
              Component: <code className="font-mono">ClinicalFlagsWidget</code>
            </div>
          </div>
        </form>

        <div className="rounded-md border border-gray-200 bg-white p-4 shadow-sm" aria-label="Remote Output">
          <h2 className="sr-only">Remote Output</h2>
          <Suspense fallback={<LoadingComponent />}>
            <ClinicalFlagsWidget
              patientId={selectedPatient}
              onFlagClick={handleFlagClick}
              displayName={displayName}
            />
          </Suspense>
        </div>
      </section>
    </main>
  );
};

export default SimpleMFEDemo;