import React, { useState, useEffect } from 'react';

interface LocationProps {
  latitude: number;
  longitude: number;
}

interface Recommendation {
  id: string;
  title: string;
  title_mr: string;
  description: string;
  description_mr: string;
  type: 'crop' | 'practice' | 'alert';
  priority: 'high' | 'medium' | 'low';
}

const LocationBasedRecommendations: React.FC<LocationProps> = ({ latitude, longitude }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (latitude && longitude) {
      fetchRecommendations();
    }
  }, [latitude, longitude]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      
      // Use mock data instead of API calls
      const mockRecommendations = [
        {
          id: 'heat-stress',
          title: 'Heat Stress Management',
          title_mr: 'उष्णता व्यवस्थापन',
          description: 'Increase irrigation frequency and consider mulching to reduce soil temperature.',
          description_mr: 'सिंचनाची वारंवारता वाढवा आणि माती तापमान कमी करण्यासाठी आच्छादन विचारात घ्या.',
          type: 'practice' as const,
          priority: 'high' as const
        },
        {
          id: 'rain-alert',
          title: 'Rainfall Expected',
          title_mr: 'पाऊस अपेक्षित',
          description: 'Prepare for rainfall in the next few days. Avoid fertilizer application.',
          description_mr: 'पुढील काही दिवसांत पावसाची तयारी करा. खते टाकणे टाळा.',
          type: 'alert' as const,
          priority: 'medium' as const
        },
        {
          id: 'crop-suggestion',
          title: 'Suitable Crops',
          title_mr: 'योग्य पिके',
          description: 'Consider planting soybean, cotton or turmeric which are suitable for this season.',
          description_mr: 'या हंगामासाठी योग्य असलेले सोयाबीन, कापूस किंवा हळद लागवड करण्याचा विचार करा.',
          type: 'crop' as const,
          priority: 'medium' as const
        }
      ];
      
      setRecommendations(mockRecommendations);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('माहिती मिळवण्यात अडचण आली आहे.');
      setLoading(false);
    }
  };

  // Generate recommendations based on weather and soil data
  const generateRecommendations = (weatherData: any, soilData: any): Recommendation[] => {
    const recommendations: Recommendation[] = [];
    
    // If API is not available, generate some static recommendations based on location
    // In a real app, this would come from the backend
    
    // Sample recommendations based on weather
    if (weatherData?.current?.temp > 30) {
      recommendations.push({
        id: 'heat-stress',
        title: 'Heat Stress Management',
        title_mr: 'उष्णता व्यवस्थापन',
        description: 'Increase irrigation frequency and consider mulching to reduce soil temperature.',
        description_mr: 'सिंचनाची वारंवारता वाढवा आणि माती तापमान कमी करण्यासाठी आच्छादन विचारात घ्या.',
        type: 'practice',
        priority: 'high'
      });
    }
    
    if (weatherData?.daily?.some((day: any) => day.weather[0].main === 'Rain')) {
      recommendations.push({
        id: 'rain-alert',
        title: 'Rainfall Expected',
        title_mr: 'पाऊस अपेक्षित',
        description: 'Prepare for rainfall in the next few days. Avoid fertilizer application.',
        description_mr: 'पुढील काही दिवसांत पावसाची तयारी करा. खते टाकणे टाळा.',
        type: 'alert',
        priority: 'medium'
      });
    }
    
    // Location-based crop recommendations
    // This would typically come from a database or API based on the region
    const regionBasedCrops = getRegionBasedCrops(latitude, longitude);
    recommendations.push(...regionBasedCrops);
    
    return recommendations;
  };
  
  // Get crop recommendations based on region (simplified example)
  const getRegionBasedCrops = (lat: number, lon: number): Recommendation[] => {
    // Maharashtra region (approximate coordinates)
    if (lat >= 16 && lat <= 22 && lon >= 72 && lon <= 81) {
      const month = new Date().getMonth();
      
      // Summer season (March-June)
      if (month >= 2 && month <= 5) {
        return [
          {
            id: 'summer-crop-1',
            title: 'Summer Moong',
            title_mr: 'उन्हाळी मुग',
            description: 'Suitable for your region in current season. Short duration crop (60-65 days).',
            description_mr: 'सध्याच्या हंगामात तुमच्या प्रदेशासाठी योग्य. अल्प कालावधीचे पीक (60-65 दिवस).',
            type: 'crop',
            priority: 'high'
          },
          {
            id: 'summer-crop-2',
            title: 'Watermelon',
            title_mr: 'कलिंगड',
            description: 'Good market value and suitable for summer cultivation in your area.',
            description_mr: 'चांगले बाजार मूल्य आणि तुमच्या भागात उन्हाळी लागवडीसाठी योग्य.',
            type: 'crop',
            priority: 'medium'
          }
        ];
      }
      
      // Kharif season (June-October)
      if (month >= 5 && month <= 9) {
        return [
          {
            id: 'kharif-crop-1',
            title: 'Soybean',
            title_mr: 'सोयाबीन',
            description: 'Recommended for your region during monsoon season.',
            description_mr: 'पावसाळ्यात तुमच्या प्रदेशासाठी शिफारस केलेले.',
            type: 'crop',
            priority: 'high'
          },
          {
            id: 'kharif-crop-2',
            title: 'Cotton',
            title_mr: 'कापूस',
            description: 'Suitable for your soil type and climate conditions.',
            description_mr: 'तुमच्या माती प्रकार आणि हवामान परिस्थितीसाठी योग्य.',
            type: 'crop',
            priority: 'medium'
          }
        ];
      }
      
      // Rabi season (October-March)
      if (month >= 9 || month <= 2) {
        return [
          {
            id: 'rabi-crop-1',
            title: 'Wheat',
            title_mr: 'गहू',
            description: 'Ideal for winter cultivation in your region.',
            description_mr: 'तुमच्या प्रदेशात हिवाळी लागवडीसाठी आदर्श.',
            type: 'crop',
            priority: 'high'
          },
          {
            id: 'rabi-crop-2',
            title: 'Chickpea',
            title_mr: 'हरभरा',
            description: 'Drought resistant and suitable for your soil conditions.',
            description_mr: 'दुष्काळ प्रतिरोधक आणि तुमच्या माती परिस्थितीसाठी योग्य.',
            type: 'crop',
            priority: 'medium'
          }
        ];
      }
    }
    
    // Default recommendations if region is not specifically matched
    return [
      {
        id: 'general-crop-1',
        title: 'Local Vegetable Cultivation',
        title_mr: 'स्थानिक भाजीपाला लागवड',
        description: 'Consider growing vegetables with local demand for better returns.',
        description_mr: 'चांगल्या परताव्यासाठी स्थानिक मागणी असलेल्या भाज्या वाढवण्याचा विचार करा.',
        type: 'crop',
        priority: 'medium'
      }
    ];
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-3">स्थानिक शिफारसी</h2>
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h2 className="text-xl font-semibold mb-3">स्थानिक शिफारसी</h2>
        <div className="bg-red-50 text-red-600 p-3 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-xl font-semibold mb-3">तुमच्या स्थानासाठी शिफारसी</h2>
      
      {recommendations.length === 0 ? (
        <p className="text-gray-500">सध्या कोणत्याही शिफारसी उपलब्ध नाहीत.</p>
      ) : (
        <div className="space-y-3">
          {recommendations.map((rec) => (
            <div 
              key={rec.id}
              className={`p-3 rounded-md ${
                rec.priority === 'high' 
                  ? 'bg-red-50 border-l-4 border-red-500' 
                  : rec.priority === 'medium'
                    ? 'bg-yellow-50 border-l-4 border-yellow-500'
                    : 'bg-blue-50 border-l-4 border-blue-500'
              }`}
            >
              <h3 className="font-medium text-gray-900">{rec.title_mr}</h3>
              <p className="text-sm text-gray-600 mt-1">{rec.description_mr}</p>
              <div className="mt-2 text-xs text-gray-500">
                {rec.type === 'crop' && 'पीक शिफारस'}
                {rec.type === 'practice' && 'शेती पद्धती'}
                {rec.type === 'alert' && 'सतर्कता'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationBasedRecommendations;