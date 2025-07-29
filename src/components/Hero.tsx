import React from 'react';
import { ArrowRight, Sprout } from 'lucide-react';

interface HeroProps {
  language: string;
}

const Hero: React.FC<HeroProps> = ({ language }) => {
  const translations = {
    en: {
      title: 'Empowering Farmers with Smart Technology',
      subtitle: 'Join HaritSetu - Your complete agricultural companion with AI-powered solutions, expert guidance, and seamless digital services.',
      cta: 'Get Started',
      features: [
        'AI-Powered Crop Diagnosis',
        'Real-time Weather Alerts', 
        'Expert Consultation',
        'Digital Marketplace'
      ]
    },
    mr: {
      title: 'स्मार्ट तंत्रज्ञानाने शेतकऱ्यांना सशक्त करणे',
      subtitle: 'हरितसेतूमध्ये सामील व्हा - AI-आधारित समाधान, तज्ञांचे मार्गदर्शन आणि डिजिटल सेवांसह तुमचा संपूर्ण कृषी साथीदार.',
      cta: 'सुरुवात करा',
      features: [
        'AI-आधारित पीक निदान',
        'वास्तविक वेळ हवामान अलर्ट',
        'तज्ञ सल्लामसलत',
        'डिजिटल बाज़ारपेठ'
      ]
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <section id="home" className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 bg-green-500 rounded-full"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-green-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-green-400 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-green-600">
                <Sprout className="w-8 h-8" />
                <span className="text-lg font-semibold">HaritSetu Platform</span>
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
                {t.title}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {t.subtitle}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {t.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2 text-gray-700">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-700 transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-105">
                <span>{t.cta}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="border-2 border-green-600 text-green-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-green-50 transition-colors">
                Learn More
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
              <div className="aspect-square bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                <div className="text-center text-white">
                  <Sprout className="w-16 h-16 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Smart Farming</h3>
                  <p className="text-green-100">Technology meets Agriculture</p>
                </div>
              </div>
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-400 rounded-full opacity-60 animate-bounce"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;