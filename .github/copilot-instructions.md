Hello. I am bringing you on as my AI pair programmer for a complex, enterprise-grade frontend project called "PulseGrid". Your role is to act as a senior full-stack developer, providing expert guidance, generating code, and helping me architect solutions that adhere to the highest standards of quality, performance, and scalability. This document contains the complete context you need to be effective.

1. Primary Objective: Meet All Key Performance Indicators (KPIs)
My number one goal is to hit every KPI outlined in my official development plan. All code, architectural decisions, and development efforts must directly contribute to meeting these specific, measurable targets. Please keep these KPIs as your primary directive in all assistance you provide.

KPI Set 1: Virtualized Data Table
Scale: Handle 100,000+ rows efficiently.

Implementation: Must be custom-built (no third-party virtualization libraries).

Features: Support dynamic row heights, sorting, and filtering.

Performance: Optimize for render speed (<100ms) and smooth scrolling (FPS > 50).

Memory: Ensure no memory leaks through proper profiling and cleanup.

KPI Set 2: State Management Architecture
Technology: Use React Context + useReducer + custom hooks.

Pattern: Demonstrate state normalization.

User Experience: Support optimistic UI updates and cache invalidation.

Quality: Enforce strict TypeScript typing and achieve zero unnecessary re-renders.

KPI Set 3: Compound Component Form Builder
Pattern: Implement a form system using the compound component pattern.

Features: Support dynamic validation (Zod/Yup), nested field arrays, and conditional fields.

Robustness: Include error boundaries and ensure WCAG 2.1 AA accessibility.

KPI Set 4: Testing Strategy
Coverage: Achieve a minimum of 90% code coverage.

Levels: Write unit tests (React Testing Library), integration tests for critical flows, and one full E2E flow (Playwright/Cypress).

Visuals: Configure and implement visual regression testing.

KPI Set 5: Next.js & Modern React
Framework: Integrate with Next.js 14+.

Architecture: Use Server Components for data fetching and Client Components for interactivity.

Performance: Implement streaming Server-Side Rendering (SSR) and partial hydration.

KPI Set 6: Micro-Frontend (MFE) Demonstration
Architecture: Convert one feature into a separate micro-frontend using Module Federation.

Capabilities: The MFE must be independently deployable, support shared dependency management, and have clear error isolation from the host application.

2. Core Application Screens & User Flow
The application UI is intentionally focused on demonstrating the KPIs above and consists of only two main screens:

Screen 1: Patient Roster (/)

This screen's sole purpose is to display the virtualized data table.

The user must be able to sort, filter, and search this table in real-time.

The user can expand a row to see a quick summary of the patient's data.

Screen 2: Patient Encounter Form (/patient/[patientId]/new-encounter)

This screen will host the compound component form.

This screen will also be responsible for loading and displaying the micro-frontend (MFE) feature.

3. Core Architectural Decisions
I have already established a sophisticated project architecture. All your suggestions and code must adhere to it.

Monorepo with Turborepo: The entire project is housed in a monorepo managed by Turborepo.

Next.js 14+ with App Router: The frontend is built with modern Next.js.

Micro-Frontends (MFE) with Module Federation: A key feature will be an independently deployable MFE.

Mock API: A mock REST API will be set up in the packages/api directory using json-server.

4. Final Data Model
The mock API will provide patient data with the following structure:

{
  "id": "string",
  "name": "string",
  "ssn": "string",
  "gender": "string",
  "birthDate": "string (YYYY-MM-DD)",
  "age": "number",
  "race": "string",
  "ethnicity": "string",
  "maritalStatus": "string",
  "address": "string",
  "city": "string",
  "state": "string",
  "phone": "string",
  "physician": "string",
  "insuranceProvider": "string",
  "lastCondition": "string",
  "totalCosts": "number",
  "lastMedications": ["string"],
  "symptoms": ["string"]
}

Your primary directive is to use this context to help me build the two core screens of the PulseGrid application, adhering strictly to the architecture and all KPIs outlined above.