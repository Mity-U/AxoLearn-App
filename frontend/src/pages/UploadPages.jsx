import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileWarning, Loader2 } from 'lucide-react';

const UploadPage = () => {
    // State untuk melacak status upload: 'idle', 'uploading', 'error', atau 'success'
    const [uploadStatus, setUploadStatus] = useState('idle');
    const [fileName, setFileName] = useState('');

    const onDrop = useCallback((acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setFileName(file.name);
            setUploadStatus('uploading');

            // Simulasi proses AI membaca berkas (nanti kita ganti dengan tembakan API beneran ke backend)
            setTimeout(() => {
                // Anggap saja berhasil setelah 3 detik
                setUploadStatus('success');
            }, 3000);
        }
    }, []);

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

            {/* STATE 1: IDLE (Tampilan awal untuk drop file) */}
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

            {/* STATE 2: UPLOADING (AI sedang membaca) */}
            {uploadStatus === 'uploading' && (
                <div style={{ marginTop: '20px' }}>
                    <Loader2 size={50} color="#4CAF50" />
                    <h3>AI sedang membaca berkas dan merancang permainanmu...</h3>
                    <p>File: {fileName}</p>
                </div>
            )}

            {/* STATE 3: SUCCESS (Input Nama Kelas) */}
            {uploadStatus === 'success' && (
                <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#e8f5e9', borderRadius: '10px' }}>
                    <h2 style={{ color: '#2e7d32' }}>Yey! Level Berhasil Dibuat!</h2>
                    <p>Sekarang, beri nama ruang belajarmu untuk memulai petualangan.</p>
                    <input
                        type="text"
                        placeholder="e.g., Sistem Terdistribusi - Kelas A"
                        style={{ padding: '10px', width: '80%', marginBottom: '10px', borderRadius: '5px' }}
                    />
                    <br />
                    <button style={{ padding: '10px 20px', backgroundColor: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px' }}>
                        Mulai Petualangan
                    </button>
                </div>
            )}

            {/* STATE 4: ERROR (Tipe file salah / gagal baca) */}
            {uploadStatus === 'error' && (
                <div style={{ marginTop: '20px', color: 'red' }}>
                    <FileWarning size={50} />
                    <h3>Waduh, dokumen kamu tidak terbaca, nih!</h3>
                    <p>Pastikan berkas yang kamu unggah berupa PDF/DOC/PPT, yaa!</p>
                    <button onClick={() => setUploadStatus('idle')}>Unggah Ulang</button>
                </div>
            )}
        </div>
    );
};

export default UploadPage;