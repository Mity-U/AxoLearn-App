import React, { useState } from 'react';
import { Phone, Lock, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');

    const handleReset = async (e) => {
        e.preventDefault();
        setMessage('Lagi memproses...');

        try {
            const response = await fetch('http://localhost:5000/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, newPassword })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('✅ ' + data.message);
                setTimeout(() => {
                    navigate('/'); // Balik ke halaman login setelah 2 detik
                }, 2000);
            } else {
                setMessage('❌ ' + data.message);
            }
        } catch (error) {
            setMessage('❌ Gagal nyambung ke server.');
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-logo">AxoLearn</div>
                
                <h2 className="auth-title" style={{marginTop: '20px'}}>Reset Kata Sandi</h2>
                <p className="auth-subtitle">Lupa sandi? Tenang, kita atur ulang.</p>

                {message && (
                    <p style={{
                        fontSize: '0.9rem', 
                        marginBottom: '15px', 
                        color: message.includes('✅') ? '#4ade80' : '#f87171'
                    }}>
                        {message}
                    </p>
                )}

                <form onSubmit={handleReset}>
                    <div className="input-group">
                        <label className="input-label">Nomor HP Terdaftar</label>
                        <div className="input-wrapper">
                            <Phone size={18} className="input-icon" />
                            <input 
                                type="tel" 
                                className="auth-input" 
                                placeholder="Masukkan nomor HP"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required 
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Kata Sandi Baru</label>
                        <div className="input-wrapper">
                            <Lock size={18} className="input-icon" />
                            <input 
                                type={showPassword ? "text" : "password"} 
                                className="auth-input" 
                                placeholder="Buat kata sandi baru" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
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

                    <button type="submit" className="btn-green" style={{marginTop: '20px', marginBottom: '20px'}}>
                        Simpan Sandi Baru
                    </button>
                </form>

                <p className="auth-footer">
                    Ingat kata sandimu? <span className="auth-link" onClick={() => navigate('/')}>Kembali ke Login</span>
                </p>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;