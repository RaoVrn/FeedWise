import { useState } from "react";
import { submitFeedback } from "../api/api";
import FeedbackAnalysis from "./FeedbackAnalysis";

function FeedbackForm({ formId, onSubmitSuccess }) {
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const maxLength = 1000;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) {
      setError("Please enter your feedback");
      return;
    }

    if (feedback.length > maxLength) {
      setError(`Feedback must be ${maxLength} characters or less`);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await submitFeedback(formId, { responses: { feedback: feedback.trim() } });
      setFeedback("");
      setAnalysis(response); // Store the Gemini analysis result
      if (onSubmitSuccess) onSubmitSuccess();
    } catch (err) {
      setError(err.message || "Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section bg-gradient-to-b from-indigo-50 to-white dark:from-gray-800 dark:to-gray-900">
      <div className="container max-w-2xl">
        <div className="card hover-lift">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
              Share Your Feedback
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Help us improve by sharing your thoughts
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <textarea
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  setError("");
                }}
                rows={5}
                maxLength={maxLength}
                placeholder="What's on your mind? We'd love to hear your thoughts..."
                className={`input-field transition-all duration-200 ${
                  error ? 'border-red-500 focus:ring-red-500 dark:border-red-700 dark:focus:ring-red-600' : ''
                }`}
              />
              {error && (
                <p className="mt-2 text-sm text-red-600 dark:text-red-400 fade-in">
                  {error}
                </p>
              )}
              <div className="mt-2 flex justify-end">
                <span className={`text-sm ${
                  feedback.length > maxLength 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {feedback.length} / {maxLength}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary relative transform transition-all duration-200 hover:scale-105 active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="opacity-0">Submit</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                    </div>
                  </>
                ) : (
                  "Submit Feedback"
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Feedback Analysis Result */}
        <FeedbackAnalysis analysis={analysis} />
      </div>
    </section>
  );
}

export default FeedbackForm;
