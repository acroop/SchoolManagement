const db = require('../config/db');

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { name, address, latitude, longitude } = req.body;

        if (!name || !address || !latitude || !longitude) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const query = 'INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)';
        db.query(query, [name, address, latitude, longitude], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'School added successfully', schoolId: result.insertId });
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
