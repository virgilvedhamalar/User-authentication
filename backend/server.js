/**
 * @file server.js
 * @description REST API server for the Student Management System.
 * Handles CRUD operations on a local JSON file (students.json).
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'students.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read students from JSON
const readStudents = () => {
  try {
    if (!fs.existsSync(DB_FILE)) {
      // If file doesn't exist, initialize with an empty array
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
      return [];
    }
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (error) {
    console.error('Error reading students database:', error);
    return [];
  }
};

// Helper function to write students to JSON
const writeStudents = (students) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(students, null, 2), 'utf8');
    return true;
  } catch (error) {
    console.error('Error writing to students database:', error);
    return false;
  }
};

// --- REST API ENDPOINTS ---

/**
 * @route GET /students
 * @desc Get all students
 */
app.get('/students', (req, res) => {
  const students = readStudents();
  res.status(200).json(students);
});

/**
 * @route GET /students/:id
 * @desc Get a single student by ID
 */
app.get('/students/:id', (req, res) => {
  const students = readStudents();
  const student = students.find(s => s.id === req.params.id);
  
  if (!student) {
    return res.status(404).json({ 
      success: false, 
      message: `Student with ID ${req.params.id} not found.` 
    });
  }
  
  res.status(200).json(student);
});

/**
 * @route POST /students
 * @desc Create a new student
 */
app.post('/students', (req, res) => {
  const { id, name, department, year, email, phone } = req.body;
  
  // Validate request body
  if (!id || !name || !department || !year || !email || !phone) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields (id, name, department, year, email, phone) are required." 
    });
  }
  
  const students = readStudents();
  
  // Check if student with the same ID already exists
  if (students.some(s => s.id === id)) {
    return res.status(409).json({ 
      success: false, 
      message: `Student with ID ${id} already exists.` 
    });
  }
  
  const newStudent = { id, name, department, year, email, phone };
  students.push(newStudent);
  
  if (writeStudents(students)) {
    res.status(201).json({
      success: true,
      message: "Student registered successfully.",
      data: newStudent
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error: Failed to write to database." 
    });
  }
});

/**
 * @route PUT /students/:id
 * @desc Update an existing student
 */
app.put('/students/:id', (req, res) => {
  const { name, department, year, email, phone } = req.body;
  const targetId = req.params.id;
  
  // Validate request body
  if (!name || !department || !year || !email || !phone) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields (name, department, year, email, phone) are required." 
    });
  }
  
  const students = readStudents();
  const studentIndex = students.findIndex(s => s.id === targetId);
  
  if (studentIndex === -1) {
    return res.status(404).json({ 
      success: false, 
      message: `Student with ID ${targetId} not found.` 
    });
  }
  
  // Update details (keep the ID unchanged)
  students[studentIndex] = {
    id: targetId,
    name,
    department,
    year,
    email,
    phone
  };
  
  if (writeStudents(students)) {
    res.status(200).json({
      success: true,
      message: "Student updated successfully.",
      data: students[studentIndex]
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error: Failed to update database." 
    });
  }
});

/**
 * @route DELETE /students/:id
 * @desc Delete a student
 */
app.delete('/students/:id', (req, res) => {
  const targetId = req.params.id;
  const students = readStudents();
  const initialLength = students.length;
  
  const filteredStudents = students.filter(s => s.id !== targetId);
  
  if (filteredStudents.length === initialLength) {
    return res.status(404).json({ 
      success: false, 
      message: `Student with ID ${targetId} not found.` 
    });
  }
  
  if (writeStudents(filteredStudents)) {
    res.status(200).json({
      success: true,
      message: `Student with ID ${targetId} deleted successfully.`
    });
  } else {
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error: Failed to delete student from database." 
    });
  }
});

// Serve frontend static assets if the user opens the URL from browser
const frontendPath = path.join(__dirname, '..', 'frontend');
if (fs.existsSync(frontendPath)) {
  app.use(express.static(frontendPath));
  app.get('*', (req, res) => {
    // Only serve index.html if request is not an api endpoint
    if (!req.url.startsWith('/students')) {
      res.sendFile(path.join(frontendPath, 'index.html'));
    }
  });
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Student Management System API server is running on http://0.0.0.0:${PORT}`);
});
