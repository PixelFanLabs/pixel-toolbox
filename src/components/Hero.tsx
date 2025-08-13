import React, { useState } from 'react';
import { Shield, DollarSign, Sparkles, Timer } from 'lucide-react';

const features = [
  {
    name: 'Secure & Private',
    description: 'Your photos are processed securely in your browser, so no data ever leaves your device. Source code is available on GitHub for independent review.',
    icon: <Shield size={48} strokeWidth={1.5} className="text-blue-500" />,
  },
  {
    name: 'Free & Accessible',
    description: 'PixelToolbox is a free service from PixelFanLabs, dedicated to making powerful and simplified tools accessible to everyone.',
    icon: <DollarSign size={48} strokeWidth={1.5} className="text-blue-500" />,
  },
  {
    name: 'Simplified Workflow',
    description: 'Stop researching image formats and juggling multiple tools. Our all-in-one toolkit eliminates the guesswork with smart defaults, delivering the perfect web-ready images instantly.',
    icon: <Sparkles size={48} strokeWidth={1.5} className="text-blue-500" />,
  },
  {
    name: 'Faster Workflows',
    description: 'Our lightning-fast processing quickly optimizes your images in bulk, delivering files that are ready to render instantly and perform flawlessly in any application.',
    icon: <Timer size={48} strokeWidth={1.5} className="text-blue-500" />,
  },
];

const Hero: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const cardWidth = e.currentTarget.scrollWidth / features.length;
    const newIndex = Math.round(scrollLeft / cardWidth);
    setActiveIndex(newIndex);
  };

  return (
    <div className="relative bg-gray-800 overflow-hidden py-12 lg:py-24">
      <img
        className="absolute inset-0 h-full w-full object-cover opacity-20"
        src="https://img.freepik.com/free-vector/vibrant-fluid-gradient-background-with-curvy-shapes_1017-32108.jpg?w=2000&t=st=1662582927~exp=1662583527~hmac=b4a3d19d47ac088c642f3b3554a4a4f0f1d3b3e3b3e3b3e3b3e3b3e3b3e3b3e3"
        alt="Background"
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
          <span className="block xl:inline">Your complete toolkit for</span>{' '}
          <span className="block text-blue-400 xl:inline">web-ready images</span>
        </h1>

        <div className="mt-10">
          <div className="lg:hidden">
            <div className="flex overflow-x-auto space-x-8 pb-4 no-scrollbar" onScroll={handleScroll}>
              {features.map((feature) => (
                <div key={feature.name} className="flex-shrink-0 w-80 bg-slate-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
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
                    <p className="text-base text-gray-500">{feature.description}</p>
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
                    const container = document.querySelector('.overflow-x-auto');
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
              <div key={feature.name} className="bg-slate-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
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
                  <p className="text-base text-gray-500">{feature.description}</p>
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