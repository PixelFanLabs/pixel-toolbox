import { ProcessingSettings } from '../types';
import { srcsetDimensions } from '../config/settings'; // Import srcsetDimensions

export interface ProcessedImageResult {
  url: string;
  size: number;
  width: number;
  height: number;
  name?: string; // Add name for srcset versions
}

export async function processImage(
  file: File,
  settings: ProcessingSettings
): Promise<ProcessedImageResult | ProcessedImageResult[]> { // Changed return type
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = async () => { // Changed to async
      try {
        if (settings.format === 'srcset') {
          const originalAspectRatio = img.width / img.height;

          const sizesToProcess = [
            {
              name: '_small',
              width: settings.srcsetSmallWidth || srcsetDimensions.small,
            },
            {
              name: '_medium',
              width: settings.srcsetMediumWidth || srcsetDimensions.medium,
            },
            {
              name: '_large',
              width: settings.srcsetLargeWidth || srcsetDimensions.large,
            },
          ];

          const results = await Promise.all(
            sizesToProcess.map(async (sizeInfo) => {
              const targetWidth = sizeInfo.width;
              const targetHeight = Math.round(targetWidth / originalAspectRatio);

              const blob = await resizeImageToDimensions(
                img,
                targetWidth,
                targetHeight,
                'avif', // Default to AVIF for srcset versions
                settings.quality,
                settings.optimize
              );

              return {
                url: URL.createObjectURL(blob),
                size: blob.size,
                width: targetWidth,
                height: targetHeight,
                name: sizeInfo.name,
              };
            })
          );
          resolve(results);
          return; // Exit after srcset processing
        }

        // Existing logic for other formats
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

async function resizeImageToDimensions(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  format: string,
  quality: number,
  optimize: boolean
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    if (optimize) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    const imgAspectRatio = img.width / img.height;
    const canvasAspectRatio = targetWidth / targetHeight;

    let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height; // Source image
    let dx = 0, dy = 0, dWidth = targetWidth, dHeight = targetHeight; // Destination canvas

    if (imgAspectRatio > canvasAspectRatio) {
      // Image is wider than canvas, fit by width, crop height
      sHeight = img.width / canvasAspectRatio;
      sy = (img.height - sHeight) / 2;
    } else {
      // Image is taller than canvas, fit by height, crop width
      sWidth = img.height * canvasAspectRatio;
      sx = (img.width - sWidth) / 2;
    }

    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); // Use the 9-argument drawImage

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob during resize'));
        }
      },
      getMimeType(format),
      format === 'jpeg' ? quality / 100 : undefined
    );
  });
}