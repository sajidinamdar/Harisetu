import React, { useState, useEffect } from 'react';
import { 
  LogOut, User, Bell, Settings, ChevronDown, Home, ShoppingCart, 
  FileText, Camera, AlertTriangle, Mic, MapPin, Thermometer, 
  Cloud, Sun, Moon, Wind, CloudRain, Menu, X, MessageSquare, FileCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';

import LanguageSwitcher from './LanguageSwitcher';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentWeather, setCurrentWeather] = useState({
    temp: '28°C',
    condition: 'Sunny',
    location: 'Pune, Maharashtra',
    icon: <Sun className="h-8 w-8 text-yellow-400" />
  });
  
  const roleTranslation = user?.role || 'Farmer';

  // Mock function to simulate getting weather data
  useEffect(() => {
    // This would be replaced with actual API call in production
    const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Windy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const randomTemp = Math.floor(Math.random() * 10) + 25; // Random temp between 25-35°C
    
    let icon;
    switch(randomCondition) {
      case 'Sunny':
        icon = <Sun className="h-8 w-8 text-yellow-400" />;
        break;
      case 'Cloudy':
        icon = <Cloud className="h-8 w-8 text-gray-400" />;
        break;
      case 'Rainy':
        icon = <CloudRain className="h-8 w-8 text-blue-400" />;
        break;
      case 'Windy':
        icon = <Wind className="h-8 w-8 text-blue-300" />;
        break;
      default:
        icon = <Sun className="h-8 w-8 text-yellow-400" />;
    }
    
    setCurrentWeather({
      temp: `${randomTemp}°C`,
      condition: randomCondition,
      location: 'Pune, Maharashtra',
      icon
    });
  }, []);

  // Animation variants for cards
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5
      }
    },
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.2
      }
    }
  };

  // Sidebar navigation items
  const navItems = [
    { icon: <Home className="h-6 w-6" />, label: 'Dashboard', path: '/dashboard' },
    { icon: <ShoppingCart className="h-6 w-6" />, label: 'KrushiBazaar', path: '/krushi_bazaar' },
    { icon: <FileText className="h-6 w-6" />, label: 'Grievance360', path: '/grievance' },
    { icon: <Camera className="h-6 w-6" />, label: 'AgriScan', path: '/agriscan' },
    { icon: <AlertTriangle className="h-6 w-6" />, label: 'AgroAlert', path: '/alerts' },
    { icon: <User className="h-6 w-6" />, label: 'My Profile', path: '/profile' },
  ];

  return (
    <div className="flex h-screen bg-gray-900 text-white overflow-hidden">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex flex-col w-20 bg-gray-800 border-r border-gray-700">
        <div className="flex items-center justify-center h-20 border-b border-gray-700">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-lg">HS</span>
          </div>
        </div>
        <nav className="flex-1 flex flex-col items-center py-6 space-y-8">
          {navItems.map((item, index) => (
            <motion.button
              key={index}
              onClick={() => navigate(item.path)}
              className="w-12 h-12 flex items-center justify-center rounded-lg text-gray-400 hover:text-green-400 hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
            </motion.button>
          ))}
        </nav>
        <div className="p-4">
          <motion.button
            onClick={logout}
            className="w-12 h-12 flex items-center justify-center rounded-lg text-red-400 hover:text-red-300 hover:bg-gray-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <LogOut className="h-6 w-6" />
          </motion.button>
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-800 text-white"
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <motion.div 
          className="fixed inset-0 z-40 bg-gray-900 bg-opacity-90 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            {navItems.map((item, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                className="flex items-center space-x-3 text-xl text-white"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.icon}
                <span>{item.label}</span>
              </motion.button>
            ))}
            <motion.button
              onClick={logout}
              className="flex items-center space-x-3 text-xl text-red-400"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <LogOut className="h-6 w-6" />
              <span>Logout</span>
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Header */}
        <header className="bg-gray-800 border-b border-gray-700 py-4 px-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {language === 'en' ? 'HaritSetu Command Center' : 'हरितसेतू कमांड सेंटर'}
              </h1>
            </div>

            <div className="flex items-center space-x-6">
              <LanguageSwitcher />
              
              <div className="relative">
                <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full"></span>
                </button>
              </div>
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-medium">{user?.name?.split(' ')[0] || 'User'}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-10">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-white">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-400">{roleTranslation || 'Farmer'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserProfile(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      {t('common', 'profile')}
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      {t('common', 'settings')}
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      {t('common', 'logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 bg-gradient-to-b from-gray-900 to-gray-800">
          {/* Weather and location info */}
          <div className="mb-8 bg-gray-800 rounded-xl p-4 border border-gray-700 shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="mr-4 bg-gray-700 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Current Location</h3>
                  <p className="text-white font-medium">{currentWeather.location}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="mr-4 bg-gray-700 p-3 rounded-lg">
                  {currentWeather.icon}
                </div>
                <div>
                  <h3 className="text-gray-400 text-sm">Weather</h3>
                  <div className="flex items-center">
                    <p className="text-white font-medium mr-2">{currentWeather.temp}</p>
                    <span className="text-gray-300">{currentWeather.condition}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-4 md:mt-0">
                <motion.button 
                  onClick={() => navigate('/haritsetu-chat')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Mic className="h-5 w-5 mr-2" />
                  <span>Voice Assistant</span>
                </motion.button>
                <motion.button 
                  onClick={() => navigate('/agriscan')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera className="h-5 w-5 mr-2" />
                  <span>AgriScan</span>
                </motion.button>
              </div>
            </div>
          </div>
          
          {/* Agricultural Modules Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                {language === 'en' ? 'Agricultural Modules' : 'कृषी मॉड्यूल्स'}
              </span>
              <span className="ml-3 px-3 py-1 bg-green-500 bg-opacity-20 text-green-400 text-sm rounded-full">
                11 {language === 'en' ? 'Modules' : 'मॉड्यूल्स'}
              </span>
            </h2>
            
            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* User Management Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-blue-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'User Management' : 'वापरकर्ता व्यवस्थापन'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'User Management' : 'User Management'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'Secure registration and login for farmers, officers, and experts with role-based access control.'
                      : 'शेतकरी, अधिकारी आणि तज्ञांसाठी सुरक्षित नोंदणी आणि लॉगिन रोल-आधारित प्रवेश नियंत्रणासह.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Multilingual Authentication', 'Profile Management', 'Role-based Access', 'Security Features']
                      : ['बहुभाषिक प्रमाणीकरण', 'प्रोफाइल व्यवस्थापन', 'रोल-आधारित प्रवेश', 'सुरक्षा वैशिष्ट्ये']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/user-management')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* KrushiBazaar Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-green-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.1 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center mr-4">
                      <ShoppingCart className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'KrushiBazaar' : 'कृषीबाज़ार'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'KrushiBazaar' : 'KrushiBazaar'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'Digital marketplace for seeds, tools, fertilizers with price comparison and subsidy information.'
                      : 'बियाणे, साधने, खत यासाठी डिजिटल बाज़ारपेठ किंमत तुलना आणि अनुदान माहितीसह.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Product Search & Buy/Sell', 'Price Comparison', 'Government Subsidies', 'Secure Payments']
                      : ['उत्पादन खरेदी/विक्री', 'किंमत तुलना', 'सरकारी अनुदान', 'सुरक्षित पेमेंट']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/krushi_bazaar')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* HaritSetu Chat Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-purple-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.2 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                      <MessageSquare className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'HaritSetu Chat' : 'हरितसेतू चॅट'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'HaritSetu Chat' : 'HaritSetu Chat'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'Real-time AI chatbot and human expert consultation in Marathi and English.'
                      : 'मराठी आणि इंग्रजीमध्ये रियल-टाइम AI चॅटबॉट आणि तज्ञ सल्लामसलत.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['AI Chatbot Support', 'Expert Consultation', 'Multilingual Chat', 'Real-time Messaging']
                      : ['AI चॅटबॉट', 'तज्ञ सल्ला', 'बहुभाषिक चॅट', 'रियल-टाइम संदेश']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/haritsetu-chat')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* AgroAlert Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-orange-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.3 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mr-4">
                      <Bell className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'AgroAlert' : 'एग्रो अलर्ट'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'AgroAlert' : 'AgroAlert'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'Smart alerts for pests, weather conditions, and crop-related issues with risk analysis.'
                      : 'कीड, हवामान परिस्थिती आणि पीक संबंधी समस्यांसाठी स्मार्ट अलर्ट जोखीम विश्लेषणासह.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Weather Alerts', 'Pest Notifications', 'Risk Analysis', 'SMS & Push Alerts']
                      : ['हवामान अलर्ट', 'कीड सूचना', 'जोखीम विश्लेषण', 'SMS आणि पुश अलर्ट']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/agroalert')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* AgriScan Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-red-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.4 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mr-4">
                      <Camera className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'AgriScan' : 'एग्री स्कॅन'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'AgriScan' : 'AgriScan'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'AI-powered crop disease detection from images with diagnosis and treatment solutions.'
                      : 'प्रतिमांवरून AI-संचालित पीक रोग शोध निदान आणि उपचार समाधानांसह.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Image-based Diagnosis', 'Disease Detection', 'Treatment Suggestions', 'Multilingual Results']
                      : ['प्रतिमा-आधारित निदान', 'रोग शोध', 'उपचार सूचना', 'बहुभाषिक परिणाम']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/agriscan')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* AgriConnect Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-indigo-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.5 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'AgriConnect' : 'एग्री कनेक्ट'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'AgriConnect' : 'AgriConnect'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'GPS-based discovery of nearby agricultural services including vets, shops, and banks.'
                      : 'पशुवैद्य, दुकाने आणि बँकांसह जवळील कृषी सेवांचा GPS-आधारित शोध.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Service Discovery', 'GPS Integration', 'Service Ratings', 'Contact Information']
                      : ['सेवा शोध', 'GPS एकत्रीकरण', 'सेवा रेटिंग', 'संपर्क माहिती']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/agriconnect')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* Grievance360 Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-yellow-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.6 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'Grievance360' : 'तक्रार ३६०'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'Grievance360' : 'Grievance360'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'Comprehensive system to register, track, and resolve farming-related complaints.'
                      : 'शेती संबंधी तक्रारी नोंदवणे, ट्रॅक करणे आणि निराकरण करण्यासाठी सर्वसमावेशक प्रणाली.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Complaint Registration', 'Status Tracking', 'Priority Assignment', 'Resolution Updates']
                      : ['तक्रार नोंदणी', 'स्थिती ट्रॅकिंग', 'प्राधान्य नियुक्ती', 'निराकरण अपडेट']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/grievance360')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* AgriDocAI Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-pink-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.7 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mr-4">
                      <FileCheck className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'AgriDocAI' : 'एग्री डॉक AI'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'AgriDocAI' : 'AgriDocAI'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'AI-powered document generation for subsidies, crop loss reports, and loan applications.'
                      : 'अनुदान, पीक नुकसान अहवाल आणि कर्ज अर्जांसाठी AI-संचालित दस्तऐवज निर्मिती.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Auto Document Generation', 'Subsidy Applications', 'Loan Forms', 'Report Creation']
                      : ['स्वयं दस्तऐवज निर्मिती', 'अनुदान अर्ज', 'कर्ज फॉर्म', 'अहवाल निर्मिती']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/agridocai')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* Kisan Mitra Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-teal-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.8 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg flex items-center justify-center mr-4">
                      <Mic className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'Kisan Mitra' : 'किसान मित्र'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'Kisan Mitra' : 'Kisan Mitra'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'Voice-based personal assistant in Marathi for crop advice and training information.'
                      : 'पीक सल्ला आणि प्रशिक्षण माहितीसाठी मराठीमध्ये आवाज-आधारित वैयक्तिक सहाय्यक.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Voice Commands', 'Crop Advice', 'Training Schedules', 'Marathi Support']
                      : ['आवाज आदेश', 'पीक सल्ला', 'प्रशिक्षण वेळापत्रक', 'मराठी समर्थन']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/kisanmitra')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* AgriLearn Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-cyan-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 0.9 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'AgriLearn' : 'एग्री लर्न'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'AgriLearn' : 'AgriLearn'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'Educational platform with courses and training materials for modern farming techniques.'
                      : 'आधुनिक शेती तंत्रांसाठी अभ्यासक्रम आणि प्रशिक्षण साहित्यासह शैक्षणिक व्यासपीठ.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Video Courses', 'Interactive Learning', 'Certification', 'Offline Access']
                      : ['व्हिडिओ अभ्यासक्रम', 'इंटरॅक्टिव्ह लर्निंग', 'प्रमाणपत्र', 'ऑफलाइन प्रवेश']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/agrilearn')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>

              {/* WeatherGuard Module */}
              <motion.div 
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg hover:border-emerald-500 transition-all duration-300"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                transition={{ delay: 1.0 }}
              >
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center mr-4">
                      <Cloud className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">
                        {language === 'en' ? 'WeatherGuard' : 'हवामान रक्षक'}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {language === 'en' ? 'WeatherGuard' : 'WeatherGuard'}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-4">
                    {language === 'en' 
                      ? 'Advanced weather forecasting and climate analysis for agricultural planning.'
                      : 'कृषी नियोजनासाठी प्रगत हवामान अंदाज आणि हवामान विश्लेषण.'
                    }
                  </p>
                  <div className="space-y-2 mb-4">
                    {(language === 'en' 
                      ? ['Seasonal Forecasts', 'Climate Analysis', 'Crop Planning', 'Disaster Alerts']
                      : ['हंगामी अंदाज', 'हवामान विश्लेषण', 'पीक नियोजन', 'आपत्ती सूचना']
                    ).map((feature, index) => (
                      <div key={index} className="flex items-center text-xs text-gray-400">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <motion.button 
                    onClick={() => navigate('/weatherguard')}
                    className="w-full px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg shadow-md text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {language === 'en' ? 'Start' : 'स्टार्ट'}
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Voice Assistant Floating Button */}
          <motion.button
            className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg z-50"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/haritsetu-chat')}
          >
            <Mic className="h-8 w-8 text-white" />
          </motion.button>
        </main>
      </div>

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* User Profile Modal */}
      {showUserProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-white mb-4">User Profile</h2>
            <p className="text-gray-300 mb-4">Profile functionality coming soon...</p>
            <button 
              onClick={() => setShowUserProfile(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;