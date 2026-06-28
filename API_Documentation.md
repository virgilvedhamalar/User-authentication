# Student Management System - REST API Documentation

This API enables full CRUD (Create, Read, Update, Delete) management for student enrollment profiles. It operates securely on a local JSON file (`students.json`) serving structured JSON payload endpoints.

---

## Base URL
When running the development server locally, the API is available at:
`http://localhost:3000`

---

## Summary of Endpoints

| Endpoint | Method | Description | Request Body | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| [`GET /students`](#get-students) | `GET` | Retrieve all student profiles | None | `200` |
| [`GET /students/:id`](#get-student-by-id) | `GET` | Retrieve a single student by ID | None | `200`, `404` |
| [`POST /students`](#post-create-student) | `POST` | Register a new student profile | JSON Object | `201`, `400`, `409`, `500` |
| [`PUT /students/:id`](#put-update-student) | `PUT` | Update details of an existing student | JSON Object | `200`, `400`, `404`, `500` |
| [`DELETE /students/:id`](#delete-student) | `DELETE` | Remove a student profile from the records | None | `200`, `404`, `500` |

---

## Detailed Endpoint Reference

### 1. GET /students
Retrieve all registered student records currently in the database.

*   **Method:** `GET`
*   **Request Headers:** None
*   **Request Body:** None
*   **Success Response (200 OK):**
    ```json
    [
      {
        "id": "STU101",
        "name": "Alex Johnson",
        "department": "Computer Science",
        "year": "3rd Year",
        "email": "alex.johnson@example.com",
        "phone": "+1 (555) 019-2834"
      },
      {
        "id": "STU102",
        "name": "Emily Smith",
        "department": "Information Technology",
        "year": "2nd Year",
        "email": "emily.smith@example.com",
        "phone": "+1 (555) 014-9821"
      }
    ]
    ```

---

### 2. GET /students/:id
Retrieve details of a single student matching the unique ID parameter.

*   **Method:** `GET`
*   **URL Parameter:** `id` (e.g., `STU101`)
*   **Request Body:** None
*   **Success Response (200 OK):**
    ```json
    {
      "id": "STU101",
      "name": "Alex Johnson",
      "department": "Computer Science",
      "year": "3rd Year",
      "email": "alex.johnson@example.com",
      "phone": "+1 (555) 019-2834"
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "success": false,
      "message": "Student with ID STU999 not found."
    }
    ```

---

### 3. POST /students
Register a new student profile. All fields are mandatory, and the ID must be unique.

*   **Method:** `POST`
*   **Request Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "id": "STU106",
      "name": "Sarah Connor",
      "department": "Mechanical Engineering",
      "year": "1st Year",
      "email": "s.connor@example.com",
      "phone": "+1 (555) 018-7744"
    }
    ```
*   **Success Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Student registered successfully.",
      "data": {
        "id": "STU106",
        "name": "Sarah Connor",
        "department": "Mechanical Engineering",
        "year": "1st Year",
        "email": "s.connor@example.com",
        "phone": "+1 (555) 018-7744"
      }
    }
    ```
*   **Error Response (400 Bad Request):** (e.g., if one of the fields is missing)
    ```json
    {
      "success": false,
      "message": "All fields (id, name, department, year, email, phone) are required."
    }
    ```
*   **Error Response (409 Conflict):** (e.g., if ID already exists in the catalog)
    ```json
    {
      "success": false,
      "message": "Student with ID STU101 already exists."
    }
    ```

---

### 4. PUT /students/:id
Update an existing student profile. The URL parameter `id` designates the student, and the JSON payload contains updated details. The ID itself cannot be altered.

*   **Method:** `PUT`
*   **URL Parameter:** `id` (e.g., `STU106`)
*   **Request Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "name": "Sarah J. Connor",
      "department": "Computer Science",
      "year": "2nd Year",
      "email": "sconnor@example.com",
      "phone": "+1 (555) 018-9900"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Student updated successfully.",
      "data": {
        "id": "STU106",
        "name": "Sarah J. Connor",
        "department": "Computer Science",
        "year": "2nd Year",
        "email": "sconnor@example.com",
        "phone": "+1 (555) 018-9900"
      }
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "success": false,
      "message": "All fields (name, department, year, email, phone) are required."
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "success": false,
      "message": "Student with ID STU999 not found."
    }
    ```

---

### 5. DELETE /students/:id
Remove a student profile completely from the system.

*   **Method:** `DELETE`
*   **URL Parameter:** `id` (e.g., `STU106`)
*   **Request Body:** None
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Student with ID STU106 deleted successfully."
    }
    ```
*   **Error Response (404 Not Found):**
    ```json
    {
      "success": false,
      "message": "Student with ID STU999 not found."
    }
    ```

---

## Testing via Postman / curl

### 1. Get All Students
```bash
curl -X GET http://localhost:3000/students
```

### 2. Create Student
```bash
curl -X POST http://localhost:3000/students \
  -H "Content-Type: application/json" \
  -d '{"id":"STU110","name":"Alice Wonder","department":"Computer Science","year":"1st Year","email":"alice@example.com","phone":"+1-555-0987"}'
```

### 3. Update Student
```bash
curl -X PUT http://localhost:3000/students/STU110 \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Wonderland","department":"Information Technology","year":"2nd Year","email":"alice.w@example.com","phone":"+1-555-1111"}'
```

### 4. Delete Student
```bash
curl -X DELETE http://localhost:3000/students/STU110
```
