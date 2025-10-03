import React from 'react';

/**
 * ClinicalFlagsWidget - A micro-frontend component that displays clinical flags and alerts
 * 
 * This component serves as the primary export for the clinical-flags-mfe micro-frontend.
 * It demonstrates isolated functionality that can be consumed by the host application
 * while maintaining independent deployability and error isolation.
 * 
 * Features:
 * - Displays patient clinical flags and warnings
 * - Self-contained styling to prevent CSS conflicts
 * - Error boundary compatible for proper isolation
 * - Accessible design following WCAG 2.1 AA standards
 */

interface ClinicalFlag {
  id: string;
  type: 'warning' | 'critical' | 'info';
  message: string;
  timestamp: string;
  patientId: string;
}

interface ClinicalFlagsWidgetProps {
  patientId?: string;
  flags?: ClinicalFlag[];
  onFlagClick?: (flag: ClinicalFlag) => void;
  className?: string;
  /**
   * Optional displayName sent by host to demonstrate cross-boundary communication.
   * When provided, widget will render a simple name-only view (demo mode) instead of full flags.
   */
  displayName?: string;
}

const ClinicalFlagsWidget: React.FC<ClinicalFlagsWidgetProps> = ({
  patientId = 'demo-patient-001',
  flags = [
    {
      id: '1',
      type: 'critical',
      message: 'High blood pressure reading requires immediate attention',
      timestamp: '2025-10-01T14:30:00Z',
      patientId: 'demo-patient-001'
    },
    {
      id: '2',
      type: 'warning',
      message: 'Patient has missed last 2 scheduled appointments',
      timestamp: '2025-10-01T13:15:00Z',
      patientId: 'demo-patient-001'
    },
    {
      id: '3',
      type: 'info',
      message: 'New lab results available for review',
      timestamp: '2025-10-01T12:00:00Z',
      patientId: 'demo-patient-001'
    }
  ],
  onFlagClick,
  className = '',
  displayName
}) => {
  const getTypeIcon = (type: ClinicalFlag['type']) => {
    switch (type) {
      case 'critical':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '📋';
    }
  };

  const getTypeStyles = (type: ClinicalFlag['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800';
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Demo short-circuit: if displayName provided, show only name echo (communication proof)
  if (displayName) {
    return (
      <section
        aria-label="Clinical Flags Communication Demo"
        className={`clinical-flags-widget rounded-md border border-gray-200 bg-white p-4 ${className}`}
      >
        <header className="mb-3 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">Remote Widget</h3>
          <span className="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600">MFE</span>
        </header>
  <p className="text-xs uppercase tracking-wide text-gray-900 mb-1">Display Name</p>
  <p className="text-lg font-medium text-gray-900" data-testid="display-name">{displayName}</p>
        <p className="mt-4 text-[11px] text-gray-500 leading-relaxed">
          Value above was passed from the host shell. Remove the name in host to view full flag list.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Clinical Flags"
      className={`clinical-flags-widget rounded-md border border-gray-200 bg-white p-4 ${className}`}
    >
      <header className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold text-gray-900">Clinical Flags</h3>
          <p className="text-xs text-gray-500 mt-0.5">Patient {patientId} • {flags.length} active</p>
        </div>
        <span className="rounded bg-gray-100 px-2 py-0.5 text-[10px] font-medium tracking-wide text-gray-600">MFE</span>
      </header>

      {flags.length === 0 ? (
        <div className="rounded-md border border-dashed border-gray-200 bg-gray-50 py-6 text-center text-sm text-gray-500">
          No clinical flags.
        </div>
      ) : (
        <ul className="space-y-2" role="list" aria-label="Clinical flag list">
          {flags.map(flag => (
            <li key={flag.id}>
              <button
                type="button"
                onClick={() => onFlagClick?.(flag)}
                className={`w-full text-left rounded-md border px-3 py-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${getTypeStyles(flag.type)} hover:bg-white/60`}
                aria-label={`Flag ${flag.type}: ${flag.message}`}
              >
                <div className="flex items-start gap-3">
                  <span className="mt-0.5 text-base" aria-hidden>{getTypeIcon(flag.type)}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug">{flag.message}</p>
                    <p className="mt-1 text-[11px] text-gray-600/80 flex items-center gap-1"><span aria-hidden>🕒</span>{formatTimestamp(flag.timestamp)}</p>
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer className="mt-4 border-t pt-3">
        <p className="text-[11px] text-gray-500 text-center">Isolated micro-frontend component</p>
      </footer>
    </section>
  );
};

export default ClinicalFlagsWidget;