import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Tangkap data yang dikirim dari halaman Upload
    const { soalKuis, namaRuangan } = location.state || {};

    // 2. Siapkan "state" untuk jalannya game
    const [currentIndex, setCurrentIndex] = useState(0); // Lacak soal nomor berapa
    const [score, setScore] = useState(0); // Lacak skor
    const [isFinished, setIsFinished] = useState(false); // Lacak apakah kuis sudah selesai

    // 3. Jaga-jaga kalau user langsung nembak URL '/quiz' tanpa lewat upload file
    if (!soalKuis || soalKuis.length === 0) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <h2>Waduh, arena kuisnya masih kosong! 👻</h2>
                <p>Kamu belum upload materi untuk dijadikan kuis.</p>
                <button 
                    onClick={() => navigate('/')}
                    style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
                >
                    Kembali ke Halaman Upload
                </button>
            </div>
        );
    }

    const currentQuestion = soalKuis[currentIndex];

    // 4. Fungsi saat user memilih jawaban
    const handleAnswerClick = (selectedOption) => {
        // Cek apakah jawaban benar
        if (selectedOption === currentQuestion.jawaban_benar) {
            setScore(score + 100); // Kasih 100 poin tiap jawaban benar
        }

        // Cek apakah masih ada soal berikutnya
        const nextIndex = currentIndex + 1;
        if (nextIndex < soalKuis.length) {
            setCurrentIndex(nextIndex); // Pindah ke soal berikutnya
        } else {
            setIsFinished(true); // Akhiri game
        }
    };

    // 5. Tampilan kalau kuis sudah selesai (Result Screen)
    if (isFinished) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
                <h1 style={{ color: '#2e7d32' }}>Petualangan Selesai! 🎉</h1>
                <h2>Ruang: {namaRuangan}</h2>
                <div style={{ margin: '30px 0', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px', display: 'inline-block' }}>
                    <p style={{ fontSize: '18px', margin: '0' }}>Skor Akhir Kamu</p>
                    <p style={{ fontSize: '48px', fontWeight: 'bold', color: '#2e7d32', margin: '10px 0' }}>{score}</p>
                </div>
                <br />
                <button 
                    onClick={() => navigate('/')}
                    style={{ padding: '12px 25px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
                >
                    Mulai Petualangan Baru
                </button>
            </div>
        );
    }

    // 6. Tampilan saat kuis sedang berjalan (Arena Kuis)
    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto' }}>
            {/* Header Arena */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '2px solid #eee', paddingBottom: '10px' }}>
                <h3 style={{ margin: 0 }}>🏰 {namaRuangan}</h3>
                <p style={{ fontWeight: 'bold', color: '#4CAF50', fontSize: '18px', margin: 0 }}>Skor: {score}</p>
            </div>

            {/* Kotak Pertanyaan */}
            <div style={{ backgroundColor: '#f9f9f9', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)' }}>
                <p style={{ fontSize: '14px', color: '#888', marginBottom: '10px', fontWeight: 'bold' }}>
                    PERTANYAAN {currentIndex + 1} DARI {soalKuis.length}
                </p>
                <h2 style={{ marginBottom: '30px', lineHeight: '1.4' }}>{currentQuestion.soal}</h2>

                {/* Daftar Pilihan Ganda */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {currentQuestion.opsi.map((opsi, index) => (
                        <button 
                            key={index}
                            onClick={() => handleAnswerClick(opsi)}
                            style={{
                                padding: '15px 20px',
                                textAlign: 'left',
                                fontSize: '16px',
                                backgroundColor: 'white',
                                border: '2px solid #e0e0e0',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center'
                            }}
                            onMouseOver={(e) => {
                                e.target.style.borderColor = '#4CAF50';
                                e.target.style.backgroundColor = '#f1f8e9';
                            }}
                            onMouseOut={(e) => {
                                e.target.style.borderColor = '#e0e0e0';
                                e.target.style.backgroundColor = 'white';
                            }}
                        >
                            <span style={{ 
                                display: 'inline-block', 
                                width: '30px', 
                                height: '30px', 
                                backgroundColor: '#eee', 
                                borderRadius: '50%', 
                                textAlign: 'center', 
                                lineHeight: '30px', 
                                marginRight: '15px',
                                fontWeight: 'bold'
                            }}>
                                {String.fromCharCode(65 + index)} {/* Mengubah index 0,1,2,3 jadi A,B,C,D */}
                            </span>
                            {opsi}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QuizPage;