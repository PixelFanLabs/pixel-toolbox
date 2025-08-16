import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <section id="about" className="pt-24 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center my-12">About PixelToolbox</h2>
        <p className="text-lg mb-6 text-center text-gray-600">
          PixelToolbox is a free service brought to you by{' '}
          <a
            href="https://pixelfanlabs.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            PixelFanLabs
          </a>
          . We believe that everyone should have access to high-quality, easy-to-use tools to make their digital lives easier.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-8">
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Our Mission</h3>
            <p className="text-gray-600">
              Our mission is to simplify the process of preparing images for the web. We saw a need for a single tool that could handle format conversion, resizing, and optimization without the need for technical expertise or expensive software. PixelToolbox is our solution: a powerful, all-in-one image utility that's accessible to everyone.
            </p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-2xl font-semibold mb-3 text-gray-800">Your Privacy is Our Priority</h3>
            <p className="text-gray-600">
              In an age where data privacy is more important than ever, we want to be clear: **we do not save your data**. All image processing happens directly in your browser. Your files are never uploaded to our servers. This client-side approach ensures that your images remain private and secure, always under your control.
            </p>
          </div>
        </div>

        <div className="text-center mt-8">
          <h3 className="text-2xl font-semibold mb-4 text-gray-900">Why We Built This</h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We got tired of juggling multiple tools to get images ready for websites. First, you need to find a format converter, then a resizer, and then an optimizer. We wanted to create a seamless workflow that takes you from raw image to web-ready asset in seconds. That's why we built PixelToolbox with batch processing and smart defaults, so you can focus on your creative work, not on the technical details.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;