---
trigger: always_on
---

# Code Maintenance & Standards Guide (Textra Frontend)

This document provides architectural constraints, coding standards, styling rules, state management paradigms, and maintenance guidelines for developers and AI agents contributing to the Textra Next.js Frontend.

---

## 1. Project Organization (App Router)

We adhere strictly to the Next.js App Router patterns to keep the client codebase clean and modular.

*   **Page Separation:** Pages must reside in their corresponding path directories under `src/app/`. Keep route folders localized and structured (e.g. `/app/dashboard/` for admin features).
*   **Component Modularity:**
    - **Global Shared Components (`src/components/ui/`)**: Reusable generic blocks (buttons, dialogs, inputs) based on Radix and Tailwind.
    - **Domain Specific Components:** Kept within localized feature folders inside the route (e.g. `/app/dashboard/components/`) to prevent polluting the global folder.
*   **Client vs. Server Components:**
    - Declare `'use client'` strictly at the top of files that utilize React state hook triggers (`useState`, `useEffect`), animations, or context.
    - Keep layout screens and pages as Server Components by default to maximize render efficiency and bundle optimization.

---

## 2. TypeScript & Component Standards

*   **Strict Typing:** Explicitly define props using TypeScript types or interfaces. Do not utilize `any`.
*   **Destructuring & Defaults:** Destructure properties cleanly inside the component signature, providing sensible defaults:
    ```typescript
    interface VehicleCardProps {
      registrationNumber: string;
      brand: string;
      year?: number;
    }
    
    export const VehicleCard = ({ registrationNumber, brand, year = 2026 }: VehicleCardProps) => {
      // JSX content
    };
    ```
*   **Icon Standard:** Restrict all icons usage to the `lucide-react` library.
*   **Zod Form Validation:** Always bind forms (via `react-hook-form` and `@hookform/resolvers/zod`) to strict schemas to ensure validation error reporting occurs on the client before network requests.

---

## 3. Styling & Styling Systems (Tailwind CSS v4)

*   **Dynamic Design Token Enforcement:** Adhere directly to Tailwind v4 spacing, border, and typography tokens.
*   **No Hardcoded Pixels:** Always use semantic classes (e.g. `p-4`, `rounded-lg`, `gap-2`) instead of hardcoding absolute pixel sizing or off-palette colors.
*   **Interactive Polishing:** Polish UI interactive objects using modern transitions (e.g. `transition-all duration-300 hover:scale-102`), smooth hover overlays, and distinct disabled states (`disabled:opacity-50 disabled:cursor-not-allowed`).

---

## 4. State Management & API Fetching (BFF Pattern)

*   **Redux Toolkit (RTK) for Global State:** Maintain shared operational data (current business profile, active user identity, global logs) in the Redux store (`src/store/`).
*   **Axios Context Client:** Restrict all backend integrations to the configured global Axios instance. The instance automatically manages authorization contexts and formats response structures.
*   **BFF Alignment:** Next.js pages and API layers must cleanly handle Clerk validation and map sync requests back to the Express backend without creating direct database integrations on the frontend server.

---

## 5. Security & Route Protection

*   **Middleware Guard:** Keep the Clerk authentication filter (`middleware.ts`) up-to-date. Ensure all private folders `/dashboard` are securely blocked.
*   **Public Routing Integrity:** Ensure public screens (like the Zero-Auth public portal at `/portal/[uid]`) bypass the middleware completely to allow passwordless customer interactions.

---

## 6. Lints, Hooks & Quality Control

*   **ESLint Rules:** Never bypass lint rules. Run `npm run lint` before committing code.
*   **Prettier Formatter:** Keep coding style consistent by running `npm run format`.
*   **Git Quality Gate:** Do not modify or bypass the Husky hooks and `lint-staged` setups. Commits are verified automatically to protect repository health.
