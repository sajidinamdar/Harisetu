import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, VolumeUp, Play, Pause } from 'lucide-react';

const KisanMitraHome: React.FC = () => {
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
        <div className="p-6 bg-gradient-to-r from-green-500 to-teal-600 text-white">
          <h1 className="text-3xl font-bold">किसान मित्र (Kisan Mitra)</h1>
          <p className="text-xl">Your voice-based personal assistant for agricultural information</p>
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
              This module is currently being developed. Voice recognition capabilities will be available soon!
            </p>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <Mic className="w-12 h-12 text-green-600" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <p className="text-lg text-gray-700 mb-4">
              Press the microphone button and ask a question in Marathi or English
            </p>
            <button 
              className="px-6 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors flex items-center justify-center mx-auto disabled:bg-gray-400"
              disabled
            >
              <Mic className="w-5 h-5 mr-2" />
              Start Speaking
            </button>
          </div>
          
          <h2 className="text-xl font-bold mb-4">Example Voice Commands</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Weather Forecast</h3>
                <button className="text-green-600 p-1 rounded-full hover:bg-green-100">
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 text-sm">"आजचे हवामान सांगा" (Tell me today's weather)</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Crop Advice</h3>
                <button className="text-green-600 p-1 rounded-full hover:bg-green-100">
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 text-sm">"गव्हासाठी खत सल्ला द्या" (Give fertilizer advice for wheat)</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Market Prices</h3>
                <button className="text-green-600 p-1 rounded-full hover:bg-green-100">
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 text-sm">"आजचे बाजारभाव सांगा" (Tell me today's market prices)</p>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Training Programs</h3>
                <button className="text-green-600 p-1 rounded-full hover:bg-green-100">
                  <Play className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 text-sm">"जवळील प्रशिक्षण कार्यक्रम" (Nearby training programs)</p>
            </div>
          </div>
          
          <div className="text-center">
            <button 
              onClick={() => navigate('/')}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KisanMitraHome;