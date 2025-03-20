import db from '../db.js';
import { calculateDistance } from '../utils/distanceCalculator.js';

// Add School
export const addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || !latitude || !longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({ error: 'Latitude and longitude must be numbers' });
  }

  const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
  db.query(query, [name, address, latitude, longitude], (err, result) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });
    res.status(201).json({ message: 'School added successfully', id: result.insertId });
  });
};

// List Schools (Sorted by Distance)
export const listSchools = (req, res) => {
  const { latitude, longitude, limit = 5 } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  if (isNaN(userLat) || isNaN(userLon)) {
    return res.status(400).json({ error: 'Latitude and longitude must be valid numbers' });
  }

  db.query('SELECT * FROM schools', (err, results) => {
    if (err) return res.status(500).json({ error: 'Database error', details: err });

    const sortedSchools = results.map((school) => {
      school.distance = calculateDistance(userLat, userLon, school.latitude, school.longitude);
      return school;
    }).sort((a, b) => a.distance - b.distance).slice(0, parseInt(limit));

    res.status(200).json(sortedSchools);
  });
};
