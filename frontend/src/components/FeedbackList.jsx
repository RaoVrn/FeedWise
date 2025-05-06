import { useEffect, useState, useCallback } from "react";
import { getFeedbackList, getFeedbackStats } from "../api/api";
import debounce from 'lodash/debounce';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

// Register the required Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

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
  const [aspectBreakdown, setAspectBreakdown] = useState({
    positiveAspects: [],
    neutralAspects: [],
    negativeAspects: []
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
        setFeedbacks(feedbackData);
        setStats(statsData);
        
        // Process feedback to extract aspect data
        processAspectBreakdown(feedbackData);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      } finally {
        setLoading(false);
      }
    }, 300),
    [formId]
  );

  // Process feedback to extract aspects based on user input text - with logic to avoid nonsensical phrases
  const processAspectBreakdown = useCallback((feedbackData) => {
    // If no feedback data available, return empty
    if (!feedbackData || feedbackData.length === 0) {
      setAspectBreakdown({
        positiveAspects: [],
        neutralAspects: [],
        negativeAspects: []
      });
      return;
    }
    
    // Initialize aspect counts for each sentiment
    const aspects = {
      positive: {},
      neutral: {},
      negative: {}
    };

    // Define common categories that make sense for feedback analysis
    const commonCategories = {
      // Product/Service aspects
      'Design': ['design', 'look', 'appearance', 'interface', 'ui', 'layout', 'visual'],
      'Functionality': ['function', 'feature', 'functionality', 'capability', 'option', 'ability', 'working'],
      'Performance': ['performance', 'speed', 'fast', 'slow', 'reliable', 'stable', 'crash', 'bug', 'glitch'],
      'Content': ['content', 'information', 'data', 'text', 'image', 'video', 'media'],
      'Usability': ['easy', 'simple', 'intuitive', 'difficult', 'complex', 'confusing', 'user-friendly'],
      'Quality': ['quality', 'good', 'bad', 'excellent', 'poor', 'amazing', 'terrible'],
      'Value': ['price', 'value', 'worth', 'expensive', 'cheap', 'cost', 'affordable'],
      'Support': ['support', 'help', 'service', 'customer service', 'assistance'],
      // Emotional responses
      'Satisfaction': ['love', 'like', 'happy', 'satisfied', 'pleased', 'disappointed', 'frustrated'],
      // Generic content types
      'Movie': ['movie', 'film', 'cinema', 'actor', 'actress', 'director', 'plot', 'scene'],
      'Food': ['food', 'restaurant', 'meal', 'dish', 'taste', 'flavor', 'delicious'],
      'Product': ['product', 'item', 'device', 'gadget', 'tool', 'app', 'application', 'software']
    };
    
    // Process each feedback entry
    feedbackData.forEach((feedback) => {
      // Get the raw feedback text from user input
      const userText = feedback.responses?.feedback || '';
      if (!userText || userText.trim().length < 3) return;
      
      const sentiment = feedback.sentiment || 'neutral';
      const text = userText.toLowerCase();
      
      // Find which category this feedback belongs to
      let matchedCategory = null;
      let highestMatchScore = 0;
      
      // Check each category
      Object.entries(commonCategories).forEach(([category, keywords]) => {
        // Count how many keywords from this category appear in the text
        const matchScore = keywords.filter(keyword => text.includes(keyword)).length;
        if (matchScore > highestMatchScore) {
          highestMatchScore = matchScore;
          matchedCategory = category;
        }
      });
      
      // If we found a matching category with at least one keyword
      if (matchedCategory && highestMatchScore > 0) {
        aspects[sentiment][matchedCategory] = (aspects[sentiment][matchedCategory] || 0) + 1;
      } else {
        // Default categories for unclassified feedback based on sentiment
        const defaultCategory = sentiment === 'positive' ? 'Positive Feedback' : 
                               sentiment === 'negative' ? 'Negative Feedback' : 'General Feedback';
        aspects[sentiment][defaultCategory] = (aspects[sentiment][defaultCategory] || 0) + 1;
      }
    });
    
    // Convert to array format
    const convertToSortedArray = (obj) => {
      return Object.entries(obj)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);
    };
    
    const positiveAspects = convertToSortedArray(aspects.positive);
    const neutralAspects = convertToSortedArray(aspects.neutral);
    const negativeAspects = convertToSortedArray(aspects.negative);
    
    setAspectBreakdown({ positiveAspects, neutralAspects, negativeAspects });
  }, []);

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

  const { positiveAspects, neutralAspects, negativeAspects } = aspectBreakdown;

  const doughnutData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [sentiment_counts.positive, sentiment_counts.neutral, sentiment_counts.negative],
        backgroundColor: ['#10B981', '#6B7280', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#4B5563', '#DC2626']
      }
    ]
  };

  const barData = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        label: 'Sentiment Counts',
        data: [sentiment_counts.positive, sentiment_counts.neutral, sentiment_counts.negative],
        backgroundColor: ['#10B981', '#6B7280', '#EF4444']
      }
    ]
  };

  // Create sentiment breakdown chart data from real data
  const aspectBreakdownData = {
    labels: [
      ...positiveAspects.map(a => a.label),
      ...neutralAspects.map(a => a.label),
      ...negativeAspects.map(a => a.label)
    ],
    datasets: [
      {
        label: 'Positive Aspects',
        data: [
          ...positiveAspects.map(a => a.count),
          ...neutralAspects.map(() => 0),
          ...negativeAspects.map(() => 0)
        ],
        backgroundColor: 'rgba(16, 185, 129, 0.7)', // Green
        barPercentage: 0.7,
      },
      {
        label: 'Neutral Aspects',
        data: [
          ...positiveAspects.map(() => 0),
          ...neutralAspects.map(a => a.count),
          ...negativeAspects.map(() => 0)
        ],
        backgroundColor: 'rgba(107, 114, 128, 0.7)', // Gray
        barPercentage: 0.7,
      },
      {
        label: 'Negative Aspects',
        data: [
          ...positiveAspects.map(() => 0),
          ...neutralAspects.map(() => 0),
          ...negativeAspects.map(a => a.count)
        ],
        backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red
        barPercentage: 0.7,
      }
    ]
  };

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

        {/* Sentiment Visualizations - Adjusted size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="card p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sentiment Breakdown</h3>
            <div className="h-64 flex items-center justify-center">
              <div style={{ maxWidth: '250px', maxHeight: '250px' }}>
                <Doughnut 
                  data={doughnutData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                      legend: {
                        position: 'top',
                        labels: {
                          boxWidth: 12,
                          padding: 15
                        }
                      }
                    }
                  }} 
                />
              </div>
            </div>
          </div>
          <div className="card p-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Sentiment Counts</h3>
            <div className="h-64">
              <Bar 
                data={barData} 
                options={{ 
                  responsive: true, 
                  maintainAspectRatio: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      grid: {
                        color: 'rgba(200, 200, 200, 0.1)'
                      }
                    },
                    x: {
                      grid: {
                        display: false
                      }
                    }
                  }
                }} 
              />
            </div>
          </div>
        </div>

        {/* Aspect Breakdown Visualization - Only render if we have real data */}
        {(positiveAspects.length > 0 || neutralAspects.length > 0 || negativeAspects.length > 0) && (
          <>
            <div className="card p-4 mb-8">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Feedback Aspect Analysis</h3>
              <div className="h-72">
                <Bar 
                  data={aspectBreakdownData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: true,
                    scales: {
                      x: {
                        stacked: true,
                        grid: {
                          display: false
                        }
                      },
                      y: {
                        stacked: true,
                        beginAtZero: true,
                        grid: {
                          color: 'rgba(200, 200, 200, 0.1)'
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          title: function(context) {
                            return context[0].label;
                          },
                          label: function(context) {
                            return `${context.dataset.label}: ${context.raw} mentions`;
                          }
                        }
                      },
                      legend: {
                        position: 'top',
                        align: 'center',
                        labels: {
                          boxWidth: 12,
                          padding: 15
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>

            {/* Aspect Details - Only show if we have real data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Positive Aspects Summary */}
              <div className="card p-4 bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800">
                <h4 className="font-medium text-green-700 dark:text-green-300 flex items-center gap-2 mb-3">
                  <span>😊</span> Positive Aspects
                </h4>
                {positiveAspects.length > 0 ? (
                  <ul className="space-y-2">
                    {positiveAspects.map((aspect, index) => (
                      <li key={`pos-${index}`} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{aspect.label}</span>
                        <span className="bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 px-2 py-0.5 rounded-full text-xs">
                          {aspect.count} mentions
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-green-700 dark:text-green-300">No positive aspects detected yet</p>
                )}
              </div>
              
              {/* Neutral Aspects Summary */}
              <div className="card p-4 bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700">
                <h4 className="font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2 mb-3">
                  <span>😐</span> Neutral Aspects
                </h4>
                {neutralAspects.length > 0 ? (
                  <ul className="space-y-2">
                    {neutralAspects.map((aspect, index) => (
                      <li key={`neu-${index}`} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{aspect.label}</span>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-0.5 rounded-full text-xs">
                          {aspect.count} mentions
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-600 dark:text-gray-400">No neutral aspects detected yet</p>
                )}
              </div>
              
              {/* Negative Aspects Summary */}
              <div className="card p-4 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
                <h4 className="font-medium text-red-700 dark:text-red-300 flex items-center gap-2 mb-3">
                  <span>😔</span> Negative Aspects
                </h4>
                {negativeAspects.length > 0 ? (
                  <ul className="space-y-2">
                    {negativeAspects.map((aspect, index) => (
                      <li key={`neg-${index}`} className="flex justify-between items-center">
                        <span className="text-sm font-medium">{aspect.label}</span>
                        <span className="bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 px-2 py-0.5 rounded-full text-xs">
                          {aspect.count} mentions
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-red-700 dark:text-red-300">No negative aspects detected yet</p>
                )}
              </div>
            </div>
          </>
        )}

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
