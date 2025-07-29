import React, { useState } from 'react';
import OTPAuthModal from '../components/auth/OTPAuthModal';
import { useAuth } from '../contexts/AuthContext';

const OTPAuthDemo: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'login' | 'register'>('login');
  const [language, setLanguage] = useState<'en' | 'mr'>('en');

  const handleOpenLoginModal = () => {
    setModalMode('login');
    setIsModalOpen(true);
  };

  const handleOpenRegisterModal = () => {
    setModalMode('register');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'mr' : 'en');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">HaritSetu OTP Authentication</h1>
          <p className="text-gray-600">
            {language === 'en' 
              ? 'Secure login and registration with mobile OTP verification' 
              : 'मोबाइल OTP सत्यापन सह सुरक्षित लॉगिन आणि नोंदणी'}
          </p>
        </div>

        <div className="flex justify-end mb-6">
          <button
            onClick={toggleLanguage}
            className="px-4 py-2 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 transition-colors"
          >
            {language === 'en' ? 'मराठी' : 'English'}
          </button>
        </div>

        {isAuthenticated && user ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">
              {language === 'en' ? 'Welcome!' : 'स्वागत आहे!'}
            </h2>
            <div className="space-y-2 mb-6">
              <p className="text-green-700">
                <span className="font-medium">{language === 'en' ? 'Name:' : 'नाव:'}</span> {user.name}
              </p>
              <p className="text-green-700">
                <span className="font-medium">{language === 'en' ? 'Phone:' : 'फोन:'}</span> {user.phone}
              </p>
              {user.email && (
                <p className="text-green-700">
                  <span className="font-medium">{language === 'en' ? 'Email:' : 'ईमेल:'}</span> {user.email}
                </p>
              )}
              {user.village && (
                <p className="text-green-700">
                  <span className="font-medium">{language === 'en' ? 'Village:' : 'गाव:'}</span> {user.village}
                </p>
              )}
            </div>
            <button
              onClick={logout}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              {language === 'en' ? 'Logout' : 'लॉगआउट'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={handleOpenLoginModal}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              {language === 'en' ? 'Login with OTP' : 'OTP सह लॉगिन करा'}
            </button>
            <button
              onClick={handleOpenRegisterModal}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              {language === 'en' ? 'Register with OTP' : 'OTP सह नोंदणी करा'}
            </button>
          </div>
        )}

        <div className="mt-8 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {language === 'en' ? 'How it works:' : 'हे कसे काम करते:'}
          </h3>
          <ol className="list-decimal pl-5 space-y-2 text-gray-600">
            <li>
              {language === 'en' 
                ? 'Enter your phone number to receive an OTP' 
                : 'OTP प्राप्त करण्यासाठी आपला फोन नंबर प्रविष्ट करा'}
            </li>
            <li>
              {language === 'en' 
                ? 'Verify your phone with the OTP code' 
                : 'OTP कोडसह आपला फोन सत्यापित करा'}
            </li>
            <li>
              {language === 'en' 
                ? 'Complete registration with your details' 
                : 'आपल्या तपशीलांसह नोंदणी पूर्ण करा'}
            </li>
          </ol>
        </div>
      </div>

      <OTPAuthModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        initialMode={modalMode}
        language={language}
      />
    </div>
  );
};

export default OTPAuthDemo;