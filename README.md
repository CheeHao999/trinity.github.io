# Trinity - Campus Lost & Found System

Trinity is a comprehensive web application designed to help university campuses manage lost and found items efficiently. It connects students and staff, allowing them to report lost items and view found items in real-time.

## 🚀 Features

*   **User Authentication**: Secure registration and login system for students/staff.
*   **Privacy-Aware Listings**: Normal users see only Category, Color, and Date; Admins see full details (location, description, contact, images).
*   **Lost/Found Reporting**: Include Item Category (Device, Bag, Keys, Clothing, Other) and optional Color.
*   **Admin Tools**: Notify lost item owner and view Recent Activity feed.
*   **Smart Matching**: (Potential) Auto-suggestions for matching lost and found items.
*   **Responsive Design**: Modern UI built with Tailwind CSS, optimized for mobile and desktop.
*   **RESTful API**: Robust backend API documented with Swagger.

## What's New (Jan 2026)

- Privacy-aware listings: users see Category/Color/Date only; admins see full details and actions.
- Item reporting now includes Category (Device, Bag, Keys, Clothing, Other) and optional Color.
- Admin-only "Notify Owner" action added for Lost items.
- Admin Dashboard: Recent Activity feed added; "Review Pending Reports" quick action removed.

## 🛠️ Tech Stack

### Frontend
*   **Framework**: React (TypeScript)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS
*   **State Management**: React Context API
*   **Testing**: Vitest, React Testing Library, Playwright (E2E)

### Backend
*   **Runtime**: Node.js
*   **Framework**: Express.js
*   **Database**: PostgreSQL
*   **ORM**: Prisma
*   **Authentication**: JWT & Bcrypt
*   **Testing**: Jest, Supertest
*   **Documentation**: Swagger UI

## 📋 Prerequisites

Before running the project, ensure you have the following installed:
*   [Node.js](https://nodejs.org/) (v16 or higher)
*   [PostgreSQL](https://www.postgresql.org/)
*   [Git](https://git-scm.com/)

## ⚡ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/CheeHao999/trinity.git
cd trinity
```

### 2. Backend Setup
The backend handles API requests and database interactions.

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Environment Variables**:
    Create a `.env` file in the root directory and add your database connection string and JWT secret:
    ```env
    DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/trinity_db?schema=public"
    JWT_SECRET="your_super_secret_key"
    PORT=3000
    ```

3.  **Database Migration**:
    Initialize the database schema using Prisma:
    ```bash
    npx prisma migrate dev --name init
    ```

4.  **Start the Server**:
    ```bash
    npm run dev
    ```
    The backend server will start at `http://localhost:3000`.
    *   **API Documentation**: Visit `http://localhost:3000/api-docs` to view Swagger docs.

### 3. Frontend Setup
The frontend is a React application located in the `frontend` folder.

1.  **Navigate to Frontend Directory**:
    ```bash
    cd frontend
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start Development Server**:
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## 📂 Project Structure

The project follows a **Feature-Based Architecture** to ensure scalability and maintainability.

### Backend (`/src`)
*   **`login/`**: Authentication logic (Controllers, Routes, Middleware).
*   **`dashboard/`**: Item management logic (Lost & Found items).
*   **`shared/`**: Shared utilities (Prisma Client, Configs).

### Frontend (`/frontend/src`)
*   **`login/`**: Login & Register pages, Auth Context.
*   **`dashboard/`**: Home, Lost Items, Found Items pages.
*   **`shared/`**: Reusable components (`Layout`), API clients, Hooks, and Types.

## 🧪 Running Tests

### Backend Tests
Run unit and integration tests for the API:
```bash
npm test
```

### Frontend Tests
Run component and logic tests:
```bash
cd frontend
npm run test
```

## 📄 License
This project is licensed under the ISC License.
