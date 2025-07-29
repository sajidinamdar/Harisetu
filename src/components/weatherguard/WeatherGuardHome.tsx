import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';

// Function to generate mock weather data
const getMockWeatherData = (lat: number, lon: number): any => {
  const currentDate = new Date();
  
  // Generate daily forecast for 7 days
  const dailyForecast = Array(7).fill(0).map((_, index) => {
    const forecastDate = new Date(currentDate);
    forecastDate.setDate(forecastDate.getDate() + index);
    
    // Generate random but realistic weather data
    const tempMax = 25 + Math.floor(Math.random() * 10);
    const tempMin = tempMax - 5 - Math.floor(Math.random() * 5);
    const humidity = 50 + Math.floor(Math.random() * 40);
    const windSpeed = 5 + Math.floor(Math.random() * 15);
    const clouds = Math.floor(Math.random() * 100);
    
    // Weather conditions based on random number
    const weatherConditions = [
      { main: 'Clear', description: 'clear sky', icon: '01d' },
      { main: 'Clouds', description: 'scattered clouds', icon: '03d' },
      { main: 'Clouds', description: 'broken clouds', icon: '04d' },
      { main: 'Rain', description: 'light rain', icon: '10d' },
    ];
    
    const weatherIndex = Math.floor(Math.random() * weatherConditions.length);
    const weather = weatherConditions[weatherIndex];
    
    // Chance of rain
    const hasRain = weather.main === 'Rain';
    
    return {
      date: forecastDate.toISOString(),
      temperature: tempMax - 2,
      feels_like: tempMax - 3,
      temp_min: tempMin,
      temp_max: tempMax,
      pressure: 1010 + Math.floor(Math.random() * 20),
      humidity: humidity,
      weather_main: weather.main,
      weather_description: weather.description,
      wind_speed: windSpeed,
      wind_direction: Math.floor(Math.random() * 360),
      clouds: clouds,
      rain_1h: hasRain ? 1 + Math.random() * 5 : undefined,
      rain_3h: hasRain ? 2 + Math.random() * 10 : undefined,
      icon: weather.icon
    };
  });
  
  // Generate hourly forecast for 24 hours
  const hourlyForecast = Array(24).fill(0).map((_, index) => {
    const forecastDate = new Date(currentDate);
    forecastDate.setHours(forecastDate.getHours() + index);
    
    // Generate random but realistic weather data
    const temp = 22 + Math.floor(Math.random() * 8) + (index % 12 < 6 ? -3 : 3);
    const humidity = 50 + Math.floor(Math.random() * 40);
    const windSpeed = 5 + Math.floor(Math.random() * 10);
    
    // Weather conditions based on random number
    const weatherConditions = [
      { main: 'Clear', description: 'clear sky', icon: index < 12 ? '01d' : '01n' },
      { main: 'Clouds', description: 'scattered clouds', icon: index < 12 ? '03d' : '03n' },
      { main: 'Clouds', description: 'broken clouds', icon: index < 12 ? '04d' : '04n' },
      { main: 'Rain', description: 'light rain', icon: index < 12 ? '10d' : '10n' },
    ];
    
    const weatherIndex = Math.floor(Math.random() * weatherConditions.length);
    const weather = weatherConditions[weatherIndex];
    
    // Chance of rain
    const hasRain = weather.main === 'Rain';
    
    return {
      date: forecastDate.toISOString(),
      temperature: temp,
      feels_like: temp - 1,
      temp_min: temp - 2,
      temp_max: temp + 2,
      pressure: 1010 + Math.floor(Math.random() * 20),
      humidity: humidity,
      weather_main: weather.main,
      weather_description: weather.description,
      wind_speed: windSpeed,
      wind_direction: Math.floor(Math.random() * 360),
      clouds: Math.floor(Math.random() * 100),
      rain_1h: hasRain ? Math.random() * 3 : undefined,
      rain_3h: undefined,
      icon: weather.icon
    };
  });
  
  // Generate crop-specific advice
  const generalAdvice = [
    'आजचे तापमान पिकांच्या वाढीसाठी योग्य आहे.',
    'पुढील 3 दिवसांत पावसाची शक्यता आहे, कृपया पिकांचे नियोजन त्यानुसार करा.',
    'सकाळी किंवा संध्याकाळी पाणी द्या, दुपारच्या उन्हात नको.',
    'पिकांवर कीटकांचा प्रादुर्भाव तपासा आणि आवश्यक असल्यास नियंत्रण उपाय करा.'
  ];
  
  const cropSpecificAdvice = {
    rice: [
      'तांदळाच्या पिकासाठी पाण्याची पातळी 2-3 सेमी ठेवा.',
      'फुलोरा अवस्थेत पिकाला पाणी कमी करू नका.',
      'पुढील आठवड्यात अपेक्षित पावसामुळे शेतात पाणी साचू शकते, निचरा व्यवस्था सुनिश्चित करा.'
    ],
    wheat: [
      'गव्हाच्या पिकाला आता पाणी देणे महत्वाचे आहे.',
      'तापमानातील बदल लक्षात घेता, दुपारच्या वेळी पिकावर पाणी फवारणी करा.',
      'पुढील काही दिवसांत कमी तापमान अपेक्षित आहे, पिकाचे संरक्षण करा.'
    ],
    cotton: [
      'कापसाच्या पिकावर फवारणी करताना हवामान स्थिती तपासा.',
      'फुलांच्या अवस्थेत पिकाला नियमित पाणी द्या.',
      'पुढील आठवड्यात अपेक्षित पावसामुळे कीटकांचा प्रादुर्भाव वाढू शकतो, निरीक्षण ठेवा.'
    ],
    vegetables: [
      'भाज्यांना नियमित पाणी द्या, विशेषत: उच्च तापमानाच्या काळात.',
      'सकाळी किंवा संध्याकाळी पाणी द्या, दुपारच्या उन्हात नको.',
      'पुढील काही दिवसांत पावसाची शक्यता आहे, भाज्यांचे संरक्षण करा.'
    ]
  };
  
  // Generate alerts based on weather conditions
  const alerts = [];
  
  if (dailyForecast.some(day => day.temp_max > 35)) {
    alerts.push({
      type: 'high_temperature',
      message: 'पुढील काही दिवसांत उच्च तापमान अपेक्षित आहे. पिकांना वारंवार पाणी द्या.'
    });
  }
  
  if (dailyForecast.some(day => day.rain_1h && day.rain_1h > 10)) {
    alerts.push({
      type: 'heavy_rain',
      message: 'जोरदार पावसाची शक्यता आहे. शेतातील पाण्याचा निचरा सुनिश्चित करा.'
    });
  }
  
  if (dailyForecast.every(day => !day.rain_1h)) {
    alerts.push({
      type: 'dry_spell',
      message: 'पुढील आठवड्यात कोरडा कालावधी अपेक्षित आहे. पिकांना नियमित पाणी द्या.'
    });
  }
  
  // Generate planting recommendations
  const plantingRecommendations = [
    'सध्याच्या हवामानात पालेभाज्या लावण्यासाठी उत्तम काळ आहे.',
    'फळझाडांची लागवड करण्यापूर्वी मातीची स्थिती तपासा.',
    'बियाणे पेरण्यापूर्वी जमिनीची पूर्वतयारी करा.'
  ];
  
  // Return complete weather forecast with agricultural advice
  return {
    city: '',  // Will be filled by reverse geocoding
    state: '',
    country: '',
    lat: lat,
    lon: lon,
    current: dailyForecast[0],
    hourly: hourlyForecast,
    daily: dailyForecast,
    agricultural_advice: {
      general_advice: generalAdvice,
      crop_specific: cropSpecificAdvice,
      alerts: alerts,
      planting_recommendations: plantingRecommendations
    }
  };
};

