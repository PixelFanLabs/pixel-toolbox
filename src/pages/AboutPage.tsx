import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <section id="about" className="pt-24 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center my-8">About PixelToolbox</h2>
        <div className="relative max-w-lg mx-auto my-8 rounded-lg shadow-md overflow-hidden">
          <img
            src="/images/photo-design-pixeltoolbox.avif"
            alt="Visual representing the meaning behind PixelToolbox"
            className="w-full h-auto object-cover brightness-50 contrast-125"
          />
          <p className="absolute inset-0 flex items-center justify-center text-3xl text-white text-center font-bold p-4">
            PixelToolbox is a free service brought to you by{' '}
            <a
              href="https://pixelfanlabs.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-300 hover:underline"
            >
              PixelFanLabs
            </a>
          </p>
        </div>

        <div className="mt-8 max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 text-center">Why We Built This</h3>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 overflow-hidden">
            <img
              src="/images/photo-fustrated-pixeltoolbox.avif"
              alt="Visual representing frustration with multiple tools"
              className="w-full md:w-1/2 h-auto rounded-lg shadow-md md:order-2"
            />
            <p className="text-lg text-gray-600 w-full md:w-1/2 mx-auto leading-relaxed md:order-1">
              Juggling multiple tools to get images ready for the web is a hassle. You're left researching the right resolution for an avatar, the best format for a logo, and how to make your photos load faster. Then, you have to find a format converter, a resizer, and an optimizer.

              We were tired of this workflow, and we believe everyone should have access to high-quality, easy-to-use tools to make their digital lives easier. That's why we built PixelToolbox—to take you from raw image to web-ready asset in seconds. With batch processing and smart defaults, PixelToolbox lets you focus on your creative work, not the technical details.
            </p>
          </div>
        </div>

        {/* Your Privacy is Our Priority section, moved and restyled */}
        <div className="my-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900 text-center">Your Privacy is Our Priority</h3>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            In an age where data privacy is more important than ever, we want to be clear: <strong>we do not save your data.</strong> All image processing happens directly in your browser. Your files are never uploaded to our servers. This client-side approach ensures your images remain private and secure, always under your control.

            For complete transparency, the source code is available on GitHub for independent review.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;