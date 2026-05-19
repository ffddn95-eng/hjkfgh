import React from 'react';

export default function Privacy() {
  return (
    <div className="bg-[#050505] min-h-screen text-white px-6 py-12 md:px-20 md:py-24">
      <div className="max-w-3xl mx-auto align-left">
        <a href="/" className="text-[#00ff9d] hover:underline mb-8 inline-block">&larr; Back to Home</a>
        <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">Privacy Policy</h1>
        
        <div className="space-y-6 text-white/80 text-sm leading-relaxed">
          <p>Effective Date: January 1, 2026</p>
          
          <h2 className="text-2xl text-white font-bold mt-8">1. Information We Collect</h2>
          <p>
            When you interact with Launchpip, we collect information that you provide to us directly. This includes the business ideas you submit, the answers you provide during the validation protocol, and any account information such as your email address when you register. We also automatically collect certain information about your device and how you interact with our Services, including IP address, browser type, referring URLs, and log data.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to operate, maintain, and provide the features and functionality of Launchpip. Specifically, your business ideas and inputs are processed by our AI engines to generate validation plans, pivot suggestions, and ruthless verdicts. We also use your information to communicate with you, provide customer support, and improve our platform's algorithms. Your data is essential for the personalized execution plans we deliver.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">3. Sharing of Your Information</h2>
          <p>
            We do not sell your personal information or business ideas to third parties. We may share your information with trusted third-party service providers (such as hosting providers and AI API providers like OpenAI or Mistral) who assist us in operating our platform, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also disclose information when legally required to do so.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">4. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">5. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">6. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at legal@launchpip.com.
          </p>
        </div>
      </div>
    </div>
  );
}
