# Admin Dashboard & Password Reset Implementation Plan

## 1. Resolve Admin Dashboard Statistics
The current `AdminDashboard.tsx` uses hardcoded values in its JSX rendering, even though it fetches data. I need to replace these hardcoded values with the state variables.

### Frontend Fixes (`frontend/src/admin/AdminDashboard.tsx`)
*   Replace hardcoded "1,248" with `{stats.totalUsers}`.
*   Replace hardcoded "42" with `{stats.activeReports}`.
*   Replace hardcoded "Lost: 28 | Found: 14" with `Lost: {stats.activeLostReports} | Found: {stats.activeFoundReports}`.
*   Replace hardcoded "856" with `{stats.resolvedItems}`.

## 2. Forgot Password Feature Implementation

### Database Changes (`prisma/schema.prisma`)
*   Add `isPasswordResetRequested` (Boolean, default `false`) to the `User` model.
*   Run migration: `npx prisma migrate dev --name add_password_reset_flag`.

### Backend Implementation
*   **Controller (`src/login/authController.js`)**:
    *   Add `requestPasswordReset(req, res)`: Finds user by email and sets `isPasswordResetRequested = true`.
*   **Controller (`src/login/adminController.js`)**:
    *   Add `getPasswordResetRequests(req, res)`: Returns users where `isPasswordResetRequested` is true.
    *   Update `resetUserPassword`: Ensure it sets `isPasswordResetRequested = false` after successful reset.
*   **Routes**:
    *   `POST /api/auth/forgot-password` (Public).
    *   `GET /api/admin/password-requests` (Admin only).

### Frontend Implementation
*   **Forgot Password Page (`frontend/src/login/ForgotPassword.tsx`)**:
    *   Create a simple form asking for email.
    *   On submit, call `POST /api/auth/forgot-password`.
*   **Login Page (`frontend/src/login/Login.tsx`)**:
    *   Link "Forgot Password?" to `/forgot-password`.
*   **App Routing (`frontend/src/App.tsx`)**:
    *   Add public route `/forgot-password`.
*   **Admin Dashboard (`frontend/src/admin/AdminDashboard.tsx`)**:
    *   Add a new section "Password Reset Requests".
    *   Fetch and list users from `/api/admin/password-requests`.
    *   Add "Reset" button that opens a modal/prompt to enter new password.
    *   Call existing `PUT /api/admin/users/:id/password` to reset.

## 3. Verification
*   Verify dashboard shows real numbers.
*   Verify user can request password reset.
*   Verify admin sees the request and can reset the password.
