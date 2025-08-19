import React, { useEffect } from 'react';

const AdsterraPopunder: React.FC = () => {
  useEffect(() => {
    const loadPopunder = () => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '//pl27450875.profitableratecpm.com/22/6d/e8/226de84eedb289e5f6a9c3bcbeac4ca5.js';
      script.async = true; // Essential for non-blocking loading

      // It's good practice to add a data-cfasync="false" attribute
      // if it was present in the original Adsterra snippet for this ad type.
      // For popunders, it's often included.
      script.setAttribute('data-cfasync', 'false');

      document.body.appendChild(script);
    };

    loadPopunder();

    // Cleanup function: For popunder scripts, direct removal might not fully
    // stop their behavior as they might have already opened a window.
    // However, it's good practice to remove the script element itself.
    return () => {
      const scriptElement = document.querySelector('script[src="//pl27450875.profitableratecpm.com/22/6d/e8/226de84eedb289e5f6a9c3bcbeac4ca5.js"]');
      if (scriptElement && document.body.contains(scriptElement)) {
        document.body.removeChild(scriptElement);
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  // Popunders don't render any visible JSX content themselves
  return null;
};

export default AdsterraPopunder;
