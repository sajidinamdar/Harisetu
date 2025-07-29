// Get weather data by coordinates
export const getWeatherByCoordinates = async (lat, lon) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY || import.meta.env.VITE_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get weather data by city name
export const getWeatherByCity = async (city) => {
  try {
    const apiKey = process.env.WEATHER_API_KEY || import.meta.env.VITE_WEATHER_API_KEY;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

// Get weather forecast for agriculture
export const getAgricultureForecast = async (lat, lon) => {
  try {
    const weatherData = await getWeatherByCoordinates(lat, lon);
    
    // Process data for agricultural insights
    const agriculturalData = {
      current: weatherData.current,
      daily: weatherData.daily.slice(0, 7),
      agricultural_advice: generateAgricultureAdvice(weatherData)
    };
    
    return agriculturalData;
  } catch (error) {
    console.error('Error fetching agricultural forecast:', error);
    throw error;
  }
};

// Generate agriculture advice based on weather data
const generateAgricultureAdvice = (weatherData) => {
  const current = weatherData.current;
  const daily = weatherData.daily;
  
  // Basic advice based on temperature and precipitation
  let advice = [];
  
  // Temperature advice
  if (current.temp > 35) {
    advice.push({
      type: 'temperature',
      severity: 'high',
      message_mr: 'तापमान खूप जास्त आहे. पिकांना पाणी देण्याची वारंवारता वाढवा.',
      message_en: 'Temperature is very high. Increase watering frequency for crops.'
    });
  } else if (current.temp < 10) {
    advice.push({
      type: 'temperature',
      severity: 'low',
      message_mr: 'तापमान खूप कमी आहे. संवेदनशील पिकांचे संरक्षण करा.',
      message_en: 'Temperature is very low. Protect sensitive crops.'
    });
  }
  
  // Rain forecast
  const willRainSoon = daily.slice(0, 3).some(day => 
    day.weather.some(w => w.main === 'Rain' || w.main === 'Thunderstorm')
  );
  
  if (willRainSoon) {
    advice.push({
      type: 'rain',
      severity: 'medium',
      message_mr: 'पुढील 3 दिवसांत पाऊस अपेक्षित आहे. खते टाकण्याचे टाळा.',
      message_en: 'Rain expected in next 3 days. Avoid fertilizer application.'
    });
  }
  
  // Wind advice
  if (current.wind_speed > 20) {
    advice.push({
      type: 'wind',
      severity: 'high',
      message_mr: 'वारा जोरदार आहे. फवारणी टाळा आणि उभी पिके बांधून ठेवा.',
      message_en: 'Strong winds. Avoid spraying and secure standing crops.'
    });
  }
  
  // Humidity advice
  if (current.humidity > 80) {
    advice.push({
      type: 'humidity',
      severity: 'high',
      message_mr: 'आर्द्रता जास्त आहे. बुरशीजन्य रोगांपासून सावध रहा.',
      message_en: 'High humidity. Be cautious of fungal diseases.'
    });
  } else if (current.humidity < 30) {
    advice.push({
      type: 'humidity',
      severity: 'low',
      message_mr: 'आर्द्रता कमी आहे. पिकांना अधिक पाणी द्या.',
      message_en: 'Low humidity. Provide more water to crops.'
    });
  }
  
  return advice;
};

export default {
  getWeatherByCoordinates,
  getWeatherByCity,
  getAgricultureForecast
};