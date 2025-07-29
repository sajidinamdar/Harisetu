import React from 'react';
import ModuleCard from './ModuleCard';
import { 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  Bell, 
  Camera, 
  MapPin, 
  FileText, 
  FileCheck, 
  Mic,
  GraduationCap,
  Cloud
} from 'lucide-react';

interface ModulesSectionProps {
  language: string;
}

const ModulesSection: React.FC<ModulesSectionProps> = ({ language }) => {
  const translations = {
    en: {
      title: 'Comprehensive Agricultural Solutions',
      subtitle: 'Discover our 11 integrated modules designed to support every aspect of modern farming',
      modules: [
        {
          title: 'User Management / वापरकर्ता व्यवस्थापन',
          description: 'Secure registration and login for farmers, officers, and experts with role-based access control.',
          features: ['Multilingual Authentication', 'Profile Management', 'Role-based Access', 'Security Features']
        },
        {
          title: 'KrushiBazaar / कृषीबाज़ार',
          description: 'Digital marketplace for seeds, tools, fertilizers with price comparison and subsidy information.',
          features: ['Product Search & Buy/Sell', 'Price Comparison', 'Government Subsidies', 'Secure Payments']
        },
        {
          title: 'HaritSetu Chat / हरितसेतू चॅट',
          description: 'Real-time AI chatbot and human expert consultation in Marathi and English.',
          features: ['AI Chatbot Support', 'Expert Consultation', 'Multilingual Chat', 'Real-time Messaging']
        },
        {
          title: 'AgroAlert / एग्रो अलर्ट',
          description: 'Smart alerts for pests, weather conditions, and crop-related issues with risk analysis.',
          features: ['Weather Alerts', 'Pest Notifications', 'Risk Analysis', 'SMS & Push Alerts']
        },
        {
          title: 'AgriScan / एग्री स्कॅन',
          description: 'AI-powered crop disease detection from images with diagnosis and treatment solutions.',
          features: ['Image-based Diagnosis', 'Disease Detection', 'Treatment Suggestions', 'Multilingual Results']
        },
        {
          title: 'AgriConnect / एग्री कनेक्ट',
          description: 'GPS-based discovery of nearby agricultural services including vets, shops, and banks.',
          features: ['Service Discovery', 'GPS Integration', 'Service Ratings', 'Contact Information']
        },
        {
          title: 'Grievance360 / तक्रार ३६०',
          description: 'Comprehensive system to register, track, and resolve farming-related complaints.',
          features: ['Complaint Registration', 'Status Tracking', 'Priority Assignment', 'Resolution Updates']
        },
        {
          title: 'AgriDocAI / एग्री डॉक AI',
          description: 'AI-powered document generation for subsidies, crop loss reports, and loan applications.',
          features: ['Auto Document Generation', 'Subsidy Applications', 'Loan Forms', 'Report Creation']
        },
        {
          title: 'Kisan Mitra / किसान मित्र',
          description: 'Voice-based personal assistant in Marathi for crop advice and training information.',
          features: ['Voice Commands', 'Crop Advice', 'Training Schedules', 'Marathi Support']
        },
        {
          title: 'AgriLearn / एग्री लर्न',
          description: 'Educational platform with courses and training materials for modern farming techniques.',
          features: ['Video Courses', 'Interactive Learning', 'Certification', 'Offline Access']
        },
        {
          title: 'WeatherGuard / हवामान रक्षक',
          description: 'Advanced weather forecasting and climate analysis for agricultural planning.',
          features: ['Seasonal Forecasts', 'Climate Analysis', 'Crop Planning', 'Disaster Alerts']
        }
      ]
    },
    mr: {
      title: 'सर्वसमावेशक कृषी समाधान',
      subtitle: 'आधुनिक शेतीच्या प्रत्येक पैलूला समर्थन देण्यासाठी डिझाइन केलेले आमचे ११ एकत्रित मॉड्यूल शोधा',
      modules: [
        {
          title: 'वापरकर्ता व्यवस्थापन / User Management',
          description: 'शेतकरी, अधिकारी आणि तज्ञांसाठी सुरक्षित नोंदणी आणि लॉगिन रोल-आधारित प्रवेश नियंत्रणासह.',
          features: ['बहुभाषिक प्रमाणीकरण', 'प्रोफाइल व्यवस्थापन', 'रोल-आधारित प्रवेश', 'सुरक्षा वैशिष्ट्ये']
        },
        {
          title: 'कृषीबाज़ार / KrushiBazaar',
          description: 'बियाणे, साधने, खत यासाठी डिजिटल बाज़ारपेठ किंमत तुलना आणि अनुदान माहितीसह.',
          features: ['उत्पादन खरेदी/विक्री', 'किंमत तुलना', 'सरकारी अनुदान', 'सुरक्षित पेमेंट']
        },
        {
          title: 'हरितसेतू चॅट / HaritSetu Chat',
          description: 'मराठी आणि इंग्रजीमध्ये रियल-टाइम AI चॅटबॉट आणि तज्ञ सल्लामसलत.',
          features: ['AI चॅटबॉट', 'तज्ञ सल्ला', 'बहुभाषिक चॅट', 'रियल-टाइम संदेश']
        },
        {
          title: 'एग्रो अलर्ट / AgroAlert',
          description: 'कीड, हवामान परिस्थिती आणि पीक संबंधी समस्यांसाठी स्मार्ट अलर्ट जोखीम विश्लेषणासह.',
          features: ['हवामान अलर्ट', 'कीड सूचना', 'जोखीम विश्लेषण', 'SMS आणि पुश अलर्ट']
        },
        {
          title: 'एग्री स्कॅन / AgriScan',
          description: 'प्रतिमांवरून AI-संचालित पीक रोग शोध निदान आणि उपचार समाधानांसह.',
          features: ['प्रतिमा-आधारित निदान', 'रोग शोध', 'उपचार सूचना', 'बहुभाषिक परिणाम']
        },
        {
          title: 'एग्री कनेक्ट / AgriConnect',
          description: 'पशुवैद्य, दुकाने आणि बँकांसह जवळील कृषी सेवांचा GPS-आधारित शोध.',
          features: ['सेवा शोध', 'GPS एकत्रीकरण', 'सेवा रेटिंग', 'संपर्क माहिती']
        },
        {
          title: 'तक्रार ३६० / Grievance360',
          description: 'शेती संबंधी तक्रारी नोंदवणे, ट्रॅक करणे आणि निराकरण करण्यासाठी सर्वसमावेशक प्रणाली.',
          features: ['तक्रार नोंदणी', 'स्थिती ट्रॅकिंग', 'प्राधान्य नियुक्ती', 'निराकरण अपडेट']
        },
        {
          title: 'एग्री डॉक AI / AgriDocAI',
          description: 'अनुदान, पीक नुकसान अहवाल आणि कर्ज अर्जांसाठी AI-संचालित दस्तऐवज निर्मिती.',
          features: ['स्वयं दस्तऐवज निर्मिती', 'अनुदान अर्ज', 'कर्ज फॉर्म', 'अहवाल निर्मिती']
        },
        {
          title: 'किसान मित्र / Kisan Mitra',
          description: 'पीक सल्ला आणि प्रशिक्षण माहितीसाठी मराठीमध्ये आवाज-आधारित वैयक्तिक सहाय्यक.',
          features: ['आवाज आदेश', 'पीक सल्ला', 'प्रशिक्षण वेळापत्रक', 'मराठी समर्थन']
        },
        {
          title: 'एग्री लर्न / AgriLearn',
          description: 'आधुनिक शेती तंत्रांसाठी अभ्यासक्रम आणि प्रशिक्षण साहित्यासह शैक्षणिक व्यासपीठ.',
          features: ['व्हिडिओ अभ्यासक्रम', 'इंटरॅक्टिव्ह लर्निंग', 'प्रमाणपत्र', 'ऑफलाइन प्रवेश']
        },
        {
          title: 'हवामान रक्षक / WeatherGuard',
          description: 'कृषी नियोजनासाठी प्रगत हवामान अंदाज आणि हवामान विश्लेषण.',
          features: ['हंगामी अंदाज', 'हवामान विश्लेषण', 'पीक नियोजन', 'आपत्ती सूचना']
        }
      ]
    }
  };

  const t = translations[language as keyof typeof translations];
  const icons = [Users, ShoppingCart, MessageSquare, Bell, Camera, MapPin, FileText, FileCheck, Mic, GraduationCap, Cloud];
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-red-500', 
    'bg-indigo-500', 'bg-yellow-500', 'bg-pink-500', 'bg-teal-500', 'bg-cyan-500', 'bg-emerald-500'
  ];

  return (
    <section id="services" className="py-8 bg-white rounded-lg shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {t.title}
          </h2>
          <p className="text-gray-600 max-w-3xl leading-relaxed text-sm">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.modules.map((module, index) => (
            <ModuleCard
              key={index}
              icon={icons[index]}
              title={module.title}
              description={module.description}
              features={module.features}
              color={colors[index]}
              delay={index * 50}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;