import { useState, useEffect } from 'react';

function FeedbackAnalysis({ analysis }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (analysis) {
      setVisible(true);
      // Hide after 20 seconds instead of 10 to give more time to read
      const timer = setTimeout(() => setVisible(false), 20000);
      return () => clearTimeout(timer);
    }
  }, [analysis]);

  if (!analysis || !visible) return null;

  const sentimentColors = {
    positive: 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/50 dark:border-green-800 dark:text-green-200',
    neutral: 'bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/50 dark:border-gray-800 dark:text-gray-200',
    negative: 'bg-red-50 border-red-200 text-red-700 dark:bg-red-900/50 dark:border-red-800 dark:text-red-200'
  };

  const sentimentIcons = {
    positive: '😊',
    neutral: '😐',
    negative: '😔'
  };

  // Function to get a more descriptive sentiment name
  const getSentimentDescription = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return 'Positive';
      case 'negative':
        return 'Negative';
      case 'neutral':
        return 'Neutral';
      default:
        return sentiment;
    }
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className={`card border ${sentimentColors[analysis.sentiment]} transition-all duration-300 transform hover:scale-[1.02]`}>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Feedback Analysis Result
            </h3>
            <span className="text-sm">
              {new Date(analysis.created_at).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label={`${analysis.sentiment} sentiment`}>
              {sentimentIcons[analysis.sentiment]}
            </span>
            <span className="font-medium capitalize">
              {getSentimentDescription(analysis.sentiment)} Feedback
            </span>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Sentiment Analysis</h4>
            <p className="text-sm whitespace-pre-line">
              {analysis.sentiment_analysis || "No detailed sentiment analysis available."}
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">Summary</h4>
            <p className="text-sm whitespace-pre-line">
              {analysis.summary}
            </p>
          </div>

          {analysis.detailed_analysis && (
            <div className="space-y-2">
              <h4 className="font-medium">Detailed Analysis</h4>
              <div className="text-sm whitespace-pre-line bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                {analysis.detailed_analysis}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FeedbackAnalysis;