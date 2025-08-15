import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './components/HomePage';
import OptimizeImagesSection from './components/OptimizeImagesSection';
import AboutPage from './pages/AboutPage';
import FAQPage from './pages/FAQPage';
import KofiModal from './components/KofiModal';

function App() {
  const [isKofiModalOpen, setIsKofiModalOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false); // New state for small screen

  const openKofiModal = () => setIsKofiModalOpen(true);
  const closeKofiModal = () => setIsKofiModalOpen(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 1023px)'); // lg breakpoint
    const handleMediaQueryChange = (e: MediaQueryListEvent) => {
      setIsSmallScreen(e.matches);
    };

    // Initial check
    setIsSmallScreen(mediaQuery.matches);

    // Listen for changes
    mediaQuery.addEventListener('change', handleMediaQueryChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

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

        {/* Floating Buy me a coffee button for small screens */}
        {isSmallScreen && (
          <button
            onClick={openKofiModal}
            className="fixed bottom-4 right-4 z-50 inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-lg"
          >
            <img src="https://storage.ko-fi.com/cdn/cup-border.png" className="h-5 w-5 mr-2" alt="Ko-fi" />
            Buy me a coffee
          </button>
        )}
      </div>
    </Router>
  );
}

export default App;