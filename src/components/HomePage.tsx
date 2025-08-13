import React from 'react';
import Hero from './Hero';
import ImageUploader from './ImageUploader';
import SettingsPanel from './SettingsPanel';
import { defaultSettings } from '../config/settings';
import { ImageFile } from '../types';

interface HomePageProps {
  onImagesUploaded: (images: ImageFile[]) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onImagesUploaded }) => {
  return (
    <div>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ImageUploader onImagesUploaded={onImagesUploaded} />
          <SettingsPanel settings={defaultSettings} onSettingsChange={() => {}} onPresetSelect={() => {}} selectedPreset={null} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;