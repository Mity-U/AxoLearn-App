import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const LoginPage = () => {
    const navigate = useNavigate();

    // State buat nyimpen ketikan user
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    // State buat ngatur mata password & notif pesan
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    // Fungsi yang jalan pas tombol 'Masuk' diklik
    const handleLogin = async (e) => {
        e.preventDefault(); // Nahan webnya biar nggak kedip/refresh otomatis
        setMessage('Lagi ngecek data...');

        try {
            // Nembak ke jembatan API Login
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phoneNumber, password })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('✅ Login mantap! Masuk ke arena...');
                // Jeda dikit biar user sempat baca notif, baru pindah ke halaman upload
                setTimeout(() => {
                    navigate('/upload');
                }, 1500);
            } else {
                // Kalau Nomor HP atau password salah
                setMessage('❌ ' + data.message);
            }
        } catch (error) {
            setMessage('❌ Waduh, servernya lagi ngambek nih.');
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-logo">AxoLearn</div>

                {/* Tempat naruh gambar maskot nanti */}


                <p className="auth-title">Selamat datang kembali!</p>
                <p className="auth-subtitle">Mari lanjut belajar.</p>

                {/* Tempat nampilin balasan dari server (error/sukses) */}
                {message && (
                    <p style={{
                        fontSize: '0.9rem',
                        marginBottom: '15px',
                        color: message.includes('✅') ? '#4ade80' : '#f87171'
                    }}>
                        {message}
                    </p>
                )}

                {/* Bungkus semua inputan pakai form */}
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label className="input-label">Nomor HP</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Masukkan nomor HP"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Kata Sandi</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Masukkan kata sandi"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className="icon-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <span
                        className="forgot-password"
                        onClick={() => navigate('/forgot-password')}
                        style={{ cursor: 'pointer' }}
                    >
                        Lupa Kata Sandi?
                    </span>

                    {/* Pastikan tombolnya bertipe submit */}
                    <button type="submit" className="btn-green">Masuk</button>
                </form>

                <div className="divider">ATAU</div>

                <button type="button" className="btn-google">
                    <span style={{ color: '#4285F4', fontWeight: 'bold' }}>G</span>
                    Lanjut dengan Google
                </button>

                <p className="auth-footer">
                    Belum punya akun? <span className="auth-link" onClick={() => navigate('/register')}>Daftar Sekarang</span>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;