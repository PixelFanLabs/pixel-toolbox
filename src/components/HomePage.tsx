import React from 'react';
import Hero from './Hero';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export default HomePage;