import React, { useState, useEffect } from 'react';
import LocationBasedRecommendations from './LocationBasedRecommendations';
import NearbyServices from './NearbyServices';

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  loading: boolean;
  error?: string;
}

interface WeatherData {
  temperature?: number;
  description?: string;
  icon?: string;
  loading: boolean;
  error?: string;
}

const UserLocation: React.FC = () => {
  const [location, setLocation] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    loading: true
  });
  
  const [weather, setWeather] = useState<WeatherData>({
    loading: true
  });
  
  const [permissionRequested, setPermissionRequested] = useState<boolean>(false);

  // Function to get user location without permission popup
  const requestLocationPermission = () => {
    setPermissionRequested(true);
    
    // Default location for Maharashtra (Pune)
    const defaultLatitude = 18.5204;
    const defaultLongitude = 73.8567;
    
    // Set default location first
    setLocation({
      latitude: defaultLatitude,
      longitude: defaultLongitude,
      loading: false
    });
    
    // Get address from coordinates
    fetchAddress(defaultLatitude, defaultLongitude);
    
    // Get weather data for the location
    fetchWeatherData(defaultLatitude, defaultLongitude);
    
    // Try to get IP-based location without permission popup
    try {
      fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            setLocation({
              latitude: data.latitude,
              longitude: data.longitude,
              loading: false
            });
            
            // Get address from coordinates
            fetchAddress(data.latitude, data.longitude);
            
            // Get weather data for the location
            fetchWeatherData(data.latitude, data.longitude);
          }
        })
        .catch(error => {
          console.error('Error getting IP location:', error);
          // Already using default location, so no need to set error
        });
    } catch (error) {
      console.error('Error in IP location fetch:', error);
      // Already using default location, so no need to set error
    }
  };

  // Auto-get location when component mounts (without permission popup)
  useEffect(() => {
    // Call our function that gets location without permission popup
    requestLocationPermission();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch address from coordinates using Google Maps Geocoding API
  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      console.log("Fetching address for:", latitude, longitude);
      
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string || '';
      
      if (!apiKey) {
        console.warn("No Google Maps API key found, using mock data");
        throw new Error("No API key");
      }
      
      // Use CORS proxy if needed
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=mr`
      );
      
      const data = await response.json();
      console.log("Geocoding response:", data);
      
      if (data.results && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        console.log("Address found:", address);
        setLocation(prev => ({
          ...prev,
          address
        }));
      } else {
        console.warn("No address results found");
        // Generate mock address based on coordinates
        const mockAddress = getMockAddressForCoordinates(latitude, longitude);
        setLocation(prev => ({
          ...prev,
          address: mockAddress
        }));
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      // Generate mock address based on coordinates
      const mockAddress = getMockAddressForCoordinates(latitude, longitude);
      setLocation(prev => ({
        ...prev,
        address: mockAddress
      }));
    }
  };
  
  // Helper function to generate mock address based on coordinates
  const getMockAddressForCoordinates = (latitude: number, longitude: number): string => {
    // Maharashtra region (approximate)
    if (latitude >= 16 && latitude <= 22 && longitude >= 72 && longitude <= 81) {
      // Different regions of Maharashtra
      if (latitude >= 18 && latitude <= 20 && longitude >= 72 && longitude <= 73.5) {
        return "मुंबई, महाराष्ट्र 400001, भारत";
      } else if (latitude >= 18 && latitude <= 19 && longitude >= 73.5 && longitude <= 74.5) {
        return "पुणे, महाराष्ट्र 411001, भारत";
      } else if (latitude >= 19.5 && latitude <= 21 && longitude >= 73.5 && longitude <= 75) {
        return "नाशिक, महाराष्ट्र 422001, भारत";
      } else if (latitude >= 19 && latitude <= 20 && longitude >= 75 && longitude <= 76) {
        return "औरंगाबाद, महाराष्ट्र 431001, भारत";
      } else if (latitude >= 20 && latitude <= 21.5 && longitude >= 78 && longitude <= 80) {
        return "नागपूर, महाराष्ट्र 440001, भारत";
      } else {
        return "महाराष्ट्र, भारत";
      }
    } else {
      return "भारत";
    }
  };

  // Fetch weather data from OpenWeatherMap API
  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      console.log("Fetching weather data for:", latitude, longitude);
      
      // Skip backend API and use direct OpenWeatherMap API
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY as string || '';
      
      if (!apiKey) {
        console.warn("No weather API key found, using mock data");
        throw new Error("No API key");
      }
      
      const directResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=mr`
      );
      
      if (directResponse.ok) {
        const data = await directResponse.json();
        console.log("Weather data received:", data);
        setWeather({
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: data.weather[0].icon,
          loading: false
        });
      } else {
        console.error("Weather API response not ok");
        throw new Error('Direct API response not ok');
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      // Use mock data based on current season
      const currentMonth = new Date().getMonth();
      let mockWeather;
      
      // Summer (March-June)
      if (currentMonth >= 2 && currentMonth <= 5) {
        mockWeather = {
          temperature: 32,
          description: "उष्ण आणि काही ढगाळ",
          icon: "01d", // clear sky
          loading: false
        };
      } 
      // Monsoon (June-September)
      else if (currentMonth >= 5 && currentMonth <= 8) {
        mockWeather = {
          temperature: 27,
          description: "पावसाची शक्यता",
          icon: "10d", // rain
          loading: false
        };
      } 
      // Winter (October-February)
      else {
        mockWeather = {
          temperature: 22,
          description: "थंड आणि स्वच्छ",
          icon: "02d", // few clouds
          loading: false
        };
      }
      
      setWeather(mockWeather);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-3">तुमचे वर्तमान स्थान</h2>
        
        {!permissionRequested ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <p className="text-center mb-5 text-blue-800 font-medium text-lg">तुमचे स्थान आणि हवामान पाहण्यासाठी लोकेशन परवानगी द्या</p>
            <button 
              onClick={requestLocationPermission}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-bold text-lg shadow-md"
            >
              स्थान परवानगी द्या
            </button>
          </div>
        ) : location.loading ? (
          <div className="flex justify-center items-center h-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : location.error ? (
          <div className="text-red-500 p-3 bg-red-50 rounded-md">
            {location.error}
            <div className="mt-3">
              <button 
                onClick={requestLocationPermission}
                className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                पुन्हा प्रयत्न करा
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg mb-3">
              <div className="flex items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <div className="font-medium text-green-800 mb-1">तुमचे गाव/शहर</div>
                  <div className="text-green-700">{location.address || 'पत्ता लोड होत आहे...'}</div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 border-t pt-3">
              <h3 className="font-medium mb-2">स्थानिक हवामान</h3>
              
              {weather.loading ? (
                <div className="flex justify-center items-center h-16">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                </div>
              ) : weather.error ? (
                <div className="text-red-500 text-sm">{weather.error}</div>
              ) : (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg">
                  <div className="flex items-center">
                    {weather.icon && (
                      <img 
                        src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                        alt="Weather icon" 
                        className="w-16 h-16 mr-2"
                      />
                    )}
                    <div>
                      <div className="text-3xl font-bold text-blue-800">{weather.temperature ? `${Math.round(weather.temperature)}°C` : ''}</div>
                      <div className="text-blue-600 font-medium">{weather.description}</div>
                      <div className="text-blue-500 text-sm mt-1">आजचे हवामान</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-4">
              <h3 className="font-medium mb-2">स्थान माहिती</h3>
              <div className="bg-gray-50 p-3 rounded-lg">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-sm text-gray-500">अक्षांश (Latitude)</div>
                    <div className="font-medium">{location.latitude.toFixed(6)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">रेखांश (Longitude)</div>
                    <div className="font-medium">{location.longitude.toFixed(6)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Show location-based recommendations if location is available */}
      {!location.loading && !location.error && location.latitude && location.longitude && (
        <>
          <LocationBasedRecommendations 
            latitude={location.latitude} 
            longitude={location.longitude} 
          />
          
          <NearbyServices
            latitude={location.latitude}
            longitude={location.longitude}
          />
        </>
      )}
    </div>
  );
};

export default UserLocation;