import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Disease {
  id: number;
  name: string;
  crop_type: string;
}

interface Detection {
  id: number;
  image_url: string;
  crop_type?: string;
  detected_disease_id?: number;
  confidence_score?: number;
  created_at: string;
  disease?: Disease;
}

const ScanHistory: React.FC = () => {
  const [detections, setDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'detected' | 'not_detected'>('all');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get token from localStorage
  const getToken = () => localStorage.getItem('haritsetu_token');

  useEffect(() => {
    fetchDetections();
  }, []);

  const fetchDetections = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to use the API if available
      try {
        const response = await fetch('/api/agriscan/detections/', {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        setDetections(data);
        return;
      } catch (apiError) {
        console.error('API fetch failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Get stored detections from localStorage
        const storedDetections = JSON.parse(localStorage.getItem('mock_agriscan_detections') || '[]');
        
        // Add mock disease data
        const mockDiseases = [
          {
            id: 1,
            name: "Leaf Blast",
            crop_type: "rice"
          },
          {
            id: 2,
            name: "Powdery Mildew",
            crop_type: "wheat"
          },
          {
            id: 3,
            name: "Bacterial Leaf Blight",
            crop_type: "rice"
          }
        ];
        
        // Add disease info to detections
        const detectionsWithDiseases = storedDetections.map((detection: any) => {
          if (detection.detected_disease_id) {
            return {
              ...detection,
              disease: mockDiseases.find(d => d.id === detection.detected_disease_id)
            };
          }
          return detection;
        });
        
        setDetections(detectionsWithDiseases);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
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

  const filteredDetections = () => {
    switch (filter) {
      case 'detected':
        return detections.filter(d => d.detected_disease_id);
      case 'not_detected':
        return detections.filter(d => !d.detected_disease_id);
      default:
        return detections;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading scan history...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Scan History</h1>
          <p className="text-gray-600">View your previous crop disease scans</p>
        </div>
        
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          onClick={() => navigate('/agriscan')}
        >
          New Scan
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {detections.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-700">No Scans Found</h2>
          <p className="mt-2 text-gray-500">You haven't performed any crop disease scans yet.</p>
          <button 
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            onClick={() => navigate('/agriscan')}
          >
            Scan Your First Crop
          </button>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 rounded-md ${filter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('all')}
              >
                All Scans
              </button>
              <button
                className={`px-4 py-2 rounded-md ${filter === 'detected' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('detected')}
              >
                Diseases Detected
              </button>
              <button
                className={`px-4 py-2 rounded-md ${filter === 'not_detected' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                onClick={() => setFilter('not_detected')}
              >
                No Diseases
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDetections().map((detection) => (
              <div 
                key={detection.id} 
                className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => navigate(`/agriscan/results/${detection.id}`)}
              >
                <div className="relative h-48 bg-gray-200">
                  <img 
                    src={detection.image_url} 
                    alt={`Scan ${detection.id}`} 
                    className="w-full h-full object-cover"
                  />
                  {detection.detected_disease_id && (
                    <div className="absolute top-2 right-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                      Disease Detected
                    </div>
                  )}
                </div>
                
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium">
                        {detection.disease ? detection.disease.name : 'No Disease Detected'}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {detection.crop_type 
                          ? `${detection.crop_type.charAt(0).toUpperCase() + detection.crop_type.slice(1)}` 
                          : 'Unknown Crop'}
                      </p>
                    </div>
                    
                    {detection.confidence_score !== undefined && (
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(detection.confidence_score)}`}>
                        {getConfidenceText(detection.confidence_score)}
                      </span>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500 mt-2">
                    {formatDate(detection.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ScanHistory;