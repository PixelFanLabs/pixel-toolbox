import React, { useState, useRef, useEffect } from 'react';
import { Shield, DollarSign, Sparkles, Timer } from 'lucide-react';

const features = [
  {
    name: 'Secure & Private',
    description: 'Your photos are processed securely in your browser, so no data ever leaves your device. Source code is available on GitHub for independent review.',
    icon: <Shield size={32} strokeWidth={1.5} className="text-white/90" />,
    color: 'text-blue-600',
  },
  {
    name: 'Simplified Workflow',
    description: 'Stop researching image formats and juggling multiple tools. Our all-in-one toolkit eliminates the guesswork, delivering web-ready images instantly.',
    icon: <Sparkles size={32} strokeWidth={1.5} className="text-white/90" />,
    color: 'text-yellow-500',
  },
  {
    name: 'Faster Workflows',
    description: 'Our lightning-fast processing optimizes your images instantly, delivering files that perform flawlessly in any application.',
    icon: <Timer size={32} strokeWidth={1.5} className="text-white/90" />,
    color: 'text-green-500',
  },
  {
    name: 'Free & Accessible',
    description: 'PixelToolbox is a free service from PixelFanLabs, dedicated to making powerful and simplified tools accessible to everyone.',
    icon: <DollarSign size={32} strokeWidth={1.5} className="text-white/90" />,
    color: 'text-purple-500',
  },
];

const Hero: React.FC = () => {
  const [taglineOpacity, setTaglineOpacity] = useState(1);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = window.innerHeight * 0.55; // 55vh
      const fadeStart = heroHeight * 0.3;
      const fadeEnd = heroHeight * 0.8;
      
      if (scrollY < fadeStart) {
        setTaglineOpacity(1);
      } else if (scrollY > fadeEnd) {
        setTaglineOpacity(0);
      } else {
        const progress = (scrollY - fadeStart) / (fadeEnd - fadeStart);
        setTaglineOpacity(1 - progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPreviewIndex((prev) => (prev + 1) % features.length);
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative bg-transparent overflow-hidden h-[55vh] flex flex-col">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/hero-image-pixeltoolbox.avif"
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col h-full pt-24">
        {/* Tagline */}
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="text-center transition-opacity duration-300 ease-out"
            style={{ opacity: taglineOpacity }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-tight tracking-wide">
              Your complete toolkit for <span className="font-medium text-blue-300">web-ready images</span>
            </h1>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="pb-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Base Card */}
                <div className="flex flex-col items-center text-center p-4 transition-all duration-300 ease-out">
                  <div className="mb-3 transition-transform duration-300 group-hover:scale-110">
                    {feature.icon}
                  </div>
                  <h3 className="text-sm lg:text-base font-medium text-white/80 group-hover:text-white transition-colors duration-300">
                    {feature.name}
                  </h3>
                </div>

                {/* Expanded Card on Hover */}
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-80 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-6 transition-all duration-500 ease-out ${
                  hoveredCard === index 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      <Shield size={24} strokeWidth={1.5} className="text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                  
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/95"></div>
                  </div>
                </div>

                {/* Auto-preview Card (alternating) */}
                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-80 bg-white/90 backdrop-blur-md rounded-xl shadow-xl border border-white/10 p-6 transition-all duration-700 ease-out ${
                  previewIndex === index && hoveredCard === null
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}>
                  <div className="flex items-center mb-4">
                    <div className="mr-4">
                      {React.cloneElement(feature.icon, { 
                        size: 24, 
                        className: "text-blue-600" 
                      })}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{feature.name}</h3>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{feature.description}</p>
                  
                  {/* Arrow pointing down */}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                    <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white/90"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Subtle indicator dots */}
          <div className="flex justify-center mt-6 space-x-2">
            {features.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  previewIndex === index ? 'bg-white/80 scale-125' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;