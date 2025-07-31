# Gemini Project Context for HR Management System

This document provides key context for the HR management system project to assist the Gemini agent in future sessions.

## Project Overview
- **Purpose:** An HR administration dashboard for managing employees, departments, positions, leave types, leave requests, and salary components.
- **Framework:** Next.js (React)
- **Backend:** Supabase (PostgreSQL database with RPC calls for data operations)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with `shadcn/ui` component library.

## Key Areas of Focus
- The primary working directory for administrative features is `app/hr/admin/`.

## Recent Changes & Conventions

### 1. Theming and Layout
- A consistent theme has been applied across the application.
- A `Navbar` (top) and `Sidebar` (left) have been implemented for consistent navigation and layout.
- The previous `components/ui/sidebar.tsx` was removed and replaced by `components/shared/sidebar.tsx`.
- The search bar has been removed from the Navbar.

### 2. Type Management
- All type definitions have been consolidated into the root `types.ts` file.
- All relevant files (`data.ts` and component files) have been refactored to import types from `types.ts` to ensure consistency and reduce duplication.

### 3. Form Validation
- All user input forms now utilize `Zod` for schema definition and validation.
- `react-hook-form` and `@hookform/resolvers` are integrated for client-side form management and validation.
- Server Actions also perform server-side validation using the same Zod schemas.

### 4. Date Formatting
- All date displays in the UI have been standardized to the `YYYY-MM-DD` format.

## Dependencies
- `zod`, `react-hook-form`, and `@hookform/resolvers` have been installed and are in use.

## General Guidelines
- When making changes, always prioritize consistency with existing patterns (e.g., component structure, data fetching methods, styling).
- Before modifying files, ensure to read their content to understand the current implementation.
- For form-related tasks, remember to update both the client-side component (using `react-hook-form` and Zod) and the corresponding server action.
