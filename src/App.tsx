import React, { useState, useCallback } from 'react';
import { Upload, Settings, Download, Image as ImageIcon, Zap, Github } from 'lucide-react';
import ImageUploader from './components/ImageUploader';
import SettingsPanel from './components/SettingsPanel';
import PreviewPanel from './components/PreviewPanel';
import ExportPanel from './components/ExportPanel';
import Header from './components/Header';
import { ImageFile, ProcessingSettings, ExportPreset } from './types';
import { defaultSettings, exportPresets } from './config/settings';

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

  const canProceedToPreview = images.length > 0;
  const canProceedToExport = images.length > 0 && images.some(img => img.processedUrl);

  const getTabContent = () => {
    switch (activeTab) {
      case 'upload':
        return (
          <ImageUploader
            images={images}
            onImagesUploaded={handleImagesUploaded}
            onRemoveImage={handleRemoveImage}
          />
        );
      case 'settings':
        return (
          <SettingsPanel
            settings={settings}
            onSettingsChange={handleSettingsChange}
            onPresetSelect={handlePresetSelect}
            selectedPreset={selectedPreset}
          />
        );
      case 'preview':
        return (
          <PreviewPanel
            images={images}
            settings={settings}
            onImagesProcessed={setImages}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        );
      case 'export':
        return (
          <ExportPanel
            images={images.filter(img => img.processedUrl)}
            settings={settings}
            selectedPreset={selectedPreset}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="flex space-x-1 bg-white rounded-xl p-2 shadow-sm border border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab('upload')}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'upload'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Upload size={18} />
            <span>Upload</span>
          </button>
          
          <button
            onClick={() => setActiveTab('settings')}
            disabled={images.length === 0}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'settings'
                ? 'bg-blue-600 text-white shadow-md'
                : images.length === 0
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
          
          <button
            onClick={() => setActiveTab('preview')}
            disabled={!canProceedToPreview}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'preview'
                ? 'bg-blue-600 text-white shadow-md'
                : !canProceedToPreview
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <ImageIcon size={18} />
            <span>Preview</span>
          </button>
          
          <button
            onClick={() => setActiveTab('export')}
            disabled={!canProceedToExport}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              activeTab === 'export'
                ? 'bg-blue-600 text-white shadow-md'
                : !canProceedToExport
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
            }`}
          >
            <Download size={18} />
            <span>Export</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {getTabContent()}
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 py-8 mt-16">
        <div className="flex items-center justify-between text-slate-500 text-sm">
          <div>
            <p>© 2025 PixelToolbox. All processing happens in your browser.</p>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="https://github.com/pixeltoolbox/pixeltoolbox"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              <Github size={16} />
              <span>View Source</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;