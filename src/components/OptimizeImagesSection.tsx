import React from 'react';
import ImageUploader from './ImageUploader';
import SettingsPanel from './SettingsPanel';
import { defaultSettings } from '../config/settings';
import { ImageFile } from '../types';

interface OptimizeImagesSectionProps {
  onImagesUploaded: (images: ImageFile[]) => void;
}

const OptimizeImagesSection: React.FC<OptimizeImagesSectionProps> = ({ onImagesUploaded }) => {
  return (
    <section id="optimize" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Optimize Images</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ImageUploader onImagesUploaded={onImagesUploaded} />
        <SettingsPanel settings={defaultSettings} onSettingsChange={() => {}} onPresetSelect={() => {}} selectedPreset={null} />
      </div>
    </section>
  );
};

export default OptimizeImagesSection;