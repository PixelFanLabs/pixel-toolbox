import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Import useLocation, useNavigate
import { Zap } from 'lucide-react';

interface HeaderProps {
  // Removed isHomePage prop
}

const Header: React.FC<HeaderProps> = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation(); // Get current location
  const navigate = useNavigate(); // Get navigate function
  const isHomePage = location.pathname === '/'; // Determine if it's the home page

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 0;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    // Only add scroll listener if it's the home page
    if (isHomePage) {
      window.addEventListener('scroll', handleScroll);
    } else {
      // If not home page, ensure scrolled is true so header is solid
      setScrolled(true);
    }

    return () => {
      if (isHomePage) {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrolled, isHomePage]); // Add isHomePage to dependency array

  const handleOptimizeClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (location.pathname === '/') {
      // If already on home page, scroll to #optimize section
      e.preventDefault(); // Prevent default Link navigation
      const optimizeSection = document.getElementById('optimize');
      if (optimizeSection) {
        optimizeSection.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If not on home page, navigate to home and then scroll
      // This will be handled by the Link component's default behavior
      // and a useEffect in OptimizeImagesSection if needed, but for now,
      // just navigating to '/' is sufficient.
    }
  };

  const handleNavLinkClick = (path: string) => {
    if (location.pathname === path) {
      // If already on the target page, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const headerClass = `fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
    scrolled ? 'bg-slate-900 shadow-sm' : 'bg-transparent'
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

          {/* Navigation */}
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-blue-300 hover:text-blue-100 transition-colors font-medium" onClick={handleOptimizeClick}>Optimize Images</Link>
              </li>
              <li>
                <Link to="/about" className="text-blue-300 hover:text-blue-100 transition-colors font-medium" onClick={() => handleNavLinkClick('/about')}>About</Link>
              </li>
              <li>
                <Link to="/faq" className="text-blue-300 hover:text-blue-100 transition-colors font-medium" onClick={() => handleNavLinkClick('/faq')}>FAQ</Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;