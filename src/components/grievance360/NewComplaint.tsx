
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  title: string;
  description: string;
  category: string;
  location: string;
}

const NewComplaint: React.FC = () => {
  const initialFormData: FormData = {
    title: '',
    description: '',
    category: '',
    location: ''
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [categories] = useState<string[]>([
    'irrigation',
    'subsidy',
    'crop_damage',
    'market_access',
    'infrastructure',
    'pest_control',
    'land_dispute',
    'water_supply',
    'electricity',
    'other'
  ]);
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get token from localStorage
  const getToken = () => localStorage.getItem('haritsetu_token');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Try to use the API if available
      try {
        const response = await fetch('/api/complaints/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to submit complaint');
        }
        
        const data = await response.json();
        navigate(`/grievance360/complaints/${data.id}`);
        return;
      } catch (apiError) {
        console.error('API submission failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Generate a random ID for the mock complaint
        const mockId = Math.floor(Math.random() * 1000) + 6;
        
        // Store complaint in localStorage for the mock implementation
        const mockComplaint = {
          id: mockId,
          ...formData,
          status: 'pending',
          user_id: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Store in localStorage
        const storedComplaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        storedComplaints.push(mockComplaint);
        localStorage.setItem('mock_complaints', JSON.stringify(storedComplaints));
        
        // Navigate to the complaint detail page
        navigate(`/grievance360/complaints/${mockId}`);
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        className="mb-4 flex items-center text-green-600 hover:text-green-800"
        onClick={() => navigate('/grievance360')}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        तक्रारींकडे परत जा (Back to Complaints)
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">नवीन तक्रार दाखल करा (File New Complaint)</h1>
          
          {submitError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {submitError}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                शीर्षक (Title) *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full p-2 border ${errors.title ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                placeholder="Brief title of your complaint"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className={`w-full p-2 border ${errors.category ? 'border-red-500' : 'border-gray-300'} rounded-md`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {formatCategory(category)}
                  </option>
                ))}
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className={`w-full p-2 border ${errors.location ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                placeholder="Village, District, etc."
              />
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={6}
                className={`w-full p-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                placeholder="Provide detailed information about your complaint..."
              ></textarea>
              {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => navigate('/grievance360')}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Tips for Filing an Effective Complaint</h2>
        
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Be specific:</strong> Include all relevant details such as dates, locations, and people involved.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Be clear:</strong> Explain the issue in simple, straightforward language.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Provide evidence:</strong> Mention any documents, photographs, or witnesses that can support your complaint.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Be factual:</strong> Stick to the facts and avoid exaggerations or emotional language.</span>
          </li>
          <li className="flex items-start">
            <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span><strong>Suggest a solution:</strong> If possible, include what you think would be a fair resolution.</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NewComplaint;