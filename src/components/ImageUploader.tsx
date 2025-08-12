import React, { useCallback, useState } from 'react';
import { Upload, X, Image as ImageIcon, File, AlertCircle } from 'lucide-react';
import { ImageFile } from '../types';
import { generateId, formatFileSize, getImageDimensions } from '../utils/helpers';

interface ImageUploaderProps {
  images: ImageFile[];
  onImagesUploaded: (images: ImageFile[]) => void;
  onRemoveImage: (id: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  images,
  onImagesUploaded,
  onRemoveImage,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFiles = (files: FileList): File[] => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    Array.from(files).forEach(file => {
      if (!supportedFormats.includes(file.type)) {
        errors.push(`${file.name}: Unsupported format`);
        return;
      }
      if (file.size > maxFileSize) {
        errors.push(`${file.name}: File too large (max 50MB)`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length > 0) {
      setError(errors.join(', '));
    } else {
      setError(null);
    }

    return validFiles;
  };

  const processFiles = async (files: File[]) => {
    setIsLoading(true);
    const processedImages: ImageFile[] = [];

    for (const file of files) {
      try {
        const url = URL.createObjectURL(file);
        const { width, height } = await getImageDimensions(file);
        
        const imageFile: ImageFile = {
          id: generateId(),
          file,
          originalUrl: url,
          originalSize: file.size,
          width,
          height,
          format: file.type.split('/')[1],
        };

        processedImages.push(imageFile);
      } catch (err) {
        console.error('Error processing file:', file.name, err);
      }
    }

    onImagesUploaded(processedImages);
    setIsLoading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      processFiles(validFiles);
    }
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validFiles = validateFiles(files);
      if (validFiles.length > 0) {
        processFiles(validFiles);
      }
    }
  }, []);

  return (
    <div className="p-8">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 ${
          isDragOver
            ? 'border-blue-400 bg-blue-50'
            : 'border-slate-300 hover:border-blue-300 hover:bg-slate-50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        
        <div className="space-y-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">
              {isLoading ? 'Processing images...' : 'Drop your images here'}
            </h3>
            <p className="text-slate-600 mb-4">
              Or click to browse your files
            </p>
            <p className="text-sm text-slate-500">
              Supports JPEG, PNG, WebP, SVG, and AVIF formats up to 50MB each
            </p>
          </div>

          <label
            htmlFor="file-upload"
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Upload className="w-5 h-5 mr-2" />
            Choose Images
          </label>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h4 className="text-red-800 font-medium">Upload Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Uploaded Images */}
      {images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">
            Uploaded Images ({images.length})
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image) => (
              <div key={image.id} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                    <ImageIcon className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-slate-800 truncate">
                      {image.file.name}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveImage(image.id)}
                    className="text-slate-400 hover:text-red-600 transition-colors flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="aspect-video bg-white rounded border border-slate-200 mb-3 overflow-hidden">
                  <img
                    src={image.originalUrl}
                    alt={image.file.name}
                    className="w-full h-full object-contain"
                  />
                </div>
                
                <div className="space-y-1 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Size:</span>
                    <span>{formatFileSize(image.originalSize)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span>{image.width} × {image.height}px</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Format:</span>
                    <span className="uppercase">{image.format}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {images.length > 0 && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            <strong>{images.length} image{images.length !== 1 ? 's' : ''} ready for processing.</strong> 
            {' '}Continue to settings to configure optimization options.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;