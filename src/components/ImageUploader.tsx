import React, { useCallback, useState } from 'react';
import { Upload, AlertCircle, XCircle } from 'lucide-react'; // Added XCircle
import { ImageFile } from '../types';
import { generateId, getImageDimensions, formatFileSize } from '../utils/helpers'; // Added formatFileSize

interface ImageUploaderProps {
  onImagesUploaded: (images: ImageFile[]) => void;
  images: ImageFile[]; // Added images prop
  handleRemoveImage: (id: string) => void; // Added handleRemoveImage prop
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImagesUploaded, images, handleRemoveImage }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supportedFormats = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/avif'];
  const maxFileSize = 50 * 1024 * 1024; // 50MB

  const validateFiles = useCallback((files: FileList): File[] => {
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
  }, [supportedFormats, maxFileSize]);

  const processFiles = useCallback(async (files: File[]) => {
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
  }, [onImagesUploaded]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      processFiles(validFiles);
    }
  }, [validateFiles, processFiles]);

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
  }, [validateFiles, processFiles]);

  return (
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
        className="hidden"
        id="file-upload"
      />
      
      <div className="space-y-4">
        <div className="w-16 h-16 flex items-center justify-center mx-auto">
          <Upload className="w-8 h-8 text-blue-600" strokeWidth={1.5} />
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
          <Upload className="w-5 h-5 mr-2" strokeWidth={1.5} />
          Choose Images
        </label>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" strokeWidth={1.5} />
          <div>
            <h4 className="text-red-800 font-medium">Upload Error</h4>
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Image List */}
      {images.length > 0 && (
        <div className="mt-8 space-y-4 max-h-64 overflow-y-auto"> {/* Added max-h and overflow for scroll */}
          {images.map((image) => (
            <div key={image.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <img src={image.originalUrl} alt={image.file.name} className="w-12 h-12 object-cover rounded-md" />
                <div className="flex-1 min-w-0"> {/* Added flex-1 min-w-0 */}
                  <h4 className="font-medium text-slate-800 text-sm truncate" title={image.file.name}>{image.file.name}</h4> {/* Added title attribute */}
                  <p className="text-xs text-slate-600">{formatFileSize(image.originalSize)}</p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveImage(image.id)}
                className="text-slate-400 hover:text-red-500 transition-colors"
                title="Remove image"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;