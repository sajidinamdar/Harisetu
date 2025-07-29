import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Disease {
  id: number;
  name: string;
  name_marathi?: string;
  crop_type: string;
  symptoms: string;
  symptoms_marathi?: string;
  treatment: string;
  treatment_marathi?: string;
  prevention: string;
  prevention_marathi?: string;
  image_urls?: string[];
  created_at: string;
  updated_at: string;
}

interface Detection {
  id: number;
  user_id: number;
  image_url: string;
  crop_type?: string;
  detected_disease_id?: number;
  confidence_score?: number;
  additional_notes?: string;
  created_at: string;
  disease?: Disease;
}

const DetectionResult: React.FC = () => {
  const { detectionId } = useParams<{ detectionId: string }>();
  const [detection, setDetection] = useState<Detection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'symptoms' | 'treatment' | 'prevention'>('symptoms');
  const [isPolling, setIsPolling] = useState<boolean>(false);
  const [language, setLanguage] = useState<'english' | 'marathi'>('english');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get token from localStorage
  const getToken = () => localStorage.getItem('haritsetu_token');

  // Fetch detection details
  useEffect(() => {
    fetchDetection();
  }, [detectionId]);

  // Poll for results if processing
  useEffect(() => {
    if (detection && !detection.detected_disease_id && !error) {
      setIsPolling(true);
      const interval = setInterval(() => {
        fetchDetection(false);
      }, 3000);
      
      return () => {
        clearInterval(interval);
        setIsPolling(false);
      };
    } else {
      setIsPolling(false);
    }
  }, [detection, error]);

  const fetchDetection = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true);
    }
    setError(null);
    
    try {
      // Try to use the API if available
      try {
        const response = await fetch(`/api/agriscan/detections/${detectionId}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        setDetection(data);
        return;
      } catch (apiError) {
        console.error('API fetch failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Get stored detections from localStorage
        const storedDetections = JSON.parse(localStorage.getItem('mock_agriscan_detections') || '[]');
        const mockDetection = storedDetections.find((d: any) => d.id.toString() === detectionId);
        
        if (!mockDetection) {
          throw new Error('Detection not found');
        }
        
        // If there's a disease ID, add mock disease data
        if (mockDetection.detected_disease_id) {
          // Mock disease data
          const mockDiseases = [
            {
              id: 1,
              name: "Leaf Blast",
              name_marathi: "पान करपा",
              crop_type: "rice",
              symptoms: "Diamond-shaped lesions with gray centers and brown borders. Lesions can enlarge and kill entire leaves.",
              symptoms_marathi: "हिरे आकाराचे घाव ज्यांचे मध्य भाग राखाडी आणि किनारी तपकिरी असतात. घाव वाढू शकतात आणि संपूर्ण पाने मारू शकतात.",
              treatment: "Apply fungicides containing tricyclazole, propiconazole, or azoxystrobin. Ensure proper spacing between plants for good air circulation.",
              treatment_marathi: "ट्रायसायक्लाझोल, प्रोपिकोनाझोल, किंवा अझोक्सिस्ट्रोबिन असलेली बुरशीनाशके वापरा. चांगल्या हवेच्या संचारासाठी रोपांमध्ये योग्य अंतर ठेवा.",
              prevention: "Use resistant varieties. Avoid excessive nitrogen fertilization. Maintain field sanitation by removing crop debris.",
              prevention_marathi: "प्रतिरोधक वाण वापरा. अतिरिक्त नायट्रोजन खतांचा वापर टाळा. पीक अवशेष काढून टाकून शेताची स्वच्छता राखा.",
              image_urls: ["https://www.plantix.net/en/library/plant-diseases/100001/rice-blast"],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 2,
              name: "Powdery Mildew",
              name_marathi: "भुरी",
              crop_type: "wheat",
              symptoms: "White, powdery patches on leaves, stems, and heads. Affected tissues may turn yellow and die.",
              symptoms_marathi: "पाने, खोड आणि कणसांवर पांढरे, भुरकट डाग. प्रभावित ऊती पिवळ्या होऊन मरू शकतात.",
              treatment: "Apply sulfur-based fungicides or products containing tebuconazole. Treat early when symptoms first appear.",
              treatment_marathi: "सल्फर-आधारित बुरशीनाशके किंवा टेब्युकोनाझोल असलेले उत्पादने वापरा. लक्षणे प्रथम दिसताच लवकर उपचार करा.",
              prevention: "Plant resistant varieties. Avoid dense planting. Rotate crops with non-susceptible plants.",
              prevention_marathi: "प्रतिरोधक वाण लावा. दाट लागवड टाळा. असंवेदनशील वनस्पतींसह पिके फिरवा.",
              image_urls: ["https://www.plantix.net/en/library/plant-diseases/100057/powdery-mildew-of-cereals"],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            },
            {
              id: 3,
              name: "Bacterial Leaf Blight",
              name_marathi: "करपा",
              crop_type: "rice",
              symptoms: "Water-soaked lesions on leaf margins that turn yellow and then grayish-white as they expand.",
              symptoms_marathi: "पानांच्या किनारींवर पाण्याने भिजलेले घाव जे वाढत असताना पिवळे आणि नंतर राखाडी-पांढरे होतात.",
              treatment: "No effective chemical control. Remove and destroy infected plants. Use copper-based bactericides preventively.",
              treatment_marathi: "प्रभावी रासायनिक नियंत्रण नाही. संक्रमित रोपे काढून नष्ट करा. प्रतिबंधात्मकरित्या तांबे-आधारित जीवाणुनाशके वापरा.",
              prevention: "Use resistant varieties. Practice crop rotation. Use disease-free seeds and maintain field sanitation.",
              prevention_marathi: "प्रतिरोधक वाण वापरा. पीक फेरपालट करा. रोगमुक्त बियाणे वापरा आणि शेताची स्वच्छता राखा.",
              image_urls: ["https://www.plantix.net/en/library/plant-diseases/100029/bacterial-leaf-blight"],
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }
          ];
          
          mockDetection.disease = mockDiseases.find((d: any) => d.id === mockDetection.detected_disease_id);
        }
        
        setDetection(mockDetection);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getConfidenceColor = (score?: number) => {
    if (!score) return 'bg-gray-100 text-gray-800';
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getConfidenceText = (score?: number) => {
    if (!score) return 'Unknown';
    return `${Math.round(score * 100)}%`;
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading detection results...</p>
      </div>
    );
  }

  if (error || !detection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Detection not found'}
        </div>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          onClick={() => navigate('/agriscan')}
        >
          Back to AgriScan
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        className="mb-4 flex items-center text-green-600 hover:text-green-800"
        onClick={() => navigate('/agriscan')}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to AgriScan
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">Scan Results</h1>
          <p className="text-gray-600 mb-6">
            Scan ID: {detection.id} • {formatDate(detection.created_at)}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Image and Basic Info */}
            <div>
              <div className="bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img 
                  src={detection.image_url} 
                  alt="Scanned crop" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Scan Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Crop Type</p>
                    <p className="font-medium">{detection.crop_type || 'Not specified'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Confidence</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(detection.confidence_score)}`}>
                      {getConfidenceText(detection.confidence_score)}
                    </span>
                  </div>
                </div>
                
                {detection.additional_notes && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Additional Notes</p>
                    <p className="text-gray-700">{detection.additional_notes}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Disease Information */}
            <div>
              {isPolling ? (
                <div className="bg-blue-50 p-6 rounded-lg text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <h3 className="text-xl font-medium text-blue-800 mb-2">Processing Your Image</h3>
                  <p className="text-blue-600">
                    Our AI is analyzing your crop image. This may take a few moments...
                  </p>
                </div>
              ) : detection.disease ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-red-700">
                      {language === 'english' ? detection.disease.name : detection.disease.name_marathi || detection.disease.name}
                    </h2>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setLanguage('english')}
                        className={`px-3 py-1 text-sm rounded-md ${language === 'english' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        English
                      </button>
                      <button
                        onClick={() => setLanguage('marathi')}
                        className={`px-3 py-1 text-sm rounded-md ${language === 'marathi' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                      >
                        मराठी
                      </button>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex border-b">
                      <button
                        className={`px-4 py-2 font-medium ${activeTab === 'symptoms' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('symptoms')}
                      >
                        Symptoms
                      </button>
                      <button
                        className={`px-4 py-2 font-medium ${activeTab === 'treatment' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('treatment')}
                      >
                        Treatment
                      </button>
                      <button
                        className={`px-4 py-2 font-medium ${activeTab === 'prevention' ? 'text-green-600 border-b-2 border-green-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('prevention')}
                      >
                        Prevention
                      </button>
                    </div>
                    
                    <div className="p-4">
                      {activeTab === 'symptoms' && (
                        <p className="text-gray-700 whitespace-pre-line">
                          {language === 'english' 
                            ? detection.disease.symptoms 
                            : detection.disease.symptoms_marathi || detection.disease.symptoms}
                        </p>
                      )}
                      
                      {activeTab === 'treatment' && (
                        <p className="text-gray-700 whitespace-pre-line">
                          {language === 'english' 
                            ? detection.disease.treatment 
                            : detection.disease.treatment_marathi || detection.disease.treatment}
                        </p>
                      )}
                      
                      {activeTab === 'prevention' && (
                        <p className="text-gray-700 whitespace-pre-line">
                          {language === 'english' 
                            ? detection.disease.prevention 
                            : detection.disease.prevention_marathi || detection.disease.prevention}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {detection.disease.image_urls && detection.disease.image_urls.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Reference Images</h3>
                      <div className="grid grid-cols-3 gap-2">
                        {detection.disease.image_urls.map((url, index) => (
                          <img 
                            key={index}
                            src={url}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-24 object-cover rounded-md"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-yellow-50 p-6 rounded-lg">
                  <h3 className="text-xl font-medium text-yellow-800 mb-2">No Disease Detected</h3>
                  <p className="text-yellow-700 mb-4">
                    Our system did not detect any known diseases in your crop image. This could mean:
                  </p>
                  <ul className="list-disc list-inside text-yellow-700 space-y-1">
                    <li>Your crop is healthy</li>
                    <li>The disease symptoms are not clearly visible in the image</li>
                    <li>The disease is not in our database</li>
                  </ul>
                  <div className="mt-4 p-3 bg-white rounded-md">
                    <p className="text-gray-700">
                      If you still suspect a problem with your crop, try uploading a clearer image or 
                      consult with an agricultural expert.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionResult;