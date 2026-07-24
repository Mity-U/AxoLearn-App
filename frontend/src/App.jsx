import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import semua halaman yang udah kita buat
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import UploadPage from './pages/UploadPages'; // Sesuaikan nama file aslinya ya (pakai 's' atau nggak)
import QuizPage from './pages/QuizPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
function App() {
  return (
    <Router>
      <Routes>
        {/* Pintu masuk pertama sekarang diarahkan ke halaman Login */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Rute untuk halaman pendaftaran */}
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Halaman utama aplikasinya dipindah ke rute /upload */}
        <Route path="/upload" element={<UploadPage />} />
        
        {/* Halaman kuis */}
        <Route path="/quiz" element={<QuizPage />} />
        
        {/* Halaman lupa kata sandi */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </Router>
  );
}
// Tambahin import-nya di bagian atas


// Lalu di dalam <Routes>, tambahin rute ini:
export default App;