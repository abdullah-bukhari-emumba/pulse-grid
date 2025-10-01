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

and here are the main files that we will be following 

upskill plan - main KPIs: 

Frontend Engineer Upskill Plan 
The Assignment: Advanced React Dashboard 
Development 
Over 4 weeks, the engineer will build a scalable, production-ready dashboard application 
with the following requirements: 
Core Features 
1. Virtualized Data Table 
○ Handle 100,000+ rows efficiently (no third-party virtualization library). 
○ Support dynamic row heights. 
○ Implement sorting and filtering. 
○ Optimize for render speed (<100ms) and smooth scrolling (FPS >50). 
○ Ensure no memory leaks. 
2. State Management Architecture 
○ Use React Context + useReducer + custom hooks. 
○ Demonstrate state normalization. 
○ Support optimistic UI updates and cache invalidation. 
○ Strict TypeScript typing, zero unnecessary re-renders. 
3. Compound Component Form Builder 
○ Implement a form system using the compound component pattern. 
○ Support dynamic validation (Zod/Yup), nested field arrays, and conditional 
fields. 
○ Include error boundaries and WCAG 2.1 AA accessibility. 
4. Testing Strategy 
○ Achieve 90% coverage. 
○ Write unit tests (React Testing Library). 
○ Add integration tests for critical flows. 
○ Include one E2E flow with Playwright/Cypress. 
○ Configure visual regression testing. 
5. Next.js & React Server Components 
○ Integrate parts of the dashboard with Next.js 14+. 
○ Use Server Components for data fetching and Client Components for 
interactivity. 
○ Implement streaming SSR and partial hydration. 
6. Micro-Frontend Demonstration 
○ Convert one feature into a separate micro-frontend with module federation. 
○ Enable independent deployability, shared dependency management, and 
error isolation. 
Timeline (4 Weeks) 
● Week 1: Virtualized Data Table + State Management 
● Week 2: Compound Form Builder + Testing Strategy 
● Week 3: Next.js + React Server Components 
● Week 4: Micro-Frontend Setup + Final Integration 
Deliverables 
● Codebase with modular structure. 
● Performance benchmarks (render time, FPS, memory profiling). 
● Testing reports with coverage metrics. 
● Technical documentation (architecture, trade-offs, scalability considerations). 
● Live demo & walkthrough at end of week 4. 
Evaluation Criteria 
● Technical Skills (40%) 
○ Code quality, scalability, React patterns, optimization. 
● Professional Skills (30%) 
○ Communication, documentation, timely delivery, code reviews. 
● Innovation & Growth (30%) 
○ Research capability, adoption of new tech, reusable solutions.


and here is the second file, PulseGrid - Blueprint: 

