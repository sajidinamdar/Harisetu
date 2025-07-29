import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface Review {
  id: number;
  service_id: number;
  user_id: number;
  rating: number;
  comment?: string;
  created_at: string;
}

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
  reviews: Review[];
  average_rating?: number;
}

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<AgriService | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewComment, setReviewComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<boolean>(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const token = localStorage.getItem('haritsetu_token');

  useEffect(() => {
    fetchServiceDetails();
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/agriconnect/services/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch service details');
      }
      
      const data = await response.json();
      setService(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(false);
    
    try {
      const response = await fetch('/api/agriconnect/reviews/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_id: Number(serviceId),
          rating: reviewRating,
          comment: reviewComment.trim() || null
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to submit review');
      }
      
      // Reset form and show success message
      setReviewComment('');
      setReviewRating(5);
      setReviewSuccess(true);
      
      // Refresh service details to show the new review
      fetchServiceDetails();
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : 'An error occurred');
      console.error(err);
    } finally {
      setSubmittingReview(false);
    }
  };

  const openInGoogleMaps = () => {
    if (service) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${service.latitude},${service.longitude}`, '_blank');
    }
  };

  const getServiceTypeIcon = (type: string): string => {
    const icons: Record<string, string> = {
      'veterinary': '🐄',
      'fertilizer_shop': '🌱',
      'seed_shop': '🌾',
      'irrigation_service': '💧',
      'equipment_rental': '🚜',
      'agricultural_bank': '🏦',
      'government_office': '🏛️',
      'cooperative_society': '👥',
      'cold_storage': '❄️',
      'processing_unit': '🏭',
      'market_yard': '🛒'
    };
    
    return icons[type] || '🏢';
  };

  const formatServiceType = (type: string): string => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Check if the current user has already submitted a review
  const hasUserReviewed = (): boolean => {
    if (!service || !user) return false;
    return service.reviews.some(review => review.user_id === Number(user.id));
  };

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <span key={i} className={`text-xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}>★</span>
    ));
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error || 'Service not found'}
        </div>
        <button 
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
          onClick={() => navigate('/agriconnect')}
        >
          Back to Services
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        className="mb-4 flex items-center text-green-600 hover:text-green-800"
        onClick={() => navigate('/agriconnect')}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Services
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Service Images */}
        {service.image_urls && service.image_urls.length > 0 ? (
          <div className="relative h-64 bg-gray-200">
            <img 
              src={service.image_urls[0]} 
              alt={service.name} 
              className="w-full h-full object-cover"
            />
            {service.is_verified && (
              <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Verified
              </div>
            )}
          </div>
        ) : (
          <div className="h-64 bg-gray-200 flex items-center justify-center relative">
            <span className="text-6xl">{getServiceTypeIcon(service.service_type)}</span>
            {service.is_verified && (
              <div className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
                Verified
              </div>
            )}
          </div>
        )}
        
        {/* Service Details */}
        <div className="p-6">
          <div className="flex flex-wrap items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">{service.name}</h1>
              {service.name_marathi && (
                <h2 className="text-xl text-gray-600 mt-1">{service.name_marathi}</h2>
              )}
              <div className="flex items-center mt-2">
                <span className="mr-2 text-2xl">{getServiceTypeIcon(service.service_type)}</span>
                <span className="text-lg text-gray-700">{formatServiceType(service.service_type)}</span>
              </div>
            </div>
            
            {service.average_rating !== null && (
              <div className="bg-green-50 px-4 py-2 rounded-lg text-center">
                <div className="flex justify-center mb-1">
                  {renderStars(Math.round(service.average_rating || 0))}
                </div>
                <p className="text-sm text-gray-600">
                  {service.average_rating?.toFixed(1)} / 5 ({service.reviews.length} reviews)
                </p>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Details</h3>
              
              {service.description && (
                <div className="mb-4">
                  <p className="text-gray-800">{service.description}</p>
                  {service.description_marathi && (
                    <p className="text-gray-600 mt-2">{service.description_marathi}</p>
                  )}
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="font-medium text-gray-700">Address:</h4>
                <p className="text-gray-800">{service.address}</p>
                <p className="text-gray-800">{service.district}, {service.state}</p>
              </div>
              
              {service.opening_hours && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700">Opening Hours:</h4>
                  <p className="text-gray-800">{service.opening_hours}</p>
                </div>
              )}
              
              {service.services_offered && service.services_offered.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700">Services Offered:</h4>
                  <ul className="list-disc list-inside text-gray-800">
                    {service.services_offered.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
              
              {service.contact_phone && (
                <div className="mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span className="text-gray-800">{service.contact_phone}</span>
                </div>
              )}
              
              {service.contact_email && (
                <div className="mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-800">{service.contact_email}</span>
                </div>
              )}
              
              {service.website && (
                <div className="mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  <a href={service.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {service.website}
                  </a>
                </div>
              )}
              
              <div className="mt-6">
                <button 
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                  onClick={openInGoogleMaps}
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  View on Google Maps
                </button>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div className="border-t pt-8">
            <h3 className="text-xl font-semibold mb-6">Reviews</h3>
            
            {/* Add Review Form */}
            {user && !hasUserReviewed() && (
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h4 className="font-medium mb-3">Add Your Review</h4>
                
                {reviewSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Your review has been submitted successfully!
                  </div>
                )}
                
                {reviewError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {reviewError}
                  </div>
                )}
                
                <form onSubmit={handleSubmitReview}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          className="text-2xl focus:outline-none"
                          onClick={() => setReviewRating(star)}
                        >
                          <span className={star <= reviewRating ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comment (Optional)</label>
                    <textarea
                      className="w-full p-2 border border-gray-300 rounded-md"
                      rows={3}
                      value={reviewComment}
                      onChange={(e) => setReviewComment(e.target.value)}
                      placeholder="Share your experience with this service..."
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400"
                    disabled={submittingReview}
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </form>
              </div>
            )}
            
            {/* Reviews List */}
            {service.reviews.length === 0 ? (
              <p className="text-gray-600 italic">No reviews yet. Be the first to review this service!</p>
            ) : (
              <div className="space-y-4">
                {service.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center mb-2">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {review.comment && <p className="text-gray-800">{review.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;