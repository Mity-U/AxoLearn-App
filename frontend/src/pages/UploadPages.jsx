import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileWarning, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Memanggil file CSS yang baru saja dibuat
import '../styles/UploadPage.css';

const UploadPage = () => {
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [fileName, setFileName] = useState('');
    const [quizData, setQuizData] = useState(null);
    const [roomName, setRoomName] = useState("");

    const navigate = useNavigate();

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];

        if (file) {
            setFileName(file.name);
            setUploadStatus('uploading');

            const formData = new FormData();
            // PERBAIKAN DI SINI: Ubah 'materi' jadi 'file' agar cocok dengan backend Multer
            formData.append('file', file);

            try {
                const response = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setQuizData(data.kuis); // Pastikan backend beneran ngirim properti 'kuis'
                    console.log('Mantap, balasan dari backend:', data);
                    setUploadStatus('success');
                } else {
                    console.error('Waduh, gagal ngirim nih');
                    setUploadStatus('error');
                }
            } catch (error) {
                console.error('Kayaknya server backend belum nyala atau ada masalah jaringan:', error);
                setUploadStatus('error');
            }
        }
    }, []);

    const handleMulaiPetualangan = () => {
        if (!roomName.trim()) {
            alert("Isi nama ruang belajarmu dulu ya!");
            return;
        }

        navigate('/quiz', {
            state: {
                soalKuis: quizData,
                namaRuangan: roomName
            }
        });
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        // Dibatasi ke format yang sudah stabil di backend untuk mencegah Error 500
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        }
    });

    return (
        <div className="upload-container">
            <h1 className="upload-title">Upload Material</h1>
            <p className="upload-subtitle">Transform Notes into Games</p>

            {/* STATE 1: IDLE */}
            {uploadStatus === 'idle' && (
                <div
                    {...getRootProps()}
                    className={`drop-zone ${isDragActive ? 'active' : ''}`}
                >
                    <input {...getInputProps()} />
                    <UploadCloud size={60} color={isDragActive ? '#4ade80' : '#888888'} />
                    <h3 className="drop-title">Pilih atau seret berkasmu ke sini</h3>
                    <p className="drop-text">Format file yang didukung PDF atau DOCX</p>
                </div>
            )}

            {/* STATE 2: UPLOADING */}
            {uploadStatus === 'uploading' && (
                <div className="status-container">
                    <Loader2 size={50} color="#4ade80" className="animate-spin" />
                    <h3 className="status-title">AI sedang membaca berkas dan merancang permainanmu...</h3>
                    <p className="status-text">File: {fileName}</p>
                </div>
            )}

            {/* STATE 3: SUCCESS */}
            {uploadStatus === 'success' && (
                <div className="success-container">
                    <h2 className="success-title">Yey! Level Berhasil Dibuat!</h2>
                    <p className="success-desc">Sekarang, beri nama ruang belajarmu untuk memulai petualangan.</p>

                    <input
                        type="text"
                        placeholder="e.g., Sistem Terdistribusi - Kelas A"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        className="input-field"
                    />
                    <br />
                    <button onClick={handleMulaiPetualangan} className="start-button">
                        Mulai Petualangan
                    </button>
                </div>
            )}

            {/* STATE 4: ERROR */}
            {uploadStatus === 'error' && (
                <div className="error-container">
                    <FileWarning size={50} color="#ef4444" />
                    <h3 className="error-title">Waduh, dokumen kamu tidak terbaca, nih!</h3>
                    <p className="error-text">Pastikan berkas yang kamu unggah berupa PDF atau DOCX, yaa!</p>
                    <button onClick={() => setUploadStatus('idle')} className="retry-button">
                        Unggah Ulang
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadPage;