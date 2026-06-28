import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const DB_FILE = path.join(process.cwd(), 'backend', 'students.json');

  // Middleware
  app.use(cors());
  app.use(express.json());

  // Helper to read database
  const readStudents = () => {
    try {
      if (!fs.existsSync(DB_FILE)) {
        // Ensure folder exists and write empty array
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
        fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
        return [];
      }
      const data = fs.readFileSync(DB_FILE, 'utf8');
      return JSON.parse(data || '[]');
    } catch (error) {
      console.error('Error reading students database in server.ts:', error);
      return [];
    }
  };

  // Helper to write database
  const writeStudents = (students: any[]) => {
    try {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(students, null, 2), 'utf8');
      return true;
    } catch (error) {
      console.error('Error writing to students database in server.ts:', error);
      return false;
    }
  };

  // --- API Routes ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', database: DB_FILE });
  });

  // GET all students
  app.get('/students', (req, res) => {
    const students = readStudents();
    res.status(200).json(students);
  });

  // GET single student
  app.get('/students/:id', (req, res) => {
    const students = readStudents();
    const student = students.find((s: any) => s.id === req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: `Student with ID ${req.params.id} not found.` });
    }
    res.status(200).json(student);
  });

  // POST create student
  app.post('/students', (req, res) => {
    const { id, name, department, year, email, phone } = req.body;
    
    if (!id || !name || !department || !year || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields (id, name, department, year, email, phone) are required.' });
    }

    const students = readStudents();
    if (students.some((s: any) => s.id === id)) {
      return res.status(409).json({ success: false, message: `Student with ID ${id} already exists.` });
    }

    const newStudent = { id, name, department, year, email, phone };
    students.push(newStudent);
    
    if (writeStudents(students)) {
      res.status(201).json({ success: true, message: 'Student registered successfully.', data: newStudent });
    } else {
      res.status(500).json({ success: false, message: 'Failed to write to database.' });
    }
  });

  // PUT update student
  app.put('/students/:id', (req, res) => {
    const { name, department, year, email, phone } = req.body;
    const targetId = req.params.id;

    if (!name || !department || !year || !email || !phone) {
      return res.status(400).json({ success: false, message: 'All fields (name, department, year, email, phone) are required.' });
    }

    const students = readStudents();
    const index = students.findIndex((s: any) => s.id === targetId);
    
    if (index === -1) {
      return res.status(404).json({ success: false, message: `Student with ID ${targetId} not found.` });
    }

    students[index] = { id: targetId, name, department, year, email, phone };

    if (writeStudents(students)) {
      res.status(200).json({ success: true, message: 'Student updated successfully.', data: students[index] });
    } else {
      res.status(500).json({ success: false, message: 'Failed to update database.' });
    }
  });

  // DELETE student
  app.delete('/students/:id', (req, res) => {
    const targetId = req.params.id;
    const students = readStudents();
    const filtered = students.filter((s: any) => s.id !== targetId);

    if (filtered.length === students.length) {
      return res.status(404).json({ success: false, message: `Student with ID ${targetId} not found.` });
    }

    if (writeStudents(filtered)) {
      res.status(200).json({ success: true, message: `Student with ID ${targetId} deleted successfully.` });
    } else {
      res.status(500).json({ success: false, message: 'Failed to delete student.' });
    }
  });

  // --- Vite / Static Assets Handling ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
