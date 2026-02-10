import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import LoginModal from './auth/LoginModal';
import RegisterModal from './auth/RegisterModal';

const WelcomePage: React.FC = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { language, t } = useLanguage();
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
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex flex-col">
        <header className="py-4 px-6 flex justify-end">
          <LanguageSwitcher />
        </header>

        <main className="flex-1 flex flex-col items-center px-4 py-12">
          <div className="text-center mb-12">
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-3xl">HS</span>
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold text-green-800 mb-3">{t('welcomePage', 'title')}</h1>
            <p className="text-xl text-green-600 mb-6">{t('welcomePage', 'subtitle')}</p>
            <p className="text-gray-600 max-w-md mx-auto mb-10">{t('welcomePage', 'description')}</p>

            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-16">
              <button
                onClick={() => setShowLoginModal(true)}
                className="px-8 py-3 text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition-colors font-semibold"
              >
                {t('common', 'login')}
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                {t('common', 'register')}
              </button>
            </div>
          </div>

          <div className="max-w-6xl w-full mx-auto">
            <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">{t('welcomePage', 'features')}</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('welcomePage', 'feature1Title')}</h3>
                <p className="text-gray-600">{t('welcomePage', 'feature1Desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('welcomePage', 'feature2Title')}</h3>
                <p className="text-gray-600">{t('welcomePage', 'feature2Desc')}</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('welcomePage', 'feature3Title')}</h3>
                <p className="text-gray-600">{t('welcomePage', 'feature3Desc')}</p>
              </div>
            </div>

            <div className="bg-green-50 p-8 rounded-xl mb-16">
              <h2 className="text-2xl font-bold text-green-800 mb-4">{t('welcomePage', 'aboutTitle')}</h2>
              <p className="text-gray-700 leading-relaxed">{t('welcomePage', 'aboutDesc')}</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md max-w-md mx-auto">
              <h3 className="font-semibold text-gray-900 mb-4 text-center">{t('welcomePage', 'demoAccounts')}</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span>{t('welcomePage', 'farmer')}</span>
                  <button
                    onClick={() => {
                      const farmerData = {
                        email: 'farmer@demo.com',
                        password: 'demo123'
                      };
                      setShowLoginModal(true);
                      setTimeout(() => {
                        const loginForm = document.querySelector('form');
                        if (loginForm) {
                          const emailInput = loginForm.querySelector('input[type="email"]') as HTMLInputElement;
                          const passwordInput = loginForm.querySelector('input[type="password"]') as HTMLInputElement;
                          if (emailInput && passwordInput) {
                            emailInput.value = farmerData.email;
                            passwordInput.value = farmerData.password;
                            // Trigger change events
                            const event = new Event('input', { bubbles: true });
                            emailInput.dispatchEvent(event);
                            passwordInput.dispatchEvent(event);
                          }
                        }
                      }, 100);
                    }}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Use
                  </button>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span>{t('welcomePage', 'officer')}</span>
                  <button
                    onClick={() => {
                      const officerData = {
                        email: 'officer@demo.com',
                        password: 'demo123'
                      };
                      setShowLoginModal(true);
                      setTimeout(() => {
                        const loginForm = document.querySelector('form');
                        if (loginForm) {
                          const emailInput = loginForm.querySelector('input[type="email"]') as HTMLInputElement;
                          const passwordInput = loginForm.querySelector('input[type="password"]') as HTMLInputElement;
                          if (emailInput && passwordInput) {
                            emailInput.value = officerData.email;
                            passwordInput.value = officerData.password;
                            // Trigger change events
                            const event = new Event('input', { bubbles: true });
                            emailInput.dispatchEvent(event);
                            passwordInput.dispatchEvent(event);
                          }
                        }
                      }, 100);
                    }}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Use
                  </button>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span>{t('welcomePage', 'expert')}</span>
                  <button
                    onClick={() => {
                      const expertData = {
                        email: 'expert@demo.com',
                        password: 'demo123'
                      };
                      setShowLoginModal(true);
                      setTimeout(() => {
                        const loginForm = document.querySelector('form');
                        if (loginForm) {
                          const emailInput = loginForm.querySelector('input[type="email"]') as HTMLInputElement;
                          const passwordInput = loginForm.querySelector('input[type="password"]') as HTMLInputElement;
                          if (emailInput && passwordInput) {
                            emailInput.value = expertData.email;
                            passwordInput.value = expertData.password;
                            // Trigger change events
                            const event = new Event('input', { bubbles: true });
                            emailInput.dispatchEvent(event);
                            passwordInput.dispatchEvent(event);
                          }
                        }
                      }, 100);
                    }}
                    className="text-green-600 hover:text-green-700 font-medium"
                  >
                    Use
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">{t('welcomePage', 'demoPassword')}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
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
    </>
  );
};

export default WelcomePage;