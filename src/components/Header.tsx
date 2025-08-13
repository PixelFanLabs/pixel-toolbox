import React from 'react';
import { Zap, Shield, Github } from 'lucide-react';

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

          {/* Features */}
          <div className="hidden md:flex items-center space-x-6 text-sm text-slate-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" strokeWidth={1.5} />
              <span>Client-side processing</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-yellow-600" strokeWidth={1.5} />
              <span>Batch optimization</span>
            </div>
            <a
              href="https://github.com/pixeltoolbox/pixeltoolbox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <Github className="w-4 h-4" strokeWidth={1.5} />
              <span>Open Source</span>
            </a>
            <button onClick={onAboutClick} className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors">
              <span>About</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;