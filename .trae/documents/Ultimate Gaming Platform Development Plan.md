I will reorganize your files so that everything related to a specific topic is in its own folder, matching your example.

### **1. Frontend (`frontend/src`)**

I will group files into these three folders:

* **`src/login/`** (For Login & Registration)

  * `Login.tsx`, `Register.tsx` (The pages)

  * `AuthContext.tsx` (The logic)

* **`src/dashboard/`** (For the Main App)

  * `Home.tsx`, `FoundItems.tsx`, `LostItems.tsx`

  * `CreateFoundItem.tsx`, `CreateLostItem.tsx`

* **`src/shared/`** (For common tools)

  * `Layout.tsx` (The main page structure)

  * `api/`, `types/`, `utils` (Helpers used everywhere)

### **2. Backend (`src`)**

I will do the same for the server code:

* **`src/login/`**: `authController.js`, `authRoutes.js`

* **`src/dashboard/`**: `itemController.js`, `itemRoutes.js`

* **`src/shared/`**: `prismaClient.js` (Database connection)

### **3. Fixing Links**

* I will automatically update all the code references (imports) so the files can still find each other in their new locations.

### **4. Verification**

* I will run the tests to confirm everything still works correctly.

