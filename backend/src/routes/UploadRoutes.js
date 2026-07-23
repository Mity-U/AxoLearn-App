const express = require('express');
const multer = require('multer');
const router = express.Router();

// 1. Ngatur si kuli panggul (Multer) mau naruh barang di mana
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Arahin ke folder uploads yang barusan kita bikin
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        // Kasih nama unik biar kalau ada file yang namanya sama nggak saling timpa
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// 2. Bikin pintu masuk (metode POST) khusus buat nerima file
// Kata 'materi' di bawah ini adalah nama kunci (key) yang harus disamain pas frontend ngirim data
router.post('/', upload.single('materi'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'gagal' });
    }

    // Kalau sukses, balikin pesan ke frontend
    res.status(200).json({
        message: 'berhasil!!',
        fileInfo: req.file // Balikin info filenya biar bisa kita cek
    });
});

module.exports = router;