import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  name: string;
  name_marathi: string;
  service_type: string;
  description: string;
  description_marathi: string;
  address: string;
  district: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  contact_phone: string;
  contact_email: string;
  website: string;
  opening_hours: string;
  services_offered: string[];
  image_urls: string[];
}

// Interface for cleaned data that allows null values for string fields
interface CleanedFormData {
  name: string;
  name_marathi: string | null;
  service_type: string;
  description: string | null;
  description_marathi: string | null;
  address: string;
  district: string;
  state: string;
  latitude: number | null;
  longitude: number | null;
  contact_phone: string | null;
  contact_email: string | null;
  website: string | null;
  opening_hours: string | null;
  services_offered: string[];
  image_urls: string[];
}

const AddServiceForm: React.FC = () => {
  const initialFormData: FormData = {
    name: '',
    name_marathi: '',
    service_type: '',
    description: '',
    description_marathi: '',
    address: '',
    district: '',
    state: '',
    latitude: null,
    longitude: null,
    contact_phone: '',
    contact_email: '',
    website: '',
    opening_hours: '',
    services_offered: [],
    image_urls: []
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [serviceTypes, setServiceTypes] = useState<string[]>([]);
  const [newService, setNewService] = useState<string>('');
  const [useCurrentLocation, setUseCurrentLocation] = useState<boolean>(false);
  const [locationLoading, setLocationLoading] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('haritsetu_token') || '';

  // Fetch service types on component mount
  useEffect(() => {
    fetchServiceTypes();
  }, []);

  // Get current location if user chooses to use it
  useEffect(() => {
    if (useCurrentLocation) {
      getCurrentLocation();
    }
  }, [useCurrentLocation]);

  const fetchServiceTypes = async () => {
    try {
      const response = await fetch('/api/agriconnect/service-types', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch service types');
      }
      
      const data = await response.json();
      setServiceTypes(data);
    } catch (err) {
      console.error('Error fetching service types:', err);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setUseCurrentLocation(false);
      return;
    }
    
    setLocationLoading(true);
    setLocationError(null);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setLocationLoading(false);
      },
      (error) => {
        setLocationError(`Error getting location: ${error.message}`);
        setLocationLoading(false);
        setUseCurrentLocation(false);
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value === '' ? null : parseFloat(value) });
    
    // Clear error for this field if it exists
    if (errors[name as keyof FormData]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleAddService = () => {
    if (newService.trim()) {
      if (!formData.services_offered.includes(newService.trim())) {
        setFormData({
          ...formData,
          services_offered: [...formData.services_offered, newService.trim()]
        });
      }
      setNewService('');
    }
  };

  const handleRemoveService = (index: number) => {
    const updatedServices = [...formData.services_offered];
    updatedServices.splice(index, 1);
    setFormData({ ...formData, services_offered: updatedServices });
  };

  const handleAddImageUrl = () => {
    setFormData({
      ...formData,
      image_urls: [...formData.image_urls, '']
    });
  };

  const handleImageUrlChange = (index: number, value: string) => {
    const updatedUrls = [...formData.image_urls];
    updatedUrls[index] = value;
    setFormData({ ...formData, image_urls: updatedUrls });
  };

  const handleRemoveImageUrl = (index: number) => {
    const updatedUrls = [...formData.image_urls];
    updatedUrls.splice(index, 1);
    setFormData({ ...formData, image_urls: updatedUrls });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.service_type) newErrors.service_type = 'Service type is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.district.trim()) newErrors.district = 'District is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    
    // Coordinates
    if (formData.latitude === null) newErrors.latitude = 'Latitude is required';
    if (formData.longitude === null) newErrors.longitude = 'Longitude is required';
    
    // Email validation
    if (formData.contact_email && !/^\S+@\S+\.\S+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }
    
    // Website validation
    if (formData.website && !formData.website.startsWith('http')) {
      newErrors.website = 'Website URL must start with http:// or https://';
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
      // Clean up empty strings in optional fields
      const cleanedData: CleanedFormData = { ...formData };
      Object.keys(cleanedData).forEach((key) => {
        const k = key as keyof FormData;
        if (typeof cleanedData[k] === 'string' && (cleanedData[k] as string).trim() === '') {
          (cleanedData as any)[k] = null;
        }
      });
      
      // Remove empty image URLs
      cleanedData.image_urls = cleanedData.image_urls.filter(url => url.trim() !== '');
      
      const response = await fetch('/api/agriconnect/services/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(cleanedData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create service');
      }
      
      const data = await response.json();
      navigate(`/agriconnect/services/${data.id}`);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add Agricultural Service</h1>
      
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {submitError}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (English) *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name (Marathi)</label>
            <input
              type="text"
              name="name_marathi"
              value={formData.name_marathi}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type *</label>
            <select
              name="service_type"
              value={formData.service_type}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.service_type ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            >
              <option value="">Select a service type</option>
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </select>
            {errors.service_type && <p className="mt-1 text-sm text-red-600">{errors.service_type}</p>}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (English)</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (Marathi)</label>
            <textarea
              name="description_marathi"
              value={formData.description_marathi}
              onChange={handleInputChange}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md"
            ></textarea>
          </div>
          
          {/* Location Information */}
          <div className="md:col-span-2 border-t pt-6 mt-2">
            <h2 className="text-xl font-semibold mb-4">Location Information</h2>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.address ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">District *</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.district ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.district && <p className="mt-1 text-sm text-red-600">{errors.district}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.state ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
          </div>
          
          <div className="md:col-span-2">
            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="useCurrentLocation"
                checked={useCurrentLocation}
                onChange={(e) => setUseCurrentLocation(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="useCurrentLocation" className="text-sm font-medium text-gray-700">
                Use my current location
              </label>
            </div>
            
            {locationLoading && <p className="text-sm text-gray-600">Getting your location...</p>}
            {locationError && <p className="text-sm text-red-600">{locationError}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Latitude *</label>
            <input
              type="number"
              name="latitude"
              value={formData.latitude === null ? '' : formData.latitude}
              onChange={handleNumberInputChange}
              step="any"
              disabled={useCurrentLocation}
              className={`w-full p-2 border ${errors.latitude ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.latitude && <p className="mt-1 text-sm text-red-600">{errors.latitude}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Longitude *</label>
            <input
              type="number"
              name="longitude"
              value={formData.longitude === null ? '' : formData.longitude}
              onChange={handleNumberInputChange}
              step="any"
              disabled={useCurrentLocation}
              className={`w-full p-2 border ${errors.longitude ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.longitude && <p className="mt-1 text-sm text-red-600">{errors.longitude}</p>}
          </div>
          
          {/* Contact Information */}
          <div className="md:col-span-2 border-t pt-6 mt-2">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleInputChange}
              className={`w-full p-2 border ${errors.contact_email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.contact_email && <p className="mt-1 text-sm text-red-600">{errors.contact_email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
            <input
              type="text"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              placeholder="https://"
              className={`w-full p-2 border ${errors.website ? 'border-red-500' : 'border-gray-300'} rounded-md`}
            />
            {errors.website && <p className="mt-1 text-sm text-red-600">{errors.website}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Opening Hours</label>
            <input
              type="text"
              name="opening_hours"
              value={formData.opening_hours}
              onChange={handleInputChange}
              placeholder="e.g., Mon-Fri: 9AM-5PM, Sat: 10AM-2PM"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Additional Information */}
          <div className="md:col-span-2 border-t pt-6 mt-2">
            <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Services Offered</label>
            
            <div className="flex mb-2">
              <input
                type="text"
                value={newService}
                onChange={(e) => setNewService(e.target.value)}
                placeholder="Add a service offered"
                className="flex-grow p-2 border border-gray-300 rounded-l-md"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="bg-green-600 text-white px-4 py-2 rounded-r-md hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
            
            {formData.services_offered.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {formData.services_offered.map((service, index) => (
                  <div key={index} className="bg-green-50 px-3 py-1 rounded-full flex items-center">
                    <span>{service}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(index)}
                      className="ml-2 text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URLs</label>
            
            {formData.image_urls.map((url, index) => (
              <div key={index} className="flex mb-2">
                <input
                  type="text"
                  value={url}
                  onChange={(e) => handleImageUrlChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-grow p-2 border border-gray-300 rounded-l-md"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImageUrl(index)}
                  className="bg-red-500 text-white px-4 py-2 hover:bg-red-600 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
            
            <button
              type="button"
              onClick={handleAddImageUrl}
              className="mt-2 text-green-600 hover:text-green-800 flex items-center"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Image URL
            </button>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/agriconnect')}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
          >
            {isSubmitting ? 'Submitting...' : 'Add Service'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddServiceForm;