import React, { useState, useCallback } from 'react';
import ImageUploader from './ImageUploader';
import SettingsPanel from './SettingsPanel';
import ExportPanel from './ExportPanel';
import { defaultSettings } from '../config/settings';
import { ImageFile, ProcessingSettings, ExportPreset } from '../types';
import { processImage } from '../utils/imageProcessor'; // Import processImage

const OptimizeImagesSection: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ProcessingSettings>(defaultSettings);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset | null>(null);
  const [showExportSection, setShowExportSection] = useState(false); // New state for export section visibility
  const [processedImages, setProcessedImages] = useState<ImageFile[]>([]); // New state for processed images
  const [processingProgress, setProcessingProgress] = useState(0); // New state for processing progress
  const [processingTime, setProcessingTime] = useState(0); // New state for processing time

  const handleImagesUploaded = useCallback((newImages: ImageFile[]) => {
    setImages(prevImages => [...prevImages, ...newImages]);
    setShowExportSection(false); // Hide export section when new images are uploaded
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prevImages => prevImages.filter(img => img.id !== id));
    setShowExportSection(false); // Hide export section when images are removed
  }, []);

  const handleSettingsChange = useCallback((newSettings: ProcessingSettings) => {
    setSettings(newSettings);
    setShowExportSection(false); // Hide export section when settings change
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
    setShowExportSection(false); // Hide export section when preset changes
  }, [settings]);

  // New function to handle image processing
  const handleProcessImages = useCallback(async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    const startTime = Date.now();
    const updatedImages: ImageFile[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      try {
        const result = await processImage(image.file, settings);

        if (settings.generateSrcset && Array.isArray(result)) {
          const resultsArray = result as ProcessedImageResult[];
          const totalSize = resultsArray.reduce((sum, r) => sum + r.size, 0);
          updatedImages.push({
            ...image,
            processedResults: resultsArray,
            processedSize: totalSize,
          });
        } else {
          const singleResult = result as ProcessedImageResult;
          updatedImages.push({
            ...image,
            processedUrl: singleResult.url,
            processedSize: singleResult.size,
            width: singleResult.width,
            height: singleResult.height,
          });
        }
        setProcessingProgress(((i + 1) / images.length) * 100);
      } catch (error) {
        console.error('Error processing image:', error);
        updatedImages.push({ ...image, processedUrl: undefined, processedSize: undefined });
      }
    }

    const endTime = Date.now();
    setProcessingTime((endTime - startTime) / 1000);
    setProcessedImages(updatedImages);
    setIsProcessing(false);
    setShowExportSection(true); // Show export section after processing
  }, [images, settings]);

  return (
    <section id="optimize" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Optimize Images</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <ImageUploader onImagesUploaded={handleImagesUploaded} images={images} handleRemoveImage={handleRemoveImage} />
        <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} onPresetSelect={handlePresetSelect} selectedPreset={selectedPreset} />
      </div>

      {/* Preview Button */}
      {images.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={handleProcessImages}
            disabled={isProcessing}
            className={`px-8 py-4 rounded-lg font-medium transition-colors text-lg ${
              isProcessing
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isProcessing ? 'Processing...' : (showExportSection ? 'Re-generate Preview' : 'Generate Preview')}
          </button>
        </div>
      )}

      {/* Export Section (conditionally rendered) */}
      {showExportSection && processedImages.length > 0 && (
        <div className="mt-12">
          <ExportPanel
            images={processedImages} // Pass processed images
            settings={settings}
            isProcessing={isProcessing}
            handleRemoveImage={handleRemoveImage}
            processingProgress={processingProgress} // Pass processing progress
            processingTime={processingTime} // Pass processing time
          />
        </div>
      )}
    </section>
  );
};

export default OptimizeImagesSection;