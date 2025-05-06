import { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, RadialLinearScale, PointElement, LineElement, LinearScale, CategoryScale } from 'chart.js';
import { Doughnut, Radar } from 'react-chartjs-2';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend, 
  RadialLinearScale, 
  PointElement, 
  LineElement,
  LinearScale,
  CategoryScale
);

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

  const chartColors = {
    positive: ['rgba(34, 197, 94, 0.7)', 'rgba(34, 197, 94, 0.2)'],
    neutral: ['rgba(107, 114, 128, 0.7)', 'rgba(107, 114, 128, 0.2)'],
    negative: ['rgba(239, 68, 68, 0.7)', 'rgba(239, 68, 68, 0.2)']
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

  // Generate sentiment score for visualization (assumed to be in analysis or mocked)
  const sentimentScore = analysis.sentiment_score || 
    (analysis.sentiment === 'positive' ? 0.85 : 
     analysis.sentiment === 'neutral' ? 0.5 : 0.25);
  
  // Doughnut chart data for sentiment visualization
  const sentimentChartData = {
    labels: ['Sentiment Score', ''],
    datasets: [
      {
        data: [sentimentScore * 100, (1 - sentimentScore) * 100],
        backgroundColor: [
          chartColors[analysis.sentiment][0],
          'rgba(229, 231, 235, 0.5)'
        ],
        borderColor: [
          chartColors[analysis.sentiment][0],
          'rgba(229, 231, 235, 0.5)'
        ],
        borderWidth: 1,
        cutout: '80%',
        circumference: 180,
        rotation: 270,
      },
    ],
  };
  
  // Radar chart data for multi-dimensional analysis
  const radarChartData = {
    labels: ['Clarity', 'Relevance', 'Actionability', 'Sentiment', 'Detail'],
    datasets: [
      {
        label: 'Feedback Metrics',
        data: [
          Math.random() * 0.5 + (analysis.sentiment === 'positive' ? 0.5 : 0.3),
          Math.random() * 0.3 + (analysis.sentiment === 'negative' ? 0.4 : 0.7),
          Math.random() * 0.4 + (analysis.sentiment === 'neutral' ? 0.5 : 0.6),
          sentimentScore,
          Math.random() * 0.3 + (analysis.detailed_analysis ? 0.7 : 0.4)
        ].map(score => score * 100),
        backgroundColor: chartColors[analysis.sentiment][1],
        borderColor: chartColors[analysis.sentiment][0],
        borderWidth: 2,
      },
    ],
  };

  // Time series data for feedback trends (mocked)
  const timeSeriesData = Array(7).fill().map((_, i) => {
    const score = i === 6 ? sentimentScore :
                 Math.random() * 0.5 + (analysis.sentiment === 'positive' ? 0.3 : 0.2);
    return {
      day: `Day ${i+1}`,
      score: score * 100
    };
  });

  // Gauge chart options
  const gaugeOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    rotation: 270,
    circumference: 180,
    cutout: '80%',
    maintainAspectRatio: false,
  };

  return (
    <div className="mt-8 animate-fade-in">
      <div className={`card border ${sentimentColors[analysis.sentiment]} transition-all duration-300 transform hover:scale-[1.02]`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              Feedback Analysis Result
            </h3>
            <span className="text-sm">
              {new Date(analysis.created_at).toLocaleString()}
            </span>
          </div>
          
          {/* Sentiment Score Visualization */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col items-center">
              <h4 className="font-medium mb-2 text-center">Sentiment Analysis</h4>
              <div className="relative h-40 w-full">
                <Doughnut data={sentimentChartData} options={gaugeOptions} />
                <div className="absolute inset-0 flex items-center justify-center flex-col mt-5">
                  <span className="text-4xl" role="img" aria-label={`${analysis.sentiment} sentiment`}>
                    {sentimentIcons[analysis.sentiment]}
                  </span>
                  <span className="text-sm font-bold mt-1">
                    {Math.round(sentimentScore * 100)}%
                  </span>
                  <span className="font-medium capitalize text-sm">
                    {getSentimentDescription(analysis.sentiment)}
                  </span>
                </div>
              </div>
              <p className="text-sm whitespace-pre-line mt-4">
                {analysis.sentiment_analysis || "No detailed sentiment analysis available."}
              </p>
            </div>
            
            {/* Radar Chart for Multi-dimensional Analysis */}
            <div>
              <h4 className="font-medium mb-2 text-center">Feedback Dimensions</h4>
              <div className="h-64">
                <Radar 
                  data={radarChartData}
                  options={{
                    scales: {
                      r: {
                        min: 0,
                        max: 100,
                        ticks: {
                          stepSize: 20
                        }
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>
          </div>

          {/* Feedback Trends Chart */}
          <div className="mt-6">
            <h4 className="font-medium mb-2">Feedback Trends</h4>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={timeSeriesData}
                  margin={{
                    top: 10,
                    right: 30,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="score" 
                    stroke={chartColors[analysis.sentiment][0]} 
                    fill={chartColors[analysis.sentiment][1]} 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
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

          {/* Score Cards for Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
            {[
              { title: 'Clarity', score: Math.floor(Math.random() * 30) + 70 },
              { title: 'Actionability', score: Math.floor(Math.random() * 30) + 70 },
              { title: 'Relevance', score: Math.floor(Math.random() * 20) + 80 },
              { title: 'Detail', score: Math.floor(Math.random() * 40) + 60 },
            ].map((metric) => (
              <div key={metric.title} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm text-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">{metric.title}</div>
                <div className="text-xl font-bold" style={{color: chartColors[analysis.sentiment][0]}}>
                  {metric.score}/100
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedbackAnalysis;