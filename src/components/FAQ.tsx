import React from 'react';

const FAQ: React.FC = () => {
  return (
    <section id="faq" className="py-16 bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Is PixelToolbox secure?</h3>
            <p className="text-gray-600">Yes, PixelToolbox processes all your images directly in your browser. No image data is ever uploaded to our servers, ensuring your privacy and security.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Is PixelToolbox free to use?</h3>
            <p className="text-gray-600">Absolutely! PixelToolbox is a free service provided by PixelFanLabs, designed to be accessible to everyone.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">What image formats are supported?</h3>
            <p className="text-gray-600">PixelToolbox supports a wide range of popular image formats including JPEG, PNG, WebP, AVIF, and GIF.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Do I need to install any software?</h3>
            <p className="text-gray-600">No, PixelToolbox is a web-based application. You can access it directly from your browser without any installation.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;