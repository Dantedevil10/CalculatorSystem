# 🧮 Full-Stack Calculator Application

A modern, robust, and responsive full-stack calculator application composed of a **Node.js/Express REST API** (Backend) and a **React + TypeScript** interface (Frontend). 

This project was built to fulfill the requirements of a full-stack technical assessment, focusing on clean design, maintainable code, testable architecture, and full Docker containerization.

---

## 🏗️ Architecture & Design Decisions

### 1. Technology Choice (Why Node.js over Go?)
While Go was mentioned as a preference for the backend, I chose **Node.js with ES Modules** because I am highly proficient in the JavaScript/TypeScript ecosystem and felt it was the most effective way for me to deliver a robust, well-architected solution within the timeframe. Although I do not currently know Go, I am a fast learner and am very eager to study and adapt to the Go ecosystem. 

Furthermore, using Node.js allowed for a unified toolchain across the entire stack—simplifying the architecture—and enabled the use of the `mathjs` library to safely parse dynamic mathematical expressions without relying on dangerous functions like `eval()`.

### 2. Backend (REST API)
- **Framework:** Express.js (Lightweight and fast).
- **Architecture:** 3-Layer Pattern (Routes ➔ Controllers ➔ Services) to strictly separate HTTP transport logic from pure business/mathematical rules.
- **Error Handling:** Centralized try-catch blocks returning standardized JSON error messages for edge cases (e.g., Division by zero, negative square roots, invalid syntax).
- **Testing:** Migrated from Jest to **Vitest** + **Supertest** to ensure native ECMAScript Modules (ESM) support without relying on legacy Babel transpilers (which flagged `npm audit` vulnerabilities).

### 3. Frontend (UI)
- **Framework:** React 19 + TypeScript powered by **Vite** for rapid HMR and strict type safety.
- **Dual UI Modes:** 
  - *Standard Mode:* A classic physical calculator keypad with auto-parentheses matching and dynamic expression evaluation.
  - *Manual Mode:* A structured form for explicit parameter submittals (Operation, Value A, Value B).
- **Responsive Native-Like Design:** Utilizes CSS Media Queries to transform the desktop floating card into a full-screen, touch-friendly native app UI on mobile devices, removing borders and expanding touch targets.
- **Testing:** **Vitest** + **React Testing Library** with DOM cleanup to ensure components render correctly and user interactions trigger the right API calls.

---

## 🚀 Quick Start (Docker)

The easiest way to run the full application is using Docker Compose.

1. Ensure Docker and Docker Compose are installed on your machine.
2. Run the following command in the root directory:

```bash
docker-compose up --build
```

- Frontend Interface: http://localhost (Port 80)

- Backend API: http://localhost:3000

## 💻 Manual Setup & Local Execution
Prerequisites

- Node.js (v18, v20, or v22)

- npm

## ⚙️ Backend Setup (/calculatorAPI)
Navigate to the backend directory:

```Bash
cd calculatorAPI
```
Install dependencies:

```Bash
npm install
```
Start the development server:

```Bash
npm run dev
```
Run Unit & Integration Tests:

```Bash
npm test
npm run test:coverage
```
## 🎨 Frontend Setup (/calculatorInterface)
Navigate to the frontend directory:

```Bash
cd calculatorInterface
```
Install dependencies:

```Bash
npm install
```
Start the Vite development server:

```Bash
npm run dev
```
Run Component & UI Tests:

```Bash
npm test
npm run test:coverage
```
## 📡 API Reference & Usage Examples
1. Evaluate Dynamic Expression
- Endpoint: POST /api/calculate

Body:

```JSON
{
  "expression": "2-5(1/3)(5+8)"
}
```
- Response 200 OK:

```JSON
{
  "expression": "2-5(1/3)(5+8)",
  "result": -19.666666666666668
}
```
2. Evaluate Named Structured Operation
- Endpoint: POST /api/calculate

Body:

```JSON
{
  "operation": "power",
  "a": 2,
  "b": 4
}
```
- Response 200 OK:

```JSON
{
  "operation": "power",
  "a": 2,
  "b": 4,
  "result": 16
}
```
3. Edge Cases & Error Handling
- Division by Zero:

  - Body: {"operation": "divide", "a": 10, "b": 0}

  - Response 400 Bad Request: {"error": "Division by zero is not allowed."}

- Negative Square Root:

  - Body: {"operation": "sqrt", "a": -9}

  - Response 400 Bad Request: {"error": "It is not possible to calculate the square root of a negative number."}

## 🤖 AI Assistance & Development Process

As required by the assignment guidelines, an AI coding assistant (LLM) was utilized to accelerate the overall development process, including rapidly scaffolding the React interface and generating the foundation for the unit and integration tests.

Throughout the workflow, the AI was strictly guided to focus on software design that aligns with the core instruction: **"Prioritize correctness, clarity, and maintainability over extra features."** The prompts were carefully formulated to enforce a clean 3-layer architecture, strict separation of concerns, and robust error handling across both the frontend and backend.

Here is a selected sample of the iterative prompts used to shape the architecture and UI:

1. *"Let's refactor this: we won't keep everything in index.js. We will divide the application into controllers for HTTP requests, services for calculations, and a routes layer."*
2. *"The API must also be capable of safely calculating dynamic mathematical expressions sent as strings, like `2-5(1/3)(5+8)`."*
3. *"Write unit and integration tests for every layer of the API, covering edge cases and error handling. (Later: How do I fix this npm audit vulnerability regarding `sprintf-js`? Let's migrate to Vitest)."*
4. *"Let's move to the React+TypeScript frontend. Build the main calculator UI to look like a physical calculator, plus a toggle button in the top left to switch to a manual input form."*
5. *"Adjust the CSS media queries so that on mobile devices (smartphones), the calculator has no window borders and occupies 100% of the screen like a native mobile UI."*
"Write frontend unit tests using React Testing Library and Vitest to test UI rendering, button clicks, API fetch mocks, and mode toggling."

"Help me configure the Dockerfiles and docker-compose.yml based on this exact folder structure to run the full stack with one command."
