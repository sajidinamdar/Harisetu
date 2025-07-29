import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ServicesMap from '../components/ServicesMap';

// Types for our services
interface AgriService {
  id: string;
  name: string;
  type: ServiceType;
  subType?: string;
  address: string;
  phone: string;
  distance: number;
  rating: number;
  openNow: boolean;
  hours?: string;
  services?: string[];
  specialties?: string[];
  hasEmergencyService?: boolean;
  hasMobileService?: boolean;
  inventory?: string[];
  priceRange?: string;
  governmentAffiliated?: boolean;
  acceptsInsurance?: boolean;
  offersLoans?: boolean;
  languages?: string[];
  verificationStatus: 'verified' | 'pending' | 'unverified';
  lastUpdated: string;
}

type ServiceType = 
  | 'veterinary' 
  | 'agri-supply' 
  | 'diagnostic' 
  | 'equipment' 
  | 'financial' 
  | 'advisory';

interface FilterOptions {
  serviceType: ServiceType | 'all';
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
  
  // State for language
  const [language, setLanguage] = useState('mr');
  
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
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
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
  
  // Load services from API or mock data
  const loadServices = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call to fetch services based on location
      // For now, we'll use mock data with calculated distances
      
      // We'll fetch real service coordinates from the API
  // This will be an empty object until we get real data
  const serviceCoordinates: Record<string, { lat: number, lng: number }> = {};
      
