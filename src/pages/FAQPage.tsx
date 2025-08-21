import React, { useState } from 'react';
import { Search, HelpCircle, Shield, DollarSign, Globe, Download, Zap, Code } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import { Helmet } from 'react-helmet-async';
import AdsterraBannerAd from '../components/AdsterraBannerAd'; // Import the new AdsterraBannerAd component

const faqData = [
  {
    question: 'Is PixelToolbox secure?',
    answer: 'Yes, PixelToolbox processes all your images directly in your browser. No image data is ever uploaded to our servers, ensuring your privacy and security.',
    icon: <Shield className="w-6 h-6 text-blue-600" />,
    category: 'Security'
  },
  {
    question: 'Is PixelToolbox free to use?',
    answer: 'Absolutely! PixelToolbox is a free service provided by PixelFanLabs, designed to be accessible to everyone.',
    icon: <DollarSign className="w-6 h-6 text-green-600" />,
    category: 'Pricing'
  },
  {
    question: 'What image formats are supported?',
    answer: 'PixelToolbox supports a wide range of popular image formats including JPEG, PNG, WebP, AVIF, and GIF.',
    icon: <Code className="w-6 h-6 text-purple-600" />,
    category: 'Features'
  },
  {
    question: 'What browsers are supported?',
    answer: 'PixelToolbox is tested and optimized for the latest versions of modern desktop browsers, including Google Chrome, Mozilla Firefox, and Microsoft Edge. While it may work on other browsers, we recommend using one of these for the best experience.',
    icon: <Globe className="w-6 h-6 text-orange-600" />,
    category: 'Compatibility'
  },
  {
    question: 'Do I need to install any software?',
    answer: 'No, PixelToolbox is a web-based application. You can access it directly from your browser without any installation.',
    icon: <Download className="w-6 h-6 text-indigo-600" />,
    category: 'Usage'
  },
  {
    question: 'What exactly does selecting \"Smart Optimization\" do?',
    answer: '\"Smart Optimization\" improves the visual quality of your images by applying a high-quality smoothing algorithm during the resizing process. It doesn\'t change your other settings (like format or quality); it works with them to produce a better-looking result, especially when making images smaller.',
    icon: <Zap className="w-6 h-6 text-yellow-600" />,
    category: 'Features'
  },
];

const FAQPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const filteredFaqData = faqData.filter((item) =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const categories = Array.from(new Set(faqData.map(item => item.category)));

  // Generate FAQPage schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(item => ({
      "@type": "Question",
      "name": item.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": item.answer
      }
    }))
  };

  return (
    <div className="pt-24 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <Helmet>
        <title>FAQ | PixelToolbox - Your Questions Answered</title>
        <meta
          name="description"
          content="Find answers to frequently asked questions about PixelToolbox, including security, privacy, supported formats, and usage tips."
        />
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Frequently Asked <span className="text-blue-600">Questions</span>
          </h1>
        </div>

        {/* Search Section */}
        <div className="mb-16">
          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={setSearchTerm} placeholder="Search frequently asked questions..." />
            {searchTerm && (
              <p className="mt-4 text-slate-600 text-center">
                Found {filteredFaqData.length} result{filteredF-aqData.length !== 1 ? 's' : ''} for "{searchTerm}"
              </p>
            )}
          </div>
        </div>

        {/* Adsterra Banner Ad after Search Bar */}
        <div className="my-16 flex justify-center">
          <AdsterraBannerAd />
        </div>

        {/* FAQ Items */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {filteredFaqData.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-12 h-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-2">No results found</h3>
                <p className="text-slate-600">Try adjusting your search terms or browse all questions below.</p>
              </div>
            ) : (
              filteredFaqData.map((item, index) => {
                const isOpen = openItems.includes(index);
                return (
                  <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-300 hover:border-blue-300 transition-all duration-300 overflow-hidden group"
                  >
                    <button
                      className="w-full text-left p-6 focus:outline-none"
                      onClick={() => toggleItem(index)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1 min-w-0">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg md:text-xl font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {item.question}
                            </h3>
                          </div>
                        </div>
                        <div className="flex-shrink-0 ml-4">
                          <div className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center transition-all duration-300 ${isOpen ? 'rotate-180 bg-blue-100' : 'group-hover:bg-blue-50'}`}>
                            <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </button>
                    
                    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                      <div className="px-6 pb-6">
                        <div className="pl-10">
                          <div>
                            <p className="text-slate-700 leading-relaxed text-lg">
                              {item.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Adsterra Banner Ad before CTA */}
        <div className="my-16 flex justify-center">
          <AdsterraBannerAd />
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white">
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

export default FAQPage;