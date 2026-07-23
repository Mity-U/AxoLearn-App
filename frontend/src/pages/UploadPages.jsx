import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileWarning, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
            formData.append('materi', file);

            try {
                const response = await fetch('http://localhost:5000/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    setQuizData(data.kuis);
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
        accept: {
            'application/pdf': ['.pdf'],
            'application/msword': ['.doc', '.docx'],
            'application/vnd.ms-powerpoint': ['.ppt', '.pptx']
        }
    });

    return (
        <div style={{ padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif' }}>
            <h1>Upload Material</h1>
            <p>Transform Notes into Games</p>

            {/* STATE 1: IDLE */}
            {uploadStatus === 'idle' && (
                <div
                    {...getRootProps()}
                    style={{
                        border: '2px dashed #4CAF50',
                        padding: '40px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        backgroundColor: isDragActive ? '#e8f5e9' : '#fff'
                    }}
                >
                    <input {...getInputProps()} />
                    <UploadCloud size={50} color="#4CAF50" />
                    <h3>Pilih atau seret berkasmu ke sini</h3>
                    <p>Format file yang didukung PDF, DOC, atau PPT</p>
                </div>
            )}

            {/* STATE 2: UPLOADING */}
            {uploadStatus === 'uploading' && (
                <div style={{ marginTop: '20px' }}>
                    <Loader2 size={50} color="#4CAF50" />
                    <h3>AI sedang membaca berkas dan merancang permainanmu...</h3>
                    <p>File: {fileName}</p>
                </div>
            )}

            {/* STATE 3: SUCCESS */}
            {uploadStatus === 'success' && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px' }}>
                    <h2 style={{ color: '#2e7d32' }}>Yey! Level Berhasil Dibuat!</h2>
                    <p>Sekarang, beri nama ruang belajarmu untuk memulai petualangan.</p>

                    <input
                        type="text"
                        placeholder="e.g., Sistem Terdistribusi - Kelas A"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        style={{ padding: '10px', width: '80%', marginBottom: '10px', borderRadius: '5px' }}
                    />
                    <br />
                    <button
                        onClick={handleMulaiPetualangan}
                        style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: 'black', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
                    >
                        Mulai Petualangan
                    </button>
                </div>
            )}

            {/* STATE 4: ERROR */}
            {uploadStatus === 'error' && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                    <FileWarning size={50} />
                    <h3>Waduh, dokumen kamu tidak terbaca, nih!</h3>
                    <p>Pastikan berkas yang kamu unggah berupa PDF/DOC/PPT, yaa!</p>
                    <button onClick={() => setUploadStatus('idle')} style={{ padding: '8px 15px', marginTop: '10px', cursor: 'pointer' }}>Unggah Ulang</button>
                </div>
            )}
        </div>
    );
};

export default UploadPage;