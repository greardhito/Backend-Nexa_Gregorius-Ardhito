const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const karyawanRoutes = require('./karyawanRoutes');

router.use('/login', authRoutes);
router.use('/karyawan', karyawanRoutes);

module.exports = router;
