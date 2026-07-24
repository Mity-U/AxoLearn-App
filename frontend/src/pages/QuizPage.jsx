import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// Memanggil file desain CSS
import './QuizPage.css';

const QuizPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // 1. Tangkap data yang dikirim dari halaman Upload
    const { soalKuis, namaRuangan } = location.state || {};

    // 2. Siapkan "state" untuk jalannya game
    const [currentIndex, setCurrentIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);

    // 3. Jaga-jaga kalau user langsung nembak URL '/quiz' tanpa lewat upload file
    if (!soalKuis || soalKuis.length === 0) {
        return (
            <div className="quiz-container">
                <h2>Waduh, arena kuisnya masih kosong! 👻</h2>
                <p>Kamu belum upload materi untuk dijadikan kuis.</p>
                <button
                    onClick={() => navigate('/')}
                    className="btn-primary"
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
            setScore(score + 100);
        }

        // Cek apakah masih ada soal berikutnya
        const nextIndex = currentIndex + 1;
        if (nextIndex < soalKuis.length) {
            setCurrentIndex(nextIndex);
        } else {
            setIsFinished(true);
        }
    };

    // 5. Tampilan kalau kuis sudah selesai (Result Screen)
    if (isFinished) {
        return (
            <div className="quiz-container">
                <h1 className="result-title">Petualangan Selesai! 🎉</h1>
                <h2>Ruang: {namaRuangan}</h2>

                <div className="result-score-box">
                    <p className="result-score-label">Skor Akhir Kamu</p>
                    <p className="result-score-value">{score}</p>
                </div>
                <br />
                <button
                    onClick={() => navigate('/')}
                    className="btn-primary btn-large"
                >
                    Mulai Petualangan Baru
                </button>
            </div>
        );
    }

    // 6. Tampilan saat kuis sedang berjalan (Arena Kuis)
    return (
        <div className="quiz-arena-container">
            {/* Header Arena */}
            <div className="arena-header">
                <h3 className="arena-room-name">🏰 {namaRuangan}</h3>
                <p className="arena-score">Skor: {score}</p>
            </div>

            {/* Kotak Pertanyaan */}
            <div className="question-box">
                <p className="question-tracker">
                    PERTANYAAN {currentIndex + 1} DARI {soalKuis.length}
                </p>
                <h2 className="question-text">{currentQuestion.soal}</h2>

                {/* Daftar Pilihan Ganda */}
                <div className="options-container">
                    {currentQuestion.opsi.map((opsi, index) => (
                        <button
                            key={index}
                            onClick={() => handleAnswerClick(opsi)}
                            className="option-button"
                        >
                            <span className="option-letter">
                                {String.fromCharCode(65 + index)}
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