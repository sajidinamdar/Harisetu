import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">
          {language === 'en' ? 'HaritSetu Dashboard' : 'हरितसेतू डॅशबोर्ड'}
        </h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'en' ? 'Welcome' : 'स्वागत'}, {user?.name || 'User'}!
          </h2>
          <p className="text-gray-300">
            {language === 'en' 
              ? 'This is a test version of the dashboard to check if the basic functionality works.'
              : 'हे डॅशबोर्डचे चाचणी आवृत्ती आहे मूलभूत कार्यक्षमता काम करते का ते तपासण्यासाठी.'
            }
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'User Management' : 'वापरकर्ता व्यवस्थापन'}
            </h3>
            <p className="text-gray-300 text-sm">
              {language === 'en' 
                ? 'Manage user accounts and permissions'
                : 'वापरकर्ता खाती आणि परवानग्या व्यवस्थापित करा'
              }
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'KrushiBazaar' : 'कृषीबाज़ार'}
            </h3>
            <p className="text-gray-300 text-sm">
              {language === 'en' 
                ? 'Digital marketplace for agricultural products'
                : 'कृषी उत्पादनांसाठी डिजिटल बाज़ारपेठ'
              }
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-2">
              {language === 'en' ? 'AgriScan' : 'एग्री स्कॅन'}
            </h3>
            <p className="text-gray-300 text-sm">
              {language === 'en' 
                ? 'AI-powered crop disease detection'
                : 'AI-संचालित पीक रोग शोध'
              }
            </p>
          </div>
        </div>

        <div className="mt-8">
          <button 
            onClick={logout}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            {language === 'en' ? 'Logout' : 'लॉगआउट'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;