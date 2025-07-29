import React, { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

interface ModuleCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  features: string[];
  color: string;
  delay?: number;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ 
  icon: Icon, 
  title, 
  description, 
  features, 
  color,
  delay = 0 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const handleOpenModule = () => {
    // Map module titles to their respective routes
    const moduleRoutes: Record<string, string> = {
      'AgriScan': '/agriscan',
      'एग्री स्कॅन': '/agriscan',
      'Grievance360': '/grievance360',
      'तक्रार ३६०': '/grievance360',
      'AgriConnect': '/agriconnect',
      'एग्री कनेक्ट': '/agriconnect',
      'KrushiBazaar': '/krushi_bazaar',
      'कृषीबाज़ार': '/krushi_bazaar',
      'WeatherGuard': '/weatherguard',
      'हवामान रक्षक': '/weatherguard',
      'AgroAlert': '/weatherguard',
      'एग्रो अलर्ट': '/weatherguard',
      'AgriDocAI': '/agridocai',
      'एग्री डॉक AI': '/agridocai',
      'Kisan Mitra': '/kisanmitra',
      'किसान मित्र': '/kisanmitra',
      'HaritSetu Chat': '/haritsetu-chat',
      'हरितसेतू चॅट': '/haritsetu-chat',
      'User Management': '/user-management',
      'वापरकर्ता व्यवस्थापन': '/user-management'
    };

    // Extract the module name from the title (which might contain both languages)
    const moduleName = title.split('/')[0].trim();
    const route = moduleRoutes[moduleName];
    
    if (route) {
      navigate(route);
    } else {
      setIsModalOpen(true);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5, delay: delay / 1000 }}
        className="group bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 relative border border-gray-100"
      >
        <div className={`h-2 ${color} w-full`}></div>
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`flex items-center justify-center w-14 h-14 ${color} bg-opacity-20 rounded-full mr-4 group-hover:scale-110 transition-transform duration-300`}>
              <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-').replace('-500', '-600')}`} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 group-hover:text-green-600 transition-colors">
              {title}
            </h3>
          </div>
          
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {description}
          </p>
          
          <div className="space-y-2 mb-5">
            {features.slice(0, 3).map((feature, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, x: -10 }}
                animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                transition={{ duration: 0.3, delay: (delay / 1000) + (index * 0.1) }}
                className="flex items-center space-x-2"
              >
                <div className={`w-1.5 h-1.5 ${color.replace('bg-', 'bg-').replace('-500', '-400')} rounded-full flex-shrink-0`}></div>
                <span className="text-xs text-gray-600">{feature}</span>
              </motion.div>
            ))}
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleOpenModule}
            className={`w-full ${color.replace('bg-', 'bg-').replace('-500', '-50')} ${color.replace('bg-', 'text-').replace('-500', '-600')} py-2 px-4 rounded-md font-medium hover:${color.replace('bg-', 'bg-').replace('-500', '-100')} transition-colors flex items-center justify-center text-sm`}
          >
            <span>स्टार्ट</span>
            <ArrowRight className="ml-2 w-4 h-4" />
          </motion.button>
        </div>
      </motion.div>

      {/* Module Modal */}
      {isModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <div className={`inline-flex items-center justify-center w-12 h-12 ${color} rounded-xl mr-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>

              <div className="mb-8">
                <p className="text-gray-600 mb-4">{description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {features.map((feature, index) => (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg"
                    >
                      <div className="w-3 h-3 bg-primary-500 rounded-full flex-shrink-0"></div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gray-50 p-6 rounded-xl mb-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">मॉड्यूल विकसित केले जात आहे (Module is under development)</h3>
                <p className="text-gray-600">
                  हे मॉड्यूल सध्या विकसित केले जात आहे. अपडेट आणि नवीन वैशिष्ट्यांसाठी लवकरच परत तपासा!
                  (This module is currently being developed. Check back soon for updates and new features!)
                </p>
              </motion.div>

              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  बंद करा (Close)
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default ModuleCard;