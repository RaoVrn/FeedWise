import { useState, useEffect } from 'react';

function HeroHeader() {
  const [stats, setStats] = useState({
    forms: 0,
    responses: 0,
    satisfaction: 0
  });

  useEffect(() => {
    // Calculate total stats across all forms
    async function fetchGlobalStats() {
      try {
        const response = await fetch('http://localhost:8000/global-stats');
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching global stats:', error);
      }
    }

    fetchGlobalStats();
  }, []);

  const scrollToFormSection = () => {
    const formSection = document.querySelector('#connect-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700 [mask-image:linear-gradient(0deg,white,transparent)] dark:[mask-image:linear-gradient(0deg,gray-800,transparent)]"></div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-48 bg-gradient-to-br from-indigo-100/50 to-cyan-100/50 dark:from-indigo-900/30 dark:to-cyan-900/30 blur-3xl"></div>
      
      <div className="container relative mx-auto px-4 py-20 sm:py-32">
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/50 backdrop-blur-sm">
            <span className="animate-pulse">🚀</span>
            <span className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
              Supercharge Your Feedback Collection
            </span>
          </div>
          
          <h1 className="mb-6 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            Transform Feedback into
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400">
              Actionable Insights
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
            Leverage AI to automatically analyze sentiment, generate summaries, and understand what your users really think—all in real-time.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={scrollToFormSection}
              className="btn-primary px-8 py-4 text-lg hover-lift group flex items-center gap-2"
            >
              Get Started
              <svg 
                className="w-5 h-5 transform transition-transform group-hover:translate-x-1" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            <button className="px-8 py-4 text-lg rounded-lg font-medium
                           bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400
                           border-2 border-indigo-600 dark:border-indigo-500
                           hover:bg-indigo-50 dark:hover:bg-gray-700
                           transition-all duration-300 hover-lift">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card hover-scale">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800 dark:from-indigo-400 dark:to-indigo-300">
                {stats.forms}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">Active Forms</div>
            </div>
            <div className="card hover-scale">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-cyan-800 dark:from-cyan-400 dark:to-cyan-300">
                {stats.responses}+
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">Responses Analyzed</div>
            </div>
            <div className="card hover-scale">
              <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800 dark:from-green-400 dark:to-green-300">
                {stats.satisfaction}%
              </div>
              <div className="text-gray-600 dark:text-gray-300 mt-1">Customer Satisfaction</div>
            </div>
          </div>

          {/* Supported Platforms */}
          <div className="mt-16">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              Seamlessly integrate with your preferred platform
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {/* Google Forms */}
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-2xl">
                  <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V19.5a2.25 2.25 0 002.25 2.25h.75M15 12h3.75M15 15h3.75M15 18h3.75" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Google Forms</span>
              </div>

              {/* TypeForm */}
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-2xl">
                  <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">TypeForm</span>
              </div>

              {/* WordPress */}
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-2xl">
                  <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">WordPress</span>
              </div>

              {/* Custom API */}
              <div className="flex flex-col items-center gap-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500/10 to-cyan-500/10 text-2xl">
                  <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Custom API</span>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-8">
              Trusted by users across leading platforms: Google Forms, TypeForm, WordPress, and more
            </p>
          </div>
        </div>
      </div>

      {/* Bottom wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg className="w-full h-auto" viewBox="0 0 1440 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,42.7C960,43,1056,53,1152,53.3C1248,53,1344,43,1392,37.3L1440,32L1440,74L1392,74C1344,74,1248,74,1152,74C1056,74,960,74,864,74C768,74,672,74,576,74C480,74,384,74,288,74C192,74,96,74,48,74L0,74Z" 
                fill="currentColor" className="text-white dark:text-gray-800"/>
        </svg>
      </div>
    </section>
  );
}

export default HeroHeader;
