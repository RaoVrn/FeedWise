import { useState } from 'react';
import { submitFeedback } from '../api';

function FeedbackForm({ onSubmitted }) {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text) return;
    setLoading(true);
    await submitFeedback(text);
    setText('');
    setLoading(false);
    onSubmitted(); // Refresh the feedback list
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Write your feedback..."
        className="w-full border p-2 rounded"
        rows={4}
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? 'Submitting...' : 'Submit Feedback'}
      </button>
    </form>
  );
}

export default FeedbackForm;
