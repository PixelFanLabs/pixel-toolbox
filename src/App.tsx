import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
import Header from './components/Header';
import HomePage from './components/HomePage';
import OptimizeImagesSection from './components/OptimizeImagesSection';
import AboutPage from './pages/AboutPage'; // Import new AboutPage
import FAQPage from './pages/FAQPage';     // Import new FAQPage

function App() {
  return (
    <Router> {/* Wrap with Router */}
      <div id="top" className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-grow">
          <Routes> {/* Define routes */}
            <Route path="/" element={
              <>
                <HomePage /> {/* Hero section */}
                <OptimizeImagesSection />
              </>
            } />
            <Route path="/about" element={<AboutPage />} /> {/* About Page */}
            <Route path="/faq" element={<FAQPage />} />     {/* FAQ Page */}
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 text-center text-sm">
            <p>© 2025 PixelToolbox. A free web service created by PixelFanLabs.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;