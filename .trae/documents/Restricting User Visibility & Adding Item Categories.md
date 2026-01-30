# Privacy & Data Structure Update Plan

## 1. Database Schema Updates
- **Modify `Item` Model**:
  - Add `category` field (String, required).
  - Add `color` field (String, optional).
- **Action**: Update `prisma/schema.prisma` and run database migration.

## 2. Backend Logic Updates
- **Update Item Creation**:
  - Modify `createLostItem` and `createFoundItem` in `itemController.js` to accept and save `category` and `color`.
- **Update Item Retrieval (Privacy Filter)**:
  - Modify `getLostItems` and `getFoundItems` in `itemController.js`.
  - **Logic**:
    - If User is **Admin**: Return full details (Location, Description, Contact, Images, etc.).
    - If User is **Normal User**: Return **only** `Category`, `Date`, `Color`, and `Status`. Exclude `Location`, `Description`, `Image`, and `Contact Info`.

## 3. Frontend Implementation
- **Update Report Forms** (`CreateLostItem.tsx`, `CreateFoundItem.tsx`):
  - Add a **Category Dropdown** (Options: Device, Bag, Keys, Clothing, Other).
  - Add a **Color Selection** input (Optional).
- **Update List Views** (`LostItems.tsx`, `FoundItems.tsx`):
  - **Admin View**: Show full table with all details and images.
  - **User View**: Show a simplified list containing only:
    - **Category** (with icon)
    - **Color**
    - **Date Reported**
    - **Status**
  - **Hide** the "Location" column and detail view buttons for normal users.

## 4. Verification
- Verify that normal users cannot see sensitive data in the API response network tab.
- Verify admins can still see all information to manage items.
- Test creating items with the new categories and colors.