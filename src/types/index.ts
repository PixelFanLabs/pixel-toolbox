import { ProcessedImageResult } from '../utils/imageProcessor';

export interface ImageFile {
  id: string;
  file: File;
  originalUrl: string;
  processedUrl?: string;
  processedResults?: ProcessedImageResult[]; // Added for srcset
  originalSize: number;
  processedSize?: number;
  width: number;
  height: number;
  format: string;
}

export interface ProcessingSettings {
  format: 'png' | 'jpeg' | 'webp' | 'avif' | 'srcset';
  quality: number;
  width?: number;
  height?: number;
  maintainAspectRatio: boolean;
  optimize: boolean;
  resizeMode: 'fit' | 'fill' | 'stretch';
  generateSrcset: boolean; // New property
  srcsetSmallWidth?: number;
  srcsetMediumWidth?: number;
  srcsetLargeWidth?: number;
  srcsetSizes?: {
    small?: { width?: number; enabled: boolean; description: string };
    medium?: { width?: number; enabled: boolean; description: string };
    large?: { width?: number; enabled: boolean; description: string };
    extraLarge?: { width?: number; enabled: boolean; description: string };
  };
}

export type Format = 'png' | 'jpeg' | 'webp' | 'avif' | 'srcset';

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
  generateSrcset: boolean; // New property
}

export interface ProcessingStats {
  originalSize: number;
  processedSize: number;
  compressionRatio: number;
  processingTime: number;
}