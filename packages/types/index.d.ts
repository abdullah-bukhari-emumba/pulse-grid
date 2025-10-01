/**
 * ============================================================================
 * PulseGrid Platform Type Definitions
 * ============================================================================
 * 
 * This file contains shared TypeScript type definitions used across the
 * PulseGrid monorepo. These types ensure consistency and type safety
 * between the dashboard shell and all micro-frontends.
 * 
 * Organization:
 * - Base types and interfaces
 * - Domain-specific types (healthcare, clinical)
 * - Module Federation types
 * - Configuration and environment types
 * 
 * Guidelines:
 * - All interfaces should extend BaseEntity when representing database entities
 * - Use union types for controlled vocabularies (enums as string literals)
 * - Mark optional properties with ? for flexibility
 * - Add JSDoc comments for complex types
 */

// ============================================================================
// BASE ENTITY TYPES
// ============================================================================

/**
 * Base interface for all database entities in the PulseGrid platform
 * 
 * Provides common fields that every persistent entity should have:
 * - id: Unique identifier (UUID recommended)
 * - createdAt: Timestamp when entity was created
 * - updatedAt: Timestamp when entity was last modified
 * 
 * This ensures audit trails and consistent identification across the platform
 */
export interface BaseEntity {
  /** Unique identifier for the entity (should be UUID in production) */
  id: string;
  
  /** Timestamp when the entity was created */
  createdAt: Date;
  
  /** Timestamp when the entity was last updated */
  updatedAt: Date;
}

// ============================================================================
// USER MANAGEMENT TYPES
// ============================================================================

/**
 * User entity representing platform users (healthcare professionals, admins, etc.)
 * 
 * Extends BaseEntity to include audit fields
 * Role-based access control through UserRole type
 */
export interface User extends BaseEntity {
  /** Full display name of the user */
  name: string;
  
  /** Email address (must be unique, used for authentication) */
  email: string;
  
  /** User's role determining their permissions in the platform */
  role: UserRole;
}

/**
 * User roles defining access levels in the healthcare platform
 * 
 * - admin: Full system access, user management, configuration
 * - clinician: Access to patient data, can create/modify clinical flags
 * - viewer: Read-only access to patient data and reports
 * 
 * This type is used for role-based access control throughout the application
 */
export type UserRole = 'admin' | 'clinician' | 'viewer';

// ============================================================================
// CLINICAL DOMAIN TYPES
// ============================================================================

/**
 * Clinical flag entity representing alerts or notifications for patient care
 * 
 * Clinical flags are used to highlight important patient conditions,
 * medication alerts, or other healthcare-related notifications that
 * require clinician attention.
 */
export interface ClinicalFlag extends BaseEntity {
  /** Patient identifier this flag is associated with */
  patientId: string;
  
  /** Type/category of the clinical flag */
  flagType: FlagType;
  
  /** Severity level determining urgency and display priority */
  severity: FlagSeverity;
  
  /** Human-readable description of the flag */
  description: string;
  
  /** Whether this flag is currently active and should be displayed */
  isActive: boolean;
}

/**
 * Types of clinical flags available in the system
 * 
 * - critical: Immediate attention required (red alerts)
 * - warning: Important but not immediately urgent (yellow alerts)
 * - info: Informational notices (blue alerts)
 */
export type FlagType = 'critical' | 'warning' | 'info';

/**
 * Severity levels for clinical flags
 * 
 * Used to prioritize display and determine urgency of response:
 * - high: Requires immediate attention
 * - medium: Should be addressed within reasonable timeframe  
 * - low: For information/awareness, less urgent
 */
export type FlagSeverity = 'high' | 'medium' | 'low';

// ============================================================================
// MODULE FEDERATION TYPES
// ============================================================================

/**
 * Generic props interface for micro-frontend components
 * 
 * Provides a flexible interface for passing props to federated components
 * since the exact prop shape may vary between different micro-frontends.
 * 
 * Use this when you need to pass unknown props to a dynamically loaded component.
 */
export interface MicroFrontendProps {
  /** Allow any additional properties for flexibility */
  [key: string]: unknown;
}

// ============================================================================
// ENVIRONMENT AND CONFIGURATION TYPES
// ============================================================================

/**
 * Environment configuration interface
 * 
 * Defines the shape of environment variables used across the platform
 * Ensures type safety when accessing process.env values
 */
export interface EnvironmentConfig {
  /** Current environment mode affecting build behavior */
  NODE_ENV: 'development' | 'production' | 'test';
  
  /** Port number for the application server */
  PORT: number;
  
  /** Optional base URL for API endpoints */
  API_BASE_URL?: string;
}