const API_URL = import.meta.env.VITE_API_URL;

// --- Submit Feedback Dynamically to a Form ---
export const submitFeedback = async (formId, responses) => {
  const response = await fetch(`${API_URL}/webhook/${formId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ responses }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit feedback');
  }

  return await response.json();
};

// --- Get Feedback List Dynamically for a Form ---
export const getFeedbackList = async (formId) => {
  const response = await fetch(`${API_URL}/feedback/${formId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch feedbacks');
  }

  return await response.json();
};
