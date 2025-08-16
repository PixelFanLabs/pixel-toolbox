import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import OptimizeImagesSection from './components/OptimizeImagesSection';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';

import KofiModal from './components/KofiModal'; // Import the KofiModal component

function App() {
  const [isKofiModalOpen, setIsKofiModalOpen] = useState(false);

  const openKofiModal = () => setIsKofiModalOpen(true);
  const closeKofiModal = () => setIsKofiModalOpen(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://storage.ko-fi.com/cdn/scripts/overlay-widget.js';
    script.async = true;

    script.onload = () => {
      if (window.kofiWidgetOverlay) {
        window.kofiWidgetOverlay.draw('pixelfan', {
          'type': 'floating-chat',
          'floating-chat.donateButton.text': 'Support Me',
          'floating-chat.donateButton.background-color': '#805ad5', // Purple color
          'floating-chat.donateButton.text-color': '#fff'
        });
      }
    };
    document.body.appendChild(script);
  }, []);

 return (
    <Router>
      <div id="top" className="min-h-screen flex flex-col">
        <Header openKofiModal={openKofiModal} /> {/* Pass the openKofiModal function */}

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


        {/* Render the KofiModal component */}
        <KofiModal isOpen={isKofiModalOpen} onClose={closeKofiModal} />


      </div>
    </Router>
  );
}

export default App;