import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AgroAlertHome: React.FC = () => {
  const navigate = useNavigate();

  // Redirect to WeatherGuard for now as they share similar functionality
  useEffect(() => {
    navigate('/weatherguard');
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto"></div>
      <p className="mt-2 text-gray-600">Redirecting to WeatherGuard...</p>
    </div>
  );
};

export default AgroAlertHome;