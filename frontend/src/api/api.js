const API_BASE_URL = 'http://localhost:8000';

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || 'An error occurred while processing your request');
  }
  return response.json();
}

export async function submitFeedback(formId, data) {
  try {
    const response = await fetch(`${API_BASE_URL}/webhook/${formId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to submit feedback');
  }
}

export async function getFeedbackList(formId, search = '', sentiment = '', startDate = '', endDate = '') {
  try {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (sentiment && sentiment !== 'all') params.append('sentiment', sentiment);
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    
    const url = `${API_BASE_URL}/feedback/${formId}${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url);
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch feedback');
  }
}

export async function getFeedbackStats(formId) {
  try {
    const response = await fetch(`${API_BASE_URL}/feedback/${formId}/stats`);
    return handleResponse(response);
  } catch (error) {
    throw new Error(error.message || 'Failed to fetch feedback statistics');
  }
}
