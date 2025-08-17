import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Settings } from 'lucide-react';

import { ProcessingSettings, ExportPreset, Format } from '../types';
import { exportPresets } from '../config/settings';
import ImageProcessingSettings from './ImageProcessingSettings';
import ToggleButton from './ToggleButton';

interface SettingsPanelProps {
  settings: ProcessingSettings;
  onSettingsChange: (settings: ProcessingSettings) => void;
  onPresetSelect: (preset: ExportPreset) => void;
  selectedPreset: ExportPreset | null;
}

const defaultSrcsetSizes = {
  small: { width: 480, enabled: true, description: 'Target mobile phone screens.' },
  medium: { width: 800, enabled: true, description: 'Target tablets and smaller laptops.' },
  large: { width: 1200, enabled: true, description: 'Target standard desktop screens.' },
  extraLarge: { width: 1600, enabled: false, description: 'For high-resolution displays or full-width hero images.' },
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  settings,
  onSettingsChange,
  onPresetSelect,
  selectedPreset,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFineTuneExpanded, setFineTuneExpanded] = useState(false);
  const [isSmartOptimizationEnabled, setIsSmartOptimizationEnabled] = useState(settings.optimize);
  // Initialize srcset sizes with defaults, overriding with saved settings if they exist
  const [srcsetSizes, setSrcsetSizes] = useState({
    small: { ...defaultSrcsetSizes.small, ...settings.srcsetSizes?.small },
    medium: { ...defaultSrcsetSizes.medium, ...settings.srcsetSizes?.medium },
    large: { ...defaultSrcsetSizes.large, ...settings.srcsetSizes?.large },
    extraLarge: { ...defaultSrcsetSizes.extraLarge, ...settings.srcsetSizes?.extraLarge },
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); }; }, []);

  const handlePresetSelect = (preset: ExportPreset) => {
    onPresetSelect(preset);
    onSettingsChange({
      ...settings,
      format: preset.format,
      quality: preset.quality,
      width: preset.width,
      height: preset.height,
      generateSrcset: preset.generateSrcset, // Revert to using preset's generateSrcset
    });
    setIsDropdownOpen(false);
  };

  const handleFormatChange = (format: Format) => {
    onSettingsChange({
      ...settings,
      format,
    });
  };

  const handleGenerateSrcsetChange = (checked: boolean) => {
    // When enabling srcset, ensure at least one size is enabled if none are
    const updatedSrcsetSizes = { ...srcsetSizes };
    if (checked && !updatedSrcsetSizes.small.enabled && !updatedSrcsetSizes.medium.enabled && !updatedSrcsetSizes.large.enabled && !updatedSrcsetSizes.extraLarge.enabled) {
      updatedSrcsetSizes.small.enabled = true; // Enable small by default if none are selected
    }
    setSrcsetSizes(updatedSrcsetSizes); // Update local state immediately
    onSettingsChange({
      ...settings,
      generateSrcset: checked,
      srcsetSizes: updatedSrcsetSizes, // Pass updated sizes with the setting change
    });
  };

  const handleSrcsetSizeChange = (size: keyof typeof defaultSrcsetSizes, key: 'width' | 'enabled', value: number | boolean) => {
    const updatedSrcsetSizes = {
      ...srcsetSizes,
      [size]: { ...srcsetSizes[size], [key]: value },
    };
    setSrcsetSizes(updatedSrcsetSizes);
    onSettingsChange({
      ...settings,
      srcsetSizes: updatedSrcsetSizes,
    });
  };

  const handleSmartOptimizationChange = (checked: boolean) => {
    setIsSmartOptimizationEnabled(checked);
    onSettingsChange({
      ...settings,
      optimize: checked,
    });
  };

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

        <div className="mt-4">
          <ToggleButton
            id="generateSrcset"
            label="Generate Responsive Images"
            description="Generate multiple image sizes that can be used with the `srcset` attribute in HTML code. This allows browsers to choose the most appropriate image for different screen sizes and resolutions, improving performance. This is particularly useful for images used on websites and in Content Management Systems (CMS)."
            checked={settings.generateSrcset}
            onChange={handleGenerateSrcsetChange}
          />
        </div>
        {settings.generateSrcset && (
          <div className="space-y-4 mt-3">
            <h4 className="text-base font-semibold text-slate-800">Srcset Dimensions (px)</h4>
            <div className="space-y-4">
              {Object.keys(srcsetSizes).map((sizeKey) => {
                const size = sizeKey as keyof typeof defaultSrcsetSizes;
                const { width, enabled, description } = srcsetSizes[size];
                const defaultWidth = defaultSrcsetSizes[size].width;

                return (
                  <div key={size} className="flex items-start space-x-4">
                    <div className="flex items-center h-5 mt-1">
                      <input
                        id={`srcset-${size}-enabled`}
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => handleSrcsetSizeChange(size, 'enabled', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex-1">
                      <label htmlFor={`srcset-${size}-enabled`} className="block text-sm font-medium text-slate-700 cursor-pointer capitalize">
                        {size} ({width || defaultWidth}px)
                      </label>
                      <p className="text-xs text-slate-500 mb-2">{description}</p>
                      <input
                        type="number"
                        value={width || ''}
                        onChange={(e) => handleSrcsetSizeChange(size, 'width', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder={defaultWidth.toString()}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!enabled}
                      />
                    </div>
                  </div>
                );
              })}
              </div>
          </div>
  )}
        <div className="mt-6">
          <ToggleButton
            id="smartOptimization"
            label="Smart Optimization"
            description="Automatically balances file size and visual quality for the best results. An intelligent algorithm analyzes the image content and determines the optimal compression level to significantly reduce file size while preserving perceived visual quality. This automated process simplifies image optimization for you."
            checked={isSmartOptimizationEnabled}
            onChange={handleSmartOptimizationChange}
          />
        </div>
      </div>

      <div className="mb-8 mt-4">
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