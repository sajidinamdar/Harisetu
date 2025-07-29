import React from 'react';
import { useNavigate } from 'react-router-dom';

const AgriDocAIHome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <button 
        className="mb-4 flex items-center text-green-600 hover:text-green-800"
        onClick={() => navigate('/')}
      >
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
        <div className="p-6 bg-gradient-to-r from-purple-500 to-purple-700 text-white">
          <h1 className="text-3xl font-bold">AgriDocAI</h1>
          <p className="text-xl">AI-powered document generation for agricultural needs</p>
        </div>
        
        <div className="p-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-medium text-yellow-800 mb-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Module Under Development
            </h3>
            
            <p className="text-yellow-700">
              This module is currently being developed. Check back soon for updates and new features!
            </p>
          </div>
          
          <h2 className="text-2xl font-bold mb-4">Features Coming Soon</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Subsidy Applications</h3>
              <p className="text-gray-600">Generate government subsidy application forms with pre-filled information based on your profile.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Crop Loss Reports</h3>
              <p className="text-gray-600">Create detailed crop loss reports for insurance claims with AI-assisted damage assessment.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Loan Applications</h3>
              <p className="text-gray-600">Prepare agricultural loan applications with financial projections and crop planning details.</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Land Records</h3>
              <p className="text-gray-600">Access and manage your land records with easy-to-use templates and government integrations.</p>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriDocAIHome;