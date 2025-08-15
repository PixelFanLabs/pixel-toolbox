import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import OptimizeImagesSection from './components/OptimizeImagesSection';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import KofiModal from './components/KofiModal';

function App() {
  const [isKofiModalOpen, setIsKofiModalOpen] = useState(false);

  const openKofiModal = () => setIsKofiModalOpen(true);
  const closeKofiModal = () => setIsKofiModalOpen(false);

  return (
    <Router>
      <div id="top" className="min-h-screen flex flex-col">
        <Header openKofiModal={openKofiModal} />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <HomePage />
                <OptimizeImagesSection />
              </>
            } />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FAQPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm">
            <p>© 2025 PixelToolbox. A free web service created by PixelFanLabs.</p>
          </div>
        </footer>

        <KofiModal isOpen={isKofiModalOpen} onClose={closeKofiModal} />
      </div>
    </Router>
  );
}

export default App;