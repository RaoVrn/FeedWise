import { useState } from 'react';
import FeedbackForm from './components/FeedbackForm';
import FeedbackList from './components/FeedbackList';

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">FeedWise - Smart Feedback Collector</h1>
      <FeedbackForm onSubmitted={() => setRefresh(prev => !prev)} />
      <FeedbackList refreshTrigger={refresh} />
    </div>
  );
}

export default App;
