import { useState } from "react";
import { Link } from "react-router-dom";
import FeedbackForm from "./FeedbackForm";

function FormConnector({ onFormConnect }) {
  const [formId, setFormId] = useState("");
  const [isHovered, setIsHovered] = useState(false);
  const [error, setError] = useState("");
  const [isConnected, setIsConnected] = useState(false);

  const handleConnect = () => {
    const trimmedId = formId.trim();
    if (!trimmedId) {
      setError("Please enter a Form ID");
      return;
    }
    
    if (!/^[a-zA-Z0-9-_]+$/.test(trimmedId)) {
      setError("Form ID can only contain letters, numbers, hyphens, and underscores");
      return;
    }

    setError("");
    setIsConnected(true);
    onFormConnect(trimmedId);
  };

  return (
    <section id="connect-form-section" className="section bg-gradient-to-r from-indigo-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container max-w-4xl">
        {!isConnected ? (
          <div className="card p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
                Connect Your Form
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Enter your Form ID to start collecting and analyzing feedback
              </p>
            </div>

            <div className="relative">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                  <input
                    type="text"
                    placeholder="Enter your Form ID (e.g., customer-feedback-2025)"
                    value={formId}
                    onChange={(e) => {
                      setFormId(e.target.value);
                      setError("");
                    }}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleConnect}
                  className="btn-primary md:w-auto whitespace-nowrap"
                >
                  Connect Form
                </button>
              </div>

              <div 
                className={`absolute -top-12 left-0 right-0 text-sm bg-white dark:bg-gray-800 
                           text-gray-600 dark:text-gray-300 p-2 rounded-lg shadow-lg 
                           transition-all duration-300 ${
                  isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'
                }`}
              >
                💡 Your Form ID is a unique identifier that helps organize feedback from different sources
              </div>
            </div>

            <div className="mt-8 grid md:grid-cols-3 gap-6">
              <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-50 to-white dark:from-gray-800 dark:to-gray-700">
                <div className="font-semibold mb-2 text-gray-900 dark:text-white">Google Forms</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Use Apps Script to connect your Google Form
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-cyan-50 to-white dark:from-gray-800 dark:to-gray-700">
                <div className="font-semibold mb-2 text-gray-900 dark:text-white">HTML Forms</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Simple POST request to our webhook endpoint
                </p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-white dark:from-gray-800 dark:to-gray-700">
                <div className="font-semibold mb-2 text-gray-900 dark:text-white">API Integration</div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Direct API access for custom solutions
                </p>
              </div>
            </div>
          </div>
        ) : (
          <FeedbackForm formId={formId} onSubmitSuccess={() => {}} />
        )}

        {!isConnected && (
          <div className="mt-8 grid md:grid-cols-2 gap-6">
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Quick Start Guide
              </h3>
              <ol className="space-y-4 text-gray-600 dark:text-gray-300">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </span>
                  <span>Create a unique Form ID for your feedback form</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </span>
                  <span>Connect your form using our integration options</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </span>
                  <span>Start receiving AI-powered feedback analysis</span>
                </li>
              </ol>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                Need Help?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our documentation provides detailed integration guides for all platforms.
              </p>
              <Link 
                to="/docs"
                className="btn-primary bg-white dark:bg-gray-800 !text-indigo-600 dark:!text-indigo-400 border-2 border-current hover:bg-indigo-50 dark:hover:bg-gray-700 inline-block"
              >
                View Documentation
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default FormConnector;
