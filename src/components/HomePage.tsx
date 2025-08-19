import React from 'react';
import Hero from './Hero';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div>
      <Hero />
      {/* Adsterra Leaderboard Banner Ad */}
      <div className="my-8 flex justify-center">
        <script type="text/javascript" dangerouslySetInnerHTML={{
          __html: `
            atOptions = {
              'key' : 'ad8f4ced24d88f4f48d5c63acc6b9634',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
          `
        }}></script>
        <script type="text/javascript" src="//www.highperformanceformat.com/ad8f4ced24d88f4f48d5c63acc6b9634/invoke.js"></script>
      </div>
    </div>
  );
};

export default HomePage;