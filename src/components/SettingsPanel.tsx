import React from 'react';
import { Settings, Sparkles, Crop, Zap } from 'lucide-react';
import { ProcessingSettings, ExportPreset } from '../types';
import { exportPresets, formatOptions, qualityPresets } from '../config/settings';

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
  const handleSettingChange = (key: keyof ProcessingSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-800 mb-2">Quick Presets</h2>
        <p className="text-slate-600">Choose a preset or customize your own settings</p>
      </div>

      {/* Export Presets */}
      <div className="mb-6">
        <h3 className="text-md font-semibold text-slate-800 mb-3 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-yellow-500" />
          Popular Use Cases
        </h3>
        <div className="space-y-3">
          {exportPresets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => onPresetSelect(preset)}
              className={`w-full p-3 rounded-lg border-2 text-left transition-all duration-200 ${
                selectedPreset?.id === preset.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl flex-shrink-0">{preset.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-slate-800">{preset.name}</h4>
                    <div className="text-xs text-slate-500 uppercase font-medium">
                      {preset.format} • {preset.quality}%
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mb-1">{preset.description}</p>
                  <div className="text-xs text-slate-500">
                    {preset.width && preset.height && (
                      <span>{preset.width} × {preset.height}px • </span>
                    )}
                    <span>{preset.useCase}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {/* Format Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-blue-500" />
            Format & Quality
          </h3>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3">
              Output Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              {formatOptions.map((format) => (
                <label
                  key={format.value}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${
                    settings.format === format.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="format"
                    value={format.value}
                    checked={settings.format === format.value}
                    onChange={(e) => handleSettingChange('format', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 text-sm">{format.label}</div>
                    <div className="text-xs text-slate-600">{format.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Quality Level: {settings.quality}%
            </label>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={settings.quality}
              onChange={(e) => handleSettingChange('quality', parseInt(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-slate-500 mt-2">
              <span>Smaller file</span>
              <span>Better quality</span>
            </div>
          </div>
        </div>

        {/* Resize Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center">
            <Crop className="w-5 h-5 mr-2 text-green-500" />
            Resize & Crop
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Width (px)
              </label>
              <input
                type="number"
                value={settings.width || ''}
                onChange={(e) => handleSettingChange('width', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Auto"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Height (px)
              </label>
              <input
                type="number"
                value={settings.height || ''}
                onChange={(e) => handleSettingChange('height', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Auto"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Resize Mode
            </label>
            <div className="space-y-1">
              {[
                { value: 'fit', label: 'Fit', description: 'Resize to fit within bounds, maintain aspect ratio' },
                { value: 'fill', label: 'Fill', description: 'Fill entire area, may crop image' },
                { value: 'stretch', label: 'Stretch', description: 'Stretch to exact dimensions' },
              ].map((mode) => (
                <label
                  key={mode.value}
                  className={`flex items-center p-2 rounded-lg border cursor-pointer transition-all ${
                    settings.resizeMode === mode.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="resizeMode"
                    value={mode.value}
                    checked={settings.resizeMode === mode.value}
                    onChange={(e) => handleSettingChange('resizeMode', e.target.value)}
                    className="sr-only"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 text-sm">{mode.label}</div>
                    <div className="text-xs text-slate-600">{mode.description}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="maintainAspectRatio"
              checked={settings.maintainAspectRatio}
              onChange={(e) => handleSettingChange('maintainAspectRatio', e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="maintainAspectRatio" className="ml-3 text-sm font-medium text-slate-700">
              Maintain aspect ratio
            </label>
          </div>
        </div>
      </div>

      {/* Optimization Toggle */}
      <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Zap className="w-5 h-5 text-yellow-600" />
            <div>
              <h4 className="font-semibold text-slate-800">Smart Optimization</h4>
              <p className="text-xs text-slate-600">
                Automatically optimize file size while maintaining visual quality
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.optimize}
              onChange={(e) => handleSettingChange('optimize', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;