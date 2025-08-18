import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    const results = learnContent.filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase())
      ||
      article.content.some(contentItem =>
        contentItem.text.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredContent(results);
  }, [searchTerm]);

  return (
    <div className="pt-24 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Learn About 
            <span className="text-blue-600"> Web Image Formats
 </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Everything you need to know about optimizing images for the web.
          </p>
        </div>
      </section>
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={setSearchTerm} />
          <nav className="my-8">
            <h2 className="text-2xl font-semibold mb-4">Table of Contents</h2>
            <ul>
              {filteredContent.map((article, index) => (
                <li key={index} className="mb-2">
                  <a href={`#${article.title.replace(/\s+/g, '-')}`} className="text-blue-600 hover:underline">
                    {article.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {filteredContent.map((article, index) => (
            <article key={index} id={article.title.replace(/\s+/g, '-')} className="mb-12 border rounded-lg p-6">
              <h2 className="text-3xl font-bold mb-4">{article.title}</h2>
              <p className="text-gray-600 mb-4">By {article.author}</p>
              <img
                src={article.image.src}
                srcSet={article.image.srcset.map(s => `${s.src} ${s.descriptor}`).join(', ')}
                alt={article.title}
                className="w-full h-auto rounded-lg shadow-md mb-8"
              />
              {article.content.map((contentItem, contentIndex) => {
                if (contentItem.type === 'heading') {
                  const Tag = `h${contentItem.level}` as keyof JSX.IntrinsicElements;
                  return <Tag key={contentIndex} className="text-2xl font-semibold mt-6 mb-4">{contentItem.text}</Tag>;
                }
                return <p key={contentIndex} className="mb-4">{contentItem.text}</p>;
              })}
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default LearnPage;
