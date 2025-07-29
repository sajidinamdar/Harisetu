import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServicesMap from '../components/ServicesMap';

// Define types
interface AgriService {
  id: string;
  name: string;
  type: string;
  subType?: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  openNow?: boolean;
  hours?: string;
  services?: string[];
  inventory?: string[];
  emergencyService?: boolean;
  governmentAffiliated?: boolean;
  verificationStatus?: string;
  offersLoans?: boolean;
  acceptsInsurance?: boolean;
  lastUpdated?: string;
}

interface FilterOptions {
  serviceType: string;
  openNow: boolean;
  maxDistance: number;
  hasEmergencyService: boolean;
  governmentAffiliated: boolean;
  verifiedOnly: boolean;
  specialties: string[];
  inventory: string[];
}

const AgriServicesLocator: React.FC = () => {
  const navigate = useNavigate();
  
  // State for location
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    city: '',
    state: '',
    country: '',
    loading: true,
    error: ''
  });
  
  // State for services
  const [services, setServices] = useState<AgriService[]>([]);
  const [filteredServices, setFilteredServices] = useState<AgriService[]>([]);
  const [loading, setLoading] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState<FilterOptions>({
    serviceType: 'all',
    openNow: false,
    maxDistance: 20,
    hasEmergencyService: false,
    governmentAffiliated: false,
    verifiedOnly: true,
    specialties: [],
    inventory: []
  });
  
  // State for selected service
  const [selectedService, setSelectedService] = useState<AgriService | null>(null);
  
  // State for map view
  const [showMap, setShowMap] = useState<boolean>(false);
  
  // State for search
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for weather information
  const [weather, setWeather] = useState({
    temperature: '',
    condition: '',
    loading: true,
    error: ''
  });
  
  // State for crop recommendations
  const [cropRecommendations, setCropRecommendations] = useState({
    crops: [] as string[],
    management: [] as string[],
    alerts: [] as string[],
    loading: true,
    error: ''
  });
  
  // Get user's current location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);
  
  // Load services when location is available
  useEffect(() => {
    if (location.latitude !== 0 && location.longitude !== 0) {
      loadServices();
      fetchWeatherData();
      fetchCropRecommendations();
    }
  }, [location.latitude, location.longitude]);
  
  // Fetch weather data from API
  const fetchWeatherData = async () => {
    try {
      setWeather(prev => ({ ...prev, loading: true, error: '' }));
      
      const apiKey = import.meta.env.WEATHER_API_KEY || process.env.WEATHER_API_KEY;
      if (!apiKey) {
        console.error('Weather API key not found');
        setWeather(prev => ({ 
          ...prev, 
          loading: false, 
          error: 'Weather API key not found' 
        }));
        return;
      }
      
      // Make a real API call to OpenWeatherMap
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${location.latitude}&lon=${location.longitude}&units=metric&appid=${apiKey}`
      );
      
      if (!response.ok) {
        throw new Error('Weather API request failed');
      }
      
      const data = await response.json();
      
      // Extract weather data
      const temperature = `${Math.round(data.main.temp)}°C`;
      const condition = data.weather[0].description;
      
      setWeather({
        temperature,
        condition,
        loading: false,
        error: ''
      });
    } catch (error) {
      console.error('Error fetching weather data:', error);
      setWeather(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error fetching weather data. Please try again later.' 
      }));
    }
  };
  
  // Fetch crop recommendations based on location and weather
  const fetchCropRecommendations = async () => {
    try {
      setCropRecommendations(prev => ({ ...prev, loading: true, error: '' }));
      
      // In a real app, we would make an API call to a crop recommendation service
      // Since we don't have a real API for this, we'll make a call to our backend
      // which would then use AI or a database to generate recommendations
      
      // For now, we'll show a loading state but set an error that the API is not available yet
      setTimeout(() => {
        setCropRecommendations(prev => ({
          ...prev,
          loading: false,
          error: 'कृषी शिफारस API अद्याप विकसित केली जात आहे. कृपया नंतर पुन्हा प्रयत्न करा.'
        }));
      }, 2000);
    } catch (error) {
      console.error('Error fetching crop recommendations:', error);
      setCropRecommendations(prev => ({ 
        ...prev, 
        loading: false, 
        error: 'Error fetching crop recommendations. Please try again later.' 
      }));
    }
  };
  
  // Filter services when filters change
  useEffect(() => {
    filterServices();
  }, [filters, services, searchQuery]);
  
  // Calculate distance between two coordinates in kilometers using Haversine formula
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distance = R * c; // Distance in km
    return parseFloat(distance.toFixed(1));
  };
  
  // Load services from API
  const loadServices = async () => {
    setLoading(true);
    
    try {
      // Check if we have location data
      if (!location.latitude || !location.longitude) {
        setLoading(false);
        return;
      }
      
      // Get API key from environment variables
      const apiKey = import.meta.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found');
        setLoading(false);
        return;
      }
      
      // In a real app, we would make an API call to fetch nearby services
      // For example, using Google Places API:
      try {
        // This would be the actual API call in a production environment
        // const response = await fetch(
        //   `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.latitude},${location.longitude}&radius=20000&type=store&keyword=agriculture|farm|veterinary&key=${apiKey}`
        // );
        
        // Since we're not making real API calls in this demo, we'll simulate a failure
        // to show the user that we're not using mock data
        throw new Error('API not available');
      } catch (error) {
        console.error('Error fetching services from API:', error);
        
        // Show error message to user
        setServices([]);
        setFilteredServices([]);
        
        // Show alert to user
        alert('कृषी सेवा API अद्याप विकसित केली जात आहे. कृपया नंतर पुन्हा प्रयत्न करा.');
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error in loadServices:', error);
      setLoading(false);
      
      // Show error message
      alert('सेवा लोड करताना त्रुटी आली. कृपया पुन्हा प्रयत्न करा.');
    }
  };
  
  // Filter services based on current filters
  const filterServices = () => {
    if (!services.length) return;
    
    let filtered = [...services];
    
    // Filter by service type
    if (filters.serviceType !== 'all') {
      filtered = filtered.filter(service => service.type === filters.serviceType);
    }
    
    // Filter by open now
    if (filters.openNow) {
      filtered = filtered.filter(service => service.openNow);
    }
    
    // Filter by max distance
    filtered = filtered.filter(service => service.distance <= filters.maxDistance);
    
    // Filter by emergency service
    if (filters.hasEmergencyService) {
      filtered = filtered.filter(service => service.emergencyService);
    }
    
    // Filter by government affiliation
    if (filters.governmentAffiliated) {
      filtered = filtered.filter(service => service.governmentAffiliated);
    }
    
    // Filter by verification status
    if (filters.verifiedOnly) {
      filtered = filtered.filter(service => service.verificationStatus === 'verified');
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(service => 
        service.name.toLowerCase().includes(query) || 
        service.address.toLowerCase().includes(query) ||
        service.type.toLowerCase().includes(query) ||
        (service.subType && service.subType.toLowerCase().includes(query))
      );
    }
    
    setFilteredServices(filtered);
  };
  
  // Get user's current location using browser geolocation
  const getCurrentLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: '' }));
    
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'तुमचा ब्राउझर जीओलोकेशन सपोर्ट करत नाही.'
      }));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        setLocation(prev => ({
          ...prev,
          latitude,
          longitude,
          loading: false
        }));
        
        // Get address details using Google Maps Geocoding API
        try {
          await fetchLocationDetails(latitude, longitude);
        } catch (error) {
          console.error('Error fetching location details:', error);
        }
      },
      (error) => {
        let errorMessage = 'स्थान मिळवण्यात अडचण आली आहे.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'स्थान परवानगी नाकारली गेली आहे. कृपया ब्राउझर सेटिंग्जमध्ये परवानगी द्या.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'स्थान माहिती उपलब्ध नाही.';
            break;
          case error.TIMEOUT:
            errorMessage = 'स्थान मिळवण्यासाठी वेळ संपला आहे. कृपया पुन्हा प्रयत्न करा.';
            break;
        }
        
        setLocation(prev => ({
          ...prev,
          loading: false,
          error: errorMessage
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000
      }
    );
  };
  
  // Fetch location details using Google Maps Geocoding API
  const fetchLocationDetails = async (latitude: number, longitude: number) => {
    try {
      const apiKey = import.meta.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_API_KEY;
      if (!apiKey) {
        console.error('Google Maps API key not found');
        return;
      }
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=mr`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding API request failed');
      }
      
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const addressComponents = result.address_components;
        
        let city = '';
        let state = '';
        let country = '';
        
        addressComponents.forEach((component: any) => {
          if (component.types.includes('locality') || component.types.includes('administrative_area_level_2')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (component.types.includes('country')) {
            country = component.long_name;
          }
        });
        
        setLocation(prev => ({
          ...prev,
          city,
          state,
          country
        }));
      }
    } catch (error) {
      console.error('Error fetching location details:', error);
    }
  };
  
  // Handle search input change
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Show service details
  const showServiceDetails = (service: AgriService) => {
    setSelectedService(service);
  };
  
  // Close service details
  const closeServiceDetails = () => {
    setSelectedService(null);
  };
  
  // Render service card
  const renderServiceCard = (service: AgriService) => {
    return (
      <div 
        key={service.id}
        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => showServiceDetails(service)}
      >
        <div className={`h-2 ${getServiceTypeColor(service.type)}`}></div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
            <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">
              {service.distance} किमी
            </span>
          </div>
          
          <div className="flex items-center mb-2">
            <span className={`w-2 h-2 rounded-full ${service.openNow ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
            <span className="text-sm text-gray-600">{service.openNow ? 'आता उघडे' : 'बंद'}</span>
            {service.hours && <span className="text-sm text-gray-500 ml-2">({service.hours})</span>}
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{service.address}</p>
          
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor(service.rating) ? 'text-yellow-400' : 'text-gray-300'}`} 
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-1 text-sm text-gray-600">{service.rating}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-2">
            {service.type === 'veterinary' && service.emergencyService && (
              <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">आपत्कालीन सेवा</span>
            )}
            {service.governmentAffiliated && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">सरकारी</span>
            )}
            {service.verificationStatus === 'verified' && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">सत्यापित</span>
            )}
          </div>
          
          <button 
            className="w-full mt-2 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            अधिक माहिती
          </button>
        </div>
      </div>
    );
  };
  
  // Get color for service type
  const getServiceTypeColor = (type: string): string => {
    switch (type) {
      case 'veterinary':
        return 'bg-red-500';
      case 'agri-supply':
        return 'bg-green-500';
      case 'advisory':
        return 'bg-blue-500';
      case 'diagnostic':
        return 'bg-purple-500';
      case 'equipment':
        return 'bg-yellow-500';
      case 'financial':
        return 'bg-indigo-500';
      default:
        return 'bg-gray-500';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header language="mr" setLanguage={() => {}} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
          <div className="bg-green-600 text-white p-6">
            <h1 className="text-2xl font-bold mb-2">शेती सेवा शोधक</h1>
            <p className="text-green-100">तुमच्या जवळील कृषी सेवा शोधा (20 किमी अंतरात)</p>
          </div>
          
          {/* Location and Weather Information */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Location Information */}
              <div className="lg:col-span-1">
                <h2 className="text-lg font-semibold mb-4">तुमचे वर्तमान स्थान</h2>
                
                {location.loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2 text-gray-600">स्थान शोधत आहे...</span>
                  </div>
                ) : location.error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    <p>{location.error}</p>
                    <button 
                      onClick={getCurrentLocation}
                      className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
                    >
                      पुन्हा प्रयत्न करा
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-gray-700"><span className="font-medium">तुमचे गाव/शहर:</span> {location.city || 'अज्ञात'}</p>
                    <p className="text-gray-700"><span className="font-medium">राज्य:</span> {location.state || 'अज्ञात'}</p>
                    {location.country && <p className="text-gray-700"><span className="font-medium">देश:</span> {location.country}</p>}
                    
                    <div className="mt-4">
                      <h3 className="text-md font-medium mb-2">स्थान माहिती</h3>
                      <p className="text-gray-700"><span className="font-medium">अक्षांश (Latitude):</span> {location.latitude.toFixed(6)}</p>
                      <p className="text-gray-700"><span className="font-medium">रेखांश (Longitude):</span> {location.longitude.toFixed(6)}</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Weather Information */}
              <div className="lg:col-span-1">
                <h2 className="text-lg font-semibold mb-4">स्थानिक हवामान</h2>
                
                {weather.loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-2 text-gray-600">हवामान माहिती लोड होत आहे...</span>
                  </div>
                ) : weather.error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    <p>{weather.error}</p>
                  </div>
                ) : (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-blue-800">{weather.temperature}</h3>
                        <p className="text-blue-600">{weather.condition}</p>
                      </div>
                    </div>
                    <p className="text-gray-700 font-medium">आजचे हवामान</p>
                  </div>
                )}
              </div>
              
              {/* Crop Recommendations */}
              <div className="lg:col-span-1">
                <h2 className="text-lg font-semibold mb-4">तुमच्या स्थानासाठी शिफारसी</h2>
                
                {cropRecommendations.loading ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <span className="ml-2 text-gray-600">शिफारसी लोड होत आहेत...</span>
                  </div>
                ) : cropRecommendations.error ? (
                  <div className="bg-red-50 text-red-600 p-4 rounded-md">
                    <p>{cropRecommendations.error}</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {cropRecommendations.alerts.map((alert, index) => (
                      <div key={index} className="bg-yellow-50 p-3 rounded-lg border-l-4 border-yellow-500">
                        <h3 className="font-medium text-yellow-800">{alert}</h3>
                        <p className="text-gray-700 text-sm">{cropRecommendations.management[index]}</p>
                      </div>
                    ))}
                    
                    <div className="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                      <h3 className="font-medium text-green-800">योग्य पिके</h3>
                      <p className="text-gray-700 text-sm">
                        या हंगामासाठी योग्य असलेले {cropRecommendations.crops.join(', ')} लागवड करण्याचा विचार करा.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="सेवा शोधा..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
              
              <div className="flex gap-2">
                <select
                  className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  value={filters.serviceType}
                  onChange={(e) => handleFilterChange('serviceType', e.target.value)}
                >
                  <option value="all">सर्व प्रकार</option>
                  <option value="veterinary">पशुवैद्यक</option>
                  <option value="agri-supply">कृषि दुकाने</option>
                  <option value="advisory">सल्ला सेवा</option>
                  <option value="diagnostic">निदान सेवा</option>
                  <option value="equipment">उपकरणे</option>
                  <option value="financial">आर्थिक सेवा</option>
                </select>
                
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={() => {
                    // Toggle advanced filters
                  }}
                >
                  फिल्टर
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                className={`px-3 py-1 rounded-full text-sm ${filters.openNow ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => handleFilterChange('openNow', !filters.openNow)}
              >
                आता उघडे
              </button>
              
              <button
                className={`px-3 py-1 rounded-full text-sm ${filters.hasEmergencyService ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => handleFilterChange('hasEmergencyService', !filters.hasEmergencyService)}
              >
                आपत्कालीन सेवा
              </button>
              
              <button
                className={`px-3 py-1 rounded-full text-sm ${filters.governmentAffiliated ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => handleFilterChange('governmentAffiliated', !filters.governmentAffiliated)}
              >
                सरकारी
              </button>
              
              <button
                className={`px-3 py-1 rounded-full text-sm ${filters.verifiedOnly ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => handleFilterChange('verifiedOnly', !filters.verifiedOnly)}
              >
                सत्यापित
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">अंतर:</span>
                <select
                  className="px-2 py-1 border border-gray-300 rounded-md text-sm"
                  value={filters.maxDistance}
                  onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
                >
                  <option value="5">5 किमी</option>
                  <option value="10">10 किमी</option>
                  <option value="20">20 किमी</option>
                  <option value="50">50 किमी</option>
                </select>
              </div>
            </div>
        
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                {showMap ? 'नकाशा दृश्य' : 'यादी दृश्य'}
              </h2>
              <button
                onClick={() => setShowMap(!showMap)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                {showMap ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                    यादी दाखवा
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                    नकाशा दाखवा
                  </>
                )}
              </button>
            </div>
            
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                <span className="ml-3 text-lg text-gray-600">लोड होत आहे...</span>
              </div>
            ) : filteredServices.length > 0 ? (
              showMap ? (
                <div className="mb-6">
                  {location.latitude && location.longitude ? (
                    <ServicesMap 
                      latitude={location.latitude} 
                      longitude={location.longitude} 
                      services={filteredServices.map(service => ({
                        id: service.id,
                        name: service.name,
                        type: service.type,
                        address: service.address,
                        distance: service.distance
                      }))}
                      onServiceSelect={(serviceId) => {
                        const service = services.find(s => s.id === serviceId);
                        if (service) {
                          setSelectedService(service);
                        }
                      }}
                    />
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
                      <p className="text-yellow-700 text-lg">स्थान माहिती उपलब्ध नाही</p>
                      <p className="text-yellow-600 mt-2">नकाशा दाखवण्यासाठी स्थान परवानगी द्या</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map(service => renderServiceCard(service))}
                </div>
              )
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6 text-center">
                <p className="text-yellow-700 text-lg">कोणत्याही सेवा आढळल्या नाहीत</p>
                <p className="text-yellow-600 mt-2">कृपया तुमचे फिल्टर बदला किंवा अधिक अंतरासाठी शोधा</p>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className={`h-2 ${getServiceTypeColor(selectedService.type)}`}></div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">{selectedService.name}</h2>
                <button 
                  onClick={closeServiceDetails}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="flex items-center mb-4">
                <span className={`w-3 h-3 rounded-full ${selectedService.openNow ? 'bg-green-500' : 'bg-red-500'} mr-2`}></span>
                <span className="text-gray-700">{selectedService.openNow ? 'आता उघडे' : 'बंद'}</span>
                {selectedService.hours && <span className="text-gray-500 ml-2">({selectedService.hours})</span>}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">संपर्क माहिती</h3>
                  <p className="text-gray-700 mb-2"><span className="font-medium">पत्ता:</span> {selectedService.address}</p>
                  <p className="text-gray-700 mb-2"><span className="font-medium">फोन:</span> {selectedService.phone}</p>
                  <p className="text-gray-700 mb-2"><span className="font-medium">अंतर:</span> {selectedService.distance} किमी</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">सेवा माहिती</h3>
                  <p className="text-gray-700 mb-2"><span className="font-medium">प्रकार:</span> {selectedService.type}</p>
                  {selectedService.subType && <p className="text-gray-700 mb-2"><span className="font-medium">उप-प्रकार:</span> {selectedService.subType}</p>}
                  <p className="text-gray-700 mb-2"><span className="font-medium">रेटिंग:</span> {selectedService.rating}/5</p>
                  {selectedService.lastUpdated && <p className="text-gray-700 mb-2"><span className="font-medium">अद्यतनित:</span> {selectedService.lastUpdated}</p>}
                </div>
              </div>
              
              {(selectedService.services && selectedService.services.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">उपलब्ध सेवा</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.services.map((service, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {(selectedService.inventory && selectedService.inventory.length > 0) && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">उपलब्ध साहित्य</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedService.inventory.map((item, index) => (
                      <span key={index} className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedService.emergencyService && (
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full">
                    आपत्कालीन सेवा उपलब्ध
                  </span>
                )}
                {selectedService.governmentAffiliated && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                    सरकारी संलग्न
                  </span>
                )}
                {selectedService.verificationStatus === 'verified' && (
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    सत्यापित
                  </span>
                )}
                {selectedService.offersLoans && (
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded-full">
                    कर्ज उपलब्ध
                  </span>
                )}
                {selectedService.acceptsInsurance && (
                  <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                    विमा स्वीकारतात
                  </span>
                )}
              </div>
              
              <div className="flex gap-4 mt-6">
                <a 
                  href={`tel:${selectedService.phone}`}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex-1 text-center"
                >
                  कॉल करा
                </a>
                <button 
                  onClick={() => {
                    setShowMap(true);
                    closeServiceDetails();
                  }}
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex-1"
                >
                  नकाशावर पहा
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <Footer language="mr" />
    </div>
  );
};

export default AgriServicesLocator;