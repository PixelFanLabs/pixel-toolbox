import React from 'aact';
import Hero from './Hero';
import { Helmet } from 'react-helmet-async';

interface HomePageProps {}

const HomePage: React.FC<HomePageProps> = () => {
  return (
    <div>
      <Helmet>
        <title>PixelToolbox | Free & Secure Image Optimization</title>
        <meta
          name="description"
          content="Optimize your images for the web with our free and secure toolkit. Batch process, convert formats, and get web-ready assets in seconds."
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "PixelToolbox",
              "operatingSystem": "Web",
              "applicationCategory": "MultimediaApplication",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "ratingCount": "150"
              },
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            }
          `}
        </script>
      </Helmet>
      <Hero />
    </div>
  );
};

export default HomePage;