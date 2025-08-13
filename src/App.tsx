import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import About from './components/About';
import HomePage from './components/HomePage';
import MainContent from './components/MainContent';
import { ImageFile, ProcessingSettings, ExportPreset } from './types';
import { defaultSettings } from './config/settings';

function App() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ProcessingSettings>(defaultSettings);
  const [activeTab, setActiveTab] = useState<'upload' | 'settings' | 'preview' | 'export'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset | null>(null);
  const [showAboutPage, setShowAboutPage] = useState(false);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex flex-col">
      <Header onAboutClick={() => setShowAboutPage(true)} />
      
      <main className="flex-grow">
        {showAboutPage ? (
          <About onBackClick={() => setShowAboutPage(false)} />
        ) : images.length === 0 ? (
          <HomePage onImagesUploaded={handleImagesUploaded} />
        ) : (
          <MainContent
            images={images}
            settings={settings}
            activeTab={activeTab}
            isProcessing={isProcessing}
            selectedPreset={selectedPreset}
            showAboutPage={showAboutPage}
            handleImagesUploaded={handleImagesUploaded}
            handleRemoveImage={handleRemoveImage}
            handleSettingsChange={handleSettingsChange}
            handlePresetSelect={handlePresetSelect}
            setActiveTab={setActiveTab}
            setImages={setImages}
            setIsProcessing={setIsProcessing}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-6 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center text-sm">
          <p>© 2025 PixelToolbox. A free web service created by PixelFanLabs, designed to empower your creative process</p>
        </div>
      </footer>
    </div>
  );
}

export default App;