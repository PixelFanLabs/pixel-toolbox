import React from 'react';
import { Settings, Sparkles, Crop, Zap } from 'lucide-react';
import { ProcessingSettings, ExportPreset } from '../types';
import { exportPresets, formatOptions } from '../config/settings';

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
  const handleSettingChange = (key: keyof ProcessingSettings, value: ProcessingSettings[keyof ProcessingSettings]) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div className="p-8">
      {/* Export Presets */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" strokeWidth={1.5} />
          Select Image format
        </h3>
        <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
          {exportPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                selectedPreset?.id === preset.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-2xl">{preset.icon}</span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-slate-800">{preset.name}</h4>
                  <p className="text-sm text-slate-600 mb-2">{preset.description}</p>
                  <div className="text-xs text-slate-500 space-y-1">
                    {preset.width && preset.height && (
                      <div>{preset.width} × {preset.height}px</div>
                    )}
                    <div className="uppercase">{preset.format} • {preset.quality}% quality</div>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      
    </div>
  );
};

export default SettingsPanel;