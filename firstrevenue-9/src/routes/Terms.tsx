import React from 'react';

export default function Terms() {
  return (
    <div className="bg-[#050505] min-h-screen text-white px-6 py-12 md:px-20 md:py-24">
      <div className="max-w-3xl mx-auto align-left">
        <a href="/" className="text-[#00ff9d] hover:underline mb-8 inline-block">&larr; Back to Home</a>
        <h1 className="text-4xl font-black mb-8 uppercase tracking-tighter">Terms of Service</h1>
        
        <div className="space-y-6 text-white/80 text-sm leading-relaxed">
          <p>Effective Date: January 1, 2026</p>
          
          <h2 className="text-2xl text-white font-bold mt-8">1. Acceptance of Terms</h2>
          <p>
            By accessing and using Launchpip, you accept and agree to be bound by the terms and provision of this agreement. 
            If you do not agree to abide by these terms, please do not use our service. Launchpip provides an AI-powered validation engine designed to critique business ideas and provide actionable growth plans.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">2. Intellectual Property</h2>
          <p>
            The business ideas you submit remain your intellectual property. However, by submitting an idea to Launchpip, you grant us a worldwide, non-exclusive, royalty-free license to parse, analyze, and process the text using our AI algorithms to generate the outputs provided back to you. The Launchpip platform itself, including its original content, features, and functionality, are owned by Launchpip and are protected by international copyright, trademark, and other intellectual property laws.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">3. AI-Generated Content Disclaimer</h2>
          <p>
            Launchpip utilizes advanced artificial intelligence to generate critiques, validation plans, and pivot suggestions ("Verdicts"). These Verdicts are auto-generated based on probabilistic models. They do not constitute financial, legal, or professional business advice. You agree that any actions you take based on the Verdicts are at your own risk. Launchpip is not liable for any financial losses or damages resulting from the execution of our generated plans.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">4. Use Limitations</h2>
          <p>
            You agree not to use the service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. We reserve the right to terminate or restrict your access to Launchpip without notice for any conduct that we, in our sole discretion, believe violates these Terms of Service or is harmful to other users of the service, us, or third parties, or for any other reason.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">5. No Guarantee of Revenue</h2>
          <p>
            While our goal is to help you achieve your "First Revenue", Launchpip does not guarantee any specific financial outcomes, user adoption, or business success. Startups are inherently risky, and you acknowledge that building a business may result in the total loss of your time and invested capital.
          </p>

          <h2 className="text-2xl text-white font-bold mt-8">6. Modifications</h2>
          <p>
            We may revise these Terms of Service at any time without notice. By using this website you are agreeing to be bound by the then current version of these Terms of Service.
          </p>
        </div>
      </div>
    </div>
  );
}
