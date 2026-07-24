// backend/src/server.js
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes'); // Panggil rute auth

const app = express();

// Biar React (frontend) bisa ngobrol sama API (backend) tanpa diblokir
app.use(cors());
// Biar bisa ngebaca data yang dikirim dalam bentuk JSON
app.use(express.json());

// Daftarin rute login & register di jalur /api/auth
app.use('/api/auth', authRoutes);

// Nyalain server di port 5000
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Backend udah jalan di http://localhost:${PORT}`);
});