# AI Development Rules for "Calculadora de Juros Abusivos"

This document outlines the technical stack and development conventions for this project. Adhering to these rules ensures consistency, maintainability, and quality.

## Tech Stack Overview

The application is built with a modern, lightweight tech stack:

-   **Framework**: React 19, written in TypeScript for type safety.
-   **Build Tool**: Vite is used for a fast and efficient development experience.
-   **Styling**: Tailwind CSS is the exclusive framework for styling. All styles should be applied via utility classes.
-   **UI Components**: The project leverages `shadcn/ui` for high-quality, accessible components.
-   **Icons**: `lucide-react` is the designated library for all icons.
-   **State Management**: State is managed locally within components using React Hooks (`useState`).
-   **Code Structure**: The codebase is organized into `src/components` for UI elements and `src/services` for business logic (calculations, formatting, etc.).
-   **Fonts**: The `Inter` font is used for all text, loaded from Google Fonts.

## Library and Convention Rules

### 1. UI Components

-   **Primary Choice**: ALWAYS use components from the `shadcn/ui` library for building the user interface. This includes buttons, inputs, cards, dialogs, etc.
-   **Custom Components**: If a suitable component does not exist in `shadcn/ui`, create a new, reusable component inside `src/components`. These components must be styled with Tailwind CSS.
-   **File Structure**: Each React component must reside in its own file (e.g., `Button.tsx`).

### 2. Styling

-   **Utility-First**: All styling MUST be done with Tailwind CSS utility classes.
-   **No Custom CSS**: Do not write custom CSS files or use inline `<style>` tags. The entire design system is managed through `tailwind.config`.
-   **Brand Colors**: Use the predefined brand colors from the Tailwind configuration (`brand-green`, `brand-yellow`, `brand-black`, etc.) to maintain brand consistency.

### 3. Icons

-   **Library**: Only use icons from the `lucide-react` package.
-   **Usage**: Import icons directly from the library, e.g., `import { Calculator } from 'lucide-react';`. This ensures they are tree-shakable.

### 4. State Management

-   **Local State**: Use React Hooks (`useState`, `useEffect`, `useReducer`) for managing component-level state.
-   **No Global State**: Do not introduce global state management libraries (like Redux, Zustand, or MobX) or a global Context API without explicit discussion. The application's current scope does not require it.

### 5. Forms

-   **Simple Forms**: For forms with minimal logic, use controlled components with the `useState` hook, as currently implemented in `CalculatorForm.tsx`.
-   **Complex Forms**: If form validation or complex state management is required, the preferred library is `react-hook-form` paired with `zod` for schema validation.

### 6. Business Logic & Utilities

-   **Separation of Concerns**: Keep business logic (e.g., financial calculations, data formatting) separate from UI components.
-   **Location**: Place all such utility and service functions in the `src/services` directory. Functions should be pure and easily testable where possible.