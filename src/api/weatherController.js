import { getWeatherByCoordinates, getAgricultureForecast } from './weatherService';

// Controller for handling weather-related API requests
export const getWeatherForecastByCoordinates = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const weatherData = await getWeatherByCoordinates(lat, lon);
    return res.json(weatherData);
  } catch (error) {
    console.error('Error in weather forecast controller:', error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
};

// Controller for getting agricultural weather forecast
export const getAgriculturalForecast = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    const forecastData = await getAgricultureForecast(lat, lon);
    return res.json(forecastData);
  } catch (error) {
    console.error('Error in agricultural forecast controller:', error);
    return res.status(500).json({ error: 'Failed to fetch agricultural forecast' });
  }
};

// Get crop recommendations based on location and soil data
export const getCropRecommendations = async (req, res) => {
  try {
    const { lat, lon } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({ error: 'Latitude and longitude are required' });
    }
    
    // Get weather data
    const weatherData = await getWeatherByCoordinates(lat, lon);
    
    // Get soil data (if available)
    let soilData = null;
    try {
      // This would typically come from a soil API or database
      // For now, we'll use mock data
      soilData = getMockSoilData(lat, lon);
    } catch (err) {
      console.log('Soil data not available');
    }
    
    // Generate recommendations
    const recommendations = generateCropRecommendations(weatherData, soilData, lat, lon);
    
    return res.json({ recommendations });
  } catch (error) {
    console.error('Error in crop recommendations controller:', error);
    return res.status(500).json({ error: 'Failed to fetch crop recommendations' });
  }
};

// Mock function to generate soil data
const getMockSoilData = (lat, lon) => {
  // In a real application, this would come from a soil database or API
  // For demonstration, we'll return mock data based on the coordinates
  
  // Maharashtra region (approximate)
  if (lat >= 16 && lat <= 22 && lon >= 72 && lon <= 81) {
    return {
      ph: 6.8,
      nitrogen: 'medium',
      phosphorus: 'medium',
      potassium: 'high',
      organic_matter: 'medium',
      soil_type: 'black cotton soil',
      moisture: 'medium'
    };
  }
  
  // Default soil data
  return {
    ph: 7.0,
    nitrogen: 'medium',
    phosphorus: 'medium',
    potassium: 'medium',
    organic_matter: 'medium',
    soil_type: 'loamy',
    moisture: 'medium'
  };
};

// Generate crop recommendations based on weather, soil, and location
const generateCropRecommendations = (weatherData, soilData, lat, lon) => {
  const recommendations = [];
  const currentMonth = new Date().getMonth();
  
  // Maharashtra region (approximate)
  if (lat >= 16 && lat <= 22 && lon >= 72 && lon <= 81) {
    // Summer season (March-June)
    if (currentMonth >= 2 && currentMonth <= 5) {
      recommendations.push(
        {
          crop: 'उन्हाळी मुग (Summer Moong)',
          suitability: 'high',
          reason: 'अल्प कालावधीचे पीक, कमी पाण्याची आवश्यकता',
          water_requirement: 'low',
          growing_period: '60-65 days'
        },
        {
          crop: 'कलिंगड (Watermelon)',
          suitability: 'high',
          reason: 'उन्हाळ्यात चांगले उत्पादन, बाजारात मागणी',
          water_requirement: 'medium',
          growing_period: '80-90 days'
        }
      );
    }
    
    // Kharif season (June-October)
    if (currentMonth >= 5 && currentMonth <= 9) {
      recommendations.push(
        {
          crop: 'सोयाबीन (Soybean)',
          suitability: 'high',
          reason: 'पावसाळ्यात चांगले उत्पादन, मध्यम पाण्याची आवश्यकता',
          water_requirement: 'medium',
          growing_period: '90-120 days'
        },
        {
          crop: 'कापूस (Cotton)',
          suitability: 'medium',
          reason: 'काळ्या मातीत चांगले उत्पादन, जास्त पाण्याची आवश्यकता',
          water_requirement: 'high',
          growing_period: '150-180 days'
        }
      );
    }
    
    // Rabi season (October-March)
    if (currentMonth >= 9 || currentMonth <= 2) {
      recommendations.push(
        {
          crop: 'गहू (Wheat)',
          suitability: 'high',
          reason: 'हिवाळ्यात चांगले उत्पादन, मध्यम पाण्याची आवश्यकता',
          water_requirement: 'medium',
          growing_period: '120-150 days'
        },
        {
          crop: 'हरभरा (Chickpea)',
          suitability: 'high',
          reason: 'कमी पाण्यात चांगले उत्पादन, दुष्काळ प्रतिरोधक',
          water_requirement: 'low',
          growing_period: '90-120 days'
        }
      );
    }
  }
  
  // If no specific recommendations, add general ones
  if (recommendations.length === 0) {
    recommendations.push(
      {
        crop: 'स्थानिक भाजीपाला (Local Vegetables)',
        suitability: 'medium',
        reason: 'स्थानिक मागणी, कमी वाहतूक खर्च',
        water_requirement: 'varies',
        growing_period: 'varies'
      }
    );
  }
  
  return recommendations;
};

export default {
  getWeatherForecastByCoordinates,
  getAgriculturalForecast,
  getCropRecommendations
};