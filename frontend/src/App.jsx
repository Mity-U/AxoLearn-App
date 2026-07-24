import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UploadPage from './pages/UploadPages'; 
import QuizPage from './pages/QuizPage';     

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman utama untuk upload materi */}
        <Route path="/" element={<UploadPage />} />
        
        {/* Halaman arena kuis */}
        <Route path="/quiz" element={<QuizPage />} /> 
      </Routes>
    </Router>
  );
}

export default App;