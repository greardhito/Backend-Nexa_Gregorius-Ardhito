const jwt = require('jsonwebtoken');
const db = require('../models/db');

module.exports = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if(!authHeader) return res.status(401).json({ message: 'Token is needed' });

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [rows] = await db.query('SELECT * FROM admin_token WHERE token = ?', [token]);
        if (rows.length === 0) return res.status(401).json({ message: 'Invalid token '});

        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token expired or invalid' });
    }
}