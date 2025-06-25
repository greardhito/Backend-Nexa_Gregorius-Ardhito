DELIMITER //

CREATE PROCEDURE sp_add_kary_gregorius_ardhito (
    IN p_nip VARCHAR(20),
    IN p_nama VARCHAR(100),
    IN p_alamat TEXT,
    IN p_gend CHAR(1),
    IN p_photo TEXT,
    IN p_tgl_lahir DATE,
    IN p_status INT,
    IN p_id INT
)
BEGIN
    DECLARE v_request TEXT;
    DECLARE v_response TEXT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET v_request = JSON_OBJECT(
            'nip', p_nip,
            'nama', p_nama,
            'alamat', p_alamat,
            'gend', p_gend,
            'tgl_lahir', p_tgl_lahir,
            'status', p_status,
            'id', p_id
        );

        SET v_response = JSON_OBJECT(
            'status', 'FAILED',
            'message', 'SQL Error occurred during insert'
        );

        ROLLBACK;

        INSERT INTO log_trx_api(user_id, api, request, response, insert_at)
        VALUES (p_nip, 'sp_add_kary_gregorius_ardhito', v_request, v_response, NOW());
    END;

    START TRANSACTION;

    SET v_request = JSON_OBJECT(
        'nip', p_nip,
        'nama', p_nama,
        'alamat', p_alamat,
        'gend', p_gend,
        'tgl_lahir', p_tgl_lahir,
        'status', p_status,
        'id', p_id
    );

    IF EXISTS (SELECT 1 FROM karyawan WHERE nip = p_nip) THEN
        SET v_response = JSON_OBJECT(
            'status', 'FAILED',
            'message', 'NIP already exists'
        );

        INSERT INTO log_trx_api(user_id, api, request, response, insert_at)
        VALUES (p_nip, 'sp_add_kary_gregorius_ardhito', v_request, v_response, NOW());

        ROLLBACK;
    ELSE
        INSERT INTO karyawan(nip, nama, alamat, gend, photo, tgl_lahir, status, id)
        VALUES(p_nip, p_nama, p_alamat, p_gend, p_photo, p_tgl_lahir, p_status, p_id);

        SET v_response = JSON_OBJECT(
            'status', 'SUCCESS',
            'message', 'Karyawan berhasil ditambahkan'
        );

        INSERT INTO log_trx_api(user_id, api, request, response, insert_at)
        VALUES (p_nip, 'sp_add_kary_gregorius_ardhito', v_request, v_response, NOW());

        COMMIT;
    END IF;
END;
//

DELIMITER ;