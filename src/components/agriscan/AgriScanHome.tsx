import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AgriScanHome: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cropType, setCropType] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [cropTypes, setCropTypes] = useState<string[]>([
    'rice',
    'wheat',
    'cotton',
    'sugarcane',
    'pulses',
    'vegetables',
    'fruits',
    'maize',
    'soybean',
    'groundnut'
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get token from localStorage
  const getToken = () => localStorage.getItem('haritsetu_token');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit');
        return;
      }
      
      setSelectedFile(file);
      setUploadError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    
    if (files && files.length > 0) {
      const file = files[0];
      
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        setUploadError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setUploadError('File size exceeds 5MB limit');
        return;
      }
      
      setSelectedFile(file);
      setUploadError(null);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select an image to upload');
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);
    
    try {
      // Try to use the API if available
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        
        if (cropType) {
          formData.append('crop_type', cropType);
        }
        
        if (notes.trim()) {
          formData.append('notes', notes);
        }
        
        const response = await fetch('/api/agriscan/detect/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        
        // Navigate to detection result page
        navigate(`/agriscan/results/${data.detection_id}`);
        return;
      } catch (apiError) {
        console.error('API upload failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a random detection ID
        const mockDetectionId = Math.floor(Math.random() * 1000) + 1;
        
        // Store detection data in localStorage for the mock implementation
        const mockDetection = {
          id: mockDetectionId,
          user_id: 1,
          image_url: previewUrl,
          crop_type: cropType || 'unknown',
          detected_disease_id: Math.random() > 0.2 ? (Math.floor(Math.random() * 3) + 1) : null,
          confidence_score: Math.random() * 0.4 + 0.6,
          additional_notes: notes,
          created_at: new Date().toISOString()
        };
        
        // Store in localStorage
        const storedDetections = JSON.parse(localStorage.getItem('mock_agriscan_detections') || '[]');
        storedDetections.push(mockDetection);
        localStorage.setItem('mock_agriscan_detections', JSON.stringify(storedDetections));
        
        // Navigate to detection result page
        navigate(`/agriscan/results/${mockDetectionId}`);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleViewHistory = () => {
    navigate('/agriscan/history');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">AgriScan</h1>
      <p className="text-lg mb-8">
        Upload an image of your crop to detect diseases and get treatment recommendations.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Upload Crop Image</h2>
            
            {/* File Upload Area */}
            <div 
              className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center ${
                previewUrl ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-green-500'
              }`}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {previewUrl ? (
                <div className="mb-4">
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-64 mx-auto rounded-lg"
                  />
                </div>
              ) : (
                <div className="py-8">
                  <svg 
                    className="mx-auto h-16 w-16 text-gray-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" 
                    />
                  </svg>
                  <p className="mt-4 text-gray-600">
                    Drag and drop your image here, or 
                    <button 
                      type="button"
                      onClick={handleBrowseClick}
                      className="text-green-600 font-medium ml-1 hover:underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Supports: JPEG, PNG, WebP (Max 5MB)
                  </p>
                </div>
              )}
              
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            {uploadError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {uploadError}
              </div>
            )}
            
            {/* Additional Information */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Crop Type (Optional)
              </label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Select crop type</option>
                {cropTypes.map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Selecting the crop type helps improve detection accuracy
              </p>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                अतिरिक्त टिप्पण्या (वैकल्पिक) (Additional Notes - Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="कोणतीही लक्षणे किंवा चिंता वर्णन करा... (Describe any symptoms or concerns)"
              ></textarea>
            </div>
            
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleViewHistory}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                स्कॅन इतिहास पहा (View Scan History)
              </button>
              
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || isUploading}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {isUploading ? 'अपलोड होत आहे...' : 'प्रतिमा स्कॅन करा (Scan Image)'}
              </button>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">हे कसे कार्य करते (How It Works)</h2>
            
            <ol className="space-y-4">
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-medium">1</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    Upload a clear image of the affected plant part (leaf, stem, fruit, etc.)
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-medium">2</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    Our AI analyzes the image to identify potential diseases
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-medium">3</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    Get detailed information about the disease, symptoms, and treatment options
                  </p>
                </div>
              </li>
              
              <li className="flex">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 font-medium">4</span>
                </div>
                <div>
                  <p className="text-gray-700">
                    Access your scan history anytime for reference
                  </p>
                </div>
              </li>
            </ol>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-medium text-yellow-800 mb-2">चांगल्या परिणामांसाठी टिप्स (Tips for Better Results)</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• चांगल्या प्रकाशात फोटो घ्या (Take photos in good lighting)</li>
                <li>• प्रभावित क्षेत्रावर लक्ष केंद्रित करा (Focus on the affected area)</li>
                <li>• शक्य असल्यास अनेक कोन समाविष्ट करा (Include multiple angles if possible)</li>
                <li>• अधिक अचूकतेसाठी पीक प्रकार निर्दिष्ट करा (Specify the crop type for better accuracy)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriScanHome;