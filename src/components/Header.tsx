import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Zap, Menu, X } from 'lucide-react';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
    } else {
      setScrolled(true);
    }

    return () => {
      if (isHomePage) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrolled, isHomePage]);

  const handleNavLinkClick = (path: string) => {
    if (location.pathname === path) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  const headerClass = `fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
    scrolled || isMenuOpen ? 'bg-slate-900 shadow-sm' : 'bg-transparent'
  }`;

  return (
    <header className={headerClass}>
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <Link to="/" className="text-3xl font-extrabold text-white font-poppins" onClick={() => handleNavLinkClick('/')}>PixelToolbox</Link>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex">
            <ul className="flex items-center space-x-6">
              <li>
                <Link to="/" className="text-blue-300 hover:text-blue-100 transition-colors font-medium" onClick={() => handleNavLinkClick('/')}>Optimize Images</Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-300 hover:text-blue-100 transition-colors font-medium" onClick={() => handleNavLinkClick('/about')}>About</Link>
              </li>
              <li>
                <Link to="/faq" className="text-blue-300 hover:text-blue-100 transition-colors font-medium" onClick={() => handleNavLinkClick('/faq')}>FAQ</Link>
              </li>
              <li>
                <a
                  href="https://ko-fi.com/P5P41JNX62"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-lg"
                >
                  <img src="https://storage.ko-fi.com/cdn/cup-border.png" className="h-5 w-5 mr-2" alt="Ko-fi" />
                  Buy me a coffee
                </a>
              </li>
            </ul>
          </nav>

          {/* Hamburger Menu Button */}
          <div className="lg:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white">
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`absolute top-full left-0 w-full bg-slate-900 lg:hidden transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
      } overflow-hidden`}>
        <nav className="py-4">
          <ul className="flex flex-col items-center space-y-4">
            <li>
              <Link to="/" className="text-white hover:text-blue-300 transition-colors font-medium" onClick={() => handleNavLinkClick('/')}>Optimize Images</Link>
            </li>
            <li>
              <Link to="/about" className="text-white hover:text-blue-300 transition-colors font-medium" onClick={() => handleNavLinkClick('/about')}>About</Link>
            </li>
            <li>
              <Link to="/faq" className="text-white hover:text-blue-300 transition-colors font-medium" onClick={() => handleNavLinkClick('/faq')}>FAQ</Link>
            </li>
            <li>
              <a
                href="https://ko-fi.com/P5P41JNX62"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-full font-semibold hover:bg-purple-700 transition-colors shadow-lg"
              >
                <img src="https://storage.ko-fi.com/cdn/cup-border.png" className="h-5 w-5 mr-2" alt="Ko-fi" />
                Buy me a coffee
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
