import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, ChevronDown, ChevronUp, Zap } from 'lucide-react';
import { ProcessingSettings, ExportPreset } from '../types';
import { exportPresets } from '../config/settings';
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
    setIsDropdownOpen(false);
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
          Select Image Format
        </h3>
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
                      <span className="uppercase">{selectedPreset.format} • {selectedPreset.quality}% quality</span>
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
      </div>

      <div className="mb-8">
        <button
          className="w-full flex items-center justify-between p-4 bg-slate-100 rounded-lg shadow-sm hover:bg-slate-200 transition-colors"
          onClick={() => setFineTuneExpanded(!isFineTuneExpanded)}
        >
          <h2 className="text-xl font-bold text-slate-800">Fine-Tune Options</h2>
          {isFineTuneExpanded ? <ChevronUp className="w-6 h-6 text-slate-600" /> : <ChevronDown className="w-6 h-6 text-slate-600" />}
        </button>
      </div>

      {isFineTuneExpanded && (
        <ImageProcessingSettings
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
      )}
    </div>
  );
};

export default SettingsPanel;