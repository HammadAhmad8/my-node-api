// Load environment variables first
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose'); // ✅ MongoDB enabled
const cors = require('cors');
const multer = require('multer');
const TaskModel = require('./Task'); // path 

const app = express();
const PORT = process.env.PORT || 3003; 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const upload = multer();

/* ---------------- MongoDB Connection ---------------- */
const mongoURI = "mongodb+srv://HAMMAD:Qazi123@notes.5fcl9g9.mongodb.net/myTasksDB?retryWrites=true&w=majority&appName=notes";

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

/* ---------------- PostgreSQL Connection (Commented for backup) ----------------
const pool = require('./db');
--------------------------------------------------------------------------------- */

// Routes using MongoDB model

// Get all notes
app.get('/api/notes', async (req, res) => {
  try {
    const tasks = await TaskModel.find();
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error fetching notes', error: err.message });
  }
});

// Add a new note
app.post('/api/notes', upload.none(), async (req, res) => {
  try {
    const { title, description, author } = req.body;
    if (!title || !description || !author) {
      return res.status(400).json({ message: '⚠️ All fields are required' });
    }
    const newTask = new TaskModel({ title, description, author });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error adding note', error: err.message });
  }
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deleted = await TaskModel.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: '❌ Note not found' });
    }
    res.status(200).json({ message: '✅ Note deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error deleting note', error: err.message });
  }
});

// Update a note
app.put('/api/notes/:id', upload.none(), async (req, res) => {
  try {
    const { title, description, author } = req.body;
    if (!title || !description || !author) {
      return res.status(400).json({ message: '⚠️ All fields are required' });
    }
    const updated = await TaskModel.findByIdAndUpdate(
      req.params.id,
      { title, description, author },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: '❌ Note not found' });
    }
    res.status(200).json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: '❌ Error updating note', error: err.message });
  }
});

// Root test route
app.get('/', (req, res) => {
  res.send('✅ Backend is working with MongoDB Atlas. Use /api/notes for data.');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
