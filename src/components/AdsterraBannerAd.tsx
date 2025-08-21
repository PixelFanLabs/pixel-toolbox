import React, { useEffect, useRef, useState } from 'react';

const AdsterraBannerAd: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const adContainer = adContainerRef.current;
    if (adContainer) {
      // Clear any existing ad content to prevent duplicates on re-render
      adContainer.innerHTML = '';

      let adUnitConfig;

      if (screenWidth <= 767) { // Mobile
        adUnitConfig = {
          key: '7d0611dfd5286d972307c89c9c3c231c',
          width: 300,
          height: 250,
        };
      } else { // Tablet and Desktop
        adUnitConfig = {
          key: 'ad8f4ced24d88f4f48d5c63acc6b9634',
          width: 728,
          height: 90,
        };
      }

      const scriptText = `
        var atOptions = {
          'key' : '${adUnitConfig.key}',
          'format' : 'iframe',
          'height' : ${adUnitConfig.height},
          'width' : ${adUnitConfig.width},
          'params' : {}
        };
      `;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = scriptText;
      adContainer.appendChild(script);

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adUnitConfig.key}/invoke.js`;
      invokeScript.async = true;
      adContainer.appendChild(invokeScript);
    }
  }, [screenWidth]);

  return (
    <div ref={adContainerRef} className="flex justify-center w-full">
      {/* Ad will be loaded dynamically here */}
    </div>
  );
};

export default AdsterraBannerAd;