      // In a real app, we would fetch services from an API
      // For now, we'll use mock data
      const mockServices: AgriService[] = [
        // Veterinary Services
        {
          id: 'vet1',
          name: 'डॉ. पाटील पशुवैद्यकीय क्लिनिक',
          type: 'veterinary',
          subType: 'clinic',
          address: 'गारखेडा परिसर, अहमदनगर',
          phone: '9876543212',
          distance: 4.1,
          rating: 4.8,
          openNow: true,
          hours: 'सकाळी 9 - रात्री 8',
          services: ['vaccination', 'surgery', 'consultation'],
          specialties: ['dairy', 'poultry'],
          hasEmergencyService: true,
          hasMobileService: true,
          verificationStatus: 'verified',
          lastUpdated: '2023-10-15'
        },
        {
          id: 'vet2',
          name: 'डॉ. शर्मा पशुवैद्यकीय हॉस्पिटल',
          type: 'veterinary',
          subType: 'hospital',
          address: 'सिडको, अहमदनगर',
          phone: '9876543217',
          distance: 15.8,
          rating: 4.7,
          openNow: true,
          hours: '24 तास',
          services: ['vaccination', 'surgery', 'consultation', 'laboratory'],
          specialties: ['dairy', 'goat', 'buffalo'],
          hasEmergencyService: true,
          hasMobileService: false,
          verificationStatus: 'verified',
          lastUpdated: '2023-11-20'
        },
        {
          id: 'vet3',
          name: 'मोबाईल पशुवैद्यकीय सेवा',
          type: 'veterinary',
          subType: 'mobile',
          address: 'अहमदनगर जिल्हा',
          phone: '9876543218',
          distance: 0,
          rating: 4.5,
          openNow: false,
          hours: 'सकाळी 8 - संध्याकाळी 6',
          services: ['vaccination', 'basic-treatment', 'consultation'],
          specialties: ['dairy', 'poultry', 'goat'],
          hasEmergencyService: true,
          hasMobileService: true,
          governmentAffiliated: true,
          verificationStatus: 'verified',
          lastUpdated: '2023-12-05'
        },
        
        // Agri-Supply Shops
        {
          id: 'shop1',
          name: 'कृषि सेवा केंद्र',
          type: 'agri-supply',
          subType: 'general',
          address: 'मेन रोड, शिवाजी नगर, अहमदनगर',
          phone: '9876543210',
          distance: 3.2,
          rating: 4.5,
          openNow: true,
          hours: 'सकाळी 8 - संध्याकाळी 8',
          inventory: ['seeds', 'fertilizers', 'pesticides', 'tools'],
          priceRange: 'medium',
          verificationStatus: 'verified',
          lastUpdated: '2023-09-10'
        },
        {
          id: 'shop2',
          name: 'शेतकरी कृषि केंद्र',
          type: 'agri-supply',
          subType: 'general',
          address: 'MIDC एरिया, अहमदनगर',
          phone: '9876543211',
          distance: 5.7,
          rating: 4.2,
          openNow: true,
          hours: 'सकाळी 9 - संध्याकाळी 7',
          inventory: ['seeds', 'fertilizers', 'pesticides', 'tools', 'irrigation'],
          priceRange: 'low',
          verificationStatus: 'verified',
          lastUpdated: '2023-08-25'
        },
        {
          id: 'shop3',
          name: 'ऑर्गॅनिक फार्म इनपुट्स',
          type: 'agri-supply',
          subType: 'organic',
          address: 'जालना रोड, अहमदनगर',
          phone: '9876543219',
          distance: 7.8,
          rating: 4.6,
          openNow: false,
          hours: 'सकाळी 10 - संध्याकाळी 6 (सोम-शनि)',
          inventory: ['organic-seeds', 'bio-fertilizers', 'bio-pesticides', 'organic-certification'],
          priceRange: 'high',
          verificationStatus: 'verified',
          lastUpdated: '2023-11-05'
        },
        
        // Diagnostic Services
        {
          id: 'diag1',
          name: 'मृदा परीक्षण प्रयोगशाळा',
          type: 'diagnostic',
          subType: 'soil-testing',
          address: 'पैठण रोड, अहमदनगर',
          phone: '9876543220',
          distance: 8.9,
          rating: 4.3,
          openNow: true,
          hours: 'सकाळी 9 - संध्याकाळी 5 (सोम-शुक्र)',
          services: ['soil-testing', 'water-testing', 'fertilizer-recommendation'],
          governmentAffiliated: true,
          verificationStatus: 'verified',
          lastUpdated: '2023-07-20'
        },
        
        // Advisory Services
        {
          id: 'adv1',
          name: 'कृषि विज्ञान केंद्र',
          type: 'advisory',
          subType: 'government',
          address: 'WALMI कॅम्पस, अहमदनगर',
          phone: '9876543221',
          distance: 12.3,
          rating: 4.7,
          openNow: true,
          hours: 'सकाळी 10 - संध्याकाळी 5 (सोम-शुक्र)',
          services: ['training', 'demonstration', 'advisory', 'soil-testing'],
          governmentAffiliated: true,
          verificationStatus: 'verified',
          lastUpdated: '2023-06-15'
        },
        
        // Equipment Services
        {
          id: 'equip1',
          name: 'कृषि यंत्र भाडे केंद्र',
          type: 'equipment',
          subType: 'rental',
          address: 'बीड बायपास रोड, अहमदनगर',
          phone: '9876543222',
          distance: 10.5,
          rating: 4.1,
          openNow: true,
          hours: 'सकाळी 8 - संध्याकाळी 7',
          inventory: ['tractor', 'harvester', 'thresher', 'sprayer'],
          verificationStatus: 'verified',
          lastUpdated: '2023-09-30'
        },
        {
          id: 'equip2',
          name: 'शेतकरी ड्रोन सेवा',
          type: 'equipment',
          subType: 'specialized',
          address: 'वाळूज MIDC, अहमदनगर',
          phone: '9876543223',
          distance: 13.2,
          rating: 4.4,
          openNow: false,
          hours: 'सकाळी 9 - संध्याकाळी 6 (सोम-शनि)',
          services: ['drone-spraying', 'crop-monitoring', 'field-mapping'],
          verificationStatus: 'verified',
          lastUpdated: '2023-10-10'
        },
        {
          id: 'equip3',
          name: 'शेतमाल वाहतूक सेवा',
          type: 'equipment',
          subType: 'logistics',
          address: 'सिडको, अहमदनगर',
          phone: '9876543224',
          distance: 14.7,
          rating: 4.0,
          openNow: true,
          hours: 'सकाळी 7 - रात्री 9',
          services: ['transportation', 'cold-storage', 'warehousing'],
          verificationStatus: 'verified',
          lastUpdated: '2023-08-15'
        },
        
        // Financial Services
        {
          id: 'fin1',
          name: 'महाराष्ट्र ग्रामीण बँक',
          type: 'financial',
          subType: 'bank',
          address: 'गारखेडा परिसर, अहमदनगर',
          phone: '9876543225',
          distance: 4.5,
          rating: 4.2,
          openNow: true,
          hours: 'सकाळी 10 - संध्याकाळी 4 (सोम-शुक्र)',
          services: ['loans', 'insurance', 'savings', 'kisan-credit-card'],
          governmentAffiliated: true,
          acceptsInsurance: true,
          offersLoans: true,
          verificationStatus: 'verified',
          lastUpdated: '2023-07-10'
        },
        {
          id: 'fin2',
          name: 'पीएम-किसान सेवा केंद्र',
          type: 'financial',
          subType: 'government-scheme',
          address: 'जालना रोड, अहमदनगर',
          phone: '9876543226',
          distance: 7.9,
          rating: 4.3,
          openNow: true,
          hours: 'सकाळी 10 - संध्याकाळी 5 (सोम-शुक्र)',
          services: ['pm-kisan', 'crop-insurance', 'subsidy-application'],
          governmentAffiliated: true,
          verificationStatus: 'verified',
          lastUpdated: '2023-11-15'
        }
      ];
      
