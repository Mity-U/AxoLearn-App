const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
// Kita pakai port 5000 untuk backend (karena 5173 udah dipakai frontend)
const PORT = process.env.PORT || 5000;

// Middleware (Satpam & Penerjemah)
app.use(cors());
app.use(express.json());

// Panggil file route yang baru kita bikin
const uploadRoutes = require('./routes/uploadRoutes');

// Daftarin jalurnya dengan awalan '/api/upload'
app.use('/api/upload', uploadRoutes);

// Route sederhana buat ngetes server
app.get('/', (req, res) => {
    res.send('berhasil');
});

// Menyalakan server
app.listen(PORT, () => {
    console.log(`[SERVER] Backend AxoLearn running di http://localhost:${PORT}`);
});