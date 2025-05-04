import { useState } from 'react';

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`card transition-all duration-300 ${
      isOpen ? 'ring-2 ring-indigo-500 dark:ring-indigo-400' : ''
    }`}>
      <button
        className="w-full text-left flex justify-between items-center gap-4"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{question}</h3>
        <span className={`flex-shrink-0 ml-4 h-6 w-6 rounded-full 
                       border-2 border-indigo-600 dark:border-indigo-400
                       flex items-center justify-center
                       transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg 
            className="w-4 h-4 text-indigo-600 dark:text-indigo-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      <div
        className={`mt-4 text-gray-600 dark:text-gray-300 transition-all duration-300 overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="prose dark:prose-invert">{answer}</p>
      </div>
    </div>
  );
}

function FAQSection() {
  const faqs = [
    {
      question: "How does FeedWise analyze sentiment?",
      answer: "FeedWise uses Google's advanced Gemini AI model to analyze feedback in real-time. Our system processes the text to determine if the sentiment is positive, negative, or neutral, while also generating concise summaries and identifying key trends in your feedback data."
    },
    {
      question: "Can I integrate FeedWise with my existing forms?",
      answer: "Yes! FeedWise is designed to work seamlessly with any form solution that can make HTTP requests. This includes popular platforms like Google Forms, TypeForm, and custom HTML forms. We provide simple integration instructions and webhooks for all major platforms."
    },
    {
      question: "Is my feedback data secure?",
      answer: "Absolutely. We implement end-to-end encryption for all data in transit and at rest. Our secure webhook system ensures safe data collection, and we follow strict access control policies. All data is stored in compliance with GDPR and other privacy regulations."
    },
    {
      question: "What kind of insights does FeedWise provide?",
      answer: "FeedWise provides comprehensive insights including sentiment analysis (positive, negative, neutral), automated summaries of feedback, trend detection across responses, and actionable recommendations. You can view these insights in real-time through our intuitive dashboard."
    },
    {
      question: "How quickly does FeedWise process feedback?",
      answer: "FeedWise processes feedback in real-time. As soon as a response is submitted through your form, our AI analyzes it within seconds, providing immediate insights. This allows you to respond quickly to customer feedback and identify trends as they emerge."
    },
    {
      question: "Do you offer custom integrations?",
      answer: "Yes, we support custom integrations through our webhook API. Our documentation provides detailed guidelines for integrating FeedWise with your specific use case. For enterprise clients, we offer dedicated support for custom implementations and advanced features."
    }
  ];

  return (
    <section className="section bg-gradient-to-b from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container max-w-4xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-50 dark:bg-indigo-900/50 rounded-full mb-4">
            <span className="px-4 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-300 rounded-full">
              Got Questions?
            </span>
          </div>
          
          <h2 className="slide-up">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Find answers to common questions about FeedWise and how it can help improve your feedback collection.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-8 
                         bg-gradient-to-r from-indigo-50 to-cyan-50 
                         dark:from-indigo-900/50 dark:to-cyan-900/50
                         rounded-2xl shadow-lg hover-lift">
            <div className="flex-grow text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Still have questions?
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our support team is here to help
              </p>
            </div>
            <button className="btn-primary whitespace-nowrap">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FAQSection;
