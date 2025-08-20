import React, { useState, useCallback, useEffect, useRef } from 'react';
import ImageUploader from './ImageUploader';
import SettingsPanel from './SettingsPanel';
import ExportPanel from './ExportPanel';
import { defaultSettings, exportPresets } from '../config/settings'; // Corrected import path
import { ImageFile, ProcessingSettings, ExportPreset } from '../types';
import { processImage } from '../utils/imageProcessor'; // Import processImage

const OptimizeImagesSection: React.FC = () => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [settings, setSettings] = useState<ProcessingSettings>(defaultSettings);
  
  // Find the CMS & Web Optimized preset to set as initial selectedPreset
  const initialSelectedPreset = exportPresets.find(preset => preset.id === 'cms-web-optimized') || null;
  const [selectedPreset, setSelectedPreset] = useState<ExportPreset | null>(initialSelectedPreset);

  const [isProcessing, setIsProcessing] = useState(false);
  const [showExportSection, setShowExportSection] = useState(false); // New state for export section visibility
  const [processedImages, setProcessedImages] = useState<ImageFile[]>([]); // New state for processed images
  const [processingProgress, setProcessingProgress] = useState(0); // New state for processing progress
  const [processingTime, setProcessingTime] = useState(0); // New state for processing time

  // Start - Code for Adsterra Banners
  const adContainerRefMid = useRef<HTMLDivElement>(null); // Ref for the existing mid-content ad
  const adContainerRefPostProcess = useRef<HTMLDivElement>(null); // Ref for the new post-process ad

  // State for screen width to handle responsive ads
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // End - Code for Adsterra Banners

  const handleImagesUploaded = useCallback((newImages: ImageFile[]) => {
    setImages(prevImages => [...prevImages, ...newImages]);
    setShowExportSection(false); // Hide export section when new images are uploaded
  }, []);

  const handleRemoveImage = useCallback((id: string) => {
    setImages(prevImages => prevImages.filter(img => img.id !== id));
    setShowExportSection(false); // Hide export section when images are removed
  }, []);

  const handleSettingsChange = useCallback((newSettings: ProcessingSettings) => {
    setSettings(newSettings);
    setShowExportSection(false); // Hide export section when settings change
  }, []);

  const handlePresetSelect = useCallback((preset: ExportPreset) => {
    setSelectedPreset(preset);
    setSettings({
      ...settings,
      format: preset.format,
      quality: preset.quality,
      width: preset.width,
      height: preset.height,
    });
    setShowExportSection(false); // Hide export section when preset changes
  }, [settings]);

  // New function to handle image processing
  const handleProcessImages = useCallback(async () => {
    setIsProcessing(true);
    setProcessingProgress(0);
    const startTime = Date.now();
    const updatedImages: ImageFile[] = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      try {
        const result = await processImage(image.file, settings);

        if (settings.generateSrcset && Array.isArray(result)) {
          const resultsArray = result as { url: string; size: number; width: number; height: number }[];
          const totalSize = resultsArray.reduce((sum, r) => sum + r.size, 0);
          updatedImages.push({
            ...image,
            processedResults: resultsArray,
            processedSize: totalSize,
          });
        } else {
          const singleResult = result as { url: string; size: number; width: number; height: number };
          updatedImages.push({
            ...image,
            processedUrl: singleResult.url,
            processedSize: singleResult.size,
            width: singleResult.width,
            height: singleResult.height,
          });
        }
        setProcessingProgress(((i + 1) / images.length) * 100);
      } catch (error) {
        console.error('Error processing image:', error);
        updatedImages.push({ ...image, processedUrl: undefined, processedSize: undefined });
      }
    }

    const endTime = Date.now();
    setProcessingTime((endTime - startTime) / 1000);
    setProcessedImages(updatedImages);
    setIsProcessing(false);
    setShowExportSection(true); // Show export section after processing
  }, [images, settings]);

  // Effect to load Mid-Content Adsterra Banner
  useEffect(() => {
    const loadAdsterraMid = () => {
      const adContainer = adContainerRefMid.current; 
      if (!adContainer) {
        console.warn('Adsterra mid-content banner container not found.');
        return;
      }

      // Clear any existing ad content to prevent duplicates on re-render
      adContainer.innerHTML = '';

      let adUnitConfig;

      if (screenWidth <= 767) { // Mobile
        adUnitConfig = {
          key: 'fc90c823d309f14535f6acea73d24ced', // 320x50
          width: 320,
          height: 50,
        };
      } else { // Tablet and Desktop
        adUnitConfig = {
          key: 'ad8f4ced24d88f4f48d5c63acc6b9634', // 728x90
          width: 728,
          height: 90,
        };
      }

      const scriptText = `
        var atOptions = {
          'key' : '${adUnitConfig.key}',
          'format' : 'iframe',
          'height' : ${adUnitConfig.height},
          'width' : ${adUnitConfig.width},
          'params' : {}
        };
      `;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = scriptText;
      adContainer.appendChild(script); 

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adUnitConfig.key}/invoke.js`;
      invokeScript.async = true; 
      adContainer.appendChild(invokeScript); 
    };

    loadAdsterraMid();

    // Cleanup function to remove scripts if the component unmounts
    return () => {
      const adContainer = adContainerRefMid.current;
      if (adContainer) {
        adContainer.innerHTML = ''; // Clear ad content on unmount
      }
    };
  }, [screenWidth]); 

  // Effect to load Post-Process Adsterra Banner
  useEffect(() => {
    const loadAdsterraPostProcess = () => {
      const adContainer = adContainerRefPostProcess.current; 
      if (!adContainer || !showExportSection) {
        // Only load if container exists AND export section is shown
        return;
      }

      // Clear any existing ad content to prevent duplicates on re-render
      adContainer.innerHTML = '';

      let adUnitConfig;

      if (screenWidth <= 767) { // Mobile
        adUnitConfig = {
          key: '7d0611dfd5286d972307c89c9c3c231c', // 300x250 mobile
          width: 300,
          height: 250,
        };
      } else { // Tablet and Desktop
        adUnitConfig = {
          key: 'ad8f4ced24d88f4f48d5c63acc6b9634', // 728x90 desktop
          width: 728,
          height: 90,
        };
      }

      const scriptText = `
        var atOptions = {
          'key' : '${adUnitConfig.key}',
          'format' : 'iframe',
          'height' : ${adUnitConfig.height},
          'width' : ${adUnitConfig.width},
          'params' : {}
        };
      `;

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.innerHTML = scriptText;
      adContainer.appendChild(script); 

      const invokeScript = document.createElement('script');
      invokeScript.type = 'text/javascript';
      invokeScript.src = `//www.highperformanceformat.com/${adUnitConfig.key}/invoke.js`;
      invokeScript.async = true; 
      adContainer.appendChild(invokeScript); 
    };

    loadAdsterraPostProcess();

    // Cleanup function to remove scripts if the component unmounts or export section hides
    return () => {
      const adContainer = adContainerRefPostProcess.current;
      if (adContainer) {
        adContainer.innerHTML = ''; // Clear ad content on unmount or hide
      }
    };
  }, [screenWidth, showExportSection]); // Re-run effect when screenWidth or showExportSection changes


  return (
    <div className="pt-8 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <section id="optimize" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Optimize Your <span className="text-blue-600">Images</span>
          </h1>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              Upload Images
            </h2>
            <ImageUploader onImagesUploaded={handleImagesUploaded} images={images} handleRemoveImage={handleRemoveImage} />
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              Configure Settings
            </h2>
            <SettingsPanel settings={settings} onSettingsChange={handleSettingsChange} onPresetSelect={handlePresetSelect} selectedPreset={selectedPreset} />
          </div>
        </div>

        {/* Start - Adsterra Mid-Content Banner Placeholder (Existing Ad) */}
        <div className="my-8 flex justify-center" ref={adContainerRefMid}>
          {/* Ad will be loaded dynamically here */}
        </div>
        {/* End - Adsterra Mid-Content Banner Placeholder */}

        {/* Process Button */}
        <div className="text-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200 p-8 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              Process & Export
            </h2>
            <button
              onClick={handleProcessImages}
              disabled={isProcessing || showExportSection || images.length === 0}
              className={`px-12 py-4 rounded-full font-semibold text-lg transition-all duration-300 shadow-lg ${
                isProcessing || showExportSection || images.length === 0
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:shadow-xl transform hover:scale-105'
              }`}
            >
              {isProcessing ? 'Processing Images...' : 'Process Images'}
            </button>
            {images.length === 0 && (
              <p className="mt-4 text-slate-500 text-sm">
                Please upload images in Step 1 to enable processing.
              </p>
            )}

            {/* Export Panel - Now integrated within the Process section */}
            {showExportSection && processedImages.length > 0 && (
              <div className="mt-8">
                <ExportPanel
                  images={processedImages}
                  settings={settings}
                  isProcessing={isProcessing}
                  handleRemoveImage={handleRemoveImage}
                  processingProgress={processingProgress}
                  processingTime={processingTime}
                />
              </div>
            )}
          </div>
        </div>

        {/* Start - Adsterra Post-Process Banner Placeholder (New Ad) */}
        {showExportSection && processedImages.length > 0 && (
          <div className="my-8 flex justify-center" ref={adContainerRefPostProcess}>
            {/* Ad will be loaded dynamically here */}
          </div>
        )}
        {/* End - Adsterra Post-Process Banner Placeholder */}
      </section>
      </div>
  );
};

export default OptimizeImagesSection;
