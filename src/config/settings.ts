import { ProcessingSettings, ExportPreset } from '../types';

export const exportPresets: ExportPreset[] = [
  {
    id: 'web-avatar',
    name: 'Avatar',
    description: 'Perfect for profile pictures and user avatars',
    icon: '👤',
    format: 'webp',
    quality: 90,
    width: 200,
    height: 200,
    useCase: 'Profile pictures, user avatars, team photos',
    generateSrcset: false,
    maintainAspectRatio: false, // Updated
    resizeMode: 'fill', // Updated
  },
  {
    id: 'web-banner',
    name: 'Banner',
    description: 'Optimized for website headers and hero sections',
    icon: '🖼️',
    format: 'webp',
    quality: 85,
    width: 1200,
    height: 400,
    useCase: 'Website headers, hero images, banners',
    generateSrcset: false,
  },
  {
    id: 'social-post',
    name: 'Social Post',
    description: 'Square format for social media posts',
    icon: '📸',
    format: 'jpeg',
    quality: 90,
    width: 1080,
    height: 1080,
    useCase: 'Instagram posts, Facebook images, social content',
    generateSrcset: false,
  },
  {
    id: 'email-signature',
    name: 'Email Signature',
    description: 'Compact size for email signatures and newsletters',
    icon: '📧',
    format: 'png',
    quality: 95,
    width: 300,
    height: 100,
    useCase: 'Email signatures, newsletter headers, small logos',
    generateSrcset: false,
  },
  {
    id: 'blog-thumbnail',
    name: 'Blog Thumbnail',
    description: 'Rectangular format for blog post thumbnails',
    icon: '📰',
    format: 'webp',
    quality: 85,
    width: 600,
    height: 400,
    useCase: 'Blog thumbnails, article previews, content cards',
    generateSrcset: false,
  },
  {
    id: 'cms-web-optimized',
    name: 'CMS & Web Optimized',
    description: 'High-quality and optimized format for content management systems and general web use',
    icon: '🌐',
    format: 'webp',
    quality: 90,
    useCase: 'WordPress, Drupal, headless CMS, general web use',
    generateSrcset: false,
  },
  {
    id: 'favicon',
    name: 'Favicon',
    description: 'Small icon for browser tabs and bookmarks',
    icon: '⭐',
    format: 'png',
    quality: 100,
    width: 32,
    height: 32,
    useCase: 'Browser tabs, bookmarks, app icons',
    generateSrcset: false,
  },
  {
    id: 'email-attachment',
    name: 'Email Attachment',
    description: 'Optimized for email attachments, balanced quality and size',
    icon: '📎',
    format: 'jpeg',
    quality: 75,
    useCase: 'Sending images via email, presentations',
    generateSrcset: false,
  },
];

// Find the CMS & Web Optimized preset
const cmsWebOptimizedPreset = exportPresets.find(preset => preset.id === 'cms-web-optimized');

export const defaultSettings: ProcessingSettings = {
  format: cmsWebOptimizedPreset?.format || 'webp',
  quality: cmsWebOptimizedPreset?.quality || 85,
  maintainAspectRatio: cmsWebOptimizedPreset?.maintainAspectRatio ?? true, // Ensure maintainAspectRatio is pulled from preset or defaults to true
  optimize: true,
  resizeMode: cmsWebOptimizedPreset?.resizeMode || 'fit', // Ensure resizeMode is pulled from preset or defaults to fit
  generateSrcset: cmsWebOptimizedPreset?.generateSrcset || false,
  preserveMetadata: false, // Default to off
};

export const formatOptions = [
  { value: 'webp', label: 'WebP', description: 'Modern format with excellent compression' },
  { value: 'jpeg', label: 'JPEG', description: 'Universal compatibility, good for photos' },
  { value: 'png', label: 'PNG', description: 'Lossless quality, supports transparency' },
  { value: 'avif', label: 'AVIF', description: 'Next-gen format with superior compression' },
];

export const qualityPresets = [
  { value: 95, label: 'Maximum', description: 'Best quality, larger file size' },
  { value: 85, label: 'High', description: 'Recommended balance of quality and size' },
  { value: 75, label: 'Medium', description: 'Good quality, smaller file size' },
  { value: 60, label: 'Optimized', description: 'Heavily compressed for fast loading' },
];