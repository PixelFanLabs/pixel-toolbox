import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import { Zap } from 'lucide-react';

interface HeaderProps {
}

const Header: React.FC<HeaderProps> = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [scrolled]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${scrolled ? 'bg-slate-900 shadow-sm' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <Link to="/" className="text-3xl font-extrabold text-white font-poppins">PixelToolbox</Link> {/* Changed to Link */}
            </div>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-6">
              <li>
                <a href="#optimize" className="text-blue-300 hover:text-blue-100 transition-colors font-medium">Optimize Images</a>
              </li>
              <li>
                <Link to="/about" className="text-blue-300 hover:text-blue-100 transition-colors font-medium">About</Link> {/* Changed to Link */}
              </li>
              <li>
                <Link to="/faq" className="text-blue-300 hover:text-blue-100 transition-colors font-medium">FAQ</Link> {/* Changed to Link */}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;