      // Calculate actual distances based on user's location
      const servicesWithDistances = mockServices.map(service => {
        // If we have real coordinates for this service, calculate the actual distance
        if (serviceCoordinates[service.id]) {
          const { lat, lng } = serviceCoordinates[service.id];
          const distance = calculateDistance(
            location.latitude,
            location.longitude,
            lat,
            lng
          );
          return { ...service, distance };
        }
        // Otherwise, use the mock distance
        return service;
      });
      
      setServices(servicesWithDistances);
      setLoading(false);
    } catch (error) {
      console.error('Error loading services:', error);
      setLoading(false);
    }
  };
  
  // Filter services based on user preferences
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
    
    // Filter by distance
    filtered = filtered.filter(service => service.distance <= filters.maxDistance);
    
    // Filter by emergency service
    if (filters.hasEmergencyService) {
      filtered = filtered.filter(service => service.hasEmergencyService);
    }
    
    // Filter by government affiliation
    if (filters.governmentAffiliated) {
      filtered = filtered.filter(service => service.governmentAffiliated);
    }
    
    // Filter by verification status
    if (filters.verifiedOnly) {
      filtered = filtered.filter(service => service.verificationStatus === 'verified');
    }
    
    // Filter by specialties (for veterinary services)
    if (filters.specialties.length > 0) {
      filtered = filtered.filter(service => 
        service.specialties && 
        filters.specialties.some(specialty => service.specialties?.includes(specialty))
      );
    }
    
    // Filter by inventory (for agri-supply shops)
    if (filters.inventory.length > 0) {
      filtered = filtered.filter(service => 
        service.inventory && 
        filters.inventory.some(item => service.inventory?.includes(item))
      );
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
    
    // Sort by distance
    filtered.sort((a, b) => a.distance - b.distance);
    
    setFilteredServices(filtered);
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName: keyof FilterOptions, value: any) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Handle service selection
  const handleServiceSelect = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      setSelectedService(service);
    }
  };
  
  // Handle view toggle
  const toggleView = () => {
    setShowMap(!showMap);
  };
  
  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  
  // Handle navigation to service details
  const navigateToServiceDetails = (serviceId: string) => {
    navigate(`/service/${serviceId}`);
  };
  
  // Render service type icon
  const renderServiceTypeIcon = (type: ServiceType) => {
    switch (type) {
      case 'veterinary':
        return '🐄';
      case 'agri-supply':
        return '🌱';
      case 'diagnostic':
        return '🔬';
      case 'equipment':
        return '🚜';
      case 'financial':
        return '💰';
      case 'advisory':
        return '📋';
      default:
        return '🌾';
    }
  };
  
  // Render service type in Marathi
  const renderServiceTypeMarathi = (type: ServiceType, subType?: string) => {
    switch (type) {
      case 'veterinary':
        return subType === 'mobile' ? 'पशुवैद्यकीय - mobile' : 
               subType === 'hospital' ? 'पशुवैद्यकीय - hospital' : 
               'पशुवैद्यकीय - clinic';
      case 'agri-supply':
        return subType === 'organic' ? 'कृषि दुकान - organic' : 'कृषि दुकान - general';
      case 'diagnostic':
        return 'निदान सेवा - soil-testing';
      case 'equipment':
        return subType === 'specialized' ? 'यंत्र व वाहतूक - specialized' : 
               subType === 'logistics' ? 'यंत्र व वाहतूक - logistics' : 
               'यंत्र व वाहतूक - rental';
      case 'financial':
        return subType === 'government-scheme' ? 'आर्थिक सेवा - government-scheme' : 'आर्थिक सेवा - bank';
      case 'advisory':
        return 'सल्लागार सेवा - government';
      default:
        return 'कृषि सेवा';
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header language={language} setLanguage={setLanguage} />
      
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-green-800 mb-2">शेती सेवा शोधक</h1>
        <p className="text-lg text-green-700 mb-6">तुमच्या जवळील कृषी सेवा शोधा ({filters.maxDistance} किमी अंतरात)</p>
        
        {/* Location Information */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">तुमचे वर्तमान स्थान</h2>
          
          {location.loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : location.error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              <p>{location.error}</p>
              <button 
                onClick={getCurrentLocation}
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                पुन्हा प्रयत्न करा
              </button>
            </div>
          ) : (
            <div>
              <div className="mb-4">
                <p className="text-gray-600">तुमचे गाव/शहर: <span className="font-semibold">{location.city || 'अज्ञात'}</span></p>
                <p className="text-gray-600">राज्य: <span className="font-semibold">{location.state || 'अज्ञात'}</span></p>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-md mb-4">
                <h3 className="font-medium text-gray-700 mb-1">स्थान माहिती</h3>
                <p className="text-gray-600">अक्षांश (Latitude): <span className="font-mono">{location.latitude.toFixed(6)}</span></p>
                <p className="text-gray-600">रेखांश (Longitude): <span className="font-mono">{location.longitude.toFixed(6)}</span></p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-md">
                <h3 className="font-medium text-blue-700 mb-1">स्थानिक हवामान</h3>
                {weather.loading ? (
                  <div className="flex justify-center items-center h-10">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
                  </div>
                ) : weather.error ? (
                  <p className="text-red-600">{weather.error}</p>
                ) : (
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">🌤️</span>
                    <div>
                      <p className="text-blue-800 font-medium">{weather.temperature}</p>
                      <p className="text-blue-600 text-sm">{weather.condition}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        {/* Crop Recommendations */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-3">तुमच्या स्थानासाठी शिफारसी</h2>
          
          {cropRecommendations.loading ? (
            <div className="flex justify-center items-center h-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
            </div>
          ) : cropRecommendations.error ? (
            <p className="text-gray-600">{cropRecommendations.error}</p>
          ) : (
            <div>
              {/* Crop recommendations content would go here */}
            </div>
          )}
        </div>
        
        {/* Service Filters */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">सेवा फिल्टर</h2>
            
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <button 
                onClick={() => handleFilterChange('openNow', !filters.openNow)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.openNow 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                आता उघडे
              </button>
              
              <button 
                onClick={() => handleFilterChange('hasEmergencyService', !filters.hasEmergencyService)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.hasEmergencyService 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                आपत्कालीन
              </button>
              
              <button 
                onClick={() => handleFilterChange('governmentAffiliated', !filters.governmentAffiliated)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filters.governmentAffiliated 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                सरकारी
              </button>
            </div>
          </div>
          
          {/* Service Type Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => handleFilterChange('serviceType', 'all')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.serviceType === 'all' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              सर्व सेवा
            </button>
            
            <button 
              onClick={() => handleFilterChange('serviceType', 'veterinary')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.serviceType === 'veterinary' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              पशुवैद्यकीय
            </button>
            
            <button 
              onClick={() => handleFilterChange('serviceType', 'agri-supply')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.serviceType === 'agri-supply' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              कृषि दुकाने
            </button>
            
            <button 
              onClick={() => handleFilterChange('serviceType', 'diagnostic')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.serviceType === 'diagnostic' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              निदान सेवा
            </button>
            
            <button 
              onClick={() => handleFilterChange('serviceType', 'equipment')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.serviceType === 'equipment' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              यंत्र व वाहतूक
            </button>
            
            <button 
              onClick={() => handleFilterChange('serviceType', 'financial')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.serviceType === 'financial' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              आर्थिक सेवा
            </button>
            
            <button 
              onClick={() => handleFilterChange('serviceType', 'advisory')}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.serviceType === 'advisory' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              सल्लागार सेवा
            </button>
          </div>
          
          {/* Distance Slider */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              अंतर: {filters.maxDistance} किमी
            </label>
            <input 
              type="range" 
              min="1" 
              max="25" 
              value={filters.maxDistance}
              onChange={(e) => handleFilterChange('maxDistance', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 किमी</span>
              <span>25 किमी</span>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex justify-between items-center">
            <div className="flex space-x-2">
              <button 
                onClick={() => setShowMap(false)}
                className={`px-3 py-1 rounded-md text-sm ${
                  !showMap 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                यादी दृश्य
              </button>
              
              <button 
                onClick={() => setShowMap(true)}
                className={`px-3 py-1 rounded-md text-sm ${
                  showMap 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                नकाशा दाखवा
              </button>
            </div>
            
            <div className="relative">
              <input 
                type="text"
                placeholder="शोधा..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm w-32 sm:w-auto"
              />
              {searchQuery && (
                <button 
                  onClick={() => handleSearch('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </div>
        
        {/* Services List or Map */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {showMap ? (
                <ServicesMap 
                  latitude={location.latitude}
                  longitude={location.longitude}
                  services={filteredServices}
                  onServiceSelect={handleServiceSelect}
                />
              ) : (
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    जवळील सेवा ({filteredServices.length})
                  </h2>
                  
                  {filteredServices.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">कोणत्याही सेवा सापडल्या नाहीत. कृपया फिल्टर बदला.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {filteredServices.map(service => (
                        <div 
                          key={service.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                          onClick={() => navigateToServiceDetails(service.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg text-gray-800">{service.name}</h3>
                              <p className="text-sm text-gray-600">{renderServiceTypeMarathi(service.type, service.subType)}</p>
                              <div className="flex items-center mt-1">
                                <span className="text-yellow-500">{service.rating}</span>
                                <span className="text-yellow-500 ml-1">★</span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">{service.distance} किमी</p>
                              <p className={`text-sm ${service.openNow ? 'text-green-600' : 'text-red-600'}`}>
                                {service.openNow ? 'आता उघडे' : 'बंद'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="mt-2">
                            <p className="text-sm text-gray-600">{service.address}</p>
                            <p className="text-sm text-gray-600">{service.phone}</p>
                          </div>
                          
                          {service.services && service.services.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                              {service.services.slice(0, 3).map(s => (
                                <span key={s} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded">
                                  {s}
                                </span>
                              ))}
                              {service.services.length > 3 && (
                                <span className="bg-gray-50 text-gray-700 text-xs px-2 py-1 rounded">
                                  +{service.services.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      
      <Footer language={language} />
    </div>
  );
};

export default AgriServicesLocator;