# Student Management System

A beautiful, production-ready, full-stack Student Management System application. It is designed to illustrate RESTful API patterns and integrates a responsive frontend user interface with a Node.js Express backend using standard JSON file storage.

The repository supports two complete variations:
1. **Full-stack Single Page React + Tailwind UI** (configured at the root level using Vite + Framer Motion).
2. **Standalone HTML5, CSS3, & Vanilla JavaScript UI** (located inside the `frontend/` and `backend/` folders).

---

## 🚀 Key Features

*   **Complete REST API CRUD Operations**: Fully supports creation, readings, updates, and deletes.
*   **Intuitive Search and Filtration**: Real-time searching by Student ID, name, email, and department, along with dedicated department filters.
*   **Dynamic Interactive Statistics**: Live count of total enrollments and department categories.
*   **Polished User Interfaces**: Styled with professional, modern elements, animations, modals, and fully adaptive mobile-first grids.
*   **Reliable Feedback Systems**: Self-dismissing toast notifications and modal confirmation checkpoints before deletion events.
*   **Persistent Storage**: Automatic read/write streaming to a local `students.json` database.

---

## 🛠️ Technology Stack

### Frontend Variations:
*   **Option A (Modern Dashboard)**: React, Tailwind CSS, Framer Motion, Lucide Icons, Vite
*   **Option B (Classic Vanilla)**: HTML5, CSS3 (variables, grid, flexbox), Vanilla ES6 JavaScript

### Backend:
*   **Engine**: Node.js & Express.js
*   **Security/Middleware**: CORS enabled, JSON Parser
*   **Database**: JSON file stream (`students.json`)

---

## 📂 Folder Structure

```text
Student-Management-System/
├── backend/                   # Standalone Backend Folder
│   ├── package.json           # Backend node configurations
│   ├── server.js              # Express REST API routes & static server
│   └── students.json          # Persistent JSON database
│
├── frontend/                  # Standalone Frontend Folder
│   ├── index.html             # UI Structure (Semantics & Modals)
│   ├── style.css              # Custom layout, animations, variables
│   └── script.js              # Vanilla Fetch API handlers
│
├── src/                       # Root React SPA Directory
│   ├── App.tsx                # Gorgeous React App Component
│   ├── index.css              # Tailwind Imports
│   └── main.tsx               # Client entrypoint
│
├── API_Documentation.md       # API Specification sheet
├── package.json               # Full-stack root package
├── server.ts                  # Root Full-stack Express Entry point
├── vite.config.ts             # Vite Configurations
└── README.md                  # Project Information
```

---

## 📦 Installation & Setup

Ensure you have [Node.js](https://nodejs.org/) (version 18+ recommended) installed.

### Option 1: Running the Root Full-Stack React Version
The root version compiles and runs a modern React dashboard bundled with Vite and Express.

1.  **Install dependencies**:
    ```bash
    npm install
    ```
2.  **Start development server**:
    ```bash
    npm run dev
    ```
3.  **Open in browser**:
    Navigate to `http://localhost:3000` inside your browser.

4.  **Production build**:
    ```bash
    npm run build
    npm start
    ```

---

### Option 2: Running the Standalone Vanilla JS Version
If you prefer running the pure, beginner-friendly HTML5/CSS3/Vanilla JS version from the dedicated folders:

1.  **Navigate into the backend**:
    ```bash
    cd backend
    ```
2.  **Install backend dependencies**:
    ```bash
    npm install
    ```
3.  **Run backend server**:
    ```bash
    npm start
    # or for development:
    npm run dev
    ```
4.  **Access the application**:
    Open `http://localhost:3000` in your web browser. The backend server automatically hosts and delivers the `frontend/` directory statically on the root route!

---

## 🌐 API Endpoints

A detailed API mapping is available in **[API_Documentation.md](API_Documentation.md)**. Summary:

*   `GET /students` - Retrieves all student records.
*   `GET /students/:id` - Retrieves a single student record matching the unique ID.
*   `POST /students` - Registers a new student (Requires `id`, `name`, `department`, `year`, `email`, `phone`).
*   `PUT /students/:id` - Updates an existing student's details.
*   `DELETE /students/:id` - Removes a student from records.

---

## 📸 Screenshots

*(Add screenshots here when hosting or deploying to GitHub)*
-   **Dashboard Main View**: High-contrast, responsive list of current student enrollments, status badges, and aggregate statistics cards.
-   **Registration Form Dialog**: Sleek sliding drawer modal with validated form fields.
-   **Delete Checkpoint**: Safety dialog blocking accidental deletes.

---

## 🔮 Future Enhancements
*   **Database Migrations**: Add seamless migration from `students.json` to real-world cloud relational databases or MongoDB.
*   **User Accounts & Auth**: Add sign-in/sign-up authentication gates using JWT or Firebase Authentication.
*   **Grade Book Module**: Add student marks, performance analysis, GPA calculations, and dynamic graphs.
*   **Export Options**: Allow administrators to export current grids into CSV, PDF, or Excel sheets.

---

## ✍️ Author Information
*   **Author**: Google AI Studio AI Developer
*   **License**: Licensed under the Apache-2.0 License.