PulseGrid 
Project Blueprint IA 
1. Project Vision 
PulseGrid will be a production-grade, high-performance Electronic Health Record (EHR) 
dashboard. The primary objective of this project is to serve as a demonstration of frontend 
engineering capabilities, specifically in building scalable, complex, and performant user 
interfaces with modern technologies. The application will simulate a real-world clinical tool, 
focusing on a core clinician workflow: managing a large roster of patients and documenting 
clinical encounters. 
2. Core User Flow 
The application will be designed around a seamless and intuitive workflow for a clinician. 
1. Landing Page (Patient Roster): Upon opening the application, the user is presented 
with the main Patient Roster dashboard. This view is a highly performant data grid 
containing over 100,000 patient records. The user can sort by various columns (e.g., 
Name, Date of Birth), perform real-time text searches to find a specific patient, and 
expand a row to see a quick summary. 
2. Patient Selection: The user identifies and clicks on a patient row in the roster. 
3. Navigation to Patient Record: The application navigates to the selected patient's 
detailed record page, for example at the route /patient/[patientId]. 
4. Patient Record Interaction: On this page, the user has a comprehensive view of the 
patient's medical information, organized into tabs: 
○ Summary: Displays the patient's demographics, current medications, known 
allergies, and other vital information. 
○ Encounter Note (SOAP Form): Contains the form to document a new clinical visit. 
○ Clinical Flags: Displays and allows the addition of critical patient alerts (e.g., "Fall 
Risk"). 
5. Form Submission & State Update: The user fills out the Encounter Note form and 
submits it. The application state updates instantly and optimistically, reflecting the new 
information (e.g., a newly prescribed medication will immediately appear in the patient's 
medication list on the Summary tab). 
6. Return to Roster: The user can navigate back to the main Patient Roster, where any 
relevant data changes will be reflected. 
3. Technical Implementation Plan 
Each feature of PulseGrid is intentionally designed to satisfy a specific technical requirement 
from the development plan. 
1. Requirement: Virtualized Data Table 
● Implementation: I will build the Patient Roster View from scratch, without relying on a 
third-party virtualization library. This component will be engineered to render only the 
visible rows from a dataset of 100,000+ records, ensuring high performance. It will 
support dynamic row heights for the expandable summary feature, along with client-side 
and API-driven sorting and filtering. I will profile the component to ensure render times 
are below 100ms and scrolling maintains an FPS above 50, with no memory leaks. 
2. Requirement: State Management Architecture 
● Implementation: I will manage the application's client-side state using a combination of 
React Context, the useReducer hook, and custom hooks. For the Patient Record State, I 
will implement a normalized state structure, where different data types (e.g., patient 
demographics, medications, allergies) are stored in separate slices and linked by IDs. This 
approach prevents data duplication and simplifies updates. I will implement optimistic UI 
updates for actions like adding a new allergy, providing immediate user feedback while 
the asynchronous request is in flight. 
3. Requirement: Compound Component Form Builder 
● Implementation: I will build the Clinical Encounter Note (SOAP Form) using the 
compound component pattern. This will create a highly reusable and composable form 
API (e.g., <Form>, <Form.Input>, <Form.FieldArray>). The form will support complex 
validation logic using Zod, including conditional fields and nested field arrays for items 
like diagnoses or prescribed medications. This demonstrates an advanced understanding 
of creating flexible and scalable form systems. 
4. Requirement: Comprehensive Testing Strategy 
● Implementation: I will develop a robust testing suite to ensure application quality, aiming 
for 90% code coverage. This includes unit tests with React Testing Library for individual 
components and utility functions, integration tests for complex interactions like the form 
and its state updates, and one complete End-to-End (E2E) test using Playwright. The 
E2E test will automate the entire core user flow: searching the roster, opening a patient 
record and adding a new medication via the form. 
5. Requirement: Next.js & React Server Components 
● Implementation: I will build the application using Next.js 14+. The main Patient 
Dashboard Shell (header, navigation) and the static parts of the Patient Record header 
will be implemented as React Server Components (RSCs) for a fast initial page load. For 
dynamic lists within the patient record, such as recent lab results, I will implement 
Streaming SSR with Suspense, showing loading skeletons while the data is fetched. This 
demonstrates a modern approach to hybrid server/client rendering. 
6. Requirement: Micro-Frontend Demonstration 
● Implementation: I will architect the Clinical Flags Module as a micro-frontend (MFE) 
using Webpack's Module Federation. This component will be developed as a separate, 
self-contained application that can be deployed independently. The main application 
shell will load this MFE at runtime, passing the necessary patientId and callback functions 
as props. This demonstrates a professional, enterprise-level pattern for modularizing a 
large application and enabling independent team workflows. 
4. Data and API Strategy 
To ensure the project is realistic and demonstrates industry-standard practices, I will employ a 
Backend-for-Frontend (BFF) pattern using a dedicated mock API. 
● Patient Data Source: I will use a pre-generated, 100,000-record dataset from 
Synthea™. This provides high-fidelity, synthetic patient data that mirrors the complexity 
of a real-world EHR system. 
● Medical Terminology(Optional): To populate form selections and display data 
accurately, I will use standardized code sets. I will download static JSON files for common 
ICD-10 (diagnoses) and LOINC (lab tests) codes. 
● Mock API Server: I will use JSON Server to serve all the data. This tool will instantly 
create a full-featured mock REST API from the static JSON files. 
○ Reasoning: This approach is strategically superior to alternatives. It perfectly 
simulates the real-world division between a frontend application and a backend API, 
which is a common enterprise pattern. It allows the frontend to be built with 
production-ready API consumption logic (fetching, error handling) without the 
overhead of building a full backend from scratch. This keeps the project's focus 
squarely on the required frontend deliverables.