import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { formatServiceType } from '../../utils/formatters';

interface AgriService {
  id: number;
  name: string;
  name_marathi?: string;
  service_type: string;
  description?: string;
  description_marathi?: string;
  address: string;
  district: string;
  state: string;
  latitude: number;
  longitude: number;
  contact_phone?: string;
  contact_email?: string;
  website?: string;
  opening_hours?: string;
  services_offered?: string[];
  image_urls?: string[];
  is_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface ServiceTypeOption {
  value: string;
  label: string;
  icon: string;
}

const serviceTypeOptions: ServiceTypeOption[] = [
  { value: 'veterinary', label: 'Veterinary Services', icon: '🐄' },
  { value: 'fertilizer_shop', label: 'Fertilizer Shops', icon: '🌱' },
  { value: 'seed_shop', label: 'Seed Shops', icon: '🌾' },
  { value: 'irrigation_service', label: 'Irrigation Services', icon: '💧' },
  { value: 'equipment_rental', label: 'Equipment Rental', icon: '🚜' },
  { value: 'agricultural_bank', label: 'Agricultural Banks', icon: '🏦' },
  { value: 'government_office', label: 'Government Offices', icon: '🏛️' },
  { value: 'cooperative_society', label: 'Cooperative Societies', icon: '👥' },
  { value: 'cold_storage', label: 'Cold Storage', icon: '❄️' },
  { value: 'processing_unit', label: 'Processing Units', icon: '🏭' },
  { value: 'market_yard', label: 'Market Yards', icon: '🛒' },
];

const AgriConnectHome: React.FC = () => {
  const [services, setServices] = useState<AgriService[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [districts, setDistricts] = useState<string[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchRadius, setSearchRadius] = useState<number>(10);
  const [searchMode, setSearchMode] = useState<'filter' | 'nearby'>('filter');
  
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get token from localStorage
  const getToken = () => localStorage.getItem('haritsetu_token');

  // Fetch all services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  // Get user's location if they choose nearby search
  useEffect(() => {
    if (searchMode === 'nearby' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setError("Could not get your location. Please enable location services.");
        }
      );
    }
  }, [searchMode]);

