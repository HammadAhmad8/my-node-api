/*
---------------- MongoDB code (commented out) ----------------
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Task', taskSchema);
--------------------------------------------------------------
*/

// ---------------- PostgreSQL code ----------------
const pool = require('./db'); // ✅ Correct path

const TaskModel = {
  async getAll() {
    const result = await pool.query('SELECT * FROM notes ORDER BY id ASC');
    return result.rows;
  },

  async create({ title, description, author }) {
    const result = await pool.query(
      'INSERT INTO notes (title, description, author) VALUES ($1, $2, $3) RETURNING *',
      [title, description, author]
    );
    return result.rows[0];
  },

  async delete(id) {
    const result = await pool.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  },

  async update(id, { title, description, author }) {
    const result = await pool.query(
      'UPDATE notes SET title = $1, description = $2, author = $3 WHERE id = $4 RETURNING *',
      [title, description, author, id]
    );
    return result.rows[0];
  }
};

module.exports = TaskModel;
