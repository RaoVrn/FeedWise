const API_URL = import.meta.env.VITE_API_URL;

export const submitFeedback = async (text) => {
  const response = await fetch(`${API_URL}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return await response.json();
};

export const getFeedbackList = async () => {
  const response = await fetch(`${API_URL}/feedback`);
  return await response.json();
};
