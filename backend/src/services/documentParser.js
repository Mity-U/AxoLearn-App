const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function extractText(filePath, mimetype) {
    try {
        if (mimetype === 'application/pdf') {
            const dataBuffer = fs.readFileSync(filePath);
            const data = await pdfParse(dataBuffer);
            return data.text;
        }
        else if (
            mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
            mimetype === 'application/msword'
        ) {
            const result = await mammoth.extractRawText({ path: filePath });
            return result.value;
        }
        else {
            throw new Error('Tipe dokumen ini belum bisa dibaca nih.');
        }
    } catch (error) {
        console.error('Gagal mengekstrak teks:', error);
        throw error;
    }
}

module.exports = { extractText };