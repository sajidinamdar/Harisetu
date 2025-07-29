






import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, User, Bot, Clock, ChevronDown, ChevronUp, Loader } from 'lucide-react';

// Mock Gemini adapter for development
const mockGeminiAdapter = {
  createChatCompletion: async (options: any) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Get the last user message
    const lastUserMessage = options.messages[options.messages.length - 1].content;
    
    // Generate a mock response based on the user's message
    let responseText = "";
    
    if (lastUserMessage.toLowerCase().includes("tomato") || lastUserMessage.toLowerCase().includes("टोमॅटो")) {
      responseText = "टोमॅटो पिकासाठी, नियमित पाणी देणे आणि योग्य खत व्यवस्थापन महत्वाचे आहे. रोगांपासून वाचण्यासाठी फवारणी वेळेवर करा. (For tomato crops, regular watering and proper fertilizer management is important. Spray on time to prevent diseases.)";
    } else if (lastUserMessage.toLowerCase().includes("rice") || lastUserMessage.toLowerCase().includes("तांदूळ")) {
      responseText = "भात पिकासाठी पाण्याची पातळी 2-5 सेमी ठेवा. खरीप हंगामात पेरणी जून-जुलै मध्ये करावी. (For rice cultivation, maintain water level at 2-5 cm. Sowing should be done in June-July for Kharif season.)";
    } else if (lastUserMessage.toLowerCase().includes("weather") || lastUserMessage.toLowerCase().includes("हवामान")) {
      responseText = "सध्याच्या हवामानानुसार, पुढील 3-4 दिवसांत पाऊस अपेक्षित आहे. पिकांचे संरक्षण करण्यासाठी योग्य उपाययोजना करा. (According to current weather, rain is expected in the next 3-4 days. Take appropriate measures to protect crops.)";
    } else if (lastUserMessage.toLowerCase().includes("fertilizer") || lastUserMessage.toLowerCase().includes("खत")) {
      responseText = "संतुलित खत व्यवस्थापनासाठी NPK (नत्र, स्फुरद, पालाश) चा वापर करा. जैविक खतांचा वापर मातीची सुपीकता वाढवतो. (For balanced fertilizer management, use NPK (Nitrogen, Phosphorus, Potassium). Using organic fertilizers improves soil fertility.)";
    } else {
      responseText = "आपल्या प्रश्नासाठी धन्यवाद. मी आपल्या कृषी प्रश्नांमध्ये मदत करू शकतो. अधिक माहितीसाठी, कृपया आपला प्रश्न अधिक स्पष्ट करा. (Thank you for your question. I can help with your agricultural queries. For more information, please make your question more specific.)";
    }
    
    return {
      choices: [
        {
          message: {
            role: "assistant",
            content: responseText
          },
          index: 0,
          finish_reason: "stop"
        }
      ]
    };
  }
};

const HaritSetuChatHome: React.FC = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [showExpertPanel, setShowExpertPanel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Use state for chat messages so we can update them
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      sender: 'bot', 
      text: 'नमस्कार! मी हरितसेतू AI सहाय्यक आहे. मी आपल्या कृषी प्रश्नांमध्ये कशी मदत करू शकतो? (Hello! I am HaritSetu AI Assistant. How can I help with your agricultural questions?)', 
      time: '10:30 AM' 
    }
  ]);
  
  // Reference for chat container to auto-scroll
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || isLoading) return;
    
    // Get current time
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Add user message to chat
    const userMessage = {
      id: chatMessages.length + 1,
      sender: 'user',
      text: message,
      time: timeString
    };
    
    setChatMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);
    
    try {
      // Use the mock Gemini adapter
      const response = await mockGeminiAdapter.createChatCompletion({
        messages: [
          { role: "system", content: "You are HaritSetu, an agricultural AI assistant specializing in Indian farming practices." },
          ...chatMessages.map(msg => ({
            role: msg.sender === 'bot' ? 'assistant' : 'user',
            content: msg.text
          })),
          { role: "user", content: message }
        ]
      });
      
      // Add bot response to chat
      const botMessage = {
        id: chatMessages.length + 2,
        sender: 'bot',
        text: response.choices[0].message.content,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error in chat:', error);
      
      // Add error message
      const errorMessage = {
        id: chatMessages.length + 2,
        sender: 'bot',
        text: "I'm sorry, I encountered an error. Please try again later.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

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
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6 flex flex-col h-[80vh]">
        <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <h1 className="text-2xl font-bold">हरितसेतू चॅट (HaritSetu Chat)</h1>
          <p>AI-powered agricultural assistant and expert consultation</p>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            <div className="bg-green-50 border border-green-200 m-4 rounded-lg p-4">
              <h3 className="text-lg font-medium text-green-800 mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Chat Now Available
              </h3>
              
              <p className="text-green-700">
                हरितसेतू चॅट आता उपलब्ध आहे! कृषी संबंधित प्रश्न विचारा. (HaritSetu Chat is now available! Ask agriculture-related questions.)
              </p>
              <p className="text-green-700 text-sm mt-1">
                Try asking about: tomatoes (टोमॅटो), rice (तांदूळ), weather (हवामान), or fertilizers (खत)
              </p>
            </div>
            
            {/* Chat messages */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    msg.sender === 'user' 
                      ? 'bg-green-100 text-gray-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className="flex items-center mb-1">
                      {msg.sender === 'user' ? (
                        <User className="w-4 h-4 mr-1 text-green-600" />
                      ) : (
                        <Bot className="w-4 h-4 mr-1 text-blue-600" />
                      )}
                      <span className="text-xs text-gray-500 ml-auto flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {msg.time}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg p-3 flex items-center space-x-2 max-w-[80%]">
                    <Bot className="w-4 h-4 text-blue-600" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="आपला प्रश्न येथे टाइप करा... (Type your question here...)"
                  className="flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className={`p-2 rounded-r-md transition-colors ${
                    isLoading || !message.trim() 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                  disabled={isLoading || !message.trim()}
                >
                  {isLoading ? (
                    <Loader className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </button>
              </form>
              {isLoading && (
                <div className="text-xs text-gray-500 mt-2 flex items-center">
                  <Loader className="w-3 h-3 mr-1 animate-spin" />
                  Generating response...
                </div>
              )}
            </div>
          </div>
          
          {/* Expert panel (collapsible on mobile) */}
          <div className="hidden md:block md:w-80 border-l bg-gray-50">
            <div className="p-4 border-b bg-gray-100 flex justify-between items-center">
              <h2 className="font-semibold">Available Experts</h2>
              <button 
                onClick={() => setShowExpertPanel(!showExpertPanel)}
                className="md:hidden"
              >
                {showExpertPanel ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Dr. Priya Sharma</h3>
                    <p className="text-xs text-gray-500">Crop Disease Specialist</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                </div>
                <button className="mt-2 w-full py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors">
                  Start Chat
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Dr. Rajesh Patel</h3>
                    <p className="text-xs text-gray-500">Soil Management Expert</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-block w-2 h-2 bg-gray-300 rounded-full"></span>
                  </div>
                </div>
                <button className="mt-2 w-full py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors">
                  Offline (Schedule)
                </button>
              </div>
              
              <div className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">Dr. Anita Desai</h3>
                    <p className="text-xs text-gray-500">Irrigation Specialist</p>
                  </div>
                  <div className="ml-auto">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                  </div>
                </div>
                <button className="mt-2 w-full py-1 text-sm bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors">
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HaritSetuChatHome;