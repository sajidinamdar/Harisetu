import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../translations';

interface LanguageSwitcherProps {
  className?: string;
}

const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'mr' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-600 hover:bg-gray-700 transition-colors text-white ${className}`}
      aria-label={language === 'en' ? 'Switch to Marathi' : 'Switch to English'}
    >
      <Globe size={16} />
      <span className="text-sm font-medium">
        {language === 'en' ? 'मराठी' : 'English'}
      </span>
    </button>
  );
};

export default LanguageSwitcher;