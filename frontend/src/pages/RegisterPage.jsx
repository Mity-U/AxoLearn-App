import React, { useState, useEffect } from 'react';
import { User, Phone, Lock, BookOpen, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import '../styles/Auth.css';

const RegisterPage = () => {
    const navigate = useNavigate();
    
    // State buat ngatur tampilan password
    const [showPassword, setShowPassword] = useState(false);
    
    // State buat nyimpen apa aja yang diketik user
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [jurusan, setJurusan] = useState('');
    
    // State buat nampilin notifikasi sukses/gagal
    const [message, setMessage] = useState('');

    // State buat nyimpen daftar jurusan dari database
    const [daftarJurusan, setDaftarJurusan] = useState([]);

    // Narik data jurusan dari backend pas halaman pertama kali dibuka
    useEffect(() => {
        const fetchJurusan = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/auth/jurusan');
                const result = await response.json();
                
                if (result.success) {
                    setDaftarJurusan(result.data); // Simpan datanya ke state
                }
            } catch (error) {
                console.error("Waduh, gagal narik data jurusan dari server");
            }
        };

        fetchJurusan();
    }, []);

    // Eksekusi pas tombol submit diklik
    const handleRegister = async (e) => {
        e.preventDefault(); // Nahan halaman biar nggak kedip/refresh
        setMessage('Tunggu sebentar...');

        try {
            // Nembak API pendaftaran
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, phoneNumber, password, jurusan })
            });

            const data = await response.json();

            if (data.success) {
                setMessage('✅ Akun berhasil dibuat! Mengalihkan ke login...');
                // Jeda 2 detik sebelum pindah ke halaman login
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setMessage('❌ ' + data.message);
            }
        } catch (error) {
            setMessage('❌ Waduh, gagal nyambung ke server nih.');
        }
    };

    return (
        <div className="auth-page-container">
            <div className="auth-card">
                <div className="auth-logo">AxoLearn</div>
                
                <h2 className="auth-title" style={{marginTop: '20px'}}>Daftar Akun Baru</h2>
                <p className="auth-subtitle">Mulai petualangan belajarmu hari ini!</p>

                {/* Notifikasi balasan dari server */}
                {message && (
                    <p style={{
                        fontSize: '0.9rem', 
                        marginBottom: '15px', 
                        color: message.includes('✅') ? '#4ade80' : '#f87171'
                    }}>
                        {message}
                    </p>
                )}

                {/* Form untuk mengelompokkan semua inputan */}
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label className="input-label">Username</label>
                        <div className="input-wrapper">
                            <User size={18} className="input-icon" />
                            <input 
                                type="text" 
                                className="auth-input" 
                                placeholder="Pilih username" 
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Nomor HP</label>
                        <div className="input-wrapper">
                            <Phone size={18} className="input-icon" />
                            <input 
                                type="tel" 
                                className="auth-input" 
                                placeholder="08xx-xxxx-xxxx" 
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
                                placeholder="Buat kata sandi" 
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

                    <div className="input-group">
                        <label className="input-label">Jurusan Kuliah</label>
                        <div className="input-wrapper">
                            <BookOpen size={18} className="input-icon" />
                            <select 
                                className="auth-select" 
                                value={jurusan}
                                onChange={(e) => setJurusan(e.target.value)}
                                required
                            >
                                <option value="" disabled>Pilih jurusan</option>
                                {/* Looping data jurusan dari database */}
                                {daftarJurusan.map((item) => (
                                    <option key={item.id} value={item.nama_jurusan}>
                                        {item.nama_jurusan}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown size={18} className="input-icon" style={{marginRight: 0}} />
                        </div>
                    </div>

                    <button type="submit" className="btn-green" style={{marginTop: '10px', marginBottom: '20px'}}>
                        Buat Akun ➔
                    </button>
                </form>

                <p className="auth-footer">
                    Sudah punya akun? <span className="auth-link" onClick={() => navigate('/')}>Masuk di sini</span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;