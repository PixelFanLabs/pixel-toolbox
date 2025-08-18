import React, { useState } from 'react';
import { Download, Package, Check, FileText, Play, RotateCcw, Eye, BarChart3, Clock } from 'lucide-react'; // Added Play, RotateCcw, Eye, BarChart3, Clock
import { ImageFile, ProcessingSettings } from '../types'; // Removed ExportPreset
import { formatFileSize, calculateCompressionRatio } from '../utils/helpers';
import JSZip from 'jszip';

interface ExportPanelProps {
  images: ImageFile[]; // These are now processed images
  settings: ProcessingSettings;
  isProcessing: boolean;
  processingProgress: number;
  processingTime: number;
  handleRemoveImage: (id: string) => void; // Keep this for individual image removal
}

const ExportPanel: React.FC<ExportPanelProps> = ({
  images,
  settings,
  isProcessing,
  processingProgress,
  processingTime,
  handleRemoveImage,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);
  const [showComparison, setShowComparison] = useState(false); // For comparison view in individual images
  const [downloadedImages, setDownloadedImages] = useState<Record<string, boolean>>({}); // New state for individual downloads

  const totalOriginalSize = images.reduce((acc, img) => acc + img.originalSize, 0);
  const totalProcessedSize = images.reduce((acc, img) => acc + (img.processedSize || 0), 0);
  const totalSavings = totalOriginalSize - totalProcessedSize;
  const averageCompression = calculateCompressionRatio(totalOriginalSize, totalProcessedSize);

  // Calculate the total number of output files
  const totalOutputFiles = images.reduce((acc, image) => {
    if (settings.generateSrcset && image.processedResults) {
      return acc + image.processedResults.length;
    } else {
      return acc + 1;
    }
  }, 0);

  // Flattened list of all individual output images for display and download
  const allIndividualOutputImages = images.flatMap(image => {
    if (settings.generateSrcset && image.processedResults) {
      return image.processedResults.map(result => ({
        id: `${image.id}-${result.name}`,
        url: result.url,
        size: result.size,
        width: result.width,
        height: result.height,
        displayName: `${image.file.name.split('.')[0]}${result.name}.webp`,
        originalSize: image.originalSize,
      }));
    } else if (image.processedUrl) {
      return [{
        id: image.id,
        url: image.processedUrl,
        size: image.processedSize || 0,
        width: image.width || 0,
        height: image.height || 0,
        displayName: `${image.file.name.split('.')[0]}-optimized.${settings.format}`,
        originalSize: image.originalSize,
      }];
    }
    return [];
  });

  const downloadSingle = async (outputItem: { id: string; url: string; displayName: string }) => {
    if (!outputItem.url) return;

    try {
      const response = await fetch(outputItem.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = outputItem.displayName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      setDownloadedImages(prev => ({ ...prev, [outputItem.id]: true })); // Mark as downloaded
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const downloadAll = async () => {
    if (images.length === 0) return;

    setIsExporting(true);

    try {
      const zip = new JSZip();

      for (const image of images) {
        const baseFileName = image.file.name.split('.').slice(0, -1).join('.');

        if (settings.generateSrcset && image.processedResults) {
          for (const result of image.processedResults) {
            const response = await fetch(result.url);
            const blob = await response.blob();
            const fileName = `${baseFileName}${result.name || ''}.webp`;
            zip.file(fileName, blob);
          }
        } else if (image.processedUrl) {
          const response = await fetch(image.processedUrl);
          const blob = await response.blob();
          const fileName = `${baseFileName}-optimized.${settings.format}`;
          zip.file(fileName, blob);
        }
      }

      // Add metadata file
      const metadata = {
        exportedAt: new Date().toISOString(),
        settings: {
          format: settings.generateSrcset ? 'responsive' : settings.format,
          quality: settings.quality,
          optimization: settings.optimize,
          ...(settings.generateSrcset && {
            responsive: true,
            srcsetSizes: settings.srcsetSizes,
          }),
        },
        stats: {
          totalImages: images.length,
          originalSize: formatFileSize(totalOriginalSize),
          processedSize: formatFileSize(totalProcessedSize),
          savings: formatFileSize(totalSavings),
          compressionRatio: `${averageCompression.toFixed(1)}%`,
        },
      };

      zip.file('export_info.json', JSON.stringify(metadata, null, 2));

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `pixeltoolbox_export_${new Date().toISOString().split('T')[0]}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
      setExportComplete(true);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Export Your Images</h2>
          <p className="text-slate-600">Download your optimized images individually or as a batch. Batch ZIP exports include a dedicated metadata file detailing all processing specifics.</p>
        </div>
      </div>

      {/* Processing Progress (moved from PreviewPanel) */}
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
      {images.length > 0 && !isProcessing && (
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center">

          {/* File Size Saved */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <BarChart3 className="w-5 h-5 text-green-700" />
              <span className="font-medium text-green-700">File Size Saved</span>
            </div>
            <div className="text-2xl font-bold text-green-700">{formatFileSize(totalSavings)}</div>
            <div className="text-sm text-green-700">{(averageCompression).toFixed(1)}% average reduction</div>
          </div>

          {/* Images Processed Card */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Eye className="w-5 h-5 text-yellow-700"/>
              <span className="font-medium text-yellow-700">Images Processed</span>
            </div>
            <div className="text-2xl font-bold text-yellow-700">{images.length}</div>
            <div className="text-sm text-yellow-700">Total images processed</div>
          </div>

          {/* Images Generated Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Package className="w-5 h-5 text-blue-700" />
              <span className="font-medium text-blue-700">Images Generated</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">{totalOutputFiles}</div>
            <div className="text-sm text-blue-700">Total images generated</div>
          </div>

          {/* Processing Time */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-5 h-5 text-purple-700" />
              <span className="font-medium text-purple-700">Processing Time</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">{processingTime.toFixed(1)}s</div>
            <div className="text-sm text-purple-700">Average: {(processingTime / images.length).toFixed(1)}s per image</div>
          </div>
        </div>
      )}

      {/* Batch Export */}
      <div className="bg-white border border-slate-200 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Batch Export</h3>
            <p className="text-slate-600">Download all images as a ZIP file with metadata.</p>
          </div>
          <button
            onClick={downloadAll}
            disabled={isExporting}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isExporting
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : exportComplete
                ? 'bg-green-600 text-white'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isExporting ? (
              <>
                <Package className="w-5 h-5 mr-2 inline-block animate-pulse" />
                Creating ZIP...
              </>
            ) : exportComplete ? (
              <>
                <Check className="w-5 h-5 mr-2 inline-block" />
                Exported!
              </>
            ) : (
              <>
                <Download className="w-5 h-5 mr-2 inline-block" />
                Download All
              </>
            )}
          </button>
        </div>
      </div>

      {/* Individual Images */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Individual Downloads</h3>
        <div className="space-y-4">
          {allIndividualOutputImages.map((outputImage) => (
            <div key={outputImage.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <div className="w-16 h-16 bg-white rounded border border-slate-200 overflow-hidden flex-shrink-0">
                    <img
                      src={outputImage.url}
                      alt={outputImage.displayName}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-medium text-slate-800 truncate">{outputImage.displayName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-slate-600 mt-1">
                      <span>{outputImage.width} × {outputImage.height}px</span>
                      <span>{formatFileSize(outputImage.size)}</span>
                      <span className="text-green-600 font-medium">
                        -{calculateCompressionRatio(outputImage.originalSize, outputImage.size).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => downloadSingle(outputImage)}
                  disabled={downloadedImages[outputImage.id]}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex-shrink-0 ${
                    downloadedImages[outputImage.id]
                      ? 'bg-green-600 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {downloadedImages[outputImage.id] ? (
                    <>
                      <Check className="w-4 h-4 mr-2 inline-block" />
                      Downloaded
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2 inline-block" />
                      Download
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;