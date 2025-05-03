import { useEffect, useState } from 'react';
import { getFeedbackList } from '../api';

function FeedbackList({ formId, refreshTrigger }) {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    async function fetchFeedbacks() {
      if (!formId) return;
      const data = await getFeedbackList(formId);
      setFeedbacks(data);
    }
    fetchFeedbacks();
  }, [formId, refreshTrigger]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-semibold mb-4">Feedbacks</h2>
      <ul className="space-y-4">
        {feedbacks.map((fb) => (
          <li key={fb.id} className="p-4 border rounded bg-white shadow">
            <p className="font-medium">{fb.responses?.text || "No Text"}</p>
            <p className="text-sm mt-2">Sentiment: <strong>{fb.sentiment}</strong></p>
            <p className="text-xs mt-1 italic text-gray-500">Summary: {fb.summary}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default FeedbackList;
