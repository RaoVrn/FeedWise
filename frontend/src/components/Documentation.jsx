import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Mermaid from 'react-mermaid2';

// Helper component for code blocks with copy functionality
const CodeBlock = ({ code, language = 'bash' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto group">
      <pre><code className={`language-${language} text-sm`}>{code}</code></pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
};

function Documentation() {
  const [isHelpful, setIsHelpful] = useState(null);
  const [mermaidTheme, setMermaidTheme] = useState('default');

  useEffect(() => {
    window.scrollTo(0, 0);
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMermaidTheme('dark');
    } else {
      setMermaidTheme('default');
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e) => setMermaidTheme(e.matches ? 'dark' : 'default');
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Mermaid diagram definitions - styled for both light/dark themes but compatible with Mermaid 8.14.0
  const flowDiagram = `
graph TD
  A[User Submits Feedback via Form/API] --> B[FeedWise Webhook Endpoint]
  B --> C{AI Processing Pipeline}
  C --> D[Sentiment Analysis]
  C --> E[Summary Generation]
  C --> F[Trend/Topic Detection]
  D --> G[(Database Storage)]
  E --> G
  F --> G
  G --> H[Analytics Dashboard]
  
  classDef formSystem fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px,color:#3730a3
  classDef aiSystem fill:#ccfbf1,stroke:#14b8a6,stroke-width:2px,color:#0f766e
  classDef analysis fill:#d1fae5,stroke:#10b981,stroke-width:2px,color:#065f46
  classDef database fill:#fef9c3,stroke:#eab308,stroke-width:2px,color:#854d0e
  
  class A,B,H formSystem
  class C aiSystem
  class D,E,F analysis
  class G database
  `;

  const architectureDiagram = `
graph LR
  A[User's Form System] --> B[FeedWise API Endpoint]
  B --> C[AI Processing Engine]
  C --> D[(Secure Database)]
  D --> E[Analytics Dashboard]
  
  classDef formSystem fill:#e0e7ff,stroke:#4f46e5,stroke-width:2px,color:#3730a3
  classDef aiSystem fill:#ccfbf1,stroke:#14b8a6,stroke-width:2px,color:#0f766e
  classDef database fill:#fef9c3,stroke:#eab308,stroke-width:2px,color:#854d0e
  
  class A,B,E formSystem
  class C aiSystem
  class D database
  `;

  const integrationDiagram = `
sequenceDiagram
  participant User
  participant Form as Your Form
  participant API as FeedWise API
  participant AI as AI Engine
  participant DB as Dashboard
  
  User->>Form: Submit Feedback
  Form->>API: POST /webhook/{form_id}
  Note over Form,API: With feedback data
  API-->>Form: 200 OK Response
  API->>AI: Request Analysis
  Note over API,AI: Sentiment, Summary, Trends
  AI-->>API: Return Analysis Results
  API->>DB: Store & Update Insights
  Note over DB: Data now visible in dashboard
  `;

  const Section = ({ title, children, id }) => (
    <section id={id} className="mb-16 scroll-mt-20">
      <h2 className="text-3xl font-bold mb-6 border-b border-gray-300 dark:border-gray-700 pb-2">{title}</h2>
      {children}
    </section>
  );

  const SubSection = ({ title, children, id }) => (
    <div id={id} className="mb-8 scroll-mt-20">
      <h3 className="text-2xl font-semibold mt-8 mb-4">{title}</h3>
      {children}
    </div>
  );

  const InfoCard = ({ title, children, icon }) => (
    <div className="bg-white dark:bg-gray-800/50 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      {icon && <div className="text-indigo-500 dark:text-indigo-400 mb-3">{icon}</div>}
      <h4 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">{title}</h4>
      <div className="text-gray-600 dark:text-gray-300 text-sm">{children}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-black text-gray-800 dark:text-gray-200">
      <div className="container mx-auto max-w-5xl py-16 px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 mb-10 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-5xl font-extrabold mb-10 text-gray-900 dark:text-white">FeedWise Documentation</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
            Welcome to the FeedWise documentation. Here you'll find everything you need to integrate FeedWise with your forms and understand the insights generated.
          </p>

          <nav className="mb-16 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Table of Contents</h3>
            <ul className="space-y-2 list-none pl-0">
              <li><a href="#introduction" className="text-indigo-600 dark:text-indigo-400 hover:underline">1. Introduction to FeedWise</a></li>
              <li><a href="#getting-started" className="text-indigo-600 dark:text-indigo-400 hover:underline">2. Getting Started</a></li>
              <li><a href="#connecting-forms" className="text-indigo-600 dark:text-indigo-400 hover:underline">3. Connecting Your Forms</a></li>
              <li><a href="#understanding-insights" className="text-indigo-600 dark:text-indigo-400 hover:underline">4. Understanding Feedback Insights</a></li>
              <li><a href="#how-it-works" className="text-indigo-600 dark:text-indigo-400 hover:underline">5. How It Works (Under the Hood)</a></li>
              <li><a href="#api-details" className="text-indigo-600 dark:text-indigo-400 hover:underline">6. API Details</a></li>
              <li><a href="#privacy-security" className="text-indigo-600 dark:text-indigo-400 hover:underline">7. Data Privacy & Security</a></li>
              <li><a href="#troubleshooting" className="text-indigo-600 dark:text-indigo-400 hover:underline">8. Troubleshooting</a></li>
              <li><a href="#faq" className="text-indigo-600 dark:text-indigo-400 hover:underline">9. Frequently Asked Questions</a></li>
            </ul>
          </nav>

          <Section title="1. Introduction to FeedWise" id="introduction">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              FeedWise is an intelligent feedback analysis platform designed to automatically process user feedback from various sources. Using advanced AI (powered by Google's Gemini model), FeedWise provides real-time sentiment analysis, concise summaries, and identifies emerging trends, transforming raw text into actionable insights.
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Our goal is to save you time and help you quickly understand your users' needs, pain points, and suggestions, enabling you to make data-driven decisions faster.
            </p>
          </Section>

          <Section title="2. Getting Started" id="getting-started">
            <p className="text-gray-600 dark:text-gray-300 mb-6">Follow these simple steps to start analyzing your feedback with FeedWise:</p>
            <ol className="list-decimal list-inside space-y-4 text-gray-600 dark:text-gray-300 mb-8 pl-4">
              <li>
                <strong>Sign Up / Log In:</strong> Access your FeedWise dashboard.
              </li>
              <li>
                <strong>Create a Form Connection:</strong> In your dashboard, create a new "Form Connection". This will generate a unique <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">FORM_ID</code> and a dedicated webhook URL for that connection.
              </li>
              <li>
                <strong>Connect Your Source:</strong> Follow the instructions in the <a href="#connecting-forms" className="text-indigo-600 dark:text-indigo-400 hover:underline">Connecting Your Forms</a> section below to link your Google Form, HTML form, or application to the generated webhook URL.
              </li>
              <li>
                <strong>Submit Test Feedback:</strong> Send some test data through your connected form to ensure the integration is working.
              </li>
              <li>
                <strong>View Insights:</strong> Check your FeedWise dashboard to see the analyzed feedback, including sentiment, summaries, and trends.
              </li>
            </ol>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 dark:border-blue-400 text-blue-700 dark:text-blue-300 rounded-r-lg">
              <p><strong>Tip:</strong> Give each Form Connection a descriptive name in FeedWise to easily identify the source of your feedback.</p>
            </div>
          </Section>

          <Section title="3. Connecting Your Forms" id="connecting-forms">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              FeedWise works by receiving feedback data via a unique webhook URL generated for each Form Connection you create. Here’s how to connect common form types:
            </p>

            <SubSection title="Google Forms Integration" id="connect-google-forms">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mb-4">Use Google Apps Script to send form responses to FeedWise:</p>
                <ol className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300 mb-6">
                  <li>Open your Google Form, click the three dots (⋮) menu, and select "Script editor".</li>
                  <li>Give your script a name (e.g., "FeedWise Webhook").</li>
                  <li>Delete any existing code and paste the following script:</li>
                </ol>
                <CodeBlock language="javascript" code={`function onFormSubmit(e) {
  var formResponse = e.response;
  var itemResponses = formResponse.getItemResponses();
  var payload = {};
  var responses = {};

  for (var i = 0; i < itemResponses.length; i++) {
    var itemResponse = itemResponses[i];
    var question = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();
    var key = question.toLowerCase().replace(/\s+/g, '_').replace(/[^\w]/g, '');
    responses[key] = answer;
  }

  payload = {
    "formId": "YOUR_FORM_ID",
    "submittedAt": new Date().toISOString(),
    "responses": responses
  };

  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };

  var webhookUrl = "https://api.feedwise.com/webhook/YOUR_FORM_ID";

  try {
    UrlFetchApp.fetch(webhookUrl, options);
    Logger.log('Feedback sent to FeedWise: ' + JSON.stringify(payload));
  } catch (error) {
    Logger.log('Error sending to FeedWise: ' + error);
  }
}`} />
                <ol start="4" className="list-decimal list-inside space-y-3 text-gray-600 dark:text-gray-300 mt-6">
                  <li><strong>Crucially:</strong> Replace <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">YOUR_FORM_ID</code> in both the <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">payload</code> and the <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">webhookUrl</code> with the unique ID provided by FeedWise for this connection.</li>
                  <li>Save the script (💾 icon).</li>
                  <li>Click the "Triggers" icon (looks like a clock) on the left sidebar.</li>
                  <li>Click "+ Add Trigger".</li>
                  <li>Configure the trigger: Choose function <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">onFormSubmit</code>, event source "From form", event type "On form submit".</li>
                  <li>Click "Save". You'll likely need to authorize the script to access external services and your form data. Review the permissions and allow them.</li>
                </ol>
              </div>
            </SubSection>

            <SubSection title="HTML Forms" id="connect-html-forms">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Point your HTML form's <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">action</code> attribute to your FeedWise webhook URL and set the method to <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">POST</code>. Ensure your input fields have appropriate <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">name</code> attributes, as these will become the keys in the feedback data.
                </p>
                <CodeBlock language="html" code={`<form action="https://api.feedwise.com/webhook/YOUR_FORM_ID" method="POST">
  <label for="feedback_text">Your Feedback:</label>
  <textarea id="feedback_text" name="feedback" required></textarea>

  <label for="user_email">Email (Optional):</label>
  <input type="email" id="user_email" name="email">

  <button type="submit">Send Feedback</button>
</form>`} />
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
                  Remember to replace <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">YOUR_FORM_ID</code> with your actual FeedWise Form ID. FeedWise will receive the data with keys based on the <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">name</code> attributes (e.g., <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">{'{"feedback": "...", "email": "..."}'}</code>).
                </p>
              </div>
            </SubSection>

            <SubSection title="API Integration (Backend/Custom Apps)" id="connect-api">
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  You can send feedback data directly from your application's backend by making a POST request to your unique webhook URL.
                </p>
                <p className="text-gray-600 dark:text-gray-300 mb-2"><strong>Endpoint:</strong></p>
                <CodeBlock code={`POST https://api.feedwise.com/webhook/YOUR_FORM_ID`} />
                <p className="text-gray-600 dark:text-gray-300 mt-4 mb-2"><strong>Headers:</strong></p>
                <CodeBlock code={`Content-Type: application/json`} />
                <p className="text-gray-600 dark:text-gray-300 mt-4 mb-2"><strong>Body (Example):</strong></p>
                <CodeBlock language="json" code={`{
  "responses": {
    "rating": 5,
    "comment": "The new feature is amazing and easy to use!",
    "user_id": "user12345",
    "app_version": "2.1.0"
  },
  "submittedAt": "2025-05-04T10:30:00Z"
}`} />
                <p className="text-gray-600 dark:text-gray-300 mt-4 text-sm">
                  Replace <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">YOUR_FORM_ID</code>. The <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">responses</code> object should contain the key-value pairs of the feedback data. FeedWise primarily analyzes text fields but stores all submitted data.
                </p>
              </div>
            </SubSection>
          </Section>

          <Section title="4. Understanding Feedback Insights" id="understanding-insights">
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Once feedback is processed, FeedWise presents insights in your dashboard. Here's what each analysis type means:
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <InfoCard title="Sentiment Analysis" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
                <p>Automatically classifies the emotional tone of the feedback as <strong>Positive</strong>, <strong>Negative</strong>, or <strong>Neutral</strong>.</p>
                <p className="mt-2">Includes a brief explanation justifying the classification, helping you understand the context.</p>
              </InfoCard>
              <InfoCard title="Smart Summaries" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}>
                <p>Generates a concise, single-sentence summary capturing the core message of the feedback.</p>
                <p className="mt-2">Ideal for quickly grasping the main point without reading the full text.</p>
              </InfoCard>
              <InfoCard title="Trend & Topic Detection" icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                <p>Identifies recurring themes, keywords, and topics across multiple feedback submissions.</p>
                <p className="mt-2">Helps you spot patterns, common issues, or frequently requested features over time.</p>
              </InfoCard>
            </div>
          </Section>

          <Section title="5. How It Works (Under the Hood)" id="how-it-works">
            <SubSection title="Feedback Processing Flow" id="flow-diagram">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This diagram illustrates the journey of feedback from submission to analysis:
              </p>
              <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex justify-center">
                <Mermaid chart={flowDiagram} config={{ theme: mermaidTheme }} />
              </div>
            </SubSection>

            <SubSection title="System Architecture" id="architecture-diagram">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                FeedWise utilizes a scalable cloud-based architecture:
              </p>
              <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex justify-center">
                <Mermaid chart={architectureDiagram} config={{ theme: mermaidTheme }} />
              </div>
            </SubSection>

            <SubSection title="Integration Sequence" id="integration-diagram">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                This sequence diagram shows the interaction between your form, FeedWise API, and the AI engine:
              </p>
              <div className="p-6 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex justify-center">
                <Mermaid chart={integrationDiagram} config={{ theme: mermaidTheme }} />
              </div>
            </SubSection>

            <SubSection title="AI Analysis Engine" id="ai-engine">
              <div className="bg-gradient-to-r from-indigo-50 to-cyan-50 dark:from-indigo-900/50 dark:to-cyan-900/50 rounded-lg p-6 border border-indigo-200 dark:border-indigo-800">
                <p className="text-gray-700 dark:text-gray-200 mb-4">
                  FeedWise leverages Google's powerful Gemini AI model for its analysis capabilities. When feedback arrives at our webhook:
                </p>
                <ul className="mt-4 space-y-3 text-gray-600 dark:text-gray-300">
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" /></svg>
                    <span><strong>Text Preprocessing:</strong> The raw feedback text is cleaned and prepared for the AI model.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Multi-Task Analysis:</strong> The AI performs sentiment classification, summarization, and topic extraction simultaneously.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span><strong>Structured Output:</strong> The results are formatted into a structured JSON object containing the sentiment, explanation, summary, and identified topics/keywords.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-indigo-500 dark:text-indigo-400 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10m16-10v10M4 11h16M4 15h16M4 7h16M4 19h16" /></svg>
                    <span><strong>Storage & Display:</strong> This structured data is stored securely and made available in your FeedWise dashboard.</span>
                  </li>
                </ul>
              </div>
            </SubSection>
          </Section>

          <Section title="6. API Details" id="api-details">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              While the primary interaction is via webhooks, understanding the data structure can be helpful.
            </p>
            <SubSection title="Webhook Payload Structure" id="webhook-payload">
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your connected forms or applications should send data to the webhook endpoint (<code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">POST /webhook/YOUR_FORM_ID</code>) with a JSON body. FeedWise looks for a <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">responses</code> object containing the actual feedback key-value pairs.
              </p>
              <CodeBlock language="json" code={`{
  "responses": {
    "question_1_title_or_key": "Answer to question 1",
    "feedback_comment": "Detailed user feedback text here.",
    "rating": 4,
    "user_identifier": "optional_user_id"
  },
  "submittedAt": "2025-05-04T12:00:00Z",
  "sourceFormId": "internal-contact-form-v2",
  "metadata": {
    "app_version": "1.5.2",
    "user_segment": "beta_testers"
  }
}`} />
              <p className="text-gray-600 dark:text-gray-300 mt-4">
                <strong>Note:</strong> FeedWise will attempt to analyze all string values within the <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">responses</code> object for sentiment and summary. Numerical values like ratings are stored but not directly analyzed as text.
              </p>
            </SubSection>
          </Section>

          <Section title="7. Data Privacy & Security" id="privacy-security">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              We take the security and privacy of your data very seriously.
            </p>
            <ul className="space-y-4 list-disc list-inside text-gray-600 dark:text-gray-300 pl-4">
              <li><strong>Encryption:</strong> Data is encrypted both in transit (using TLS/SSL) and at rest using industry-standard encryption algorithms.</li>
              <li><strong>Access Control:</strong> Access to your data is restricted based on user authentication and authorization.</li>
              <li><strong>AI Processing:</strong> Feedback text sent for AI analysis is processed securely by Google Cloud's infrastructure under strict data privacy agreements.</li>
              <li><strong>Compliance:</strong> We strive to comply with major data protection regulations like GDPR and CCPA.</li>
              <li><strong>Data Retention:</strong> You have control over your data. We provide options for data export and deletion.</li>
              <li><strong>Anonymization:</strong> Consider anonymizing personally identifiable information (PII) at the source if it's not required for your analysis.</li>
            </ul>
            <p className="text-gray-600 dark:text-gray-300 mt-6">
              For more detailed information, please refer to our official Privacy Policy.
            </p>
          </Section>

          <Section title="8. Troubleshooting" id="troubleshooting">
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Experiencing issues? Here are some common problems and solutions:
            </p>
            <div className="space-y-6">
              <InfoCard title="Feedback not appearing in dashboard">
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Check Webhook URL:</strong> Ensure the webhook URL used in your form/script exactly matches the one provided by FeedWise for your Form Connection.</li>
                  <li><strong>Verify Form Submission:</strong> Confirm that your form is actually submitting data.</li>
                  <li><strong>Google Apps Script:</strong>
                    <ul>
                      <li>Check the script's execution logs in the Apps Script editor for errors.</li>
                      <li>Ensure the <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">onFormSubmit</code> trigger is correctly configured and enabled.</li>
                      <li>Re-authorize the script if necessary.</li>
                    </ul>
                  </li>
                  <li><strong>API/HTML Form:</strong> Check your server logs or browser's network developer tools to see if the POST request to the FeedWise webhook is being sent successfully.</li>
                  <li><strong>Check Payload Structure:</strong> Ensure the data being sent includes the <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">responses</code> object as expected by the API.</li>
                </ul>
              </InfoCard>
              <InfoCard title="Incorrect analysis (Sentiment/Summary)">
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Ambiguous Text:</strong> AI models can sometimes misinterpret sarcasm, nuanced language, or very short feedback.</li>
                  <li><strong>Language:</strong> While Gemini supports multiple languages, performance might be best with English.</li>
                  <li><strong>Provide Context:</strong> Structure your form questions to elicit clear, specific feedback.</li>
                  <li><strong>Report Issues:</strong> If you consistently see incorrect analysis for clear feedback, please let us know.</li>
                </ul>
              </InfoCard>
              <InfoCard title="Mermaid diagrams not rendering correctly">
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Syntax Errors:</strong> Double-check the Mermaid syntax in the diagram definitions.</li>
                  <li><strong>Library Issues:</strong> Ensure the <code className="text-sm bg-gray-200 dark:bg-gray-700 px-1 rounded">react-mermaid2</code> library is installed correctly.</li>
                  <li><strong>Browser Compatibility:</strong> Check if the issue persists in a different browser.</li>
                </ul>
              </InfoCard>
            </div>
          </Section>

          <Section title="9. Frequently Asked Questions" id="faq">
            <div className="space-y-6">
              <InfoCard title="Is FeedWise free to use?">
                <p>
                  FeedWise is currently offered with a generous free tier suitable for individuals and small teams during our initial launch phase.
                </p>
              </InfoCard>
              <InfoCard title="How secure is my data?">
                <p>
                  Data security is paramount. We employ end-to-end encryption, secure cloud infrastructure, and follow industry best practices.
                </p>
              </InfoCard>
              <InfoCard title="Can I integrate custom forms or apps?">
                <p>
                  Absolutely! Our webhook system is designed for flexibility. As long as your system can send an HTTP POST request with a JSON payload, you can integrate it with FeedWise.
                </p>
              </InfoCard>
              <InfoCard title="What languages does the AI analysis support?">
                <p>
                  FeedWise leverages Google's Gemini model, which supports a wide range of languages.
                </p>
              </InfoCard>
              <InfoCard title="Can I export my feedback data?">
                <p>
                  Yes, data export functionality is available within the FeedWise dashboard.
                </p>
              </InfoCard>
            </div>
          </Section>

          <div className="mt-24 pt-10 border-t border-gray-300 dark:border-gray-700 text-center">
            <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-gray-100">Was this documentation helpful?</h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setIsHelpful(true)}
                className={`px-6 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isHelpful === true
                    ? 'bg-green-600 text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-green-500'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  Yes
                </span>
              </button>
              <button
                onClick={() => setIsHelpful(false)}
                className={`px-6 py-2 rounded-lg transition-all duration-200 text-sm font-medium ${
                  isHelpful === false
                    ? 'bg-red-600 text-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-black ring-red-500'
                    : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  No
                </span>
              </button>
            </div>
            {isHelpful !== null && (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                Thank you for your feedback!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Documentation;