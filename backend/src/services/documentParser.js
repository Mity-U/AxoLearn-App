const fs = require('fs');
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

// Fungsi utama untuk membaca isi dokumen
async function extractText(filePath, mimetype) {
    try {
        // Kalau filenya PDF, pakai pdf-parse
        if (mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdf(dataBuffer);
            return data.text;
        }
        // Kalau filenya Word (.docx), pakai mammoth
        else if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        }
        // Kalau tipe file nggak dikenali
        else {
            throw new Error('Tipe dokumen ini belum bisa dibaca nih.');
        }
    } catch (error) {
        console.error('Gagal mengekstrak teks:', error);
        throw error;
    }
}

module.exports = { extractText };
