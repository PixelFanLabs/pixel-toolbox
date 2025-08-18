import React from 'react';
import Hero from './Hero';
import { ImageFile } from '../types';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export default HomePage;