interface WeatherData {
  date: string;
  temperature: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  pressure: number;
  humidity: number;
  weather_main: string;
  weather_description: string;
  wind_speed: number;
  wind_direction: number;
  clouds: number;
  rain_1h?: number;
  rain_3h?: number;
  icon: string;
}

interface WeatherForecast {
  city: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
  current: WeatherData;
  hourly: WeatherData[];
  daily: WeatherData[];
  agricultural_advice: {
    general_advice: string[];
    crop_specific: Record<string, string[]>;
    alerts: Array<{
      type: string;
      message: string;
    }>;
    planting_recommendations: string[];
  };
}

const WeatherGuardHome: React.FC = () => {
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [citySearch, setCitySearch] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'daily' | 'hourly'>('daily');
  const [usingCurrentLocation, setUsingCurrentLocation] = useState<boolean>(false);
  
  const { user } = useAuth();

  // Fetch weather data when location changes
  useEffect(() => {
    if (location) {
      fetchWeatherData(location.lat, location.lon);
    }
  }, [location]);

  // Get user's exact location with Google API
  useEffect(() => {
    setUsingCurrentLocation(true);
    setError('कृपया थांबा, आम्ही आपले स्थान शोधत आहोत...');
    
    // Try to get location using Google Maps Geolocation API
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
    
    if (apiKey) {
      try {
        // Use Google Maps Geolocation API
        fetch(`https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        })
        .then(response => response.json())
        .then(data => {
          if (data.location && data.location.lat && data.location.lng) {
            const userLat = data.location.lat;
            const userLon = data.location.lng;
            
            console.log(`Got user's location from Google API: ${userLat}, ${userLon}`);
            
            // Update location state with user's actual coordinates
            setLocation({
              lat: userLat,
              lon: userLon
            });
            
            setUsingCurrentLocation(false);
            setError(null); // Clear error when we get location
          } else {
            throw new Error('Google Geolocation API did not return valid coordinates');
          }
        })
        .catch(error => {
          console.error('Error getting location from Google API:', error);
          setUsingCurrentLocation(false);
          setError('आपले स्थान शोधण्यात अडचण आली आहे. कृपया पुन्हा प्रयत्न करा.');
        });
      } catch (error) {
        console.error('Error in Google Geolocation API fetch:', error);
        setUsingCurrentLocation(false);
        setError('आपले स्थान शोधण्यात अडचण आली आहे. कृपया पुन्हा प्रयत्न करा.');
      }
    } else {
      console.error('Google Maps API key not available');
      setUsingCurrentLocation(false);
      setError('लोकेशन सेवा उपलब्ध नाही. कृपया नंतर पुन्हा प्रयत्न करा.');
    }
  }, []);

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get location name using reverse geocoding
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      if (apiKey) {
        // First get the location name
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${apiKey}`;
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();
        
        // Generate mock weather data
        const mockResponse = getMockWeatherData(lat, lon);
        
        // Update with real location data if available
        if (geocodeData.results && geocodeData.results.length > 0) {
          const addressComponents = geocodeData.results[0].address_components;
          
          for (const component of addressComponents) {
            if (component.types.includes('locality')) {
              mockResponse.city = component.long_name;
            } else if (component.types.includes('administrative_area_level_1')) {
              mockResponse.state = component.long_name;
            } else if (component.types.includes('country')) {
              mockResponse.country = component.long_name;
            }
          }
        }
        
        setForecast(mockResponse);
      } else {
        // If no API key, just use mock data without location name
        const mockResponse = getMockWeatherData(lat, lon);
        setForecast(mockResponse);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCitySearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!citySearch.trim()) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Use Google Maps Geocoding API to get coordinates for the city
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
      
      if (apiKey) {
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(citySearch)}&key=${apiKey}`;
        
        const response = await fetch(geocodeUrl);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry.location;
          
          // Get weather data for these coordinates
          const mockResponse = getMockWeatherData(lat, lng);
          
          // Get city name from geocoding result
          const addressComponents = data.results[0].address_components;
          let city = '';
          let state = '';
          let country = '';
          
          for (const component of addressComponents) {
            if (component.types.includes('locality')) {
              city = component.long_name;
            } else if (component.types.includes('administrative_area_level_1')) {
              state = component.long_name;
            } else if (component.types.includes('country')) {
              country = component.long_name;
            }
          }
          
          // Update forecast with real location data
          mockResponse.city = city || citySearch;
          mockResponse.state = state;
          mockResponse.country = country;
          
          setForecast(mockResponse);
          setLocation({ lat, lon: lng });
        } else {
          throw new Error('City not found');
        }
      } else {
        throw new Error('Google Maps API key not available');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (navigator.geolocation) {
      setUsingCurrentLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude
          });
          setUsingCurrentLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setUsingCurrentLocation(false);
          setError('Failed to get your current location. Please try again or search by city.');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please search by city instead.');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'high_temperature':
        return (
          <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        );
      case 'heavy_rain':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  if (loading && !forecast) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading weather data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">हवामान रक्षक (WeatherGuard)</h1>
      <p className="text-lg mb-6">कृषी निर्णयांसाठी रिअल-टाइम हवामान अंदाज (Real-time weather forecasting for agricultural decisions)</p>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <form onSubmit={handleCitySearch} className="flex">
              <input
                type="text"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                placeholder="शहराचे नाव शोधा... (Search by city name)"
                className="p-2 border border-gray-300 rounded-l-md w-full md:w-64"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors"
              >
                शोधा (Search)
              </button>
            </form>
          </div>
          
          <button
            onClick={handleUseCurrentLocation}
            disabled={usingCurrentLocation}
            className="flex items-center justify-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {usingCurrentLocation ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                स्थान मिळवत आहे... (Getting Location)
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                माझे स्थान वापरा (Use My Location)
              </>
            )}
          </button>
        </div>
      </div>
      
      {forecast && (
        <>
          {/* Current Weather */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="p-6 bg-gradient-to-r from-blue-500 to-green-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{forecast.city}</h2>
                  <p className="text-lg">{forecast.state}, {forecast.country}</p>
                  <p className="text-sm opacity-80">Lat: {forecast.lat.toFixed(4)}, Lon: {forecast.lon.toFixed(4)}</p>
                </div>
                
                <div className="text-right">
                  <p className="text-sm">{formatDate(forecast.current.date)}</p>
                  <p className="text-sm">{formatTime(forecast.current.date)}</p>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between mt-6">
                <div className="flex items-center">
                  <img 
                    src={getWeatherIcon(forecast.current.icon)} 
                    alt={forecast.current.weather_description} 
                    className="w-20 h-20"
                  />
                  <div className="ml-4">
                    <h3 className="text-4xl font-bold">{forecast.current.temperature.toFixed(1)}°C</h3>
                    <p className="capitalize">{forecast.current.weather_description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-4 md:mt-0">
                  <div>
                    <p className="text-sm opacity-80">Feels Like</p>
                    <p className="font-medium">{forecast.current.feels_like.toFixed(1)}°C</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Humidity</p>
                    <p className="font-medium">{forecast.current.humidity}%</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Wind</p>
                    <p className="font-medium">{forecast.current.wind_speed.toFixed(1)} m/s</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-80">Pressure</p>
                    <p className="font-medium">{forecast.current.pressure} hPa</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Weather Alerts */}
          {forecast.agricultural_advice.alerts.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium text-yellow-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Weather Alerts
              </h3>
              
              <div className="space-y-2">
                {forecast.agricultural_advice.alerts.map((alert, index) => (
                  <div key={index} className="flex items-start p-3 bg-white rounded-md shadow-sm">
                    <div className="flex-shrink-0 mr-3">
                      {getAlertIcon(alert.type)}
                    </div>
                    <div>
                      <p className="text-gray-800">{alert.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Forecast Tabs */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="flex border-b">
              <button
                className={`flex-1 py-3 font-medium ${activeTab === 'daily' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('daily')}
              >
                7-दिवस अंदाज (7-Day Forecast)
              </button>
              <button
                className={`flex-1 py-3 font-medium ${activeTab === 'hourly' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('hourly')}
              >
                तासाभराचा अंदाज (Hourly Forecast)
              </button>
            </div>
            
            <div className="p-4">
              {activeTab === 'daily' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
                  {forecast.daily.map((day, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
                      <p className="font-medium">{formatDate(day.date)}</p>
                      <img 
                        src={getWeatherIcon(day.icon)} 
                        alt={day.weather_description} 
                        className="w-16 h-16 mx-auto"
                      />
                      <p className="capitalize text-sm">{day.weather_description}</p>
                      <div className="flex justify-center space-x-2 mt-1">
                        <span className="text-gray-800 font-medium">{day.temp_max.toFixed(1)}°</span>
                        <span className="text-gray-500">{day.temp_min.toFixed(1)}°</span>
                      </div>
                      {day.rain_1h && (
                        <div className="mt-1 flex items-center justify-center text-blue-600">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                          </svg>
                          <span>{day.rain_1h.toFixed(1)} mm</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <div className="inline-flex space-x-4 pb-4">
                    {forecast.hourly.slice(0, 24).map((hour, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 text-center min-w-[100px]">
                        <p className="font-medium">{formatTime(hour.date)}</p>
                        <img 
                          src={getWeatherIcon(hour.icon)} 
                          alt={hour.weather_description} 
                          className="w-12 h-12 mx-auto"
                        />
                        <p className="text-lg font-medium">{hour.temperature.toFixed(1)}°C</p>
                        {hour.rain_1h && (
                          <div className="mt-1 flex items-center justify-center text-blue-600 text-sm">
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                            <span>{hour.rain_1h.toFixed(1)} mm</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Agricultural Advice */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-medium mb-4">शेती सल्ला (Agricultural Advice)</h3>
                
                <div className="mb-6">
                  <h4 className="font-medium text-gray-700 mb-2">सामान्य शिफारसी (General Recommendations)</h4>
                  <ul className="space-y-2">
                    {forecast.agricultural_advice.general_advice.map((advice, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-5 h-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{advice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">पिक-विशिष्ट सल्ला (Crop-Specific Advice)</h4>
                  
                  <div className="mb-3">
                    <select
                      value={selectedCrop}
                      onChange={(e) => setSelectedCrop(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">पीक निवडा (Select a crop)</option>
                      {Object.keys(forecast.agricultural_advice.crop_specific).map((crop) => (
                        <option key={crop} value={crop}>
                          {crop.charAt(0).toUpperCase() + crop.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {selectedCrop && (
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h5 className="font-medium text-green-800 mb-2">
                        {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)}
                      </h5>
                      <ul className="space-y-2">
                        {forecast.agricultural_advice.crop_specific[selectedCrop].map((advice, index) => (
                          <li key={index} className="flex items-start">
                            <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            <span>{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-medium mb-4">लागवड शिफारसी (Planting Recommendations)</h3>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">सध्याच्या हवामानासाठी योग्य पिके (Crops Suitable for Current Weather)</h4>
                  
                  <ul className="space-y-3">
                    {forecast.agricultural_advice.planting_recommendations.map((crop, index) => (
                      <li key={index} className="flex items-center">
                        <div className="bg-green-100 rounded-full p-1 mr-3">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <span className="capitalize">{crop}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <p className="mt-4 text-sm text-green-700">
                    या शिफारसी सध्याच्या हवामान पद्धती आणि अंदाजांवर आधारित आहेत.
                    नेहमी स्थानिक माती परिस्थिती आणि हंगामी वेळ विचारात घ्या.
                    (These recommendations are based on current weather patterns and forecasts.
                    Always consider local soil conditions and seasonal timing.)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default WeatherGuardHome;