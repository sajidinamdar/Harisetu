import React, { useEffect, useState } from 'react';

interface LoadingScreenProps {
  onFinished: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinished }) => {
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState(() => {
    // Try to get language from localStorage or default to English
    return localStorage.getItem('preferredLanguage') || 'en';
  });

  useEffect(() => {
    // Faster progress updates
    const timer = setTimeout(() => {
      if (progress < 100) {
        // Increase by larger increments for faster loading
        setProgress(prev => Math.min(prev + 20, 100));
      } else {
        // Ensure we call onFinished when progress reaches 100%
        onFinished();
      }
    }, 150); // Reduced from 300ms to 150ms

    return () => clearTimeout(timer);
  }, [progress, onFinished]);
  
  // Ensure we call onFinished after a maximum time to prevent getting stuck
  useEffect(() => {
    const maxLoadingTime = setTimeout(() => {
      onFinished();
    }, 3000);
    
    return () => clearTimeout(maxLoadingTime);
  }, [onFinished]);

  const translations = {
    en: {
      title: 'HaritSetu',
      subtitle: 'Smart Agricultural Platform',
      loading: 'Loading'
    },
    mr: {
      title: 'हरितसेतू',
      subtitle: 'स्मार्ट कृषी प्लॅटफॉर्म',
      loading: 'लोड करत आहे'
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-50">
      {/* Simplified logo */}
      <div className="mb-6">
        <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center">
          <span className="text-white font-bold text-3xl">
            {language === 'en' ? 'HS' : 'हस'}
          </span>
        </div>
      </div>
      
      <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
      <p className="text-lg text-green-600 mb-6">{t.subtitle}</p>
      
      {/* Simplified progress bar */}
      <div className="w-64 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-600 transition-all duration-150 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Language selector */}
      <div className="mt-6 flex space-x-4">
        <button 
          onClick={() => {
            setLanguage('en');
            localStorage.setItem('preferredLanguage', 'en');
          }}
          className={`px-3 py-1 rounded-md ${language === 'en' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          English
        </button>
        <button 
          onClick={() => {
            setLanguage('mr');
            localStorage.setItem('preferredLanguage', 'mr');
          }}
          className={`px-3 py-1 rounded-md ${language === 'mr' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          मराठी
        </button>
      </div>
    </div>
  );
};

export default LoadingScreen;