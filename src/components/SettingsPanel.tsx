import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Settings, Info } from 'lucide-react';

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
  const [isHoveringImageProfileInfo, setIsHoveringImageProfileInfo] = useState(false); // New state for info hover
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
      srcsetSizes: updatedSrcsetSizes,
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
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-6">Output Image Settings</h3>

        <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <span className="text-base font-medium text-slate-700 block">
              Image Profile
              <div
                className="ml-2 group relative inline-flex items-center"
                onMouseEnter={() => setIsHoveringImageProfileInfo(true)}
                onMouseLeave={() => setIsHoveringImageProfileInfo(false)}
              >
                <Info className="w-4 h-4 text-slate-400 cursor-pointer" />
                {isHoveringImageProfileInfo && (
                  <div className="absolute left-1/2 transform -translate-x-1/2 top-full mt-2 bg-slate-800 text-white text-xs rounded-xl py-2 px-3 w-64 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 shadow-lg">
                    Choose an image profile to apply a set of recommended settings for common use cases, suchs as web, social media, or print.
                  </div>
                )}
              </div>
            </span>
          </div>
        </div>
        <div className="relative mt-4" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-white/80 backdrop-blur-sm border border-slate-300 rounded-xl text-left px-4 py-3 flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-blue-300 transition-all duration-200"
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
            <div className="absolute z-10 mt-1 w-full bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
              {exportPresets.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors duration-200"
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

        <div className="mt-6">
          <ToggleButton
            id="generateSrcset"
            label="Generate Responsive Images"
            description="Generate multiple image sizes that can be used with the `srcset` attribute in HTML code. This allows browsers to choose the most appropriate image for different screen sizes and resolutions, improving performance. This is particularly useful for images used on websites and in Content Management Systems (CMS)."
            checked={settings.generateSrcset}
            onChange={handleGenerateSrcsetChange}
          />
        </div>
        {settings.generateSrcset && (
          <div className="mt-4 p-4 bg-blue-50/50 border border-blue-200 rounded-xl">
            <h4 className="text-base font-semibold text-slate-800">Srcset Dimensions (px)</h4>
            <div className="space-y-3">
              {Object.keys(srcsetSizes).map((sizeKey) => {
                const size = sizeKey as keyof typeof defaultSrcsetSizes;
                const { width, enabled, description } = srcsetSizes[size];
                const defaultWidth = defaultSrcsetSizes[size].width;

                return (
                  <div key={size} className="flex items-start justify-between py-2 border-b last:border-b-0 border-slate-100">
                    <div className="flex items-start">
                      <div className="flex items-center h-5 mt-1 mr-2">
                        <input
                          id={`srcset-${size}-enabled`}
                          type="checkbox"
                          checked={enabled}
                          onChange={(e) => handleSrcsetSizeChange(size, 'enabled', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                      </div>
                      <div>
                        <label htmlFor={`srcset-${size}-enabled`} className="block text-sm font-medium text-slate-700 cursor-pointer capitalize">
                          {size} ({width || defaultWidth}px)
                        </label>
                        <p className="text-xs text-slate-500">{description}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 w-24 ml-4">
                      <input
                        type="number"
                        value={width || ''}
                        onChange={(e) => handleSrcsetSizeChange(size, 'width', e.target.value ? parseInt(e.target.value) : undefined)}
                        placeholder={defaultWidth.toString()}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-right transition-all duration-200"
                        disabled={!enabled}
                      />
                    </div>
                  </div>
                );
              })}
              </div>
          </div>
  )}
        <div className="mt-8">
          <ToggleButton
            id="smartOptimization"
            label="Smart Optimization"
            description="Automatically balances file size and visual quality for the best results. An intelligent algorithm analyzes the image content and determines the optimal compression level to significantly reduce file size while preserving perceived visual quality. This automated process simplifies image optimization for you."
            checked={isSmartOptimizationEnabled}
            onChange={handleSmartOptimizationChange}
          />
        </div>
      </div>
      </div>

      <div className="border-t border-slate-200 pt-8">
        <h3
        className="text-lg font-semibold text-slate-800 mb-6 flex items-center justify-between cursor-pointer"
        onClick={() => setFineTuneExpanded(!isFineTuneExpanded)}
      >
        <span className="flex items-center">
          Fine-Tune Settings
        </span>
        {isFineTuneExpanded ? <ChevronUp className="w-6 h-6 text-slate-600" /> : <ChevronDown className="w-6 h-6 text-slate-600" />}
        </h3>

      {isFineTuneExpanded && (
        <div className="space-y-6">
          <ImageProcessingSettings
            settings={settings}
            onSettingsChange={onSettingsChange}
          />
        </div>
      )}
      </div>
    </div>
  );
};

export default SettingsPanel;