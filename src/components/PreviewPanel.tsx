import React, { useState } from 'react';
import { Play, RotateCcw, Eye, BarChart3, Clock } from 'lucide-react';
import { ImageFile, ProcessingSettings } from '../types';
import { processImage } from '../utils/imageProcessor';
import { formatFileSize, calculateCompressionRatio } from '../utils/helpers';

interface PreviewPanelProps {
  images: ImageFile[];
  settings: ProcessingSettings;
  onImagesProcessed: (images: ImageFile[]) => void;
  isProcessing: boolean;
  setIsProcessing: (processing: boolean) => void;
}

const PreviewPanel: React.FC<PreviewPanelProps> = ({
  images,
  settings,
  onImagesProcessed,
  isProcessing,
  setIsProcessing,
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
    onImagesProcessed(updatedImages);
    setIsProcessing(false);
  };

  const handleResetProcessing = () => {
    const resetImages = images.map(img => ({
      ...img,
      processedUrl: undefined,
      processedSize: undefined,
    }));
    onImagesProcessed(resetImages);
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
            <div className="text-sm text-green-600">{averageCompression.toFixed(1)}% average reduction</div>
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

      {/* Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image) => (
          <div key={image.id} className="bg-slate-50 rounded-lg border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-medium text-slate-800 truncate">{image.file.name}</h3>
            </div>

            {showComparison && image.processedUrl ? (
              // Comparison view
              <div className="grid grid-cols-2">
                <div className="p-4 border-r border-slate-200">
                  <h4 className="text-sm font-medium text-slate-600 mb-2">Original</h4>
                  <div className="aspect-video bg-white rounded border border-slate-200 overflow-hidden mb-3">
                    <img
                      src={image.originalUrl}
                      alt={`${image.file.name} original`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(image.originalSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="uppercase">{image.format}</span>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-medium text-slate-600 mb-2">Processed</h4>
                  <div className="aspect-video bg-white rounded border border-slate-200 overflow-hidden mb-3">
                    <img
                      src={image.processedUrl}
                      alt={`${image.file.name} processed`}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span className="text-green-600 font-medium">
                        {formatFileSize(image.processedSize || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="uppercase">{settings.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saved:</span>
                      <span className="text-green-600 font-medium">
                        {calculateCompressionRatio(image.originalSize, image.processedSize || image.originalSize).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Single view
              <div className="p-4">
                <div className="aspect-video bg-white rounded border border-slate-200 overflow-hidden mb-3">
                  <img
                    src={image.processedUrl || image.originalUrl}
                    alt={image.file.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Size:</span>
                      <span>{formatFileSize(image.processedSize || image.originalSize)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format:</span>
                      <span className="uppercase">{image.processedUrl ? settings.format : image.format}</span>
                    </div>
                  </div>
                  <div className="space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Dimensions:</span>
                      <span>{image.width} × {image.height}px</span>
                    </div>
                    {image.processedSize && (
                      <div className="flex justify-between">
                        <span>Saved:</span>
                        <span className="text-green-600 font-medium">
                          {calculateCompressionRatio(image.originalSize, image.processedSize).toFixed(1)}%
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
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