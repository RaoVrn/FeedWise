import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import HeroHeader from './components/HeroHeader';
import HowItWorks from './components/HowItWorks';
import FormConnector from './components/FormConnector';
import FeedbackList from './components/FeedbackList';
import FAQSection from './components/FAQSection';
import Documentation from './components/Documentation';
import Footer from './components/Footer';

function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 z-50 p-2 rounded-full bg-indigo-600 dark:bg-indigo-500 
                 text-white shadow-lg transition-all duration-300 hover:bg-indigo-700 
                 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 
                 focus:ring-indigo-500 ${
                   isVisible ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                 }`}
      aria-label="Scroll to top"
    >
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
    </button>
  );
}

function HomePage({ darkMode, formId, handleFormConnect, refreshTrigger, handleFeedbackSubmitted }) {
  return (
    <>
      <HeroHeader />
      <HowItWorks />
      <FormConnector onFormConnect={handleFormConnect} />
      <FeedbackList 
        formId={formId} 
        refreshTrigger={refreshTrigger} 
      />
      <FAQSection />
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [formId, setFormId] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const handleFormConnect = (id) => {
    setFormId(id);
  };

  const handleFeedbackSubmitted = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'dark bg-gray-900' : 'bg-white'
    }`}>
      <NavBar 
        darkMode={darkMode} 
        onToggleDarkMode={() => setDarkMode(!darkMode)} 
      />

      <ScrollToTop />

      <main className="space-y-0 pt-14">
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage 
                darkMode={darkMode}
                formId={formId}
                handleFormConnect={handleFormConnect}
                refreshTrigger={refreshTrigger}
                handleFeedbackSubmitted={handleFeedbackSubmitted}
              />
            } 
          />
          <Route path="/docs" element={<Documentation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
