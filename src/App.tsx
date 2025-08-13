import React from 'react';
import Header from './components/Header';
import About from './components/About';
import HomePage from './components/HomePage';
import FAQ from './components/FAQ';
import OptimizeImagesSection from './components/OptimizeImagesSection';

function App() {
  return (
    <div id="top" className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HomePage /> {/* Hero section */}
        <OptimizeImagesSection />
        <About />
        <FAQ />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>© 2025 PixelToolbox. A free web service created by PixelFanLabs.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;