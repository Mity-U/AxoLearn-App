const express = require('express');
const multer = require('multer');
const { extractText } = require('../services/documentParser'); // Panggil si tukang baca
const router = express.Router();

// Setting Multer (Gudang penyimpanan sementara)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Pintu masuk /api/upload
router.post('/', upload.single('materi'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Waduh, nggak ada file yang masuk nih!' });
    }

    try {
        // 1. Ambil lokasi file dan tipe filenya
        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        // 2. Suruh service documentParser buat baca isinya
        const extractedText = await extractText(filePath, fileType);

        // 3. Tampilkan sebagian teks di terminal server buat ngecek aja
        console.log('--- HASIL BACAAN SEMENTARA ---');
        console.log(extractedText.substring(0, 200) + '... [lanjutannya masih panjang]');
        console.log('------------------------------');

        // 4. Balikin respons sukses ke frontend
        res.status(200).json({
            message: 'Mantap, file berhasil dibaca mesin!',
            // Nanti teks ini nggak perlu dikirim balik ke frontend, tapi untuk sekarang biar ketahuan aja
            previewTeks: extractedText.substring(0, 100)
        });

    } catch (error) {
        res.status(500).json({ message: 'Server gagal membaca isi file dokumen.' });
    }
});

module.exports = router;