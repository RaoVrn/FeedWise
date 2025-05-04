import { Link } from 'react-router-dom';

function Footer() {
  const year = new Date().getFullYear();
  
  return (
    <footer className="relative bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-t border-gray-200 dark:border-gray-700">
      <div className="absolute inset-0 bg-grid-gray-100 dark:bg-grid-gray-800 opacity-5"></div>
      <div className="container px-4 py-12 mx-auto relative">
        <div className="flex flex-col items-center text-center">
          {/* Company Info */}
          <div className="space-y-4 max-w-lg mb-12">
            <div className="inline-block">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-500 to-cyan-500 dark:from-indigo-400 dark:via-blue-400 dark:to-cyan-300 pb-1">
                FeedWise
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mx-auto max-w-2xl">
              Smart feedback collection and analysis powered by AI. Transform your customer feedback into actionable insights.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-8 mb-12">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transform transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                aria-label={label}
              >
                <Icon className="h-7 w-7" />
              </a>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="w-full max-w-4xl mx-auto border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-6 text-sm">
              <p className="font-medium text-gray-600 dark:text-gray-300">© {year} FeedWise. All rights reserved.</p>
              <div className="flex gap-8">
                {legalLinks.map(({ label, href }) => (
                  <a
                    key={label}
                    href={href}
                    className="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400 transition-colors duration-200"
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

const socialLinks = [
  {
    icon: ({ className }) => (
      <svg className={className} viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    ),
    href: 'https://github.com/RaoVrn',
    label: 'GitHub'
  },
  {
    icon: ({ className }) => (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
    href: 'https://www.linkedin.com/in/varun--prakash/',
    label: 'LinkedIn'
  }
];

const legalLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' }
];

export default Footer;
