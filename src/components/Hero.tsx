import React, { useState, useRef, useEffect } from 'react';
import { Shield, DollarSign, Sparkles, Timer } from 'lucide-react';

const features = [
  {
    name: 'Secure & Private',
    description: 'Your photos are processed securely in your browser, so no data ever leaves your device. Source code is available on GitHub for independent review.',
    icon: <Shield size={48} strokeWidth={1.5} className="text-blue-500" />,
  },
  {
    name: 'Simplified Workflow',
    description: 'Stop researching image formats and juggling multiple tools. Our all-in-one toolkit eliminates the guesswork, delivering web-ready images instantly.',
    icon: <Sparkles size={48} strokeWidth={1.5} className="text-blue-500" />,
  },
  {
    name: 'Faster Workflows',
    description: 'Our lightning-fast processing optimizes your images instantly, delivering files that perform flawlessly in any application.',
    icon: <Timer size={48} strokeWidth={1.5} className="text-blue-500" />,
  },
  {
    name: 'Free & Accessible',
    description: 'PixelToolbox is a free service from PixelFanLabs, dedicated to making powerful and simplified tools accessible to everyone.',
    icon: <DollarSign size={48} strokeWidth={1.5} className="text-blue-500" />,
  },
];

const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardElements = Array.from(scrollContainerRef.current.children) as HTMLElement[];
      const containerWidth = scrollContainerRef.current.offsetWidth;

      cardElements.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const viewportCenter = containerWidth / 2;
        const distance = Math.abs(viewportCenter - cardCenter);

        // Normalize distance to a 0-1 range, where 0 is at center, 1 is at edge
        const normalizedDistance = Math.min(1, distance / (containerWidth / 2 + cardRect.width / 2));

        // Apply scale and opacity based on normalized distance
        const scale = 1 - (normalizedDistance * 0.1); // Scale down by up to 10%
        const opacity = 1 - (normalizedDistance * 0.3); // Fade out by up to 30%

        card.style.transform = `scale(${scale})`;
        card.style.opacity = `${opacity}`;
      });

      // Update active dot
      const firstVisibleCardIndex = cardElements.findIndex(card => {
        const rect = card.getBoundingClientRect();
        return rect.left >= 0 && rect.left < containerWidth;
      });
      if (firstVisibleCardIndex !== -1) {
        setActiveIndex(firstVisibleCardIndex);
      }
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      // Initial call to set styles
      handleScroll();
      return () => {
        container.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <div className="relative bg-transparent overflow-hidden py-8 lg:py-16">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/hero-image-pixeltoolbox.avif"
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/30"></div> {/* Darkening overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white text-balance drop-shadow-lg whitespace-nowrap">
          Your complete toolkit for <span className="text-blue-300">web-ready images</span>
        </h1>

        <div className="mt-12">
          <div className="lg:hidden">
            <div ref={scrollContainerRef} className="flex overflow-x-auto space-x-8 pb-4 no-scrollbar">
              {features.map((feature) => (
                <div key={feature.name} className="flex-shrink-0 w-80 bg-white/70 backdrop-blur-md rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-12 w-12 rounded-md">
                        {feature.icon}
                      </div>
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-base text-gray-800">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full mx-1 ${activeIndex === index ? 'bg-blue-600' : 'bg-gray-300'}`}
                  onClick={() => {
                    const container = scrollContainerRef.current;
                    if (container) {
                      const cardWidth = container.scrollWidth / features.length;
                      container.scrollTo({
                        left: cardWidth * index,
                        behavior: 'smooth',
                      });
                    }
                  }}
                />
              ))}
            </div>
          </div>

          <div className="hidden lg:grid lg:grid-cols-4 lg:gap-8">
            {features.map((feature) => (
              <div key={feature.name} className="bg-white/70 backdrop-blur-md rounded-lg p-6 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-base text-gray-800">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;