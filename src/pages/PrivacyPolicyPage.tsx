import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Google AdSense and Cookies</h2>
        <p>
          This site uses Google AdSense, a third-party vendor, which uses cookies to serve personalized ads. These cookies track your browsing history on this site and others to provide advertisements relevant to your interests.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
        <p>We collect personal information from users primarily through contact forms, which is used solely to respond to your inquiries. Google also collects data for ad personalization purposes as described above.</p>
        <p className="mt-2 font-bold">PixelToolbox processes all your images directly in your browser. No image data is ever uploaded to our servers, ensuring your privacy and security.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Opt-Out Option</h2>
        <p>Users may opt out of personalized advertising by visiting the Google Ads Settings page: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.google.com/settings/ads</a>.</p>
      </section>

      <section className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
        <p>We take reasonable measures to protect the personal information we collect. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at: [Your Email Address Here]</p>
      </section>
    </div>
  );
};

export default PrivacyPolicyPage;