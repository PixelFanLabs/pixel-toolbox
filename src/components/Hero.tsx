import React, { useState, useRef, useEffect } from 'react';
import { Shield, DollarSign, Sparkles, Timer } from 'lucide-react';

const features = [
  {
    name: 'Secure & Private',
    description: 'Your photos are processed securely in your browser, so no data ever leaves your device. Source code is available on GitHub for independent review.',
    icon: <Shield size={32} strokeWidth={1.5} className="text-white/90" />,
    color: 'text-blue-300',
  },
  {
    name: 'Simplified Workflow',
    description: 'Stop researching image formats and juggling multiple tools. Our all-in-one toolkit eliminates the guesswork, delivering web-ready images instantly.',
    icon: <Sparkles size={32} strokeWidth={1.5} className="text-white/90" />,
    color: 'text-yellow-300',
  },
  {
    name: 'Faster Processing',
    description: 'Our lightning-fast processing optimizes your images instantly, delivering files that perform flawlessly in any application.',
    icon: <Timer size={32} strokeWidth={1.5} className="text-white/90" />,
    color: 'text-green-300',
  },
  {
    name: 'Free & Accessible',
    description: 'PixelToolbox is a free service from PixelFanLabs, dedicated to making powerful and simplified tools accessible to everyone.',
    icon: <DollarSign size={32} strokeWidth={1.5} className="text-white/90" />,
    color: 'text-purple-300',
  },
];

const Hero: React.FC = () => {
  const [taglineOpacity, setTaglineOpacity] = useState(1);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    }, 8000); // Change every 8 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1168) {
      cardRefs.current[previewIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [previewIndex]);

  return (
    <div className="relative bg-blue-800 overflow-hidden h-[55vh] flex flex-col">
      <img
        className="absolute inset-0 h-full w-full object-cover"
        src="/images/hero-image-pixeltoolbox.avif"
        alt="Background"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 w-full lg:max-w-6xl mx-auto flex flex-col h-full pt-24">
        {/* Tagline */}
        <div className="flex-1 flex items-center justify-center">
          <div 
            className="text-center transition-opacity duration-300 ease-out px-4 sm:px-6"
            style={{ opacity: taglineOpacity }}
          >
            <h1 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-light text-white leading-tight tracking-wide">
              Your complete toolkit for <span className="font-medium text-blue-300">web-ready images</span>
            </h1>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="pb-8">
          <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar py-4 desktop:justify-center desktop:overflow-visible desktop:snap-none desktop:py-0 gap-6 desktop:gap-12">
            <div className="shrink-0 w-[calc(50%-128px)] desktop:w-0"></div>
            {features.map((feature, index) => (
              <div
                key={feature.name}
                ref={(el) => (cardRefs.current[index] = el)}
                className="group [perspective:1000px] h-52 w-64 snap-center shrink-0"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <div
                  className={`relative h-full w-full transition-all duration-500 [transform-style:preserve-3d] [transform:rotateY(180deg)] ${
                    (previewIndex === index && hoveredCard === null) || hoveredCard === index
                      ? 'desktop:[transform:rotateY(180deg)]'
                      : 'desktop:[transform:rotateY(0deg)]'
                  }`}>
                  {/* Front */}
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center [backface-visibility:hidden]">
                    <div className="mb-3">
                      {React.cloneElement(feature.icon, {
                        size: 32,
                        className: "text-white/90",
                      })}
                    </div>
                    <h3 className="text-sm lg:text-base font-medium text-white/80">
                      {feature.name}
                    </h3>
                  </div>

                  {/* Back */}
                  <div className="absolute inset-0 w-full h-full bg-black/20 backdrop-blur-md rounded-xl p-6 [transform:rotateY(180deg)] [backface-visibility:hidden]">
                    <div className="flex flex-row items-center mb-4">
                      <div className="mr-4">
                        {React.cloneElement(feature.icon, {
                          size: 32,
                          className: "text-white/90",
                        })}
                      </div>
                      <h3 className="text-sm lg:text-base font-medium text-white/80">
                        {feature.name}
                      </h3>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed pb-8">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <div className="shrink-0 w-[calc(50%-128px)] desktop:w-0"></div>
          </div>

          {/* Subtle indicator dots */}
          <div className="flex justify-center mt-6 space-x-2 lg:hidden">
            {features.map((_, index) => (
              <div
                key={index}
                onClick={() => setPreviewIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
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