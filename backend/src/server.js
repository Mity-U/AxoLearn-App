require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Panggil rute auth
const fs = require('fs');
const mammoth = require('mammoth');
const pdfParse = require('pdf-parse');
const { generateQuiz } = require('./services/aiService'); // Panggil fungsi generateQuiz dari aiService.js
const app = express();

// Biar React (frontend) bisa ngobrol sama API (backend) tanpa diblokir
app.use(cors());
// Biar bisa ngebaca data yang dikirim dalam bentuk JSON
app.use(express.json());

// Daftarin rute login & register di jalur /api/auth
app.use('/api/auth', authRoutes);

// Nyalain server di port 5000
const PORT = 5000;

// ... (kodingan sebelumnya yang udah ada di server.js) ...
const multer = require('multer');
const path = require('path');

// 1. Konfigurasi Multer (Mau disimpan di mana dan namanya apa)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Pastikan folder 'uploads' udah kamu bikin di dalam folder 'backend'
    },
    filename: function (req, file, cb) {
        // Bikin nama file unik pakai tanggal biar nggak ketimpa kalau namanya sama
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// 2. Bikin Rute (Endpoint) buat nerima file
// Perhatikan URL-nya: '/api/upload' harus sama persis kayak yang ditembak sama React
app.post('/api/upload', upload.single('file'), async (req, res) => {
    // Kalau nggak ada file yang nyangkut, tolak
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'Nggak ada file yang di-upload nih.' });
    }

    try {
        console.log("File mendarat, mulai mengekstrak teks...");
        let teksDokumen = "";

        // Baca isi file tergantung formatnya (PDF atau DOCX)
        if (req.file.mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(req.file.path);
            const data = await pdfParse(dataBuffer);
            teksDokumen = data.text;
        } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ path: req.file.path });
            teksDokumen = result.value;
        } else {
            return res.status(400).json({ success: false, message: 'Format file salah, wajib PDF atau DOCX.' });
        }

        if (!teksDokumen || teksDokumen.trim() === '') {
            return res.status(400).json({ success: false, message: 'Dokumennya kosong atau nggak terbaca teksnya.' });
        }

        console.log("Teks berhasil diekstrak, AI sedang meracik soal...");

        // Panggil fungsi sakti buatanmu kemarin! 
        // (Kita batasi teksnya dikit biar API-nya nggak kepanjangan/error batas token)
        const dataKuis = await generateQuiz(teksDokumen.substring(0, 8000));

        // Kirim amunisi kuis ke frontend!
        res.json({
            success: true,
            message: 'Mantap! File berhasil diolah jadi kuis.',
            filePath: `/uploads/${req.file.filename}`,
            kuis: dataKuis // Ini dia obat penangkal pesan hantu "arena kuis kosong"!
        });

    } catch (error) {
        console.error("Wah, ada error pas mikir soal:", error);
        res.status(500).json({ success: false, message: 'Server gagal meracik kuis dari dokumenmu.' });
    }
});

app.listen(PORT, () => {
    console.log(`Backend udah jalan di http://localhost:${PORT}`);
});