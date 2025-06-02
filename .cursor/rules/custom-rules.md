---
description: 
globs: 
alwaysApply: false
---
# Funnel Board - Development Rules & Best Practices

## 1. Purpose

This document outlines the coding standards, architectural guidelines, and best practices to be followed during the development and maintenance of the Funnel Board project. The goal is to ensure a high-quality, maintainable, scalable, and performant application. All AI-assisted code generation and refactoring should strictly adhere to these rules.

## 2. Core Principles

* **Clarity and Readability:** Code should be easy to understand and self-documenting. Prioritize simplicity over unnecessary complexity.
* **Modularity:** Design components, hooks, and services with clear responsibilities and loose coupling.
* **Performance:** Be mindful of performance implications, especially in the interactive canvas and frequently re-rendering components.
* **Correctness:** Code must be functional and achieve its intended purpose reliably.
* **Consistency:** Follow established patterns and conventions within the project.
* **Testability:** Write code that is easy to test. Strive for good test coverage.
* **Maintainability:** Future developers (including AI) should be able to easily understand, modify, and extend the codebase.

## 3. Coding Standards

### 3.1. General
* **Language:** All code, comments, variable names, function names, class names, and commit messages **MUST be written in English.**
* **Formatting:**
    * Strictly adhere to the ESLint rules defined in `eslint.config.js`.
    * Use Prettier (or a similar consistent formatter) for code formatting. Resolve all linting and formatting issues before committing.
    * The `@typescript-eslint/no-unused-vars` rule should be set to `"warn"` or `"error"`. Unused variables must be removed or explicitly marked (e.g., prefixed with `_`) if intentionally unused.
* **Naming Conventions:**
    * Components and Types/Interfaces: `PascalCase` (e.g., `ComponentNode`, `FunnelProject`).
    * Functions, Variables, Hooks: `camelCase` (e.g., `handleSaveProject`, `useCanvasZoom`).
    * Constants: `UPPER_SNAKE_CASE` (e.g., `DEFAULT_COMPONENT_COLOR`).
* **File Naming:**
    * Components: `ComponentName.tsx`
    * Hooks: `useHookName.ts`
    * Types: `typeName.types.ts` or within a relevant `types.ts` file for a module.
    * Services: `serviceName.service.ts`
* **Comments:**
    * Write comments in **English**.
    * Explain *why* something is done, not just *what* is being done, especially for complex logic or non-obvious decisions.
    * Avoid unnecessary comments for self-explanatory code.
    * Use JSDoc-style comments for functions and hooks where appropriate to describe parameters and return values.

### 3.2. TypeScript
* **Strong Typing:** Utilize TypeScript's strong typing system to its full potential.
* **Avoid `any`:** The use of `any` is strongly discouraged. Prefer specific types, `unknown` with type guards, or generics.
* **Interfaces vs. Types:** Use interfaces for defining the shape of objects and classes. Use type aliases for unions, intersections, or more complex type definitions. Be consistent.
* **Utility Types:** Leverage TypeScript's utility types (`Partial`, `Readonly`, `Pick`, `Omit`, etc.) to create more precise and reusable types.
* **Explicit Return Types:** All functions and methods should have explicit return types.
* **Non-null Assertion Operator (`!`)**: Avoid using the non-null assertion operator unless you are absolutely certain that the value will not be null or undefined and the TypeScript compiler cannot infer this. Prefer type guards or optional chaining.

### 3.3. React
* **Functional Components & Hooks:** Exclusively use functional components with Hooks.
* **Hook Rules:** Strictly follow the Rules of Hooks.
* **`useEffect` Dependencies:** Ensure dependency arrays for `useEffect`, `useMemo`, and `useCallback` are correct and complete to prevent stale closures and unnecessary re-executions.
* **Component Design:**
    * **Single Responsibility Principle (SRP):** Components should have a single, well-defined responsibility.
    * **Composition over Inheritance:** Prefer component composition.
    * **Props:** Keep prop interfaces clear and minimal. Avoid overly complex prop objects. Destructure props for readability.
* **Performance:**
    * Use `React.memo` for components that are expensive to render and receive the same props frequently.
    * Use `useMemo` for expensive calculations and `useCallback` for memoizing functions passed as props to memoized children. Use these judiciously.
* **Keys:** Always provide stable and unique `key` props when rendering lists of components.
* **Conditional Rendering:** Use clear and concise patterns for conditional rendering (e.g., `&&` operator for simple cases, ternary operator, or early returns).

## 4. Project Structure & Modularity

* **Adherence to Existing Structure:** Maintain and refine the established folder structure (`src/components`, `src/hooks`, `src/features`, `src/contexts`, `src/pages`, `src/types`, `src/integrations`, `src/lib`, `src/data`).
* **Feature-Sliced Design (FSD) Enhancement:**
    * Continue to organize code by features within `src/features/`.
    * Each feature should be as self-contained as possible, with its own `components`, `hooks`, `services` (if applicable), and `types` subdirectories.
    * Minimize direct dependencies between features. If shared logic is needed, place it in `src/lib` or a shared `src/shared/` directory.
