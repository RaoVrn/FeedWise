import { useEffect, useState } from 'react';
import { getFeedbackList } from '../api';

function FeedbackList({ refreshTrigger }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchFeedbacks() {
      const data = await getFeedbackList();
      setFeedbacks(data);
    }
    fetchFeedbacks();
  }, [refreshTrigger]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Feedbacks</h2>
      <ul className="space-y-4">
        {feedbacks.map((fb) => (
          <li key={fb.id} className="p-4 border rounded">
            <p className="font-medium">{fb.text}</p>
            <p className="text-sm mt-2">Sentiment: <strong>{fb.sentiment}</strong></p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeedbackList;
