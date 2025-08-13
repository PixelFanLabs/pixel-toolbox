import React from 'react';
import { Settings, Download, Image as ImageIcon } from 'lucide-react';
import SettingsPanel from './SettingsPanel';
import PreviewPanel from './PreviewPanel';
import ExportPanel from './ExportPanel';
import { ImageFile, ProcessingSettings, ExportPreset } from '../types';

interface MainContentProps {
  images: ImageFile[];
  settings: ProcessingSettings;
  activeTab: 'settings' | 'preview' | 'export';
  isProcessing: boolean;
  selectedPreset: ExportPreset | null;
  showAboutPage: boolean;
  handleSettingsChange: (newSettings: ProcessingSettings) => void;
  handlePresetSelect: (preset: ExportPreset) => void;
  setActiveTab: (tab: 'settings' | 'preview' | 'export') => void;
  setImages: (images: ImageFile[]) => void;
  setIsProcessing: (isProcessing: boolean) => void;
}

const MainContent: React.FC<MainContentProps> = ({
  images,
  settings,
  activeTab,
  isProcessing,
  selectedPreset,
  handleSettingsChange,
  handlePresetSelect,
  setActiveTab,
  setImages,
  setIsProcessing,
}) => {
  const canProceedToPreview = images.length > 0;
  const canProceedToExport = images.length > 0 && images.some(img => img.processedUrl);

  const getTabContent = () => {
    switch (activeTab) {
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
    <>
      {/* Navigation Tabs */}
      <div className="max-w-6xl mx-auto px-6 pt-8">
        <nav className="flex space-x-1 bg-white rounded-xl p-2 shadow-sm border border-slate-200 mb-8">
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
            <Settings size={18} strokeWidth={1.5} />
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
            <ImageIcon size={18} strokeWidth={1.5} />
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
            <Download size={18} strokeWidth={1.5} />
            <span>Export</span>
          </button>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
          {getTabContent()}
        </div>
      </div>
    </>
  );
};

export default MainContent;