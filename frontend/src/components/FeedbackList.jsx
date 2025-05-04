import { useEffect, useState, useCallback } from "react";
import { getFeedbackList, getFeedbackStats } from "../api/api";
import debounce from 'lodash/debounce';

function SentimentBadge({ sentiment }) {
  const colors = {
    positive: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    negative: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors[sentiment]}`}>
      {sentiment.charAt(0).toUpperCase() + sentiment.slice(1)}
    </span>
  );
}

function FeedbackCard({ feedback }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasAnalysis = Boolean(feedback.sentiment_analysis || feedback.detailed_analysis);

  return (
    <div className="card hover-lift fade-in">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap justify-between items-start gap-2">
          <SentimentBadge sentiment={feedback.sentiment} />
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {new Date(feedback.created_at).toLocaleString()}
          </span>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">
            {feedback.summary}
          </h3>
          <div className={`text-gray-600 dark:text-gray-300 overflow-hidden transition-all duration-300 ${
            isExpanded ? 'max-h-[1000px]' : 'max-h-20'
          }`}>
            <p className="whitespace-pre-line">{feedback.responses.feedback}</p>
            
            {/* Analysis Section */}
            {isExpanded && (
              <div className="mt-6 space-y-6 border-t border-gray-200 dark:border-gray-700 pt-4">
                {/* Sentiment Analysis */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
                    Sentiment Analysis
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {feedback.sentiment_analysis ? (
                      <p className="whitespace-pre-line">{feedback.sentiment_analysis}</p>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Sentiment analysis is being processed</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Detailed Analysis */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    Detailed Analysis
                  </h4>
                  <div className="text-sm text-gray-600 dark:text-gray-300">
                    {feedback.detailed_analysis ? (
                      <p className="whitespace-pre-line">{feedback.detailed_analysis}</p>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Detailed analysis is being processed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300 
                     text-sm font-medium mt-2 bg-transparent border-none p-0 shadow-none hover:bg-transparent
                     flex items-center gap-1"
          >
            <span>{isExpanded ? 'Show less' : 'Read more'}</span>
            <svg 
              className={`w-4 h-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackList({ formId, refreshTrigger }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    sentiment_counts: { positive: 0, neutral: 0, negative: 0 }
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query, sentiment) => {
      if (!formId) return;
      
      setLoading(true);
      try {
        const [feedbackData, statsData] = await Promise.all([
          getFeedbackList(formId, query, sentiment !== 'all' ? sentiment : ''),
          getFeedbackStats(formId)
        ]);
        setFilteredFeedbacks(feedbackData);
        setStats(statsData);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [formId]
  );

  // Fetch initial data and setup search/filter effects
  useEffect(() => {
    if (formId) {
      debouncedSearch(searchTerm, filter);
    }
  }, [formId, searchTerm, filter, refreshTrigger, debouncedSearch]);

  if (!formId) return null;

  const { total, sentiment_counts } = stats;
  const positivePercentage = total ? Math.round((sentiment_counts.positive || 0) / total * 100) : 0;
  const neutralPercentage = total ? Math.round((sentiment_counts.neutral || 0) / total * 100) : 0;
  const negativePercentage = total ? Math.round((sentiment_counts.negative || 0) / total * 100) : 0;

  return (
    <section className="section bg-gradient-to-b from-white to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container max-w-4xl">
        <div className="text-center mb-8">
          <h2>Feedback Insights</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Real-time analysis of {total} responses
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="card text-center hover-lift">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {sentiment_counts.positive || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Positive ({positivePercentage}%)
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500" 
                style={{ width: `${positivePercentage}%` }}
              />
            </div>
          </div>
          <div className="card text-center hover-lift">
            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
              {sentiment_counts.neutral || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Neutral ({neutralPercentage}%)
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gray-500" 
                style={{ width: `${neutralPercentage}%` }}
              />
            </div>
          </div>
          <div className="card text-center hover-lift">
            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
              {sentiment_counts.negative || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-300">
              Negative ({negativePercentage}%)
            </div>
            <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-red-500" 
                style={{ width: `${negativePercentage}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['all', 'positive', 'neutral', 'negative'].map(type => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all duration-300 ${
                  filter === type
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-md'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 
                     dark:border-gray-700 text-gray-900 dark:text-gray-100 
                     focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 
                     focus:border-transparent transition-all duration-200"
            />
            {loading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="w-5 h-5 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
        </div>

        {/* Feedback List */}
        <div className="space-y-4">
          {loading && !filteredFeedbacks.length ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-t-2 border-b-2 border-indigo-600 dark:border-indigo-400 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading feedback...</p>
            </div>
          ) : filteredFeedbacks.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                {searchTerm 
                  ? 'No feedback matches your search'
                  : 'No feedback received yet'}
              </p>
            </div>
          ) : (
            filteredFeedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default FeedbackList;
