import React from 'react';

interface AboutProps {
  onBackClick: () => void;
}

const About: React.FC<AboutProps> = ({ onBackClick }) => {
  return (
    <div className="bg-gray-900 text-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto my-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold text-primary">About PixelToolbox</h1>
        <button 
          onClick={onBackClick}
          className="bg-blue-600 text-white hover:bg-blue-700 font-bold py-2 px-4 rounded"
        >
          Back
        </button>
      </div>
      <p className="text-lg mb-6 text-center text-gray-400">
        PixelToolbox is a free service brought to you by{' '}
        <a
          href="https://pixelfanlabs.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-secondary hover:underline"
        >
          PixelFanLabs
        </a>
        . We believe that everyone should have access to high-quality, easy-to-use tools to make their digital lives easier.
      </p>

      <div className="grid md:grid-cols-2 gap-8 my-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">Our Mission</h2>
          <p className="text-gray-300">
            Our mission is to simplify the process of preparing images for the web. We saw a need for a single tool that could handle format conversion, resizing, and optimization without the need for technical expertise or expensive software. PixelToolbox is our solution: a powerful, all-in-one image utility that's accessible to everyone.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-3 text-secondary">Your Privacy is Our Priority</h2>
          <p className="text-gray-300">
            In an age where data privacy is more important than ever, we want to be clear: **we do not save your data**. All image processing happens directly in your browser. Your files are never uploaded to our servers. This client-side approach ensures that your images remain private and secure, always under your control.
          </p>
        </div>
      </div>

      <div className="text-center mt-8">
        <h2 className="text-2xl font-semibold mb-4 text-primary">Why We Built This</h2>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          We got tired of juggling multiple tools to get images ready for websites. First, you need to find a format converter, then a resizer, and then an optimizer. We wanted to create a seamless workflow that takes you from raw image to web-ready asset in seconds. That's why we built PixelToolbox with batch processing and smart defaults, so you can focus on your creative work, not on the technical details.
        </p>
      </div>
    </div>
  );
};

export default About;