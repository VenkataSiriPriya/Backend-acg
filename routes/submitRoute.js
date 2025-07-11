const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`)
});

const upload = multer({ storage });

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

module.exports = router;
