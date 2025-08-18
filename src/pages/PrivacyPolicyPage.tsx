import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
 return (
    <div className="pt-24 pb-20 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
 {/* Hero Section */}
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
 <div className="text-center mb-16">
 <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
          Privacy <span className="text-blue-600">Policy</span>
 </h1>
 <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Understanding how your data is handled
 </p>
 </div>

 {/* Content Sections */}
 <div className="max-w-4xl mx-auto space-y-12 text-slate-700 leading-relaxed">
 <section>
 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Google AdSense and Cookies
 </h2>
 <p className="text-lg">
            This site uses Google AdSense, a third-party vendor, which uses cookies to serve personalized ads. These cookies track your browsing history on this site and others to provide advertisements relevant to your interests.
 </p>
 </section>

 <section>
 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Data Collection
 </h2>
 <p className="text-lg mb-4">We collect personal information from users primarily through contact forms, which is used solely to respond to your inquiries. Google also collects data for ad personalization purposes as described above.</p>
 <p className="text-lg">PixelToolbox processes all your images directly in your browser. No image data is ever uploaded to our servers, ensuring your privacy and security.</p>
 </section>

 <section>
 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Opt-Out Option
 </h2>
 <p className="text-lg">Users may opt out of personalized advertising by visiting the Google Ads Settings page: <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.google.com/settings/ads</a>.</p>
 </section>

 <section>
 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Data Security
 </h2>
 <p className="text-lg">We take reasonable measures to protect the personal information we collect. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure.</p>
 </section>

 <section>
 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
 Changes to this Privacy Policy
 </h2>
 <p className="text-lg">We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.</p>
 </section>

 <section>
 <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
            Contact Information
 </h2>
 <p className="text-lg">If you have any questions about this Privacy Policy, please contact us at: contactpixelfanlabs@gmail.com</p>
 </section>
 </div>
 </div>
    </div>
  );
};

export default PrivacyPolicyPage;