import React, { useState, useEffect, useRef } from 'react';
import { Settings, Crop, Zap, ChevronDown, ChevronUp, Info } from 'lucide-react';
import { ProcessingSettings } from '../types';
import { formatOptions } from '../config/settings';

interface ImageProcessingSettingsProps {
  settings: ProcessingSettings;
  onSettingsChange: (settings: ProcessingSettings) => void;
}

const ImageProcessingSettings: React.FC<ImageProcessingSettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const [isFormatDropdownOpen, setFormatDropdownOpen] = useState(false);
  const [isResizeModeDropdownOpen, setResizeModeDropdownOpen] = useState(false);
  const [isFormatQualityExpanded, setIsFormatQualityExpanded] = useState(true); // New state for collapsable
  const [isResizeCropExpanded, setIsResizeCropExpanded] = useState(true); // New state for collapsable
  const formatDropdownRef = useRef<HTMLDivElement>(null);
  const resizeModeDropdownRef = useRef<HTMLDivElement>(null);

  const handleSettingChange = (key: keyof ProcessingSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  const handleFormatSelect = (format: string) => {
    handleSettingChange('format', format);
    setFormatDropdownOpen(false);
  };

  const handleResizeModeSelect = (mode: 'fit' | 'fill' | 'stretch') => {
    handleSettingChange('resizeMode', mode);
    setResizeModeDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formatDropdownRef.current && !formatDropdownRef.current.contains(event.target as Node)) {
        setFormatDropdownOpen(false);
      }
      if (resizeModeDropdownRef.current && !resizeModeDropdownRef.current.contains(event.target as Node)) {
        setResizeModeDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedFormat = formatOptions.find(f => f.value === settings.format);
  const resizeModes = [
    { value: 'fit', label: 'Fit', description: 'Resize to fit within bounds, maintain aspect ratio' },
    { value: 'fill', label: 'Fill', description: 'Fill entire area, may crop image' },
    { value: 'stretch', label: 'Stretch', description: 'Stretch to exact dimensions' },
  ];
  const selectedResizeMode = resizeModes.find(m => m.value === settings.resizeMode);

  return (
    <>
      <div className="space-y-6 mb-8">
        {/* Format Settings */}
        <h3
          className="text-lg font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
          onClick={() => setIsFormatQualityExpanded(!isFormatQualityExpanded)}
        >
          <span className="flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-500" strokeWidth={1.5} />
            Format & Quality
          </span>
          {isFormatQualityExpanded ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
        </h3>
        {isFormatQualityExpanded && (
          <div className="mt-3 pl-4 border-l-4 border-blue-200 rounded-bl-lg space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Output Format</label>
              <div className="relative" ref={formatDropdownRef}>
                <button
                  onClick={() => setFormatDropdownOpen(!isFormatDropdownOpen)}
                  className="w-full bg-white border border-slate-300 rounded-lg text-left px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedFormat ? (
                    <div>
                      <div className="font-medium text-slate-800">{selectedFormat.label}</div>
                      <div className="text-sm text-slate-600">{selectedFormat.description}</div>
                    </div>
                  ) : (
                    <span>Choose a format...</span>
                  )}
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isFormatDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {isFormatDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {formatOptions.map((format) => (
                      <div
                        key={format.value}
                        onClick={() => handleFormatSelect(format.value)}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium text-slate-800">{format.label}</div>
                        <div className="text-sm text-slate-600">{format.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Quality Level: {settings.quality}%</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={settings.quality}
                onChange={(e) => handleSettingChange('quality', parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-slate-500 mt-2">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            {/* Preserve Metadata Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="preserveMetadata"
                  checked={settings.preserveMetadata}
                  onChange={(e) => handleSettingChange('preserveMetadata', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="preserveMetadata" className="ml-3 text-sm font-medium text-slate-700">Preserve Metadata (EXIF, IPTC, XMP)</label>
                <div className="relative group ml-2">
                  <Info className="w-4 h-4 text-slate-400 cursor-help" />
                  <div className="absolute left-1/2 transform -translate-x-1/2 -mt-10 w-64 p-2 text-xs text-white bg-slate-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Keep original image metadata like camera settings, date, and copyright information. It is recommended to keep this off unless necessary to ensure maximum compression.
                  </div>
                </div>
              </div>
            </div>


          </div>
        )}

      </div>

      {/* Resize Settings */}
      <div className="space-y-6">
        <h3
          className="text-lg font-semibold text-slate-800 flex items-center justify-between cursor-pointer"
          onClick={() => setIsResizeCropExpanded(!isResizeCropExpanded)}
        >
          <span className="flex items-center">
            <Crop className="w-5 h-5 mr-2 text-green-500" strokeWidth={1.5} />
            Resize & Crop
          </span>
          {isResizeCropExpanded ? <ChevronUp className="w-5 h-5 text-slate-600" /> : <ChevronDown className="w-5 h-5 text-slate-600" />}
        </h3>
        {isResizeCropExpanded && (
          <div className="mt-3 pl-4 border-l-4 border-blue-200 rounded-bl-lg space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Width (px)</label>
                <input
                  type="number"
                  value={settings.width || ''}
                  onChange={(e) => handleSettingChange('width', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Auto"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Height (px)</label>
                <input
                  type="number"
                  value={settings.height || ''}
                  onChange={(e) => handleSettingChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
                  placeholder="Auto"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="maintainAspectRatio"
                checked={settings.maintainAspectRatio}
                onChange={(e) => handleSettingChange('maintainAspectRatio', e.target.checked)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="maintainAspectRatio" className="ml-3 text-sm font-medium text-slate-700">Maintain aspect ratio</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-3">Resize Mode</label>
              <div className="relative" ref={resizeModeDropdownRef}>
                <button
                  onClick={() => setResizeModeDropdownOpen(!isResizeModeDropdownOpen)}
                  className="w-full bg-white border border-slate-300 rounded-lg text-left px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {selectedResizeMode ? (
                    <div>
                      <div className="font-medium text-slate-800">{selectedResizeMode.label}</div>
                      <div className="text-sm text-slate-600">{selectedResizeMode.description}</div>
                    </div>
                  ) : (
                    <span>Choose a resize mode...</span>
                  )}
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isResizeModeDropdownOpen ? 'transform rotate-180' : ''}`} />
                </button>

                {isResizeModeDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                    {resizeModes.map((mode) => (
                      <div
                        key={mode.value}
                        onClick={() => handleResizeModeSelect(mode.value as any)}
                        className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                      >
                        <div className="font-medium text-slate-800">{mode.label}</div>
                        <div className="text-sm text-slate-600">{mode.description}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ImageProcessingSettings;
