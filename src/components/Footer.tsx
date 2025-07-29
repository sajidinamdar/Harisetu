import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { translations } from '../translations';

const Footer: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">HS</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">
                  {language === 'en' ? 'HaritSetu' : 'हरितसेतू'}
                </h3>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              {t('footer', 'tagline')}
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors duration-300"
                >
                  <Social className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer', 'quickLinks')}</h4>
            <ul className="space-y-3">
              {language === 'en' 
                ? translations.footer.en.links.map((link: string, index: number) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))
                : translations.footer.mr.links.map((link: string, index: number) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                        {link}
                      </a>
                    </li>
                  ))
              }
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer', 'services')}</h4>
            <ul className="space-y-3">
              {language === 'en'
                ? translations.footer.en.servicesList.map((service: string, index: number) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                        {service}
                      </a>
                    </li>
                  ))
                : translations.footer.mr.servicesList.map((service: string, index: number) => (
                    <li key={index}>
                      <a href="#" className="text-gray-400 hover:text-green-400 transition-colors duration-300">
                        {service}
                      </a>
                    </li>
                  ))
              }
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">{t('footer', 'contact')}</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                <p className="text-gray-400">
                  {language === 'en' 
                    ? translations.footer.en.contactInfo.address 
                    : translations.footer.mr.contactInfo.address}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-gray-400">
                  {language === 'en' 
                    ? translations.footer.en.contactInfo.phone 
                    : translations.footer.mr.contactInfo.phone}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-green-400 flex-shrink-0" />
                <p className="text-gray-400">
                  {language === 'en' 
                    ? translations.footer.en.contactInfo.email 
                    : translations.footer.mr.contactInfo.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <p className="text-center text-gray-400">
            {t('footer', 'copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;