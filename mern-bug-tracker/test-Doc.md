# 🔬 Comprehensive Testing Strategy & Methodologies

The Bug Tracker application utilizes a robust, **three-tiered testing strategy** (**Unit**, **Integration**, and **End-to-End**) to ensure code quality, component functionality, and a reliable user experience. This approach follows the **Agile/Scrum Methodology**, where testing is continuous and integrated into development sprints.

---

## 1. 🧪 Unit Testing (Front-End & Back-End)

Unit testing is the lowest and most isolated level of testing. It focuses on verifying the correctness of individual, isolated logic units or components.

**Tooling:** Jest, React Testing Library (Front-End)
**Key Value:** Confirms that the smallest building blocks of the UI and business logic work as intended, making it easy to pinpoint errors.

---

### 1.1 Front-End Unit Testing (Components)

**Scope:** Individual React Components (BugForm, BugItem, BugList)

**Verification:** Component rendering, props handling, internal state changes, and form validation logic.

| Component   | Key Logic / Behavior Verified                                                                                                                                                     |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **BugForm** | Renders all inputs, handles user typing, triggers submission with the correct payload, implements validation (required fields, title length), and clears fields after submission. |
| **BugItem** | Renders bug data correctly, verifies status dropdown functionality, and ensures the delete action requires confirmation.                                                          |
| **BugList** | Correctly handles all states: Loading, Error, Empty, and successfully renders a list of `BugItem` components.                                                                     |

---

### 1.2 Back-End Unit Testing (Utilities)

**Scope:** Core utility functions that handle business logic or data sanitation, such as validators.

**Verification:** Ensures utility functions handle expected inputs, edge cases (e.g., empty string, incorrect data type), and apply business rules (e.g., title length, valid status/priority values).

| Utility                 | Key Logic / Behavior Verified                                                                                                          |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **validateBugTitle**    | Validates correct title format, invalidates empty or overly long titles (>100 chars), and rejects non-string inputs.                   |
| **validateBugStatus**   | Validates against a fixed set of allowed statuses (`open`, `in-progress`, `resolved`) and applies a default value (`open`) if missing. |
| **validateBugPriority** | Validates against a fixed set of allowed priorities (`low`, `medium`, `high`) and applies a default value (`medium`) if missing.       |

---

## 2. 🧩 Integration Testing (Front-End & Back-End)

Integration testing verifies that different modules or components work correctly when combined, focusing on data exchange and dependencies.

---

### 2.1 Front-End Integration Testing (App)

**Scope:** The primary application component (`App.js`), which integrates UI components and the service layer (`bugService`).

**Approach:** **Service Mocking**. The external API dependency (`bugService`) is mocked using Jest to isolate logic from the actual backend.

**Key Value:** Verifies the business logic flow — UI interactions trigger correct service calls, and service responses correctly update application state and UI.

---

### 2.2 Back-End Integration Testing (API & Database)

**Scope:** Testing complete API endpoints, including routing, controller logic, and successful interaction with the database (MongoDB via Mongoose).

**Approach:** **Supertest & In-Memory Database** — Tests make HTTP requests against the Express server and a temporary in-memory MongoDB instance for isolation.

**Tooling:** Jest, Supertest

**Key Value:** Confirms that the entire server stack is functional, including:

* Data persistence
* Correct HTTP status codes
* Robust error handling via middleware

| API Endpoint             | Key Logic / Behavior Verified                                                                          |
| ------------------------ | ------------------------------------------------------------------------------------------------------ |
| **POST /api/bugs**       | Successful creation (201), rejection of invalid data (400), and correct default values (open, medium). |
| **GET /api/bugs**        | Returns all bugs (200), including handling an empty list.                                              |
| **GET /api/bugs/:id**    | Returns a specific bug (200) and handles non-existent IDs (404).                                       |
| **PATCH /api/bugs/:id**  | Successfully updates a field and rejects invalid updates (400).                                        |
| **DELETE /api/bugs/:id** | Deletes a bug (200) and handles non-existent IDs (404).                                                |

---

## 3. 🖥️ End-to-End (E2E) Testing – Cypress

E2E testing is the highest level of testing, simulating a complete user journey in a real browser environment.

**Scope:** Full application stack (UI → Network → Backend behavior)

**Approach:** **API Interception** — Cypress intercepts network requests (GET, POST, PATCH, DELETE) and returns fixture data instead of using a live database.

**Tooling:** Cypress

**Key Value:** Confirms full user experience — all components, network calls, and UI flows work together correctly.

-
