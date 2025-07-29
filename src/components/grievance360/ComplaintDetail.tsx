import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface ComplaintUpdate {
  id: number;
  complaint_id: number;
  user_id: number;
  comment: string;
  status_change: string | null;
  created_at: string;
}

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  location: string;
  status: string;
  priority: string;
  user_id: number;
  assigned_to: number | null;
  created_at: string;
  updated_at: string;
  updates: ComplaintUpdate[];
}

interface User {
  id: number;
  name: string;
  role: string;
}

const ComplaintDetail: React.FC = () => {
  const { complaintId } = useParams<{ complaintId: string }>();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState<string>('');
  const [statusChange, setStatusChange] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [officers, setOfficers] = useState<User[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<number | null>(null);
  const [assigningOfficer, setAssigningOfficer] = useState<boolean>(false);
  
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Get token from localStorage
  const getToken = () => localStorage.getItem('haritsetu_token');

  useEffect(() => {
    fetchComplaint();
    if (user?.role === 'officer') {
      fetchOfficers();
    }
  }, [complaintId]);

  const fetchComplaint = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to use the API if available
      try {
        const response = await fetch(`/api/complaints/${complaintId}`, {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        setComplaint(data);
        
        // If the complaint is assigned, set the selected officer
        if (data.assigned_to) {
          setSelectedOfficer(data.assigned_to);
        }
        return;
      } catch (apiError) {
        console.error('API fetch failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Get stored complaints from localStorage
        const storedComplaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        const mockComplaint = storedComplaints.find((c: any) => c.id.toString() === complaintId);
        
        if (!mockComplaint) {
          // If not found in localStorage, use hardcoded mock data
          const mockComplaints = [
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
              updated_at: "2023-06-15T10:30:00Z",
              comments: [
                {
                  id: 1,
                  complaint_id: 1,
                  user_id: 1,
                  comment: "I've submitted this complaint as the situation is getting worse.",
                  status_change: null,
                  created_at: "2023-06-15T10:35:00Z",
                  user: {
                    id: 1,
                    name: "राम पाटील",
                    role: "farmer"
                  }
                }
              ]
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
              updated_at: "2023-06-11T09:15:00Z",
              comments: [
                {
                  id: 2,
                  complaint_id: 2,
                  user_id: 1,
                  comment: "The infestation is spreading to neighboring fields as well.",
                  status_change: null,
                  created_at: "2023-06-10T16:30:00Z",
                  user: {
                    id: 1,
                    name: "राम पाटील",
                    role: "farmer"
                  }
                },
                {
                  id: 3,
                  complaint_id: 2,
                  user_id: 3,
                  comment: "I'll be visiting your field tomorrow to assess the situation.",
                  status_change: "assigned",
                  created_at: "2023-06-11T09:15:00Z",
                  user: {
                    id: 3,
                    name: "Prof. Suresh Kumar",
                    role: "expert"
                  }
                }
              ]
            }
          ];
          
          const foundComplaint = mockComplaints.find(c => c.id.toString() === complaintId);
          
          if (!foundComplaint) {
            throw new Error('Complaint not found');
          }
          
          // Transform the mock data to match the Complaint interface
          // Map 'comments' array to 'updates' array and ensure assigned_to is number | null
          const transformedComplaint = {
            ...foundComplaint,
            updates: foundComplaint.comments || [],
            assigned_to: foundComplaint.assigned_to || null
          };
          
          setComplaint(transformedComplaint);
          
          // If the complaint is assigned, set the selected officer
          if (foundComplaint.assigned_to) {
            setSelectedOfficer(foundComplaint.assigned_to);
          }
        } else {
          // Use the complaint from localStorage
          // Transform the mock data to match the Complaint interface
          const transformedMockComplaint = {
            ...mockComplaint,
            updates: mockComplaint.comments || [],
            assigned_to: mockComplaint.assigned_to || null
          };
          
          setComplaint(transformedMockComplaint);
          
          // If the complaint is assigned, set the selected officer
          if (mockComplaint.assigned_to) {
            setSelectedOfficer(mockComplaint.assigned_to);
          }
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOfficers = async () => {
    try {
      // Try to use the API if available
      try {
        const response = await fetch('/api/users/?role=officer', {
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('API request failed');
        }
        
        const data = await response.json();
        setOfficers(data);
        return;
      } catch (apiError) {
        console.error('API fetch failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock officers data
        const mockOfficers = [
          {
            id: 2,
            name: "Dr. Priya Sharma",
            email: "officer@demo.com",
            role: "officer",
            department: "Agriculture Department",
            district: "Pune"
          },
          {
            id: 4,
            name: "Dr. Rajesh Patel",
            email: "rajesh@demo.com",
            role: "officer",
            department: "Horticulture Department",
            district: "Nashik"
          },
          {
            id: 5,
            name: "Dr. Anita Desai",
            email: "anita@demo.com",
            role: "officer",
            department: "Soil Conservation",
            district: "Nagpur"
          }
        ];
        
        setOfficers(mockOfficers);
      }
    } catch (err) {
      console.error('Error fetching officers:', err);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!comment.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Try to use the API if available
      try {
        const payload = {
          comment,
          status_change: statusChange || null
        };
        
        const response = await fetch(`/api/complaints/${complaintId}/comments`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.detail || 'Failed to submit comment');
        }
        
        // Reset form and refresh complaint
        setComment('');
        setStatusChange('');
        fetchComplaint();
        return;
      } catch (apiError) {
        console.error('API submission failed, using mock implementation:', apiError);
        
        // Mock implementation for demo
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create a new comment
        const newComment = {
          id: Date.now(),
          complaint_id: complaintId ? parseInt(complaintId) : 0,
          user_id: user?.id ? parseInt(user.id) : 1,
          comment,
          status_change: statusChange || null,
          created_at: new Date().toISOString(),
          user: {
            id: user?.id ? parseInt(user.id) : 1,
            name: user?.name || 'User',
            role: user?.role || 'farmer'
          }
        };
        
        // Get stored complaints from localStorage
        const storedComplaints = JSON.parse(localStorage.getItem('mock_complaints') || '[]');
        const complaintIndex = storedComplaints.findIndex((c: any) => c.id.toString() === complaintId);
        
        if (complaintIndex !== -1) {
          // Add comment to the complaint
          if (!storedComplaints[complaintIndex].comments) {
            storedComplaints[complaintIndex].comments = [];
          }
          
          storedComplaints[complaintIndex].comments.push(newComment);
          
          // Update status if needed
          if (statusChange) {
            storedComplaints[complaintIndex].status = statusChange;
            storedComplaints[complaintIndex].updated_at = new Date().toISOString();
          }
          
          // Save back to localStorage
          localStorage.setItem('mock_complaints', JSON.stringify(storedComplaints));
          
          // Update complaint in the UI with the new comment
          setComplaint(prev => {
            if (!prev) return prev;
            
            // Check if we need to add to updates or comments array based on the structure
            if (Array.isArray(prev.updates)) {
              return {
                ...prev,
                updates: [...prev.updates, newComment],
                status: statusChange ? statusChange : prev.status
              };
            } else if (Array.isArray((prev as any).comments)) {
              return {
                ...prev,
                comments: [...(prev as any).comments, newComment],
                status: statusChange ? statusChange : prev.status
              };
            }
            
            return prev;
          });
        }
        
        // Reset form
        setComment('');
        setStatusChange('');
      }
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignOfficer = async () => {
    if (!selectedOfficer) {
      return;
    }
    
    setAssigningOfficer(true);
    
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          assigned_to: selectedOfficer,
          status: 'assigned'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to assign officer');
      }
      
      // Refresh complaint
      fetchComplaint();
    } catch (err) {
      console.error('Error assigning officer:', err);
    } finally {
      setAssigningOfficer(false);
    }
  };

  const handleUpdatePriority = async (priority: string) => {
    try {
      const response = await fetch(`/api/complaints/${complaintId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ priority })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to update priority');
      }
      
      // Refresh complaint
      fetchComplaint();
    } catch (err) {
      console.error('Error updating priority:', err);
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
    return date.toLocaleString();
  };

  const formatCategory = (category: string) => {
    return category.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading complaint details...</p>
      </div>
    );
  }

  if (error || !complaint) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Complaint not found'}
        </div>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          onClick={() => navigate('/grievance360')}
        >
          Back to Complaints
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        className="mb-4 flex items-center text-green-600 hover:text-green-800"
        onClick={() => navigate('/grievance360')}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Complaints
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex flex-wrap justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold">{complaint.title}</h1>
              <p className="text-gray-600">
                Complaint ID: {complaint.id} • Filed on {formatDate(complaint.created_at)}
              </p>
            </div>
            
            <div className="flex space-x-2 mt-2 sm:mt-0">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' ')}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority.charAt(0).toUpperCase() + complaint.priority.slice(1)} Priority
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-line">{complaint.description}</p>
              </div>
            </div>
            
            <div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h2 className="text-lg font-medium mb-2">Details</h2>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium">{formatCategory(complaint.category)}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{complaint.location}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1).replace('_', ' ')}</p>
                  </div>
                  
                  {user?.role === 'officer' && (
                    <div>
                      <p className="text-sm text-gray-500">Priority</p>
                      <div className="flex space-x-1 mt-1">
                        {['low', 'medium', 'high', 'urgent'].map((priority) => (
                          <button
                            key={priority}
                            onClick={() => handleUpdatePriority(priority)}
                            className={`px-2 py-1 text-xs rounded ${
                              complaint.priority === priority 
                                ? getPriorityColor(priority) + ' font-bold' 
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {user?.role === 'officer' && (
                    <div>
                      <p className="text-sm text-gray-500">Assignment</p>
                      {complaint.assigned_to ? (
                        <p className="font-medium">
                          Assigned to Officer ID: {complaint.assigned_to}
                        </p>
                      ) : (
                        <div className="mt-1">
                          <select
                            value={selectedOfficer || ''}
                            onChange={(e) => setSelectedOfficer(Number(e.target.value))}
                            className="w-full p-1 text-sm border border-gray-300 rounded-md"
                          >
                            <option value="">Select an officer</option>
                            {officers.map((officer) => (
                              <option key={officer.id} value={officer.id}>
                                {officer.name}
                              </option>
                            ))}
                          </select>
                          <button
                            onClick={handleAssignOfficer}
                            disabled={!selectedOfficer || assigningOfficer}
                            className="mt-1 w-full px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
                          >
                            {assigningOfficer ? 'Assigning...' : 'Assign Officer'}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Updates and Comments */}
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4">Updates & Comments</h2>
            
            {complaint.updates.length === 0 ? (
              <p className="text-gray-500 italic">No updates yet.</p>
            ) : (
              <div className="space-y-4">
                {complaint.updates.map((update) => (
                  <div key={update.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium">User ID: {update.user_id}</p>
                        <p className="text-sm text-gray-500">{formatDate(update.created_at)}</p>
                      </div>
                      
                      {update.status_change && (
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(update.status_change)}`}>
                          Status changed to: {update.status_change.charAt(0).toUpperCase() + update.status_change.slice(1).replace('_', ' ')}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700">{update.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Add Comment Form */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-medium mb-4">Add Comment</h2>
            
            {submitError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {submitError}
              </div>
            )}
            
            <form onSubmit={handleSubmitComment}>
              {user?.role === 'officer' && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Update Status (Optional)
                  </label>
                  <select
                    value={statusChange}
                    onChange={(e) => setStatusChange(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">No status change</option>
                    <option value="pending">Pending</option>
                    <option value="assigned">Assigned</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              )}
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Comment
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Add your comment or update..."
                  required
                ></textarea>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !comment.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Comment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetail;