import React from 'react';
import { Zap } from 'lucide-react';

interface HeaderProps {
  onAboutClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAboutClick }) => {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" strokeWidth={1.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 font-poppins">PixelToolbox</h1>
              <p className="text-sm text-slate-600">Your complete toolkit for web-ready images</p>
            </div>
          </div>

          {/* About Button */}
          <div>
            <button onClick={onAboutClick} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-medium">
              <span>About</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;