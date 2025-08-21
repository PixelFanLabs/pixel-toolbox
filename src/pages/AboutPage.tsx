import React, { useEffect, useRef, useState } from 'react';
import { Shield, Heart, Code, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const AboutPage: React.FC = () => {
  const adContainerRefPrivacy = useRef<HTMLDivElement>(null);
  const adContainerRefContact = useRef<HTMLDivElement>(null);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const loadAdsterraBanner = (containerRef: React.RefObject<HTMLDivElement>, mobileKey: string, desktopKey: string) => {
    const adContainer = containerRef.current;
    if (!adContainer) {
      console.warn('Adsterra banner container not found.');
      return;
    }

    adContainer.innerHTML = ''; // Clear any existing ad content

    let adUnitConfig;
    if (screenWidth <= 767) { // Mobile
      adUnitConfig = {
        key: mobileKey,
        width: 300,
        height: 250,
      };
    } else { // Tablet and Desktop
      adUnitConfig = {
        key: desktopKey,
        width: 728,
        height: 90,
      };
    }

    // Create and append the script for atOptions
    const atOptionsScript = document.createElement('script');
    atOptionsScript.type = 'text/javascript';
    atOptionsScript.innerHTML = `
      var atOptions = {
        'key' : '${adUnitConfig.key}',
        'format' : 'iframe',
        'height' : ${adUnitConfig.height},
        'width' : ${adUnitConfig.width},
        'params' : {}
      };
    `;
    adContainer.appendChild(atOptionsScript);

    // Create and append the script for invoke.js
    const invokeScript = document.createElement('script');
    invokeScript.type = 'text/javascript';
    invokeScript.src = `//www.highperformanceformat.com/${adUnitConfig.key}/invoke.js`;
    invokeScript.async = true; // Essential for non-blocking loading
    adContainer.appendChild(invokeScript);
  };

  useEffect(() => {
    // Load the first banner before Privacy section
    loadAdsterraBanner(adContainerRefPrivacy, '7d0611dfd5286d972307c89c9c3c231c', 'ad8f4ced24d88f4f48d5c63acc6b9634');

    // Cleanup function for the first banner
    return () => {
      const adContainer = adContainerRefPrivacy.current;
      if (adContainer) {
        adContainer.innerHTML = '';
      }
    };
  }, [screenWidth]);

  useEffect(() => {
    // Load the second banner after Contact Us section
    loadAdsterraBanner(adContainerRefContact, '7d0611dfd5286d972307c89c9c3c231c', 'ad8f4ced24d88f4f48d5c63acc6b9634');

    // Cleanup function for the second banner
    return () => {
      const adContainer = adContainerRefContact.current;
      if (adContainer) {
        adContainer.innerHTML = '';
      }
    };
  }, [screenWidth]);

  return (
    <div className="pt-24 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <Helmet>
        <title>About PixelToolbox | Free Image Optimization Tool</title>
        <meta
          name="description"
          content="Learn about PixelToolbox, a free and secure online image optimization tool from PixelFanLabs. Discover our mission for privacy and ease of use."
        />
      </Helmet>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            About <span className="text-blue-600">PixelToolbox</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            A free service brought to you by{' '}
            <a
              href="https://pixelfanlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              PixelFanLabs
            </a>
          </p>
        </div>

        {/* Why We Built This Section */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Why We Built This
              </h2>
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                  Juggling multiple tools to get images ready for the web is a hassle. You're left researching the right resolution for an avatar, the best format for a logo, and how to make your photos load faster.
                </p>
                <p>
                  Then, you have to find a format converter, a resizer, and an optimizer. We were tired of this workflow, and we believe everyone should have access to high-quality, easy-to-use tools to make their digital lives easier.
                </p>
                <p className="text-blue-700 font-medium">
                  That's why we built PixelToolbox—to take you from raw image to web-ready asset in seconds. With batch processing and smart defaults, PixelToolbox lets you focus on your creative work, not the technical details.
                </p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3"></div>
                <img
                  src="/images/photo-fustrated-pixeltoolbox-1600w.webp"
                  alt="Frustrated designer using multiple image tools"
                  className="relative w-full h-auto rounded-2xl shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300"
                  loading="lazy"
                  srcSet="/images/photo-fustrated-pixeltoolbox-480w.webp 480w, /images/photo-fustrated-pixeltoolbox-800w.webp 800w, /images/photo-fustrated-pixeltoolbox-1200w.webp 1200w"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Adsterra Banner before Privacy Section */}
        <div className="mt-20 mb-20 flex justify-center" ref={adContainerRefPrivacy}>
          {/* Ad will be loaded dynamically here */}
        </div>

        {/* Privacy Section */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform -rotate-3"></div>
              <img
                src="/images/photo-latop-design-pixeltoolbox-1600w.webp"
                alt="Designer using PixelToolbox on a laptop"
                className="relative w-full h-auto rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-300"
                loading="lazy"
                srcSet="/images/photo-latop-design-pixeltoolbox-480w.webp 480w, /images/photo-latop-design-pixeltoolbox-800w.webp 800w, /images/photo-latop-design-pixeltoolbox-1200w.webp 1200w"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                Your Privacy is Our Priority
              </h2>
              <div className="space-y-6 text-lg text-slate-700 leading-relaxed">
                <p>
                  In an age where data privacy is more important than ever, we want to be clear: <strong className="text-slate-900">we do not save your data.</strong>
                </p>
                <p>
                  All image processing happens directly in your browser. Your files are never uploaded to our servers. This client-side approach ensures your images remain private and secure, always under your control.
                </p>
                <p className="text-blue-700 font-medium">
                  For complete transparency, the source code is available on GitHub for independent review.
                </p>
                <p>
                  For a detailed explanation of how we handle your data, please read our <Link to="/privacy-policy" className="text-blue-600 hover:text-blue-700 font-semibold transition-colors">Privacy Policy</Link>.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mb-20">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 text-center mb-12">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Privacy First</h3>
              <p className="text-slate-600">Your data stays on your device, always.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                <Heart className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Free Forever</h3>
              <p className="text-slate-600">Quality tools shouldn't cost a fortune.</p>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                <Users className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">User Focused</h3>
              <p className="text-slate-600">Built for creators, by creators.</p>
            </div>
          </div>
        </div>

        {/* Contact Us Section */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center justify-items-center">
            <div className="text-center lg:text-left order-2 lg:order-1">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 flex items-center justify-center lg:justify-start">
                Contact Us
              </h2>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Have questions, feedback, or interested in collaboration? We'd love to hear from you!
              </p>
              <p className="text-lg text-blue-700 font-medium mb-6">
                Email us at:{' '}
                <a
                  href="mailto:contactpixelfanlabs@gmail.com"
                  className="hover:underline"
                >
                  contactpixelfanlabs@gmail.com
                </a>
              </p>
            </div>
            <div className="relative order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-2xl transform rotate-3"></div>
              <img
                src="/images/photo-contact-us-pixeltoolbox-1200w.webp"
                alt="Contact us illustration"
                className="relative w-full h-auto rounded-2xl shadow-2xl transform -rotate-1 hover:rotate-0 transition-transform duration-300"
                loading="lazy"
                srcSet="/images/photo-contact-us-pixeltoolbox-480w.webp 480w, /images/photo-contact-us-pixeltoolbox-800w.webp 800w, /images/photo-contact-us-pixeltoolbox-1200w.webp 1200w"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>

        {/* Adsterra Banner after Contact Us Section */}
        <div className="mt-20 mb-20 flex justify-center" ref={adContainerRefContact}>
          {/* Ad will be loaded dynamically here */}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to optimize your images?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of creators who trust PixelToolbox for their image optimization needs.
          </p>
          <a
            href="/#optimize"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-full font-semibold text-lg hover:bg-blue-50 transition-colors shadow-lg"
          >
            Start Optimizing Now
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;