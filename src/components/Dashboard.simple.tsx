import React, { useState, useEffect } from 'react';
import { 
  LogOut, User, Bell, Settings, ChevronDown, Home, ShoppingCart, 
  FileText, Camera, AlertTriangle, Mic, MapPin, Thermometer, 
  Cloud, Sun, Moon, Wind, CloudRain, Menu, X, MessageSquare, FileCheck
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import UserProfile from './auth/UserProfile';
import LanguageSwitcher from './LanguageSwitcher';
import { motion } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
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

  // Mock function to simulate getting weather data
  useEffect(() => {
    const weatherConditions = ['Sunny', 'Cloudy', 'Rainy', 'Windy'];
    const randomCondition = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    const randomTemp = Math.floor(Math.random() * 10) + 25;
    
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

  // Agricultural modules data
  const modules = [
    {
      id: 'user-management',
      title: language === 'en' ? 'User Management' : 'वापरकर्ता व्यवस्थापन',
      subtitle: 'User Management',
      description: language === 'en' 
        ? 'Secure registration and login for farmers, officers, and experts with role-based access control.'
        : 'शेतकरी, अधिकारी आणि तज्ञांसाठी सुरक्षित नोंदणी आणि लॉगिन रोल-आधारित प्रवेश नियंत्रणासह.',
      features: language === 'en' 
        ? ['Multilingual Authentication', 'Profile Management', 'Role-based Access', 'Security Features']
        : ['बहुभाषिक प्रमाणीकरण', 'प्रोफाइल व्यवस्थापन', 'रोल-आधारित प्रवेश', 'सुरक्षा वैशिष्ट्ये'],
      icon: <User className="h-6 w-6 text-white" />,
      color: 'from-blue-500 to-blue-600',
      borderColor: 'hover:border-blue-500',
      path: '/user-management'
    },
    {
      id: 'krushi-bazaar',
      title: language === 'en' ? 'KrushiBazaar' : 'कृषीबाज़ार',
      subtitle: 'KrushiBazaar',
      description: language === 'en' 
        ? 'Digital marketplace for seeds, tools, fertilizers with price comparison and subsidy information.'
        : 'बियाणे, साधने, खत यासाठी डिजिटल बाज़ारपेठ किंमत तुलना आणि अनुदान माहितीसह.',
      features: language === 'en' 
        ? ['Product Search & Buy/Sell', 'Price Comparison', 'Government Subsidies', 'Secure Payments']
        : ['उत्पादन खरेदी/विक्री', 'किंमत तुलना', 'सरकारी अनुदान', 'सुरक्षित पेमेंट'],
      icon: <ShoppingCart className="h-6 w-6 text-white" />,
      color: 'from-green-500 to-green-600',
      borderColor: 'hover:border-green-500',
      path: '/krushi_bazaar'
    },
    {
      id: 'haritsetu-chat',
      title: language === 'en' ? 'HaritSetu Chat' : 'हरितसेतू चॅट',
      subtitle: 'HaritSetu Chat',
      description: language === 'en' 
        ? 'Real-time AI chatbot and human expert consultation in Marathi and English.'
        : 'मराठी आणि इंग्रजीमध्ये रियल-टाइम AI चॅटबॉट आणि तज्ञ सल्लामसलत.',
      features: language === 'en' 
        ? ['AI Chatbot Support', 'Expert Consultation', 'Multilingual Chat', 'Real-time Messaging']
        : ['AI चॅटबॉट', 'तज्ञ सल्ला', 'बहुभाषिक चॅट', 'रियल-टाइम संदेश'],
      icon: <MessageSquare className="h-6 w-6 text-white" />,
      color: 'from-purple-500 to-purple-600',
      borderColor: 'hover:border-purple-500',
      path: '/haritsetu-chat'
    },
    {
      id: 'agroalert',
      title: language === 'en' ? 'AgroAlert' : 'एग्रो अलर्ट',
      subtitle: 'AgroAlert',
      description: language === 'en' 
        ? 'Smart alerts for pests, weather conditions, and crop-related issues with risk analysis.'
        : 'कीड, हवामान परिस्थिती आणि पीक संबंधी समस्यांसाठी स्मार्ट अलर्ट जोखीम विश्लेषणासह.',
      features: language === 'en' 
        ? ['Weather Alerts', 'Pest Notifications', 'Risk Analysis', 'SMS & Push Alerts']
        : ['हवामान अलर्ट', 'कीड सूचना', 'जोखीम विश्लेषण', 'SMS आणि पुश अलर्ट'],
      icon: <Bell className="h-6 w-6 text-white" />,
      color: 'from-orange-500 to-orange-600',
      borderColor: 'hover:border-orange-500',
      path: '/agroalert'
    },
    {
      id: 'agriscan',
      title: language === 'en' ? 'AgriScan' : 'एग्री स्कॅन',
      subtitle: 'AgriScan',
      description: language === 'en' 
        ? 'AI-powered crop disease detection from images with diagnosis and treatment solutions.'
        : 'प्रतिमांवरून AI-संचालित पीक रोग शोध निदान आणि उपचार समाधानांसह.',
      features: language === 'en' 
        ? ['Image-based Diagnosis', 'Disease Detection', 'Treatment Suggestions', 'Multilingual Results']
        : ['प्रतिमा-आधारित निदान', 'रोग शोध', 'उपचार सूचना', 'बहुभाषिक परिणाम'],
      icon: <Camera className="h-6 w-6 text-white" />,
      color: 'from-red-500 to-red-600',
      borderColor: 'hover:border-red-500',
      path: '/agriscan'
    },
    {
      id: 'agriconnect',
      title: language === 'en' ? 'AgriConnect' : 'एग्री कनेक्ट',
      subtitle: 'AgriConnect',
      description: language === 'en' 
        ? 'GPS-based discovery of nearby agricultural services including vets, shops, and banks.'
        : 'पशुवैद्य, दुकाने आणि बँकांसह जवळील कृषी सेवांचा GPS-आधारित शोध.',
      features: language === 'en' 
        ? ['Service Discovery', 'GPS Integration', 'Service Ratings', 'Contact Information']
        : ['सेवा शोध', 'GPS एकत्रीकरण', 'सेवा रेटिंग', 'संपर्क माहिती'],
      icon: <MapPin className="h-6 w-6 text-white" />,
      color: 'from-indigo-500 to-indigo-600',
      borderColor: 'hover:border-indigo-500',
      path: '/agriconnect'
    }
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
                      <p className="text-xs text-gray-400">{user?.role || 'Farmer'}</p>
                    </div>
                    <button
                      onClick={() => {
                        setShowUserProfile(true);
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <User className="w-4 h-4 mr-2" />
                      Profile
                    </button>
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </button>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
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
                {modules.length} {language === 'en' ? 'Modules' : 'मॉड्यूल्स'}
              </span>
            </h2>
            
            {/* Modules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <motion.div 
                  key={module.id}
                  className={`bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg ${module.borderColor} transition-all duration-300`}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="p-6">
                    <div className="flex items-center mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${module.color} rounded-lg flex items-center justify-center mr-4`}>
                        {module.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">
                          {module.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {module.subtitle}
                        </p>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-4">
                      {module.description}
                    </p>
                    <div className="space-y-2 mb-4">
                      {module.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-xs text-gray-400">
                          <div className={`w-1.5 h-1.5 bg-gradient-to-r ${module.color} rounded-full mr-2`}></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                    <motion.button 
                      onClick={() => navigate(module.path)}
                      className={`w-full px-4 py-2 bg-gradient-to-r ${module.color} text-white rounded-lg shadow-md text-sm font-medium`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {language === 'en' ? 'Start' : 'स्टार्ट'}
                    </motion.button>
                  </div>
                </motion.div>
              ))}
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
      <UserProfile
        isOpen={showUserProfile}
        onClose={() => setShowUserProfile(false)}
        language={language}
      />
    </div>
  );
};

export default Dashboard;