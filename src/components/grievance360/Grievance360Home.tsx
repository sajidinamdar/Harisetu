 import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  priority: string;
  user_id: number;
  assigned_to?: number;
  created_at: string;
  updated_at: string;
}

const Grievance360Home: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [categories, setCategories] = useState<string[]>([
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
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get token from localStorage
  const getToken = () => localStorage.getItem('haritsetu_token');

  useEffect(() => {
    fetchComplaints();
  }, [statusFilter, categoryFilter]);

  const fetchComplaints = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to use the API if available
      try {
        let url = '/api/complaints/';
        const params = new URLSearchParams();
        
        if (statusFilter) {
          params.append('status', statusFilter);
        }
        
        if (categoryFilter) {
          params.append('category', categoryFilter);
        }
        
        if (params.toString()) {
          url += `?${params.toString()}`;
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
        setComplaints(data);
        return;
      } catch (apiError) {
        console.error('API fetch failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock complaints data
        const mockComplaints: Complaint[] = [
          {
            id: 1,
            title: "Water shortage in irrigation canal",
            description: "The irrigation canal in our village has been dry for the past week. We need urgent assistance.",
            category: "irrigation",
            location: "Pune",
            status: "pending",
            priority: "high",
            user_id: 1,
            created_at: "2023-06-15T10:30:00Z",
            updated_at: "2023-06-15T10:30:00Z"
          },
          {
            id: 2,
            title: "Pest infestation in wheat crop",
            description: "My wheat crop is showing signs of pest infestation. Need guidance on pesticide application.",
            category: "pest_control",
            location: "Pune",
            status: "assigned",
            priority: "medium",
            user_id: 1,
            assigned_to: 3,
            created_at: "2023-06-10T14:20:00Z",
            updated_at: "2023-06-11T09:15:00Z"
          },
          {
            id: 3,
            title: "Damaged road to agricultural market",
            description: "The road connecting our village to the agricultural market is severely damaged, making it difficult to transport produce.",
            category: "infrastructure",
            location: "Nashik",
            status: "in_progress",
            priority: "medium",
            user_id: 1,
            assigned_to: 2,
            created_at: "2023-06-05T08:45:00Z",
            updated_at: "2023-06-07T11:30:00Z"
          },
          {
            id: 4,
            title: "Delay in subsidy disbursement",
            description: "I applied for the fertilizer subsidy three months ago but haven't received it yet. Please expedite the process.",
            category: "subsidy",
            location: "Pune",
            status: "resolved",
            priority: "low",
            user_id: 1,
            assigned_to: 2,
            created_at: "2023-05-20T16:10:00Z",
            updated_at: "2023-06-12T14:25:00Z"
          },
          {
            id: 5,
            title: "Power outage affecting water pumps",
            description: "Frequent power outages in our area are affecting irrigation. Water pumps cannot operate properly.",
            category: "electricity",
            location: "Nagpur",
            status: "pending",
            priority: "high",
            user_id: 1,
            created_at: "2023-06-14T12:00:00Z",
            updated_at: "2023-06-14T12:00:00Z"
          }
        ];
        
        // Filter based on selected criteria
        let filteredComplaints = [...mockComplaints];
        
        if (statusFilter && statusFilter !== 'all') {
          filteredComplaints = filteredComplaints.filter(complaint => complaint.status === statusFilter);
        }
        
        if (categoryFilter && categoryFilter !== 'all') {
          filteredComplaints = filteredComplaints.filter(complaint => complaint.category === categoryFilter);
        }
        
        setComplaints(filteredComplaints);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'assigned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-blue-100 text-blue-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'urgent':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const handleNewComplaint = () => {
    navigate('/grievance360/new');
  };

  const handleViewComplaint = (id: number) => {
    navigate(`/grievance360/complaints/${id}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">तक्रार ३६० (Grievance360)</h1>
          <p className="text-gray-600">आपल्या शेती संबंधित समस्यांचा मागोवा घ्या आणि त्यांचे निराकरण करा (Track and resolve your farming-related issues)</p>
        </div>
        
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          onClick={handleNewComplaint}
        >
          नवीन तक्रार दाखल करा (File New Complaint)
        </button>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-medium mb-4">तक्रारी फिल्टर करा (Filter Complaints)</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">स्थिती (Status)</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">सर्व स्थिती (All Statuses)</option>
              <option value="pending">प्रलंबित (Pending)</option>
              <option value="assigned">नियुक्त (Assigned)</option>
              <option value="in_progress">प्रगतीपथावर (In Progress)</option>
              <option value="resolved">निराकरण झाले (Resolved)</option>
              <option value="closed">बंद (Closed)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">श्रेणी (Category)</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">सर्व श्रेणी (All Categories)</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {formatCategory(category)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
          <p className="mt-2 text-gray-600">तक्रारी लोड होत आहेत... (Loading complaints...)</p>
        </div>
      ) : complaints.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h2 className="mt-4 text-xl font-medium text-gray-700">कोणत्याही तक्रारी सापडल्या नाहीत (No Complaints Found)</h2>
          <p className="mt-2 text-gray-500">
            {statusFilter || categoryFilter 
              ? 'अधिक परिणाम पाहण्यासाठी आपले फिल्टर बदलण्याचा प्रयत्न करा. (Try changing your filters to see more results.)' 
              : 'आपण अद्याप कोणतीही तक्रार दाखल केलेली नाही. (You haven\'t filed any complaints yet.)'}
          </p>
          {!statusFilter && !categoryFilter && (
            <button 
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
              onClick={handleNewComplaint}
            >
              आपली पहिली तक्रार दाखल करा (File Your First Complaint)
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  तक्रार (Complaint)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  श्रेणी (Category)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  स्थिती (Status)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  प्राधान्य (Priority)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  दिनांक (Date)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  क्रिया (Actions)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {complaints.map((complaint) => (
                <tr key={complaint.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{complaint.title}</div>
                    <div className="text-sm text-gray-500">{complaint.location}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCategory(complaint.category)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getPriorityColor(complaint.priority)}`}>
                      {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(complaint.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleViewComplaint(complaint.id)}
                      className="text-green-600 hover:text-green-900"
                    >
                      तपशील पहा (View Details)
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Grievance360Home;