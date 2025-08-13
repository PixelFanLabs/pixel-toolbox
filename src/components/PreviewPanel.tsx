import React, { useState } from 'react';
import { Play, RotateCcw, Eye, BarChart3, Clock, XCircle } from 'lucide-react'; // Added XCircle
import { ImageFile, ProcessingSettings } from '../types';
import { processImage } from '../utils/imageProcessor';
import { formatFileSize, calculateCompressionRatio } from '../utils/helpers';

interface PreviewPanelProps {
  images: ImageFile[];
  settings: ProcessingSettings;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
  handleRemoveImage: (id: string) => void; // Added handleRemoveImage
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  images,
  settings,
  isProcessing,
  setIsProcessing,
  handleRemoveImage, // Destructured
}) => {
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [showComparison, setShowComparison] = useState(false);

  const processedImages = images.filter(img => img.processedUrl);
  const totalSavings = images.reduce((acc, img) => {
    if (img.processedSize) {
      return acc + (img.originalSize - img.processedSize);
    }
    return acc;
  }, 0);

  const averageCompression = images.length > 0 
    ? images.reduce((acc, img) => acc + calculateCompressionRatio(img.originalSize, img.processedSize || img.originalSize), 0) / images.length
    : 0;

  const handleProcessImages = async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    const startTime = Date.now();
    const updatedImages = [...images];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      try {
        const result = await processImage(image.file, settings);
        updatedImages[i] = {
          ...image,
          processedUrl: result.url,
          processedSize: result.size,
        };
        setProcessingProgress((i + 1) / images.length * 100);
      } catch (error) {
        console.error('Error processing image:', error);
      }
    }

    const endTime = Date.now();
    setProcessingTime((endTime - startTime) / 1000);
    // onImagesProcessed(updatedImages); // Removed this line
    setIsProcessing(false);
  };

  const handleResetProcessing = () => {
    const resetImages = images.map(img => ({
      ...img,
      processedUrl: undefined,
      processedSize: undefined,
    }));
    // onImagesProcessed(resetImages); // Removed this line
    setProcessingProgress(0);
    setProcessingTime(0);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Preview & Process</h2>
          <p className="text-slate-600">Review your settings and process the images.</p>
        </div>

        <div className="flex items-center space-x-4">
          {processedImages.length > 0 && (
            <>
              <button
                onClick={() => setShowComparison(!showComparison)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  showComparison
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <Eye className="w-4 h-4 mr-2 inline-block" />
                Compare
              </button>
              <button
                onClick={handleResetProcessing}
                className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-colors"
              >
                <RotateCcw className="w-4 h-4 mr-2 inline-block" />
                Reset
              </button>
            </>
          )}

          <button
            onClick={handleProcessImages}
            disabled={isProcessing || images.length === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isProcessing || images.length === 0
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Play className="w-5 h-5 mr-2 inline-block" />
            {isProcessing ? 'Processing...' : 'Process Images'}
          </button>
        </div>
      </div>

      {/* Processing Progress */}
      {isProcessing && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-blue-800">Processing Images</h3>
            <span className="text-blue-700 font-medium">{Math.round(processingProgress)}%</span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${processingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Results Summary */}
      {processedImages.length > 0 && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-800">File Size Saved</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{formatFileSize(totalSavings)}</div>
            <div className="text-sm text-green-600">{(averageCompression).toFixed(1)}% average reduction</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-800">Images Processed</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{processedImages.length} / {images.length}</div>
            <div className="text-sm text-blue-600">Ready for export</div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-purple-600" />
              <span className="font-medium text-purple-800">Processing Time</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{processingTime.toFixed(1)}s</div>
            <div className="text-sm text-purple-600">Average: {(processingTime / images.length).toFixed(1)}s per image</div>
          </div>
        </div>
      )}

      {/* Image List */}
      <div className="space-y-4">
        {images.map((image) => (
          <div key={image.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center space-x-4">
              <img src={image.originalUrl} alt={image.file.name} className="w-16 h-16 object-cover rounded-md" />
              <div>
                <h4 className="font-medium text-slate-800">{image.file.name}</h4>
                <p className="text-sm text-slate-600">{formatFileSize(image.originalSize)}</p>
              </div>
            </div>
            <button
              onClick={() => handleRemoveImage(image.id)}
              className="text-slate-400 hover:text-red-500 transition-colors"
              title="Remove image"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {processedImages.length > 0 && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800">
            <strong>Processing complete!</strong> Your images are optimized and ready for export. 
            Continue to the Export tab to download your files.
          </p>
        </div>
      )}
    </div>
  );
};

export default PreviewPanel;