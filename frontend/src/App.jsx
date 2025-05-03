import { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';

function App() {
  const [refresh, setRefresh] = useState(false);
  const [formId, setFormId] = useState(''); // Track formId entered by user

  const handleFormIdChange = (e) => {
    setFormId(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">FeedWise - Smart Feedback Collector</h1>

      <div className="mb-6">
        <input
          type="text"
          value={formId}
          onChange={handleFormIdChange}
          placeholder="Enter your Form ID (Example: my-form-123)"
          className="w-full border p-2 rounded"
        />
      </div>

      {formId && (
        <>
          <FeedbackForm formId={formId} onSubmitted={() => setRefresh(prev => !prev)} />
          <FeedbackList formId={formId} refreshTrigger={refresh} />
        </>
      )}
    </div>
  );
}

export default App;
