import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import About from './components/About';
import HomePage from './components/HomePage';
import FAQ from './components/FAQ';
import OptimizeImagesSection from './components/OptimizeImagesSection';
import MainContent from './components/MainContent';
import { ImageFile, ProcessingSettings, ExportPreset } from './types';
import { defaultSettings } from './config/settings';

function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ProcessingSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'upload' | 'settings' | 'preview' | 'export'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset | null>(null);

  const handleImagesUploaded = useCallback((newImages: ImageFile[]) => {
    setImages(prevImages => [...prevImages, ...newImages]);
    if (newImages.length > 0 && activeTab === 'upload') {
      setActiveTab('settings');
    }
  }, [activeTab]);

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
    <div id="top" className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <HomePage onImagesUploaded={handleImagesUploaded} /> {/* Hero section */}
        <div id="optimize">
          {images.length === 0 ? (
            <OptimizeImagesSection onImagesUploaded={handleImagesUploaded} />
          ) : (
            <MainContent
              images={images}
              settings={settings}
              activeTab={activeTab}
              isProcessing={isProcessing}
              selectedPreset={selectedPreset}
              handleImagesUploaded={handleImagesUploaded}
              handleRemoveImage={handleRemoveImage}
              handleSettingsChange={handleSettingsChange}
              handlePresetSelect={handlePresetSelect}
              setActiveTab={setActiveTab}
              setImages={setImages}
              setIsProcessing={setIsProcessing}
            />
          )}
        </div>
        <About />
        <FAQ />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-8 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>© 2025 PixelToolbox. A free web service created by PixelFanLabs.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;