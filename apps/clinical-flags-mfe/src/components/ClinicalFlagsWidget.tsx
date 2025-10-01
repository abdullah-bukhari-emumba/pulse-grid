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
  className = ''
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

  return (
    <div className={`clinical-flags-widget p-4 bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          🏥 Clinical Flags
          <span className="text-sm font-normal text-gray-500">
            ({flags.length} active)
          </span>
        </h3>
        <span className="text-xs text-gray-400 font-mono">
          Patient: {patientId}
        </span>
      </div>

      {/* Flags List */}
      <div className="space-y-3">
        {flags.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <span className="text-2xl mb-2 block">✅</span>
            <p>No clinical flags for this patient</p>
          </div>
        ) : (
          flags.map((flag) => (
            <div
              key={flag.id}
              className={`
                p-3 rounded-lg border-l-4 transition-all duration-200 cursor-pointer
                hover:shadow-md hover:scale-[1.02] active:scale-[0.98]
                ${getTypeStyles(flag.type)}
              `}
              onClick={() => onFlagClick?.(flag)}
              role="button"
              tabIndex={0}
              aria-label={`Clinical flag: ${flag.message}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onFlagClick?.(flag);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getTypeIcon(flag.type)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm leading-relaxed">
                    {flag.message}
                  </p>
                  <p className="text-xs opacity-75 mt-1 flex items-center gap-1">
                    <span>🕒</span>
                    {formatTimestamp(flag.timestamp)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500 text-center">
        <span className="inline-flex items-center gap-1">
          <span>⚡</span>
          Powered by Clinical Flags MFE
        </span>
      </div>
    </div>
  );
};

export default ClinicalFlagsWidget;