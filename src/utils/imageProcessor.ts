import { ProcessingSettings } from '../types';

export interface ProcessedImageResult {
  url: string;
  size: number;
  width: number;
  height: number;
  name?: string;
}

export async function processImage(
  file: File,
  settings: ProcessingSettings
): Promise<ProcessedImageResult | ProcessedImageResult[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = async () => {
      try {
        const originalFileName = file.name.split('.').slice(0, -1).join('.');
        
        // Handle srcset generation
        if (settings.generateSrcset && settings.srcsetSizes) {
          const originalAspectRatio = img.width / img.height;
          const results: ProcessedImageResult[] = [];
          
          // Process each enabled srcset size
          for (const [sizeKey, sizeConfig] of Object.entries(settings.srcsetSizes)) {
            if (sizeConfig.enabled && sizeConfig.width) {
              const targetWidth = sizeConfig.width;
              const targetHeight = Math.round(targetWidth / originalAspectRatio);
              
              const blob = await processImageToBlob(
                img,
                targetWidth,
                targetHeight,
                'webp', // Use WebP for srcset
                settings.quality,
                settings.optimize,
                settings.resizeMode
              );
              
              results.push({
                url: URL.createObjectURL(blob),
                size: blob.size,
                width: targetWidth,
                height: targetHeight,
                name: `-${targetWidth}w`,
              });
            }
          }
          
          resolve(results);
          return;
        }
        
        // Handle single image processing
        const { width, height } = calculateDimensions(
          img.width,
          img.height,
          settings.width,
          settings.height,
          settings.maintainAspectRatio,
          settings.resizeMode
        );
        
        const blob = await processImageToBlob(
          img,
          width,
          height,
          'webp', // Use WebP for all single image processing
          settings.quality,
          settings.optimize,
          settings.resizeMode
        );
        
        resolve({
          url: URL.createObjectURL(blob),
          size: blob.size,
          width,
          height,
        });
        
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

async function processImageToBlob(
  img: HTMLImageElement,
  targetWidth: number,
  targetHeight: number,
  format: string,
  quality: number,
  optimize: boolean,
  resizeMode: 'fit' | 'fill' | 'stretch'
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

    // Apply optimization settings
    if (optimize) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    // Calculate drawing parameters based on resize mode
    let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;
    let dx = 0, dy = 0, dWidth = targetWidth, dHeight = targetHeight;

    if (resizeMode === 'fill') {
      // Fill mode: crop to fill the entire canvas
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = targetWidth / targetHeight;

      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider, crop width
        sWidth = img.height * canvasAspectRatio;
        sx = (img.width - sWidth) / 2;
      } else {
        // Image is taller, crop height
        sHeight = img.width / canvasAspectRatio;
        sy = (img.height - sHeight) / 2;
      }
    } else if (resizeMode === 'fit') {
      // Fit mode: fit entire image within canvas (may have letterboxing)
      const imgAspectRatio = img.width / img.height;
      const canvasAspectRatio = targetWidth / targetHeight;

      if (imgAspectRatio > canvasAspectRatio) {
        // Image is wider, fit by width
        dHeight = targetWidth / imgAspectRatio;
        dy = (targetHeight - dHeight) / 2;
      } else {
        // Image is taller, fit by height
        dWidth = targetHeight * imgAspectRatio;
        dx = (targetWidth - dWidth) / 2;
      }
    }
    // For stretch mode, use default values (entire image to entire canvas)

    // Clear canvas with white background for JPEG
    if (format === 'jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetWidth, targetHeight);
    }

    // Draw the image
    ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

    // Convert to blob
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      },
      getMimeType(format),
      format === 'jpeg' ? quality / 100 : quality / 100
    );
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