import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useLanguage } from './contexts/LanguageContext';
import LoadingScreen from './components/LoadingScreen';
import WelcomePage from './components/WelcomePage';
import Dashboard from './components/Dashboard';
import Footer from './components/Footer';

const App: React.FC = () => {
  // Check if we should skip loading screen (if we've loaded recently)
  const shouldSkipLoading = () => {
    const lastLoadTime = localStorage.getItem('lastLoadTime');
    if (lastLoadTime) {
      const timeSinceLastLoad = Date.now() - parseInt(lastLoadTime);
      // Skip loading if we've loaded in the last 5 minutes
      return timeSinceLastLoad < 5 * 60 * 1000;
    }
    return false;
  };
  
  const [isLoading, setIsLoading] = useState(!shouldSkipLoading());
  const { isAuthenticated } = useAuth();
  const { language } = useLanguage();

  useEffect(() => {
    // Simulate initial loading with a shorter time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500); // Reduced from 3000ms to 1500ms

    return () => clearTimeout(timer);
  }, []);
  // Handle loading state with a fallback mechanism
  if (isLoading) {
    return (
      <LoadingScreen 
        onFinished={() => {
          // Ensure we set loading to false
          setIsLoading(false);
          
          // Also store a timestamp to prevent getting stuck in loading
          localStorage.setItem('lastLoadTime', Date.now().toString());
        }} 
      />
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Dashboard />
      ) : (
        <WelcomePage />
      )}
      <Footer />
    </>
  );
};

export default App;