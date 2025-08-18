import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import learnContent from '../content/learnContent.json';

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

  useEffect(() => {
    const results = learnContent.filter(article =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.content.some(contentItem =>
        contentItem.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredContent(results);
  }, [searchTerm]);

  return (
    <div className="pt-24 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Learn About 
            <span className="text-blue-600"> Web Image Formats</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Explore our articles and guides on modern web image formats and optimization techniques.
          </p>
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
                </ul>
              </nav>
            </div>
          </aside>

          {/* Articles Section */}
          <div className="w-full lg:w-2/3">
            {filteredContent.length > 0 ? (
              filteredContent.map((article, articleIndex) => (
                <article key={articleIndex} id={article.title.replace(/\s+/g, '-')} className="mb-12 bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-2xl border border-slate-200">
                  <img
                    src={article.image.src}
                    srcSet={article.image.srcset.map(s => `${s.src} ${s.descriptor}`).join(', ')}
                    alt={article.title}
                    className="w-full h-64 object-cover"
                  />
                  <div className="p-8">
                    <h2 className="text-3xl font-bold mb-3 text-slate-900">{article.title}</h2>
                    <p className="text-slate-500 mb-6">By {article.author}</p>
                    
                    {article.content.map((contentItem, contentIndex) => {
                      // Start of code for Adsterra Native Banner Ads
                      if (contentIndex === 0 && contentItem.type === 'paragraph') {
                        return (
                          <React.Fragment key={contentIndex}>
                            <p className="mb-4 text-slate-700 leading-relaxed">{contentItem.text}</p>
                            {/* Adsterra Native Banner Ad Unit */}
                            <div className="my-8 flex justify-center">
                              <div id="container-eaa56e5d2f00d1d5a4b44c95331429f1"></div>
                            </div>
                          </React.Fragment>
                        );
                      }
                      // End of code for Adsterra Native Banner Ads
                      if (contentItem.type === 'heading') {
                        const Tag = `h${contentItem.level}` as keyof JSX.IntrinsicElements;
                        return <Tag key={contentIndex} className="text-2xl font-semibold mt-8 mb-4 text-slate-800">{contentItem.text}</Tag>;
                      }
                      return <p key={contentIndex} className="mb-4 text-slate-700 leading-relaxed">{contentItem.text}</p>;
                    })}
                  </div>
                </article>
              ))
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