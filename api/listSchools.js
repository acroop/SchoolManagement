const db = require('../config/db');

const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = angle => (Math.PI / 180) * angle;
    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export default function handler(req, res) {
    if (req.method === 'GET') {
        const { latitude, longitude } = req.query;

        if (!latitude || !longitude) {
            return res.status(400).json({ message: 'Latitude and longitude are required' });
        }

        const query = 'SELECT * FROM schools';
        db.query(query, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });

            const schoolsWithDistance = results.map(school => ({
                ...school,
                distance: haversineDistance(
                    parseFloat(latitude),
                    parseFloat(longitude),
                    school.latitude,
                    school.longitude
                ),
            }));

            schoolsWithDistance.sort((a, b) => a.distance - b.distance);
            res.status(200).json(schoolsWithDistance);
        });
    } else {
        res.status(405).json({ message: 'Method Not Allowed' });
    }
}
