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

---

## 7. Component Refactoring & API Query Patterns (Hooks Separation)

To ensure maximum maintainability, clean testability, and standard-compliant React coding, all feature-rich or complex dashboard views must adhere to the **decoupled state hook and sub-components architecture**.

### 7.1 Separation of Hooks and UI
*   **Encapsulate State & Actions**: Do not bleed state variables, RTK Query hooks, validations, and click handlers directly inside large JSX page controllers. Move them into a dedicated custom React hook (e.g., `useOpticalDashboard` or `useServicesPage`) stored inside `src/lib/hooks/` (or a corresponding feature hook folder).
*   **Pure Orchestrators**: The main entry component (e.g., `OpticalDashboardPage`) should only invoke the custom hook, destructure required states and handlers, and mount focused sibling sub-components.
*   **Single-Purpose Sibling Views**: Break large view sections into modular sibling sub-components in the same feature folder (e.g., `customer-directory.tsx`, `prescription-form.tsx`, `diagnostics-timeline.tsx`). Keep their props clean, simple, and strictly typed.

### 7.2 Clerk Authentication & Query Skips
*   **Secure API Requests**: Every backend integration query (e.g., `useFetchOpticalCustomersQuery`) must wait for Clerk to load the user session context.
*   **Skip Option Configuration**: Always fetch user status using Clerk's `useUser()` hook:
    ```typescript
    const { user: clerkUser, isLoaded } = useUser();
    ```
    Then, pass the `skip` flag inside the query config option:
    ```typescript
    const { data: response } = useFetchSomeDataQuery(undefined, {
      skip: !isLoaded || !clerkUser,
    });
    ```
    For child queries requiring active keys (e.g., `activeCustomerId`), extend the skip condition symmetrically:
    ```typescript
    skip: !activeCustomerId || !isLoaded || !clerkUser
    ```

### 7.3 Safe API Response Parsing & Normalization
*   **Robust Fallback Arrays**: Normalize backend RTK responses directly inside the custom hook using conditional array and nested data checks to prevent rendering breakdowns:
    ```typescript
    const items = Array.isArray(itemsResponse) ? itemsResponse : (itemsResponse as any)?.data || [];
    ```

### 7.4 Smartphone POS Compact Layout Design
*   **Extreme High-Density**: POS and smartphone-facing command interfaces must compress spaces to eliminate scrolling.
*   **Pill & Capsule Buttons**: Purge bulky emojis or massive cards; use single-row inline text pills (`[Single] [Bifocal]`) and badge rows.
*   **Micro Camera Snap Row**: Shrink drag-and-drop boxes to inline upload bars that render a tiny preview thumbnail next to the camera input trigger.

