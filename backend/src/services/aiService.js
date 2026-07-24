const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Masukkan tiket API Key dari file .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. Fungsi untuk menyuruh Gemini bikin kuis
async function generateQuiz(text) {
    try {
        // Kita pakai model gemini-1.5-flash karena cepat dan pintar
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // 3. Ini "Prompt" alias instruksi sakti buat AI-nya
        const prompt = `
    Kamu adalah asisten pembuat kuis cerdas.
    Tugasmu adalah membuat 3 soal pilihan ganda berdasarkan teks materi di bawah ini.
    
    ATURAN SANGAT PENTING: 
    Kamu HANYA Boleh membalas dengan format JSON murni berbentuk array of objects seperti contoh di bawah ini. Jangan tambahkan teks basa-basi apapun sebelum atau sesudah JSON!
    
    Contoh Output yang Diharapkan:
    [
      {
        "soal": "Apa ibukota Indonesia?",
        "opsi": ["Jakarta", "Bandung", "Surabaya", "Medan"],
        "jawaban_benar": "Jakarta"
      }
    ]
    
    Teks materi:
    ${text}
    `;

        // 4. Kirim instruksi ke Gemini dan tunggu balasannya
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let textResponse = response.text();

        // 5. Bersihkan balasan dari format markdown ```json ... ``` (karena AI suka iseng nambahin)
        textResponse = textResponse.replace(/```json/gi, "").replace(/```/gi, "").trim();

        // 6. Ubah teks JSON menjadi objek data yang bisa dibaca Node.js
        return JSON.parse(textResponse);

    } catch (error) {
        console.error("Gagal menyuruh AI bikin kuis:", error);
        throw error;
    }
}

module.exports = { generateQuiz };