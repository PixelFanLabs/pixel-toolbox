import React from 'react';
import Hero from './Hero';

interface HomePageProps {
  onImagesUploaded: (images: ImageFile[]) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onImagesUploaded }) => {
  return (
    <div>
      <Hero />
    </div>
  );
};

export default HomePage;