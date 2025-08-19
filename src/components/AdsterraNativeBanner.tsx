import React, { useEffect, useRef } from 'react';

const AdsterraNativeBanner: React.FC = () => {
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadNativeBanner = () => {
      const adContainer = adContainerRef.current;
      if (!adContainer) {
        console.warn('Adsterra native banner container not found.');
        return;
      }

      // Clear any existing ad content
      adContainer.innerHTML = '';

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.setAttribute('data-cfasync', 'false');
      invokeScript.async = true;
      invokeScript.src = '//pl27450259.profitableratecpm.com/eaa56e5d2f00d1d5a4b44c95331429f1/invoke.js';
      
      adContainer.appendChild(invokeScript);
    };

    loadNativeBanner();

    // Cleanup function to remove scripts if the component unmounts
    return () => {
      const adContainer = adContainerRef.current;
      if (adContainer) {
        adContainer.innerHTML = '';
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="my-8 flex justify-center" id="container-eaa56e5d2f00d1d5a4b44c95331429f1" ref={adContainerRef}>
      {/* Adsterra Native Banner will be loaded dynamically here */}
    </div>
  );
};

export default AdsterraNativeBanner;
