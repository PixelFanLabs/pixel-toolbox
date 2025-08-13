import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import SettingsPanel from './SettingsPanel';
import PreviewPanel from './PreviewPanel';
import ExportPanel from './ExportPanel';
import { defaultSettings } from '../config/settings';
import { ImageFile, ProcessingSettings, ExportPreset } from '../types';

const OptimizeImagesSection: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ProcessingSettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset | null>(null);

  const handleImagesUploaded = useCallback((newImages: ImageFile[]) => {
    setImages(prevImages => [...prevImages, ...newImages]);
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prevImages => prevImages.filter(img => img.id !== id));
  }, []);

  const handleSettingsChange = useCallback((newSettings: ProcessingSettings) => {
    setSettings(newSettings);
  }, []);

  const handlePresetSelect = useCallback((preset: ExportPreset) => {
    setSelectedPreset(preset);
    setSettings({
      ...settings,
      format: preset.format,
      quality: preset.quality,
      width: preset.width,
      height: preset.height,
    });
  }, [settings]);

  return (
    <section id="optimize" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-20">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Optimize Images</h2>
      <div className="flex flex-col items-center">
        <div className="w-full">
          <ImageUploader onImagesUploaded={handleImagesUploaded} />
        </div>
        <div className="w-full mt-12">
          <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} onPresetSelect={handlePresetSelect} selectedPreset={selectedPreset} />
        </div>
      </div>

      {images.length > 0 && (
        <div className="mt-12">
          <PreviewPanel images={images} settings={settings} isProcessing={isProcessing} setIsProcessing={setIsProcessing} />
          <ExportPanel images={images} settings={settings} isProcessing={isProcessing} handleRemoveImage={handleRemoveImage} />
        </div>
      )}
    </section>
  );
};

export default OptimizeImagesSection;