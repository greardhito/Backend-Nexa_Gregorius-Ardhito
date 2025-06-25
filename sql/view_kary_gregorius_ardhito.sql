CREATE OR REPLACE VIEW karyawan_gregorius_ardhito AS
SELECT
    nip AS Nip,
    nama AS Nama,
    alamat AS Alamat,
    CASE gend
        WHEN 'L' THEN 'Laki - Laki'
        WHEN 'P' THEN 'Perempuan'
        ELSE 'Tidak Diketahui'
    END AS Gend,
    DATE_FORMAT(tgl_lahir, '%d %M %Y') AS `Tanggal Lahir`
FROM karyawan
