const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const db = require('../models/db');

const rawKey = process.env.AES_KEY; 
const keyBuffer = Buffer.alloc(16, 0); 
Buffer.from(rawKey).copy(keyBuffer); 

function decrypt(encrypted) {
    const decipher = crypto.createDecipheriv('aes-128-ecb', keyBuffer, null);
    decipher.setAutoPadding(true);
    let decrypted = decipher.update(encrypted, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}
const login = async (req, res) => {
    const { username , password } = req.body;

    try {
        const [rows] = await db.query('SELECT * FROM admin WHERE username = ?', [username]);
        if (rows.length === 0) return res.status(401).json({ message: 'User tidak ditemukan '});

        const admin = rows[0];
        const decryptedPassword = decrypt(admin.password);

        if (decryptedPassword !== password) {
            return res.status(401).json({ message: 'Password salah'});
        }

        const token = jwt.sign({ id:admin.id, username: admin.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        
        await db.query('INSERT INTO admin_token (token) VALUES (?)', [token]);

        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message : 'Login error'});
    }
}

module.exports = {login};
