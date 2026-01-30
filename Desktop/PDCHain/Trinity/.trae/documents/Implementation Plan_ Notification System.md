# Implementation Plan: Notification System for Lost & Found

This plan implements a comprehensive notification system to facilitate communication between users and admins regarding lost and found items.

## 1. Database Updates (Prisma Schema)
*   **Create `Notification` Model**:
    *   Fields: `id`, `userId` (recipient), `title`, `message`, `type` (e.g., `CLAIM_REQUEST`, `ITEM_FOUND`, `ADMIN_MESSAGE`), `read` (boolean), `relatedItemId` (optional), `createdAt`.
*   **Update `User` Model**:
    *   Add relation: `notifications Notification[]`.

## 2. Backend Implementation
### New Notification Module (`src/notifications/`)
*   **Controller**: Logic to fetch notifications, mark as read, and create notifications.
*   **Routes**:
    *   `GET /api/notifications`: Fetch current user's notifications.
    *   `PUT /api/notifications/:id/read`: Mark specific notification as read.
    *   `POST /api/notifications/notify-user`: (Admin only) Send a custom message to a user.

### Item Logic Updates (`src/dashboard/itemController.js`)
*   **Found Item Claim Flow**:
    *   New Endpoint: `POST /api/found-items/:id/claim`
    *   Logic: When a user claims a found item, the system finds all ADMIN users and creates a `CLAIM_REQUEST` notification for them ("User X wants to claim Item Y").
*   **Lost Item Found Flow**:
    *   New Endpoint: `POST /api/lost-items/:id/notify-owner`
    *   Logic: When an Admin physically finds a lost item, they trigger this to create an `ITEM_FOUND` notification for the item's owner ("Good news! We found your item...").

## 3. Frontend Implementation
### Notification UI
*   **`NotificationBell` Component**: A new component in the `Layout` header.
    *   Displays a bell icon with a badge for unread count.
    *   Clicking opens a dropdown/modal list of notifications.
    *   Notifications have visual styles based on type (e.g., Green for "Found", Yellow for "Alert").

### Interaction Buttons
*   **Found Items Page (`FoundItems.tsx`)**:
    *   Add **"Claim / Notify Admin"** button to item cards.
    *   Action: Sends a claim request to admins.
*   **Lost Items Page (`LostItems.tsx`)**:
    *   Add **"Notify Owner"** button (Visible to **Admins Only**).
    *   Action: Sends "Item Found" notification to the original reporter.

### Admin Dashboard Updates
*   **Notifications Section**: A new panel to view incoming claim requests.
*   **Reply Action**: Ability for Admins to click a notification and send a custom response (e.g., "Please come to the office to verify").

## 4. Verification Steps
1.  **User -> Admin Claim**: User clicks "Claim" on a Found Item; Admin receives notification.
2.  **Admin -> User Response**: Admin replies to the claim; User receives notification.
3.  **Admin -> User Found Alert**: Admin clicks "Notify Owner" on a Lost Item; Owner receives "Item Found" alert.
