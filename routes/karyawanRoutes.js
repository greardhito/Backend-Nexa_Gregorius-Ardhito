const express = require('express');
const router = express.Router();
const multer = require('multer');
const uploadImg = multer();
const auth = require('../middlewares/authMiddleware');
const karyawanController = require('../controllers/karyawanController');

router.post('/', auth, uploadImg.single('photo'), karyawanController.tambahKaryawan);
router.get('/', auth, karyawanController.getKaryawan);
router.put('/:nip', auth, karyawanController.updateKaryawan);
router.patch('/nonaktif/:nip', auth, karyawanController.nonaktifkanKaryawan);

module.exports = router;