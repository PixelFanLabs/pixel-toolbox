export interface ImageFile {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl?: string;
  originalSize: number;
  processedSize?: number;
  width: number;
  height: number;
  format: string;
}

export interface ProcessingSettings {
  format: 'png' | 'jpeg' | 'webp' | 'avif';
  quality: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  optimize: boolean;
  resizeMode: 'fit' | 'fill' | 'stretch';
}

export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  icon: string;
  format: 'png' | 'jpeg' | 'webp' | 'avif';
  quality: number;
  width?: number;
  height?: number;
  useCase: string;
}

export interface ProcessingStats {
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  processingTime: number;
}