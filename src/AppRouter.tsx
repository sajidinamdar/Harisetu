import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import App from './App';
import KrushiBazaarHome from './components/krushi_bazaar/KrushiBazaarHome';
import AgriConnectHome from './components/agriconnect/AgriConnectHome';
import Grievance360Home from './components/grievance360/Grievance360Home';
import NewComplaint from './components/grievance360/NewComplaint';
import ComplaintDetail from './components/grievance360/ComplaintDetail';
import AgriScanHome from './components/agriscan/AgriScanHome';
import DetectionResult from './components/agriscan/DetectionResult';
import ScanHistory from './components/agriscan/ScanHistory';
import WeatherGuardHome from './components/weatherguard/WeatherGuardHome';
import CropWeatherAdvice from './components/weatherguard/CropWeatherAdvice';
import AgriDocAIHome from './components/agridocai/AgriDocAIHome';
import KisanMitraHome from './components/kisanmitra/KisanMitraHome';
import HaritSetuChatHome from './components/haritsetu-chat/HaritSetuChatHome';
import UserManagementHome from './components/user-management/UserManagementHome';
import AgroAlertHome from './components/agroalert/AgroAlertHome';
import AgriServicesLocator from './pages/AgriServicesLocator';
import OTPAuthDemo from './pages/OTPAuthDemo';


// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

const AppRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        
        {/* Protected routes */}
        <Route 
          path="/krushi_bazaar" 
          element={
            <ProtectedRoute>
              <KrushiBazaarHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agriconnect" 
          element={
            <ProtectedRoute>
              <AgriConnectHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agriconnect/services/:id" 
          element={
            <ProtectedRoute>
              <AgriConnectHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/grievance360" 
          element={
            <ProtectedRoute>
              <Grievance360Home />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/grievance360/new" 
          element={
            <ProtectedRoute>
              <NewComplaint />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/grievance360/complaints/:id" 
          element={
            <ProtectedRoute>
              <ComplaintDetail />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/weatherguard" 
          element={
            <ProtectedRoute>
              <WeatherGuardHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/weatherguard/crop/:cropType" 
          element={
            <ProtectedRoute>
              <CropWeatherAdvice />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agridocai" 
          element={
            <ProtectedRoute>
              <AgriDocAIHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/kisanmitra" 
          element={
            <ProtectedRoute>
              <KisanMitraHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/haritsetu-chat" 
          element={
            <ProtectedRoute>
              <HaritSetuChatHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/user-management" 
          element={
            <ProtectedRoute>
              <UserManagementHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agroalert" 
          element={
            <ProtectedRoute>
              <AgroAlertHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agriscan" 
          element={
            <ProtectedRoute>
              <AgriScanHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agriscan/results/:detectionId" 
          element={
            <ProtectedRoute>
              <DetectionResult />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agriscan/history" 
          element={
            <ProtectedRoute>
              <ScanHistory />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/weatherguard" 
          element={
            <ProtectedRoute>
              <WeatherGuardHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/weatherguard/crop/:cropType" 
          element={
            <ProtectedRoute>
              <CropWeatherAdvice />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agridocai" 
          element={
            <ProtectedRoute>
              <AgriDocAIHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/kisanmitra" 
          element={
            <ProtectedRoute>
              <KisanMitraHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/haritsetu-chat" 
          element={
            <ProtectedRoute>
              <HaritSetuChatHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/user-management" 
          element={
            <ProtectedRoute>
              <UserManagementHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agroalert" 
          element={
            <ProtectedRoute>
              <AgroAlertHome />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/agri-services" 
          element={
            <ProtectedRoute>
              <AgriServicesLocator />
            </ProtectedRoute>
          } 
        />
        
        {/* OTP Authentication Demo - Public route */}
        <Route path="/otp-auth-demo" element={<OTPAuthDemo />} />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;