* **`src/components` Organization:**
    * Generic, reusable UI components (atoms/molecules) can reside in `src/components/ui` (as per shadcn-ui).
    * More complex shared components (organisms) can be in `src/components/shared/`.
    * Components specific to a page or a major layout part (e.g., `Sidebar`, `Toolbar`) can have their own subdirectories within `src/components/`.
* **Separation of Concerns:**
    * UI logic in components (React components).
    * Business logic and stateful component logic in custom Hooks (`src/hooks/`).
    * API/Backend interactions abstracted into hooks (like `useSupabaseWorkspace`) or a dedicated service layer (`src/services/`).
    * Global UI state or cross-cutting concerns in Contexts (`src/contexts/`).

## 5. Specific Project Areas & Refactoring Focus

* **Canvas (`src/components/Canvas.tsx`, `src/components/Canvas/CanvasContainer.tsx`):**
    * **Bug Fix (High Priority):** Resolve the visual bug where components are "cut off" or improperly rendered during pan/zoom. This requires careful review of coordinate calculations, transforms, viewport management, and CSS overflow properties.
    * **State Management:** If prop-drilling becomes excessive or state management complex, consider refactoring to use a more granular state solution (e.g., Zustand, Jotai) for canvas-specific states like zoom, pan, selections, and node positions.
    * **Performance:** Continuously monitor and optimize rendering performance as more components are added.
* **Large Component Refactoring:**
    * Break down large components like `ComponentEditor.tsx`, `WorkspaceSelector.tsx`, and `ModernSidebar.tsx` into smaller, more focused sub-components and hooks.
* **Hook Refactoring (`src/hooks/`):**
    * Refactor `useSupabaseWorkspace.ts` into more specialized hooks (e.g., `useWorkspaces`, `useProjects`) to improve cohesion and testability.
    * Ensure all custom hooks have clear input/output contracts and manage their internal state effectively.
* **Component Organization:**
    * Relocate feature-specific components from the main `src/components` directory to their respective `src/features/[featureName]/components` directories.
* **Styling:**
    * Consolidate global styles into `src/index.css`. Minimize or eliminate `src/App.css` by migrating styles to Tailwind CSS where possible.

## 6. State Management

* **Local Component State:** Use `useState` for simple, component-local state.
* **Server State & Caching:** Use React Query (via `QueryClientProvider`) for all server state management, data fetching, caching, and optimistic updates related to Supabase.
* **Global UI State / Cross-Cutting Concerns:** Use React Context API (`src/contexts/`) for state that needs to be shared across many components but isn't server state (e.g., `AuthContext`, potentially theme, or global UI settings).
* **Complex UI State (Canvas, Editor):** If Context API leads to performance issues or excessive prop drilling for rapidly changing UI states, evaluate and consider Zustand or Jotai for more granular and performant state management.

## 7. API Interactions (Supabase)

* **Client Usage:** All Supabase interactions should use the configured client from `src/integrations/supabase/client.ts`.
* **Abstraction:** Encapsulate Supabase calls within custom hooks (current approach) or a dedicated service layer (e.g., `src/services/workspaceService.ts`). This improves testability and isolates Supabase-specific logic.
* **Error Handling:** Implement robust error handling for all Supabase calls, providing user-friendly feedback.
* **Security:** Always be mindful of Supabase Row Level Security (RLS). Frontend code should only request data the user is authorized to see.

## 8. Error Handling

* Utilize the `ErrorBoundary.tsx` component to catch rendering errors in component trees.
* Implement try-catch blocks for asynchronous operations and API calls.
* Provide meaningful error messages to the user (e.g., via `sonner` toasts).

## 9. Testing

* **Mandatory:** New features and significant refactors **must** include relevant tests.
* **Unit Tests:** Use Vitest (or Jest) and React Testing Library to write unit tests for:
    * Custom Hooks (especially those with complex logic).
    * Utility functions (`src/lib/utils.ts`).
    * Individual components with complex internal logic or UI states.
* **Integration Tests:** Test interactions between multiple components and user flows.
* **Testable Code:** Write code with testability in mind (e.g., pure functions, clear dependencies, avoiding excessive side effects in components).
* **Colocation:** Place test files (`*.test.ts` or `*.test.tsx`) alongside the files they are testing or in a `__tests__` subdirectory.

## 10. Commit Messages

* Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat:`, `fix:`, `chore:`, `refactor:`, `docs:`, `test:`).
* Messages should be concise and written in **English**.
* The body of the commit message should explain the "what" and "why" of the change.

## 11. AI Collaboration Guidelines

* **Explain Reasoning:** When proposing significant code changes, refactoring, or architectural decisions, please provide a clear explanation of the rationale and expected benefits.
* **Offer Alternatives:** If multiple valid solutions exist, present them with their respective pros and cons.
* **Iterative Development:** Prefer smaller, incremental changes that are easier to review, understand, and test.
* **Prioritize Functionality:** Ensure that any suggested refactoring or new code maintains or improves existing functionality and does not introduce regressions.
* **Ask for Clarification:** If requirements or existing code are unclear, please ask questions before proceeding.
* **Focus on Best Practices:** Actively suggest improvements based on the best practices outlined in this document.

By following these rules, we aim to build a robust, high-quality, and maintainable Funnel Board application.