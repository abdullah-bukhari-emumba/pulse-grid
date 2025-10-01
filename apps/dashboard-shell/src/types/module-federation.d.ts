/**
 * Module Federation Type Declarations
 * 
 * These declarations provide TypeScript support for dynamically imported
 * micro-frontend components through Module Federation.
 * 
 * Without these declarations, TypeScript cannot understand the remote
 * module imports that are resolved at runtime by Module Federation.
 */

declare module 'clinicalFlagsMfe/ClinicalFlagsWidget' {
  import React from 'react';
  
  /**
   * Clinical Flag Interface
   * Represents a single clinical flag or alert for a patient
   */
  interface ClinicalFlag {
    id: string;
    type: 'warning' | 'critical' | 'info';
    message: string;
    timestamp: string;
    patientId: string;
  }

  /**
   * Props interface for the ClinicalFlagsWidget component
   * This must match the props interface defined in the remote MFE
   */
  interface ClinicalFlagsWidgetProps {
    patientId?: string;
    flags?: ClinicalFlag[];
    onFlagClick?: (flag: ClinicalFlag) => void;
    className?: string;
  }

  /**
   * ClinicalFlagsWidget Component
   * Exported from the clinical-flags-mfe micro-frontend
   */
  const ClinicalFlagsWidget: React.FC<ClinicalFlagsWidgetProps>;
  
  export default ClinicalFlagsWidget;
  export default ClinicalFlagsWidget;
  export type { ClinicalFlag, ClinicalFlagsWidgetProps };
}

/**
 * Global Module Federation Types
 * These can be extended for additional remote modules
 */
declare global {
  /**
   * Webpack Module Federation Runtime
   * Provides access to the federation runtime for advanced scenarios
   */
  const __webpack_init_sharing__: (scope: string) => Promise<void>;
  const __webpack_share_scopes__: Record<string, unknown>;
}

export {};