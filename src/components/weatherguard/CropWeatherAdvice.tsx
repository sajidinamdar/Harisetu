import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Function to generate mock weather data
const getMockWeatherData = (lat: number, lon: number, cropType: string): WeatherForecast => {
  const currentDate = new Date();
  
  // Generate daily forecast for 7 days
  const dailyForecast: WeatherData[] = Array(7).fill(0).map((_, index) => {
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
  const hourlyForecast: WeatherData[] = Array(24).fill(0).map((_, index) => {
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
  
  const cropSpecificAdvice: Record<string, string[]> = {
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
    city: lat > 19 ? 'पुणे' : 'मुंबई',
    state: 'महाराष्ट्र',
    country: 'भारत',
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

// Crop-specific thresholds and information
const cropInfo: Record<string, any> = {
  rice: {
    name: 'Rice',
    name_marathi: 'तांदूळ',
    optimal_temp: { min: 20, max: 35 },
    water_needs: 'High',
    humidity_preference: 'High',
    growing_season: 'Kharif (Monsoon)',
    sensitivity: {
      drought: 'High',
      flood: 'Low',
      heat: 'Medium',
      cold: 'High'
    },
    key_stages: [
      { name: 'Germination', days: '5-10 days', temp: '25-30°C' },
      { name: 'Seedling', days: '15-20 days', temp: '25-32°C' },
      { name: 'Tillering', days: '30-40 days', temp: '25-31°C' },
      { name: 'Panicle Initiation', days: '40-60 days', temp: '25-35°C' },
      { name: 'Flowering', days: '60-90 days', temp: '30-32°C' },
      { name: 'Maturity', days: '110-150 days', temp: '20-25°C' }
    ]
  },
  wheat: {
    name: 'Wheat',
    name_marathi: 'गहू',
    optimal_temp: { min: 15, max: 25 },
    water_needs: 'Medium',
    humidity_preference: 'Medium',
    growing_season: 'Rabi (Winter)',
    sensitivity: {
      drought: 'Medium',
      flood: 'High',
      heat: 'High',
      cold: 'Low'
    },
    key_stages: [
      { name: 'Germination', days: '4-7 days', temp: '12-25°C' },
      { name: 'Seedling', days: '10-15 days', temp: '15-20°C' },
      { name: 'Tillering', days: '20-30 days', temp: '16-22°C' },
      { name: 'Stem Extension', days: '30-60 days', temp: '18-24°C' },
      { name: 'Heading', days: '60-90 days', temp: '18-24°C' },
      { name: 'Ripening', days: '90-120 days', temp: '20-25°C' }
    ]
  },
  cotton: {
    name: 'Cotton',
    name_marathi: 'कापूस',
    optimal_temp: { min: 18, max: 32 },
    water_needs: 'Medium',
    humidity_preference: 'Medium',
    growing_season: 'Kharif (Monsoon)',
    sensitivity: {
      drought: 'Medium',
      flood: 'High',
      heat: 'Low',
      cold: 'High'
    },
    key_stages: [
      { name: 'Germination', days: '5-10 days', temp: '18-30°C' },
      { name: 'Seedling', days: '15-20 days', temp: '20-30°C' },
      { name: 'Squaring', days: '35-60 days', temp: '20-30°C' },
      { name: 'Flowering', days: '60-90 days', temp: '20-32°C' },
      { name: 'Boll Development', days: '90-120 days', temp: '25-30°C' },
      { name: 'Maturity', days: '160-180 days', temp: '25-30°C' }
    ]
  },
  vegetables: {
    name: 'Vegetables (General)',
    name_marathi: 'भाज्या',
    optimal_temp: { min: 15, max: 30 },
    water_needs: 'Medium to High',
    humidity_preference: 'Medium',
    growing_season: 'Year-round (varies by type)',
    sensitivity: {
      drought: 'High',
      flood: 'Medium',
      heat: 'Medium',
      cold: 'Medium'
    },
    key_stages: [
      { name: 'Germination', days: '5-14 days', temp: '18-25°C' },
      { name: 'Seedling', days: '14-28 days', temp: '18-27°C' },
      { name: 'Vegetative Growth', days: '30-60 days', temp: '20-30°C' },
      { name: 'Flowering', days: '45-90 days', temp: '20-30°C' },
      { name: 'Fruiting', days: '60-120 days', temp: '20-30°C' },
      { name: 'Harvest', days: 'Varies by type', temp: '18-30°C' }
    ]
  }
};

const CropWeatherAdvice: React.FC = () => {
  const { cropType } = useParams<{ cropType: string }>();
  const [forecast, setForecast] = useState<WeatherForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [weatherRisks, setWeatherRisks] = useState<Array<{ risk: string; level: string; advice: string }>>([]);
  const [cropData, setCropData] = useState<any>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  // Set crop data based on the URL parameter
  useEffect(() => {
    if (cropType && cropInfo[cropType]) {
      setCropData(cropInfo[cropType]);
    } else {
      setError('Crop type not found or not supported');
    }
  }, [cropType]);

  // Get user's location without permission popup
  useEffect(() => {
    // Default to a location in Maharashtra (Pune)
    const defaultLat = 18.5204;
    const defaultLon = 73.8567;
    
    // Set default location first
    setLocation({ 
      lat: defaultLat, 
      lon: defaultLon 
    });
    
    // Try to get IP-based location without permission popup
    try {
      fetch('https://ipapi.co/json/')
        .then(response => response.json())
        .then(data => {
          if (data.latitude && data.longitude) {
            setLocation({
              lat: data.latitude,
              lon: data.longitude
            });
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
  }, []);

  // Fetch weather data when location changes
  useEffect(() => {
    if (location) {
      fetchWeatherData(location.lat, location.lon);
    }
  }, [location]);

  // Analyze weather risks for the crop when forecast data is available
  useEffect(() => {
    if (forecast && cropData) {
      analyzeWeatherRisks();
    }
  }, [forecast, cropData]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Use mock data instead of API call
      const mockResponse = getMockWeatherData(lat, lon, cropType as string);
      const data = mockResponse;
      setForecast(data);
      return;
      // This code is now replaced by mock data above
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWeatherRisks = () => {
    if (!forecast || !cropData) return;
    
    const risks: Array<{ risk: string; level: string; advice: string }> = [];
    
    // Check temperature risks
    const maxTemp = Math.max(...forecast.daily.map(day => day.temp_max));
    const minTemp = Math.min(...forecast.daily.map(day => day.temp_min));
    
    if (maxTemp > cropData.optimal_temp.max + 5) {
      risks.push({
        risk: 'High Temperature',
        level: 'High',
        advice: `Temperatures above ${cropData.optimal_temp.max}°C can stress ${cropData.name}. Provide shade and increase irrigation frequency.`
      });
    } else if (maxTemp > cropData.optimal_temp.max) {
      risks.push({
        risk: 'High Temperature',
        level: 'Medium',
        advice: `Temperatures slightly above optimal range. Monitor plants for stress and ensure adequate water.`
      });
    }
    
    if (minTemp < cropData.optimal_temp.min - 5) {
      risks.push({
        risk: 'Low Temperature',
        level: 'High',
        advice: `Temperatures below ${cropData.optimal_temp.min}°C can damage ${cropData.name}. Consider protective measures like row covers.`
      });
    } else if (minTemp < cropData.optimal_temp.min) {
      risks.push({
        risk: 'Low Temperature',
        level: 'Medium',
        advice: `Temperatures slightly below optimal range. Be prepared for potential cold stress.`
      });
    }
    
    // Check rainfall risks
    const hasHeavyRain = forecast.daily.some(day => day.rain_1h && day.rain_1h > 20);
    const hasModerateRain = forecast.daily.some(day => day.rain_1h && day.rain_1h > 5);
    const hasNoRain = !forecast.daily.some(day => day.rain_1h);
    
    if (hasHeavyRain && cropData.sensitivity.flood === 'High') {
      risks.push({
        risk: 'Heavy Rainfall',
        level: 'High',
        advice: `${cropData.name} is sensitive to flooding. Ensure proper drainage and consider protective measures.`
      });
    } else if (hasModerateRain && cropData.sensitivity.flood === 'Medium') {
      risks.push({
        risk: 'Moderate Rainfall',
        level: 'Medium',
        advice: `Monitor field drainage and be prepared for potential waterlogging.`
      });
    }
    
    if (hasNoRain && cropData.water_needs === 'High') {
      risks.push({
        risk: 'Dry Conditions',
        level: 'High',
        advice: `No rainfall expected and ${cropData.name} has high water needs. Ensure regular irrigation.`
      });
    } else if (hasNoRain && cropData.water_needs === 'Medium') {
      risks.push({
        risk: 'Dry Conditions',
        level: 'Medium',
        advice: `Plan for irrigation as no significant rainfall is expected.`
      });
    }
    
    // Check humidity risks
    const avgHumidity = forecast.daily.reduce((sum, day) => sum + day.humidity, 0) / forecast.daily.length;
    
    if (avgHumidity > 80 && cropData.humidity_preference !== 'High') {
      risks.push({
        risk: 'High Humidity',
        level: 'Medium',
        advice: `High humidity may increase disease risk. Monitor for fungal diseases and ensure good air circulation.`
      });
    } else if (avgHumidity < 40 && cropData.humidity_preference === 'High') {
      risks.push({
        risk: 'Low Humidity',
        level: 'Medium',
        advice: `Low humidity may stress plants. Consider increasing irrigation frequency.`
      });
    }
    
    setWeatherRisks(risks);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getWeatherIcon = (icon: string) => {
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  const getRiskLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && !forecast) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading crop weather advice...</p>
      </div>
    );
  }

  if (error || !cropData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <button 
          className="mb-4 flex items-center text-green-600 hover:text-green-800"
          onClick={() => navigate('/weatherguard')}
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to WeatherGuard
        </button>
        
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Crop information not available'}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        className="mb-4 flex items-center text-green-600 hover:text-green-800"
        onClick={() => navigate('/weatherguard')}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to WeatherGuard
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-6 bg-gradient-to-r from-green-500 to-green-700 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">{cropData.name}</h1>
              <p className="text-xl">{cropData.name_marathi}</p>
            </div>
            
            {forecast && (
              <div className="text-right">
                <p className="text-lg">{forecast.city}, {forecast.state}</p>
                <p className="text-sm">{formatDate(forecast.current.date)}</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-medium mb-4">Crop Information</h2>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Optimal Temperature</p>
                    <p className="font-medium">{cropData.optimal_temp.min}°C - {cropData.optimal_temp.max}°C</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Water Needs</p>
                    <p className="font-medium">{cropData.water_needs}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Humidity Preference</p>
                    <p className="font-medium">{cropData.humidity_preference}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Growing Season</p>
                    <p className="font-medium">{cropData.growing_season}</p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Sensitivity</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(cropData.sensitivity).map(([key, value]) => (
                      <div key={key} className="flex items-center">
                        <span className="capitalize mr-2">{key}:</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          value === 'High' ? 'bg-red-100 text-red-800' :
                          value === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {forecast && (
              <div>
                <h2 className="text-xl font-medium mb-4">Current Weather</h2>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center mb-4">
                    <img 
                      src={getWeatherIcon(forecast.current.icon)} 
                      alt={forecast.current.weather_description} 
                      className="w-16 h-16"
                    />
                    <div className="ml-4">
                      <h3 className="text-2xl font-bold">{forecast.current.temperature.toFixed(1)}°C</h3>
                      <p className="capitalize">{forecast.current.weather_description}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Humidity</p>
                      <p className="font-medium">{forecast.current.humidity}%</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Wind</p>
                      <p className="font-medium">{forecast.current.wind_speed.toFixed(1)} m/s</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Min/Max Temp</p>
                      <p className="font-medium">{forecast.current.temp_min.toFixed(1)}°C / {forecast.current.temp_max.toFixed(1)}°C</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-500">Pressure</p>
                      <p className="font-medium">{forecast.current.pressure} hPa</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Weather Risks */}
          <div className="mb-6">
            <h2 className="text-xl font-medium mb-4">Weather Risks for {cropData.name}</h2>
            
            {weatherRisks.length === 0 ? (
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <p className="text-green-800 font-medium">Current weather conditions are favorable for {cropData.name}.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {weatherRisks.map((risk, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <span className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${getRiskLevelColor(risk.level)}`}>
                          {risk.level.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-medium">
                          {risk.risk} <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${getRiskLevelColor(risk.level)}`}>
                            {risk.level} Risk
                          </span>
                        </h3>
                        <p className="mt-1 text-gray-700">{risk.advice}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Growth Stages */}
          <div>
            <h2 className="text-xl font-medium mb-4">Key Growth Stages</h2>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Optimal Temperature
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Weather Sensitivity
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {cropData.key_stages.map((stage: any, index: number) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{stage.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{stage.days}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{stage.temp}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">
                          {index === 0 ? 'High (moisture)' : 
                           index === 3 ? 'High (temperature)' : 
                           index === 4 ? 'Very High (all factors)' : 'Medium'}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* Weekly Forecast */}
      {forecast && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-4 bg-green-50">
            <h2 className="text-xl font-medium">7-Day Forecast</h2>
          </div>
          
          <div className="p-4">
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
          </div>
        </div>
      )}
      
      {/* Crop-specific Advice */}
      {forecast && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-medium mb-4">Crop-Specific Advice</h2>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <ul className="space-y-3">
              {forecast.agricultural_advice.crop_specific[cropType as string]?.map((advice, index) => (
                <li key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{advice}</span>
                </li>
              ))}
              
              {weatherRisks.map((risk, index) => (
                <li key={`risk-${index}`} className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span>{risk.advice}</span>
                </li>
              ))}
              
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Monitor your crop regularly for signs of stress or disease, especially during critical growth stages.</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropWeatherAdvice;