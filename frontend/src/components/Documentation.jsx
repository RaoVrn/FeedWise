import { useState } from 'react';
import { Link } from 'react-router-dom';

function Documentation() {
  const [isHelpful, setIsHelpful] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl py-12">
        {/* Back to Home */}
        <Link 
          to="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-8"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        {/* Documentation Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-8">FeedWise Documentation</h1>
          
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Introduction to FeedWise</h2>
            <p className="text-gray-600 dark:text-gray-300">
              FeedWise is a smart feedback collection and analysis platform that uses AI to transform raw feedback into actionable insights. 
              Our platform processes feedback in real-time, providing instant sentiment analysis, summaries, and trend detection to help you 
              better understand your users' needs.
            </p>
          </section>

          {/* Connecting Your Form */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Connecting Your Form</h2>
            
            <h3 className="text-xl font-semibold mt-6 mb-3">Google Forms Integration</h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-6">
              <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300">
                <li>Open your Google Form in Google Forms editor</li>
                <li>Click on the "..." menu and select "Script editor"</li>
                <li>Copy and paste the following webhook code (provided in integration guide)</li>
                <li>Replace FORM_ID with your unique FeedWise form identifier</li>
                <li>Deploy the script and authorize necessary permissions</li>
              </ol>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">HTML Forms</h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Add our webhook endpoint to your form's action attribute:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">
                  &lt;form action="https://api.feedwise.com/webhook/YOUR_FORM_ID" method="POST"&gt;
                </code>
              </pre>
            </div>

            <h3 className="text-xl font-semibold mt-6 mb-3">API Integration</h3>
            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Send POST requests to our webhook endpoint:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm">{`POST https://api.feedwise.com/webhook/YOUR_FORM_ID
Content-Type: application/json

{
  "responses": {
    "feedback": "User feedback text here"
  }
}`}</code>
              </pre>
            </div>
          </section>

          {/* Understanding Feedback Insights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Understanding Feedback Insights</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              FeedWise provides three levels of analysis for each feedback submission:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="card">
                <h4 className="font-semibold mb-2">Sentiment Analysis</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Automatic classification of feedback as positive, negative, or neutral with detailed explanation.
                </p>
              </div>
              <div className="card">
                <h4 className="font-semibold mb-2">Smart Summaries</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Concise, one-sentence summaries capturing the main points of each feedback.
                </p>
              </div>
              <div className="card">
                <h4 className="font-semibold mb-2">Trend Detection</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Identification of common themes and patterns across multiple feedback submissions.
                </p>
              </div>
            </div>
          </section>

          {/* How Sentiment Analysis Works */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">How Sentiment Analysis Works</h2>
            <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/50 dark:to-cyan-900/50 rounded-lg p-6">
              <p className="text-gray-600 dark:text-gray-300">
                FeedWise uses Google's advanced Gemini AI model to analyze feedback in real-time. When feedback is submitted:
              </p>
              <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>The AI model processes the text to understand context and sentiment</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Sentiment is classified based on emotional tone and content</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Key themes and actionable insights are automatically extracted</span>
                </li>
              </ul>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="card">
                <h3 className="font-semibold mb-2">Is FeedWise free to use?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes, FeedWise is currently free to use during our beta period. We'll introduce pricing plans in the future 
                  with a generous free tier for small teams.
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold mb-2">How secure is my data?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  We use end-to-end encryption and follow industry best practices for data security. Your feedback data is stored 
                  securely and processed in compliance with GDPR and other privacy regulations.
                </p>
              </div>
              <div className="card">
                <h3 className="font-semibold mb-2">Can I integrate custom forms?</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Yes! Our webhook API allows you to integrate any form solution that can make HTTP requests. Check our API 
                  documentation for detailed integration guides.
                </p>
              </div>
            </div>
          </section>

          {/* Feedback Box */}
          <div className="mt-16 card text-center">
            <h3 className="text-lg font-semibold mb-4">Was this page helpful?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsHelpful(true)}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  isHelpful === true
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setIsHelpful(false)}
                className={`px-6 py-2 rounded-lg transition-all duration-300 ${
                  isHelpful === false
                    ? 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;