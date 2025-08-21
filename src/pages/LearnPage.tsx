import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import learnContent from '../content/learnContent.json';
import { Helmet } from 'react-helmet-async';

interface Content {
  type: string;
  level?: number;
  text: string;
}

interface Article {
  title: string;
  author: string;
  image: {
    src: string;
    srcset: {
      src: string;
      descriptor: string;
    }[];
  };
  content: Content[];
}

const LearnPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredContent, setFilteredContent] = useState<Article[]>(learnContent);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const adContainerRef = useRef<HTMLDivElement>(null);
  const adRefs = useRef<HTMLDivElement[]>([null]);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const results = learnContent.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.some(contentItem =>
        contentItem.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredContent(results);
  }, [searchTerm]);

  useEffect(() => {
    adRefs.current.forEach((adContainer, index) => {
      if (adContainer) {
        // Clear any existing ad content to prevent duplicates on re-render
        adContainer.innerHTML = '';

        let adUnitConfig;

        if (screenWidth <= 767) { // Mobile
          adUnitConfig = {
            key: '7d0611dfd5286d972307c89c9c3c231c',
            width: 300,
            height: 250,
          };
        } else { // Tablet and Desktop
          adUnitConfig = {
            key: 'ad8f4ced24d88f4f48d5c63acc6b9634',
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
      }
    });
  }, [screenWidth, filteredContent]);

  return (
    <div className="pt-24 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <Helmet>
        <title>Learn | Web Image Formats & Optimization - PixelToolbox</title>
        <meta
          name="description"
          content="Explore articles and guides on modern web image formats like WebP, AVIF, and optimization techniques to improve your website performance with PixelToolbox."
        />
      </Helmet>
      {/* Hero Section */}
      <section className="mb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Learn About 
            <span className="text-blue-600"> Web Image Formats</span>
          </h1>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row lg:space-x-12">

          {/* Sidebar */}
          <aside className="w-full lg:w-1/3 lg:sticky lg:top-24 self-start mb-12 lg:mb-0">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200">
              <SearchBar onSearch={setSearchTerm} placeholder="Search articles..." />
              <nav>
                <div 
                  className="flex justify-between items-center cursor-pointer lg:cursor-default"
                  onClick={() => setIsTocOpen(!isTocOpen)}
                >
                  <h2 className="text-2xl font-semibold text-slate-900">Table of Contents</h2>
                  <ChevronDown 
                    className={`w-6 h-6 text-slate-500 transition-transform lg:hidden ${isTocOpen ? 'rotate-180' : ''}`} 
                  />
                </div>
                <ul className={`mt-4 space-y-2 border-t pt-4 ${isTocOpen ? 'block' : 'hidden'} lg:block`}>
                  {filteredContent.map((article, index) => (
                    <li key={index}>
                      <a href={`#${article.title.replace(/\s+/g, '-')}`} className="text-blue-600 hover:underline hover:text-blue-800 transition-colors block p-2 rounded-md hover:bg-blue-50">
                        {article.title}
                      </a>
                    </li>
                  ))}
                  {/* Removed pop-under ad container */}
                </ul>
              </nav>
            </div>
          </aside>

          {/* Articles Section */}
          <div className="w-full lg:w-2/3">
            {filteredContent.length > 0 ? (
              filteredContent.map((article, articleIndex) => {
                const adIndex = articleIndex === 0 || (articleIndex - 1) % 2 === 0 ? articleIndex : -1;
                return (
                  <React.Fragment key={articleIndex}>
                    <article id={article.title.replace(/\s+/g, '-')}
                     className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl border border-slate-200">
                      <img
                        src={article.image.src}
                        srcSet={article.image.srcset.map(s => `${s.src} ${s.descriptor}`).join(', ')}
                        alt={`Article thumbnail for ${article.title}`}
                        className="w-full h-64 object-cover"
                      />
                      <div className="p-8">
                        <h2 className="text-3xl font-bold mb-3 text-slate-900">{article.title}</h2>
                        <p className="text-slate-500 mb-6">By {article.author}</p>

                        {article.content.map((contentItem, contentIndex) => {
                          if (contentItem.type === 'heading') {
                            const Tag = `h${contentItem.level}` as keyof JSX.IntrinsicElements;
                            return <Tag key={contentIndex} className="text-2xl font-semibold mt-8 mb-4 text-slate-800">{contentItem.text}</Tag>;
                          }
                          return <p key={contentIndex} className="mb-4 text-slate-700 leading-relaxed">{contentItem.text}</p>;
                        })}
                      </div>
                    </article>
                    {adIndex !== -1 && (
                      <div className="my-8 flex justify-center" ref={el => (adRefs.current[adIndex] = el)} id="container-595098208be58f6b1fc62e768dcc579c">
                        {/* Ad will be loaded dynamically here */}
                      </div>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 text-center border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">No Articles Found</h2>
                <p className="text-slate-600">Try adjusting your search term to find what you're looking for.</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default LearnPage;