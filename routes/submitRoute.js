const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

// Route: Submit a new place
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const {
      place_name,
      place_type,
      address,
      city,
      features,
      comments
    } = req.body;

    const imagePath = req.file ? req.file.filename : null;
    const featuresArray = typeof features === 'string' ? [features] : features;

    const result = await pool.query(
      `INSERT INTO places (place_name, place_type, address, city, features, comments, image)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [place_name, place_type, address, city, featuresArray, comments, imagePath]
    );

    res.status(201).json({ message: 'Place submitted successfully', place: result.rows[0] });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route: Get all submitted places
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM places ORDER BY created_at DESC`);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route: Approve or reject a place
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'

  try {
    const result = await pool.query(
      `UPDATE places SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
