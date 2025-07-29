import React from 'react';
import { Users, Award, MapPin, Zap } from 'lucide-react';

interface StatsSectionProps {
  language: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ language }) => {
  const translations = {
    en: {
      title: 'Transforming Agriculture Across Maharashtra',
      subtitle: 'Join thousands of farmers who are already benefiting from our smart agricultural solutions',
      stats: [
        { number: '50,000+', label: 'Active Farmers', icon: Users },
        { number: '500+', label: 'Agricultural Experts', icon: Award },
        { number: '1,200+', label: 'Villages Connected', icon: MapPin },
        { number: '95%', label: 'Success Rate', icon: Zap }
      ]
    },
    mr: {
      title: 'संपूर्ण महाराष्ट्रातील कृषीचे रूपांतर',
      subtitle: 'आमच्या स्मार्ट कृषी समाधानांचा आधीच फायदा घेत असलेल्या हजारो शेतकऱ्यांमध्ये सामील व्हा',
      stats: [
        { number: '५०,०००+', label: 'सक्रिय शेतकरी', icon: Users },
        { number: '५००+', label: 'कृषी तज्ञ', icon: Award },
        { number: '१,२००+', label: 'जोडलेली गावे', icon: MapPin },
        { number: '९५%', label: 'यश दर', icon: Zap }
      ]
    }
  };

  const t = translations[language as keyof typeof translations];

  return (
    <section className="py-20 bg-green-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            {t.title}
          </h2>
          <p className="text-xl text-green-100 max-w-3xl mx-auto leading-relaxed">
            {t.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {t.stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6 group-hover:bg-white/30 transition-colors">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-green-100 font-semibold text-lg">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;