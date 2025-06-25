const db = require('../models/db');
const fs = require('fs');

const tambahKaryawan = async (req, res) => {
    const { nama, alamat, gend, tgl_lahir } = req.body;
    const photo = req.file;
    const admin_id = req.user.id;
    const admin_username = req.user.username;

    if (!photo) {
        return res.status(400).json({ message: 'Foto wajib diupload' });
    }

    const tahun = new Date().getFullYear();

    try {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM karyawan WHERE nip LIKE ?', [`${tahun}%`]);
        const count = rows[0].count + 1;
        const nip = `${tahun}${String(count).padStart(4, '0')}`;

        const photoBase64 = photo.buffer.toString('base64');

        await db.query(
            'INSERT INTO karyawan (nip, nama, alamat, gend, photo, tgl_lahir, status, insert_by, id) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)',
            [nip, nama, alamat, gend, photoBase64, tgl_lahir, admin_username, admin_id]
        );

        const newKaryawan = {
            nip: nip,
            nama: nama,
            alamat: alamat,
            gend: gend,
            tgl_lahir: tgl_lahir
        };

        res.json({ message: 'Karyawan berhasil ditambahkan', data: newKaryawan });
    } catch (err) {
        res.status(500).json({ message: 'Gagal menyimpan', error: err.message });
    }
};

const getKaryawan = async (req, res) => {
    const { keyword = '', start = 0, count = 10} = req.query;
    try {
        const [data] = await db.query(
            `SELECT * FROM karyawan WHERE nama LIKE ? LIMIT ?, ?`,
            [`%${keyword}%`, parseInt(start), parseInt(count)]
        );
        res.json(data);
    } catch (err) {
        res.status(500).json({ message: 'Data tidak ditemukan', error: err.message });
    }
};

const updateKaryawan = async (req, res) => {
    const { nip } =  req.params;
    const { nama, alamat, gend, photo, tgl_lahir } =  req.body;
    const admin_username = req.user.username;

    try {

        const [existing] = await db.query(`SELECT * FROM karyawan WHERE nip = ?`, [nip]);

        if (existing.length === 0) {
            return res.status(404).json({ message: 'Karyawan tidak ditemukan '});
        }

        const dataLama = existing[0];

        const baruNama = nama || dataLama.nama;
        const baruAlamat = alamat || dataLama.alamat;
        const baruGend = gend || dataLama.gend;
        const baruPhoto = photo || dataLama.photo;
        const baruTglLahir = tgl_lahir || dataLama.tgl_lahir;

        await db.query(
            `UPDATE karyawan SET nama=?, alamat=?, gend=?, photo=?, tgl_lahir=?, update_by=? WHERE nip=?`, [
                baruNama, baruAlamat, baruGend, baruPhoto, baruTglLahir, admin_username, nip
            ]
        );

        const dataBaru = {
            nip: nip,
            nama: baruNama,
            alamat: baruAlamat,
            gend: baruGend,
            tgl_lahir: baruTglLahir
        }
        res.json({ messsage : 'Data berhasil diupdate', data: dataBaru });
    } catch (err) {
        res.status(500).json({ message: 'Gagal update data', error: err.message});
    }
};

const nonaktifkanKaryawan = async (req, res) => {
    const { nip } = req.params;
    
    try {
        await db.query(
            `UPDATE karyawan SET status = 9 WHERE nip=?`, [nip]
        )
        res.json({ message: 'Karyawan berhasil dinonaktifkan'});
    } catch (err) {
        res.status(500).json({ message: 'Gagal menonaktifkan karyawan', error: err.message});
    }
};

module.exports = {
    tambahKaryawan,
    getKaryawan,
    updateKaryawan,
    nonaktifkanKaryawan
};