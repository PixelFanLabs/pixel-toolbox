import { ProcessingSettings } from '../types';

export interface ProcessedImageResult {
  url: string;
  size: number;
  width: number;
  height: number;
}

export async function processImage(
  file: File,
  settings: ProcessingSettings
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }

        // Calculate dimensions
        const { width, height } = calculateDimensions(
          img.width,
          img.height,
          settings.width,
          settings.height,
          settings.maintainAspectRatio,
          settings.resizeMode
        );

        canvas.width = width;
        canvas.height = height;

        // Apply optimization settings
        if (settings.optimize) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
        }

        // Draw the image
        if (settings.resizeMode === 'fill' && settings.width && settings.height) {
          // Calculate scaling to fill the entire canvas
          const scaleX = settings.width / img.width;
          const scaleY = settings.height / img.height;
          const scale = Math.max(scaleX, scaleY);
          
          const scaledWidth = img.width * scale;
          const scaledHeight = img.height * scale;
          
          const offsetX = (settings.width - scaledWidth) / 2;
          const offsetY = (settings.height - scaledHeight) / 2;
          
          ctx.drawImage(img, offsetX, offsetY, scaledWidth, scaledHeight);
        } else {
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Convert to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const url = URL.createObjectURL(blob);
              resolve({
                url,
                size: blob.size,
                width,
                height,
              });
            } else {
              reject(new Error('Failed to create blob'));
            }
          },
          getMimeType(settings.format),
          settings.format === 'jpeg' ? settings.quality / 100 : undefined
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  targetWidth?: number,
  targetHeight?: number,
  maintainAspectRatio: boolean = true,
  resizeMode: 'fit' | 'fill' | 'stretch' = 'fit'
): { width: number; height: number } {
  // If no dimensions specified, return original
  if (!targetWidth && !targetHeight) {
    return { width: originalWidth, height: originalHeight };
  }

  // If only one dimension specified and maintaining aspect ratio
  if (maintainAspectRatio) {
    if (targetWidth && !targetHeight) {
      const ratio = targetWidth / originalWidth;
      return {
        width: targetWidth,
        height: Math.round(originalHeight * ratio),
      };
    }
    
    if (!targetWidth && targetHeight) {
      const ratio = targetHeight / originalHeight;
      return {
        width: Math.round(originalWidth * ratio),
        height: targetHeight,
      };
    }
  }

  // If both dimensions specified
  if (targetWidth && targetHeight) {
    if (resizeMode === 'stretch' || !maintainAspectRatio) {
      return { width: targetWidth, height: targetHeight };
    }
    
    if (resizeMode === 'fit') {
      const ratioX = targetWidth / originalWidth;
      const ratioY = targetHeight / originalHeight;
      const ratio = Math.min(ratioX, ratioY);
      
      return {
        width: Math.round(originalWidth * ratio),
        height: Math.round(originalHeight * ratio),
      };
    }
    
    if (resizeMode === 'fill') {
      return { width: targetWidth, height: targetHeight };
    }
  }

  return { width: originalWidth, height: originalHeight };
}

function getMimeType(format: string): string {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'webp':
      return 'image/webp';
    case 'avif':
      return 'image/avif';
    default:
      return 'image/png';
  }
}