  // Extract unique districts from services
  useEffect(() => {
    if (services.length > 0) {
      const uniqueDistricts = [...new Set(services.map(service => service.district))];
      setDistricts(uniqueDistricts);
    }
  }, [services]);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to use the API if available
      try {
        let url = '/api/agriconnect/services/';
        
        if (searchMode === 'filter') {
          // Add query parameters for filtering
          const params = new URLSearchParams();
          if (selectedType) params.append('service_type', selectedType);
          if (selectedDistrict) params.append('district', selectedDistrict);
          
          if (params.toString()) {
            url += `?${params.toString()}`;
          }
        } else if (searchMode === 'nearby' && userLocation) {
          // Use nearby endpoint with location
          url = `/api/agriconnect/services/nearby?latitude=${userLocation.lat}&longitude=${userLocation.lng}&radius=${searchRadius}`;
          if (selectedType) url += `&service_type=${selectedType}`;
        }
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        setServices(data);
        return;
      } catch (apiError) {
        console.error('API fetch failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock services data
        const mockServices: AgriService[] = [
          {
            id: 1,
            name: "Pune Agricultural Supply Center",
            name_marathi: "पुणे कृषी पुरवठा केंद्र",
            service_type: "supply_store",
            description: "Agricultural supplies including seeds, fertilizers, and tools",
            description_marathi: "बियाणे, खते आणि अवजारे यांसह कृषी पुरवठा",
            address: "123 Farm Road, Pune",
            district: "Pune",
            state: "Maharashtra",
            latitude: 18.5204,
            longitude: 73.8567,
            contact_phone: "+91-9876543210",
            contact_email: "info@puneagri.com",
            website: "www.puneagri.com",
            opening_hours: "9:00 AM - 6:00 PM",
            is_verified: true,
            is_active: true,
            created_at: "2023-01-15T10:30:00Z",
            updated_at: "2023-06-20T14:45:00Z"
          },
          {
            id: 2,
            name: "Dr. Patil Veterinary Clinic",
            name_marathi: "डॉ. पाटील पशुवैद्यकीय क्लिनिक",
            service_type: "veterinary",
            description: "Veterinary services for farm animals",
            description_marathi: "शेतातील प्राण्यांसाठी पशुवैद्यकीय सेवा",
            address: "45 Rural Avenue, Pune",
            district: "Pune",
            state: "Maharashtra",
            latitude: 18.5314,
            longitude: 73.8446,
            contact_phone: "+91-9876543211",
            opening_hours: "8:00 AM - 8:00 PM",
            is_verified: true,
            is_active: true,
            created_at: "2023-02-10T09:15:00Z",
            updated_at: "2023-07-05T11:30:00Z"
          },
          {
            id: 3,
            name: "Maharashtra Farmers' Cooperative Bank",
            name_marathi: "महाराष्ट्र शेतकरी सहकारी बँक",
            service_type: "agricultural_bank",
            description: "Financial services for farmers including loans and insurance",
            description_marathi: "कर्ज आणि विमा यांसह शेतकऱ्यांसाठी आर्थिक सेवा",
            address: "78 Main Street, Pune",
            district: "Pune",
            state: "Maharashtra",
            latitude: 18.5167,
            longitude: 73.8562,
            contact_phone: "+91-9876543212",
            contact_email: "info@mfcbank.com",
            website: "www.mfcbank.com",
            opening_hours: "10:00 AM - 5:00 PM",
            is_verified: true,
            is_active: true,
            created_at: "2023-03-20T08:45:00Z",
            updated_at: "2023-08-15T16:20:00Z"
          },
          {
            id: 4,
            name: "Nashik Agricultural Equipment Rental",
            name_marathi: "नाशिक कृषी उपकरणे भाडेतत्वावर",
            service_type: "equipment_rental",
            description: "Rental services for tractors and other farming equipment",
            description_marathi: "ट्रॅक्टर आणि इतर शेती उपकरणांसाठी भाडे सेवा",
            address: "34 Tractor Lane, Nashik",
            district: "Nashik",
            state: "Maharashtra",
            latitude: 19.9975,
            longitude: 73.7898,
            contact_phone: "+91-9876543213",
            is_verified: true,
            is_active: true,
            created_at: "2023-04-05T13:10:00Z",
            updated_at: "2023-09-01T10:45:00Z"
          },
          {
            id: 5,
            name: "Nagpur Cold Storage Facility",
            name_marathi: "नागपूर शीत साठवण सुविधा",
            service_type: "cold_storage",
            description: "Cold storage for fruits, vegetables, and other perishable farm products",
            description_marathi: "फळे, भाज्या आणि इतर नाशवंत शेती उत्पादनांसाठी शीत साठवण",
            address: "56 Cold Storage Road, Nagpur",
            district: "Nagpur",
            state: "Maharashtra",
            latitude: 21.1458,
            longitude: 79.0882,
            contact_phone: "+91-9876543214",
            contact_email: "info@nagpurcold.com",
            is_verified: true,
            is_active: true,
            created_at: "2023-05-12T11:25:00Z",
            updated_at: "2023-10-10T09:30:00Z"
          }
        ];
        
        // Filter based on selected criteria
        let filteredServices = [...mockServices];
        
        if (selectedType) {
          filteredServices = filteredServices.filter(service => service.service_type === selectedType);
        }
        
        if (selectedDistrict) {
          filteredServices = filteredServices.filter(service => service.district === selectedDistrict);
        }
        
        if (searchMode === 'nearby' && userLocation) {
          // Simple distance calculation (not accurate for real-world use)
          filteredServices = filteredServices.filter(service => {
            const distance = Math.sqrt(
              Math.pow(service.latitude - userLocation.lat, 2) + 
              Math.pow(service.longitude - userLocation.lng, 2)
            ) * 111; // Rough conversion to km
            return distance <= searchRadius;
          });
        }
        
        setServices(filteredServices);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchServices();
  };

  const handleViewDetails = (serviceId: number) => {
    // For now, just show an alert with the service details
    const service = services.find(s => s.id === serviceId);
    if (service) {
      alert(`Service Details:\n\nName: ${service.name}\nType: ${formatServiceType(service.service_type)}\nAddress: ${service.address}\nContact: ${service.contact_phone || 'N/A'}\n\nThis is a placeholder. In a real app, this would navigate to a detailed view.`);
    }
  };

  const getServiceTypeLabel = (type: string): ServiceTypeOption => {
    return serviceTypeOptions.find(option => option.value === type) || 
      { value: type, label: type.replace('_', ' '), icon: '🏢' };
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">AgriConnect</h1>
      <p className="text-lg mb-8">
        Find agricultural services near you - connect with veterinarians, fertilizer shops, 
        irrigation services, and more to support your farming needs.
      </p>
      
      {/* Search Controls */}
      <div className="bg-green-50 p-6 rounded-lg shadow-md mb-8">
        <div className="flex items-center mb-4">
          <button 
            className={`px-4 py-2 rounded-l-lg ${searchMode === 'filter' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSearchMode('filter')}
          >
            Filter Search
          </button>
          <button 
            className={`px-4 py-2 rounded-r-lg ${searchMode === 'nearby' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setSearchMode('nearby')}
          >
            Nearby Search
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="">All Services</option>
              {serviceTypeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.icon} {option.label}
                </option>
              ))}
            </select>
          </div>
          
          {searchMode === 'filter' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
              >
                <option value="">All Districts</option>
                {districts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>
          )}
          
          {searchMode === 'nearby' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search Radius (km)</label>
              <input 
                type="number" 
                className="w-full p-2 border border-gray-300 rounded-md"
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                min="1"
                max="100"
              />
            </div>
          )}
        </div>
        
        <button 
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading services...</p>
        </div>
      ) : (
        <>
          {/* Results */}
          {services.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No services found. Try adjusting your search criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map(service => (
                <div key={service.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  {service.image_urls && service.image_urls.length > 0 ? (
                    <img 
                      src={service.image_urls[0]} 
                      alt={service.name} 
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <span className="text-4xl">{getServiceTypeLabel(service.service_type).icon}</span>
                    </div>
                  )}
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-semibold">{service.name}</h3>
                      {service.is_verified && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Verified</span>
                      )}
                    </div>
                    
                    {service.name_marathi && (
                      <p className="text-gray-600 mb-2">{service.name_marathi}</p>
                    )}
                    
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span className="mr-1">{getServiceTypeLabel(service.service_type).icon}</span>
                      <span>{getServiceTypeLabel(service.service_type).label}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-2">{service.address}</p>
                    <p className="text-gray-600 mb-4">{service.district}, {service.state}</p>
                    
                    {service.contact_phone && (
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Phone:</span> {service.contact_phone}
                      </p>
                    )}
                    
                    <button 
                      className="w-full mt-2 bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors"
                      onClick={() => handleViewDetails(service.id)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AgriConnectHome;