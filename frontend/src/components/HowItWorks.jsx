function FeatureCard({ icon, title, description, features, delay }) {
  return (
    <div 
      className="card hover-lift fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 
                    dark:from-indigo-600 dark:to-indigo-700 
                    text-white flex items-center justify-center text-2xl mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 mb-6">{description}</p>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600 dark:text-gray-300">
            <svg className="h-5 w-5 text-green-500 dark:text-green-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

function HowItWorks() {
  const scrollToFormSection = () => {
    const formSection = document.querySelector('#connect-form-section');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: "1",
      title: "Create Your Form",
      description: "Start with your favorite form builder - we work seamlessly with all popular platforms.",
      features: [
        "Google Forms integration",
        "TypeForm compatibility",
        "Custom HTML forms",
        "Webhook support"
      ],
      delay: 100
    },
    {
      icon: "2",
      title: "Connect with FeedWise",
      description: "Simple one-click setup gets you started in seconds, no complex configuration needed.",
      features: [
        "Instant form connection",
        "Secure data transfer",
        "Real-time sync",
        "Automatic updates"
      ],
      delay: 200
    },
    {
      icon: "3",
      title: "Get AI-Powered Insights",
      description: "Watch as our advanced AI analyzes your feedback in real-time, providing valuable insights.",
      features: [
        "Sentiment analysis",
        "Smart summaries",
        "Trend detection",
        "Actionable recommendations"
      ],
      delay: 300
    }
  ];

  return (
    <section className="section bg-gradient-to-b from-white to-indigo-50 dark:from-gray-800 dark:to-gray-900">
      <div className="container">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-50 dark:bg-indigo-900/50 rounded-full mb-4">
            <span className="px-4 py-1 text-sm font-medium text-indigo-600 dark:text-indigo-300 rounded-full">
              Simple Setup
            </span>
          </div>
          
          <h2 className="slide-up">How FeedWise Works</h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Start collecting and analyzing feedback in three simple steps. No complex setup required.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center p-8 bg-gradient-to-r 
                         from-indigo-50 to-cyan-50 dark:from-indigo-900/50 dark:to-cyan-900/50 
                         rounded-2xl shadow-lg hover-lift">
            <div className="flex-grow text-left">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Ready to Transform Your Feedback Strategy? 🔥
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Start collecting insights with FeedWise today. Quick setup, real-time analysis, no complex integrations.
              </p>
            </div>
            <button 
              onClick={scrollToFormSection}
              className="btn-primary whitespace-nowrap group transition-all duration-300 
                       hover:translate-y-[-2px] hover:shadow-lg hover:bg-gradient-to-r 
                       hover:from-indigo-500 hover:to-indigo-600
                       dark:hover:from-indigo-400 dark:hover:to-indigo-500
                       flex items-center gap-2"
            >
              Get Started
              <svg 
                className="w-4 h-4 transform transition-transform group-hover:translate-x-1" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
