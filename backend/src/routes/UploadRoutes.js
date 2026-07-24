const express = require('express');
const multer = require('multer');
const { extractText } = require('../services/documentParser');
const { generateQuiz } = require('../services/aiService'); // Panggil service AI-nya
const router = express.Router();

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

router.post('/', upload.single('materi'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Waduh, nggak ada file yang masuk nih!' });
    }

    try {
        const filePath = req.file.path;
        const fileType = req.file.mimetype;

        console.log('1. Membaca isi dokumen...');
        const extractedText = await extractText(filePath, fileType);

        console.log('2. Menyuruh Gemini membuat soal kuis (tunggu sebentar)...');
        // Supaya AI-nya nggak pusing baca teks kepanjangan, kita batasi baca 3000 karakter pertama aja
        const textForAI = extractedText.substring(0, 3000);
        const quizData = await generateQuiz(textForAI);

        console.log('3. Yey! Kuis berhasil dibuat oleh AI:');
        console.log(quizData); // Cetak hasil kuis di terminal

        // Kirim soal kuis yang udah jadi ke frontend
        res.status(200).json({
            message: 'Materi berhasil diubah jadi kuis!',
            kuis: quizData
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server ngadat pas nyoba bikin kuis dari materi.' });
    }
});

module.exports = router;