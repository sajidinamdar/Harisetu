import React, { useState, useEffect } from 'react';

interface NearbyServicesProps {
  latitude: number;
  longitude: number;
}

interface Service {
  id: string;
  name: string;
  type: 'agri_shop' | 'vet' | 'agri_connect' | 'krushi_bazaar' | 'agro_alert';
  distance: number; // in km
  address: string;
  contact?: string;
  rating?: number;
}

const NearbyServices: React.FC<NearbyServicesProps> = ({ latitude, longitude }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    if (latitude && longitude) {
      fetchNearbyServices();
    }
  }, [latitude, longitude]);

  const fetchNearbyServices = async () => {
    try {
      setLoading(true);
      
      // In a real app, we would fetch from an API
      // For now, we'll use mock data
      const mockServices: Service[] = [
        {
          id: '1',
          name: 'कृषि सेवा केंद्र',
          type: 'agri_shop',
          distance: 3.2,
          address: 'मेन रोड, शिवाजी नगर, अहमदनगर',
          contact: '9876543210',
          rating: 4.5
        },
        {
          id: '2',
          name: 'शेतकरी कृषि केंद्र',
          type: 'agri_shop',
          distance: 5.7,
          address: 'MIDC एरिया, अहमदनगर',
          contact: '9876543211',
          rating: 4.2
        },
        {
          id: '3',
          name: 'डॉ. पाटील पशुवैद्यकीय क्लिनिक',
          type: 'vet',
          distance: 4.1,
          address: 'गारखेडा परिसर, अहमदनगर',
          contact: '9876543212',
          rating: 4.8
        },
        {
          id: '4',
          name: 'ऑर्गॅनिक फार्म इनपुट्स',
          type: 'agri_shop',
          distance: 7.8,
          address: 'जालना रोड, अहमदनगर',
          contact: '9876543219',
          rating: 4.6
        },
        {
          id: '5',
          name: 'मृदा परीक्षण प्रयोगशाळा',
          type: 'agri_connect',
          distance: 8.9,
          address: 'पैठण रोड, अहमदनगर',
          contact: '9876543220',
          rating: 4.3
        },
        {
          id: '6',
          name: 'कृषि यंत्र भाडे केंद्र',
          type: 'agri_connect',
          distance: 10.5,
          address: 'बीड बायपास रोड, अहमदनगर',
          contact: '9876543222',
          rating: 4.1
        },
        {
          id: '7',
          name: 'शेतकरी ड्रोन सेवा',
          type: 'agri_connect',
          distance: 13.2,
          address: 'वाळूज MIDC, अहमदनगर',
          contact: '9876543223',
          rating: 4.4
        },
        {
          id: '8',
          name: 'शेतमाल वाहतूक सेवा',
          type: 'krushi_bazaar',
          distance: 14.7,
          address: 'सिडको, अहमदनगर',
          contact: '9876543224',
          rating: 4.0
        }
      ];
      
      // Sort by distance
      mockServices.sort((a, b) => a.distance - b.distance);
      
      setServices(mockServices);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching nearby services:', err);
      setError('सेवा माहिती लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
      setLoading(false);
    }
  };

  const filteredServices = activeTab === 'all' 
    ? services 
    : services.filter(service => service.type === activeTab);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold mb-4">जवळील सेवा</h2>
      
      {/* Tabs */}
      <div className="flex overflow-x-auto space-x-2 mb-4 pb-1">
        <button
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            activeTab === 'all' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('all')}
        >
          सर्व
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            activeTab === 'agri_shop' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('agri_shop')}
        >
          कृषि दुकाने
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            activeTab === 'vet' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('vet')}
        >
          पशुवैद्यकीय
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            activeTab === 'agri_connect' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('agri_connect')}
        >
          कृषि सेवा
        </button>
        <button
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            activeTab === 'krushi_bazaar' 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveTab('krushi_bazaar')}
        >
          कृषि बाजार
        </button>
      </div>
      
      {/* Services List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      ) : error ? (
        <div className="text-red-500 p-3 bg-red-50 rounded-md">
          {error}
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          कोणत्याही सेवा सापडल्या नाहीत
        </div>
      ) : (
        <div className="space-y-3">
          {filteredServices.map(service => (
            <div 
              key={service.id}
              className="border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="font-medium text-gray-800">{service.name}</h3>
                  <p className="text-sm text-gray-600">{service.address}</p>
                  {service.contact && (
                    <p className="text-sm text-gray-600">{service.contact}</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{service.distance} किमी</p>
                  {service.rating && (
                    <div className="flex items-center justify-end mt-1">
                      <span className="text-yellow-500">{service.rating}</span>
                      <span className="text-yellow-500 ml-1">★</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-center">
        <a 
          href="/services"
          className="text-green-600 hover:text-green-700 text-sm font-medium"
        >
          सर्व सेवा पहा →
        </a>
      </div>
    </div>
  );
};

export default NearbyServices;