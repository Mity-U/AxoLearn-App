// backend/src/controllers/authController.js
const db = require('../models/db');

// Fungsi buat Register
const register = (req, res) => {
    const { username, phoneNumber, password, jurusan } = req.body;

    const query = 'INSERT INTO users (username, phone_number, password, jurusan) VALUES (?, ?, ?, ?)';
    
    db.query(query, [username, phoneNumber, password, jurusan], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Gagal bikin akun. Mungkin Nomor HP udah terdaftar.' });
        }
        res.json({ success: true, message: 'Akun berhasil dibuat! Silakan login.' });
    });
};

// Fungsi buat Login
const login = (req, res) => {
    const { phoneNumber, password } = req.body;

    const query = 'SELECT * FROM users WHERE phone_number = ? AND password = ?';
    
    db.query(query, [phoneNumber, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Server lagi error nih.' });
        }

        if (results.length > 0) {
            res.json({ success: true, message: 'Login berhasil, gas masuk!' });
        } else {
            res.status(401).json({ success: false, message: 'Nomor HP atau kata sandi salah.' });
        }
    });
};

// Tambahin fungsi ini buat ngambil list jurusan
const getJurusan = (req, res) => {
    const query = 'SELECT * FROM daftar_jurusan';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Gagal ngambil data jurusan' });
        }
        res.json({ success: true, data: results });
    });
};

// Fungsi buat Lupa Password (Reset Password)
const resetPassword = (req, res) => {
    const { phoneNumber, newPassword } = req.body;

    // Cek dulu, nomor HP-nya ada nggak di database?
    const checkQuery = 'SELECT * FROM users WHERE phone_number = ?';
    
    db.query(checkQuery, [phoneNumber], (err, results) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Server lagi error.' });
        }

        // Kalau datanya kosong (nomor HP nggak ketemu)
        if (results.length === 0) {
            return res.status(404).json({ success: false, message: 'Nomor HP belum terdaftar nih.' });
        }

        // Kalau nomornya ketemu, kita update/timpa kata sandi lamanya
        const updateQuery = 'UPDATE users SET password = ? WHERE phone_number = ?';
        db.query(updateQuery, [newPassword, phoneNumber], (err, result) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Gagal mengganti kata sandi.' });
            }
            res.json({ success: true, message: 'Kata sandi berhasil direset! Silakan login.' });
        });
    });
};

// Jangan lupa daftarin fungsinya di export
module.exports = { register, login, getJurusan, resetPassword };
