const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/reset-password', authController.resetPassword);
// Tambahin baris ini buat ngatur rute ngambil data jurusan (pakai GET karena cuma minta data)
router.get('/jurusan', authController.getJurusan); 

module.exports = router;