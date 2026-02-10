




import React, { useState } from 'react';
import { Menu, X, User, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';
import UserProfile from './auth/UserProfile';
import logoSvg from '../assets/logo.svg';

import { Language } from '../translations';

interface HeaderProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Header: React.FC<HeaderProps> = ({ language, setLanguage }) => {
  const { user, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const translations = {
    en: {
      title: 'HaritSetu',
      subtitle: 'Smart Agricultural Platform',
      login: 'Login',
      register: 'Register',
      home: 'Home',
      services: 'Services',
      about: 'About',
      contact: 'Contact',
      welcome: 'Welcome',
      profile: 'Profile',
      logout: 'Logout'
    },
    mr: {
      title: 'हरितसेतू',
      subtitle: 'स्मार्ट कृषी प्लॅटफॉर्म',
      login: 'लॉगिन',
      register: 'नोंदणी',
      home: 'मुख्यपृष्ठ',
      services: 'सेवा',
      about: 'आमच्याबद्दल',
      contact: 'संपर्क',
      welcome: 'स्वागत',
      profile: 'प्रोफाइल',
      logout: 'लॉगआउट'
    }
  };

  const t = translations[language as keyof typeof translations];

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="bg-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <img src={logoSvg} alt="HaritSetu Logo" className="w-full h-full" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-green-800">{t.title}</h1>
                <p className="text-sm text-green-600">{t.subtitle}</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">{t.home}</a>
              <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors">{t.services}</a>
              <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">{t.about}</a>
              <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">{t.contact}</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                <Globe size={16} />
                <span className="text-sm">{language === 'en' ? 'मराठी' : 'English'}</span>
              </button>

              {isAuthenticated && user ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-medium">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowUserProfile(true);
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {t.profile}
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                  >
                    {t.login}
                  </button>
                  <button
                    onClick={() => setShowRegisterModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t.register}
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#home" className="text-gray-700 hover:text-green-600 transition-colors">{t.home}</a>
                <a href="#services" className="text-gray-700 hover:text-green-600 transition-colors">{t.services}</a>
                <a href="#about" className="text-gray-700 hover:text-green-600 transition-colors">{t.about}</a>
                <a href="#contact" className="text-gray-700 hover:text-green-600 transition-colors">{t.contact}</a>

                <div className="flex items-center space-x-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => setLanguage(language === 'en' ? 'mr' : 'en')}
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                  >
                    <Globe size={16} />
                    <span className="text-sm">{language === 'en' ? 'मराठी' : 'English'}</span>
                  </button>

                  {isAuthenticated && user ? (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowUserProfile(true)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors"
                      >
                        <User className="w-4 h-4" />
                        <span>{user.name.split(' ')[0]}</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => setShowLoginModal(true)}
                        className="px-4 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors"
                      >
                        {t.login}
                      </button>
                      <button
                        onClick={() => setShowRegisterModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        {t.register}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Click outside to close user menu */}
        {showUserMenu && (
          <div
            className="fixed inset-0 z-30"
            onClick={() => setShowUserMenu(false)}
          />
        )}
      </header>

      {/* Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <RegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
      />
    </>
  );
};

export default Header;