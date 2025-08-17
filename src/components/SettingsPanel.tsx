import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Settings } from 'lucide-react';
import { ProcessingSettings, ExportPreset } from '../types';
import { exportPresets, formatOptions } from '../config/settings'; // Import formatOptions
import ImageProcessingSettings from './ImageProcessingSettings';

interface SettingsPanelProps {
  settings: ProcessingSettings;
  onSettingsChange: (settings: ProcessingSettings) => void;
  onPresetSelect: (preset: ExportPreset) => void;
  selectedPreset: ExportPreset | null;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onPresetSelect,
  selectedPreset,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFineTuneExpanded, setFineTuneExpanded] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handlePresetSelect = (preset: ExportPreset) => {
    onPresetSelect(preset);
    onSettingsChange({
      ...settings,
      format: preset.format,
      quality: preset.quality,
      width: preset.width,
      height: preset.height,
      generateSrcset: preset.generateSrcset, // Update generateSrcset from preset
    });
    setIsDropdownOpen(false);
  };

  const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onSettingsChange({
      ...settings,
      format: e.target.value as 'png' | 'jpeg' | 'webp' | 'avif',
    });
  };

  const handleGenerateSrcsetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSettingsChange({
      ...settings,
      generateSrcset: e.target.checked,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" strokeWidth={1.5} />
          Select Image format
        </h3>
        {/* Dropdown for presets */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white border border-slate-300 rounded-lg text-left px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {selectedPreset ? (
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{selectedPreset.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-slate-800">{selectedPreset.name}</div>
                  <div className="text-sm text-slate-500 mb-1">{selectedPreset.description}</div>
                  <div className="text-xs text-slate-500 space-y-1">
                      {selectedPreset.width && selectedPreset.height && (
                        <span>{selectedPreset.width} × {selectedPreset.height}px • </span>
                      )}
                      <span className="uppercase">{selectedPreset.format} • {selectedPreset.quality}% quality {selectedPreset.generateSrcset ? ' • SRCSET' : ''}</span>
                    </div>
                </div>
              </div>
            ) : (
              <span>Choose a format...</span>
            )}
            <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {exportPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{preset.icon}</span>
                    <div>
                      <div className="font-semibold text-slate-800">{preset.name}</div>
                      <div className="text-sm text-slate-500">{preset.description}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Separate dropdown for base format when no preset is selected or fine-tuning */} 
        <div className="mt-4">
          <label htmlFor="output-format" className="block text-sm font-medium text-slate-700 mb-1">Output Format</label>
          <select
            id="output-format"
            name="output-format"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={settings.format}
            onChange={handleFormatChange}
          >
            {formatOptions.filter(opt => opt.value !== 'svg').map((option) => ( // SVG is not a raster image format for processing
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-8">
        <button
          className="w-full flex items-center justify-between p-4 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200 transition-colors"
          onClick={() => setFineTuneExpanded(!isFineTuneExpanded)}
        >
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-500" strokeWidth={1.5} />
            Fine-Tune Settings
          </h3>
          {isFineTuneExpanded ? <ChevronUp className="w-6 h-6 text-slate-600" /> : <ChevronDown className="w-6 h-6 text-slate-600" />}
        </button>
      </div>

      {isFineTuneExpanded && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <label htmlFor="generateSrcset" className="text-base font-medium text-slate-800 cursor-pointer">Generate Responsive Image Set (srcset)</label>
            <input
              type="checkbox"
              id="generateSrcset"
              name="generateSrcset"
              checked={settings.generateSrcset}
              onChange={handleGenerateSrcsetChange}
              className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <ImageProcessingSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </div>
      )}
    </div>
  );
};

export default SettingsPanel;