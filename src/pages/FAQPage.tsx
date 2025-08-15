import React, { useState } from 'react';
import Accordion from '../components/Accordion';
import SearchBar from '../components/SearchBar';

const faqData = [
  {
    question: 'Is PixelToolbox secure?',
    answer: 'Yes, PixelToolbox processes all your images directly in your browser. No image data is ever uploaded to our servers, ensuring your privacy and security.',
  },
  {
    question: 'Is PixelToolbox free to use?',
    answer: 'Absolutely! PixelToolbox is a free service provided by PixelFanLabs, designed to be accessible to everyone.',
  },
  {
    question: 'What image formats are supported?',
    answer: 'PixelToolbox supports a wide range of popular image formats including JPEG, PNG, WebP, AVIF, and GIF.',
  },
  {
    question: 'What browsers are supported?',
    answer: 'PixelToolbox is tested and optimized for the latest versions of modern desktop browsers, including Google Chrome, Mozilla Firefox, and Microsoft Edge. While it may work on other browsers, we recommend using one of these for the best experience.',
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No, PixelToolbox is a web-based application. You can access it directly from your browser without any installation.',
  },
  {
    question: 'What exactly does selecting “Smart Optimization” do?',
    answer: '“Smart Optimization” improves the visual quality of your images by applying a high-quality smoothing algorithm during the resizing process. It doesn’t change your other settings (like format or quality); it works with them to produce a better-looking result, especially when making images smaller.',
  },
];

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqData = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section id="faq" className="pt-24 pb-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center my-12">Frequently Asked Questions</h2>
        <SearchBar onSearch={setSearchTerm} />
        <div className="space-y-4">
          {filteredFaqData.map((item, index) => (
            <Accordion key={index} title={item.question}>
              <p className="text-gray-600">{item.answer}</p>
            </Accordion>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQPage;