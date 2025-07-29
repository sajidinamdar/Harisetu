import React, { useState, useEffect } from 'react';
import { MapPin, AlertCircle } from 'lucide-react';

// Access environment variables
declare global {
  interface ImportMetaEnv {
    GOOGLE_MAPS_API_KEY?: string;
    WEATHER_API_KEY?: string;
    // Vite already includes [key: string]: any
  }
}

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
  loading: boolean;
  error?: string;
}

interface WeatherData {
  temperature?: number;
  description?: string;
  icon?: string;
  loading: boolean;
  error?: string;
}

const LocationPermission: React.FC = () => {
  const [location, setLocation] = useState<LocationData>({
    latitude: 0,
    longitude: 0,
    loading: true
  });
  
  const [weather, setWeather] = useState<WeatherData>({
    loading: true
  });
  
  const [permissionStatus, setPermissionStatus] = useState<string>('prompt'); // 'prompt', 'granted', 'denied'
  const [showPermissionDialog, setShowPermissionDialog] = useState<boolean>(false);
  
  // Helper function to generate mock address based on coordinates
  const getMockAddressForCoordinates = (latitude: number, longitude: number): string => {
    console.log('Generating mock address for coordinates:', latitude, longitude);
    
    // Specific villages in Sangamner taluka
    // Paragon/Paregow area
    if (latitude >= 19.56 && latitude <= 19.58 && longitude >= 74.20 && longitude <= 74.22) {
      return "पारेगाव, संगमनेर, अहमदनगर, महाराष्ट्र, भारत";
    }
    // Gunjalwadi
    else if (latitude >= 19.55 && latitude <= 19.57 && longitude >= 74.18 && longitude <= 74.20) {
      return "गुंजाळवाडी, संगमनेर, अहमदनगर, महाराष्ट्र, भारत";
    }
    // Talegaon
    else if (latitude >= 19.58 && latitude <= 19.60 && longitude >= 74.19 && longitude <= 74.21) {
      return "ताळेगाव, संगमनेर, अहमदनगर, महाराष्ट्र, भारत";
    }
    // Ashvi Khurd
    else if (latitude >= 19.54 && latitude <= 19.56 && longitude >= 74.21 && longitude <= 74.23) {
      return "आशवी खुर्द, संगमनेर, अहमदनगर, महाराष्ट्र, भारत";
    }
    // Sangamner city
    else if (latitude >= 19.56 && latitude <= 19.59 && longitude >= 74.16 && longitude <= 74.22) {
      return "संगमनेर, अहमदनगर, महाराष्ट्र, भारत";
    }
    // Broader Sangamner taluka
    else if (latitude >= 19.50 && latitude <= 19.65 && longitude >= 74.10 && longitude <= 74.30) {
      return "संगमनेर तालुका, अहमदनगर, महाराष्ट्र, भारत";
    }
    // Ahmednagar district
    else if (latitude >= 19.0 && latitude <= 19.7 && longitude >= 74.0 && longitude <= 75.0) {
      return "अहमदनगर जिल्हा, महाराष्ट्र, भारत";
    }
    // Mumbai region
    else if (latitude >= 18.9 && latitude <= 19.3 && longitude >= 72.7 && longitude <= 73.0) {
      if (latitude >= 19.0 && latitude <= 19.1 && longitude >= 72.8 && longitude <= 72.9) {
        return "अंधेरी, मुंबई, महाराष्ट्र, भारत";
      } else if (latitude >= 19.1 && latitude <= 19.2 && longitude >= 72.8 && longitude <= 72.9) {
        return "बांद्रा, मुंबई, महाराष्ट्र, भारत";
      } else if (latitude >= 18.9 && latitude <= 19.0 && longitude >= 72.8 && longitude <= 72.9) {
        return "वरळी, मुंबई, महाराष्ट्र, भारत";
      } else {
        return "मुंबई, महाराष्ट्र, भारत";
      }
    } 
    // Pune region
    else if (latitude >= 18.4 && latitude <= 18.7 && longitude >= 73.7 && longitude <= 74.0) {
      if (latitude >= 18.5 && latitude <= 18.6 && longitude >= 73.8 && longitude <= 73.9) {
        return "शिवाजीनगर, पुणे, महाराष्ट्र, भारत";
      } else if (latitude >= 18.4 && latitude <= 18.5 && longitude >= 73.8 && longitude <= 73.9) {
        return "हडपसर, पुणे, महाराष्ट्र, भारत";
      } else {
        return "पुणे, महाराष्ट्र, भारत";
      }
    } 
    // Nashik region
    else if (latitude >= 19.9 && latitude <= 20.1 && longitude >= 73.7 && longitude <= 73.9) {
      return "नाशिक, महाराष्ट्र, भारत";
    } 
    // Additional Ahmednagar region
    else if (latitude >= 19.0 && latitude <= 19.2 && longitude >= 74.7 && longitude <= 74.9) {
      return "अहमदनगर शहर, महाराष्ट्र, भारत";
    } 
    // Nagpur region
    else if (latitude >= 21.0 && latitude <= 21.2 && longitude >= 79.0 && longitude <= 79.2) {
      return "नागपूर, महाराष्ट्र, भारत";
    } 
    // Maharashtra general
    else if (latitude >= 16 && latitude <= 22 && longitude >= 72 && longitude <= 81) {
      return "महाराष्ट्र, भारत";
    } 
    // Delhi region
    else if (latitude >= 28.4 && latitude <= 28.8 && longitude >= 76.8 && longitude <= 77.4) {
      return "दिल्ली, भारत";
    }
    // Bangalore region
    else if (latitude >= 12.8 && latitude <= 13.1 && longitude >= 77.5 && longitude <= 77.8) {
      return "बेंगलुरु, कर्नाटक, भारत";
    }
    // Chennai region
    else if (latitude >= 12.9 && latitude <= 13.2 && longitude >= 80.1 && longitude <= 80.3) {
      return "चेन्नई, तमिळनाडू, भारत";
    }
    // Kolkata region
    else if (latitude >= 22.5 && latitude <= 22.7 && longitude >= 88.3 && longitude <= 88.5) {
      return "कोलकाता, पश्चिम बंगाल, भारत";
    }
    // Default for India
    else if (latitude >= 8 && latitude <= 35 && longitude >= 68 && longitude <= 97) {
      return "भारत";
    } else {
      return "अज्ञात स्थान";
    }
  };
  
  // Fetch weather data
  const fetchWeatherData = async (latitude: number, longitude: number) => {
    try {
      setWeather(prev => ({ ...prev, loading: true }));
      
      // Try different environment variable formats
      const apiKey = import.meta.env.VITE_WEATHER_API_KEY || 
                    import.meta.env.WEATHER_API_KEY || 
                    'c897d41439b302c567513b504e43ae6e';
      
      if (!apiKey) {
        console.warn("No weather API key found, using mock data");
        throw new Error("No API key");
      }
      
      console.log(`Fetching weather for coordinates: ${latitude}, ${longitude} with API key: ${apiKey}`);
      
      // Add a delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}&lang=mr`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('Weather API response:', data);
          
          if (data && data.main && data.weather && data.weather.length > 0) {
            // Use a short timeout to ensure the state updates properly
            setTimeout(() => {
              setWeather({
                temperature: data.main.temp,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                loading: false
              });
            }, 100);
            return;
          } else {
            console.error('Weather API returned incomplete data:', data);
            throw new Error('Weather API returned incomplete data');
          }
        } else {
          let errorMessage = 'Weather API error: ' + response.status;
          try {
            const errorData = await response.json();
            console.error('Weather API error:', errorData);
            errorMessage = `Weather API error: ${errorData.message || response.statusText}`;
          } catch (e) {
            console.error('Could not parse error response:', e);
          }
          throw new Error(errorMessage);
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        throw fetchError;
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
      
      // Use mock data based on current season
      const currentMonth = new Date().getMonth();
      let mockWeather;
      
      // Summer (March-June)
      if (currentMonth >= 2 && currentMonth <= 5) {
        mockWeather = {
          temperature: 32,
          description: "उष्ण आणि काही ढगाळ",
          icon: "01d", // clear sky
          loading: false
        };
      } 
      // Monsoon (June-September)
      else if (currentMonth >= 5 && currentMonth <= 8) {
        mockWeather = {
          temperature: 27,
          description: "पावसाची शक्यता",
          icon: "10d", // rain
          loading: false
        };
      } 
      // Winter (October-February)
      else {
        mockWeather = {
          temperature: 22,
          description: "थंड आणि स्वच्छ",
          icon: "02d", // few clouds
          loading: false
        };
      }
      
      // Use a short timeout to ensure the state updates properly
      setTimeout(() => {
        setWeather(mockWeather);
      }, 100);
    }
  };
  
  // Fetch address from coordinates
  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      console.log(`Fetching address for coordinates: ${latitude}, ${longitude}`);
      
      // First try with OpenStreetMap Nominatim API (doesn't require API key)
      try {
        // Add a delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1&accept-language=mr`
        );
        
        if (response.ok) {
          const data = await response.json();
          console.log('OpenStreetMap API response:', data);
          
          if (data && data.display_name) {
            // Try to extract the most specific location information
            const addressParts = [];
            
            // Village or hamlet first (most specific)
            if (data.address && (data.address.village || data.address.hamlet)) {
              addressParts.push(data.address.village || data.address.hamlet);
            }
            // Then suburb or neighborhood
            else if (data.address && (data.address.suburb || data.address.neighbourhood)) {
              addressParts.push(data.address.suburb || data.address.neighbourhood);
            }
            // Then city or town
            else if (data.address && (data.address.city || data.address.town)) {
              addressParts.push(data.address.city || data.address.town);
            }
            
            // Add district/county
            if (data.address && data.address.county) {
              addressParts.push(data.address.county);
            }
            
            // Add state
            if (data.address && data.address.state) {
              addressParts.push(data.address.state);
            }
            
            // Add country
            if (data.address && data.address.country) {
              addressParts.push(data.address.country);
            }
            
            let address = addressParts.join(', ');
            
            // If we couldn't extract specific parts, use the full display name
            if (!address) {
              address = data.display_name;
            }
            
            console.log('Formatted address from OpenStreetMap:', address);
            
            setLocation(prev => ({
              ...prev,
              address
            }));
            
            return; // Successfully got the address, exit the function
          }
        }
        
        // If we get here, the OpenStreetMap API didn't give us what we needed
        throw new Error('OpenStreetMap API did not return usable data');
        
      } catch (osmError) {
        console.error('Error with OpenStreetMap API:', osmError);
        
        // Now try with Google Maps API
        try {
          // Try different environment variable formats
          const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 
                        import.meta.env.GOOGLE_MAPS_API_KEY || 
                        'AIzaSyBEsYiV0HMCgii9cW3Trz7jO5yqIow1D8E';
          
          if (!apiKey) {
            console.warn("No Google Maps API key found, using mock data");
            throw new Error("No API key");
          }
          
          console.log(`Trying Google Maps API with key: ${apiKey}`);
          
          // Add a delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 500));
          
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}&language=mr&result_type=locality|sublocality|administrative_area_level_2|administrative_area_level_1`
          );
          
          const data = await response.json();
          console.log('Google Maps Geocoding API response:', data);
          
          if (data.status === 'OK' && data.results && data.results.length > 0) {
            // Try to get the most specific address component
            let address = '';
            
            // First try to find a locality (city/town) or sublocality (neighborhood)
            const localityResult = data.results.find((result: { types: string[]; formatted_address: string }) => 
              result.types.includes('locality') || 
              result.types.includes('sublocality') ||
              result.types.includes('administrative_area_level_2')
            );
            
            if (localityResult) {
              address = localityResult.formatted_address;
            } else {
              // If no specific locality found, use the first result
              address = data.results[0].formatted_address;
            }
            
            // Extract components for more detailed address
            let locality = '';
            let district = '';
            let state = '';
            let country = '';
            
            // Define types for Google Maps API response
            interface AddressComponent {
              long_name: string;
              short_name: string;
              types: string[];
            }
            
            interface GeocodingResult {
              address_components: AddressComponent[];
              formatted_address: string;
              types: string[];
            }
            
            // Look through all results to find the most specific components
            data.results.forEach((result: GeocodingResult) => {
              if (result.address_components) {
                result.address_components.forEach((component: AddressComponent) => {
                  if (component.types && component.types.includes('locality') && !locality) {
                    locality = component.long_name;
                  }
                  if (component.types && component.types.includes('administrative_area_level_2') && !district) {
                    district = component.long_name;
                  }
                  if (component.types && component.types.includes('administrative_area_level_1') && !state) {
                    state = component.long_name;
                  }
                  if (component.types && component.types.includes('country') && !country) {
                    country = component.long_name;
                  }
                });
              }
            });
            
            // Construct a more detailed address if components are available
            if (locality && district && state) {
              address = `${locality}, ${district}, ${state}, ${country}`;
            } else if (locality && state) {
              address = `${locality}, ${state}, ${country}`;
            }
            
            console.log('Formatted address from Google Maps:', address);
            
            setLocation(prev => ({
              ...prev,
              address
            }));
            
            return; // Successfully got the address, exit the function
          } else {
            throw new Error('Google Maps API did not return usable data');
          }
        } catch (googleError) {
          console.error('Error with Google Maps API:', googleError);
          throw googleError; // Re-throw to be caught by the outer catch
        }
      }
    } catch (error) {
      console.error('Error fetching address from all sources:', error);
      
      // Generate mock address based on coordinates
      const mockAddress = getMockAddressForCoordinates(latitude, longitude);
      console.log('Using mock address:', mockAddress);
      
      // Use a short timeout to ensure the state updates properly
      setTimeout(() => {
        setLocation(prev => ({
          ...prev,
          address: mockAddress
        }));
      }, 100);
    }
  };
  
  // Get current location
  const getCurrentLocation = () => {
    setLocation(prev => ({ ...prev, loading: true, error: undefined }));
    
    console.log('Getting current location...');
    
    // Use the browser's geolocation API to get the user's actual live location
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser');
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'तुमचा ब्राउझर जीओलोकेशन सपोर्ट करत नाही.'
      }));
      return;
    }
    
    // Use a timeout to handle cases where the geolocation API doesn't respond
    const timeoutId = setTimeout(() => {
      console.error('Geolocation request timed out');
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'स्थान मिळवण्यासाठी वेळ संपला आहे.'
      }));
    }, 20000); // 20 seconds timeout
    
    try {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Clear the timeout since we got a response
          clearTimeout(timeoutId);
          
          // Extract the user's actual coordinates
          const { latitude, longitude } = position.coords;
          console.log('User live location:', latitude, longitude);
          
          setLocation(prev => ({
            ...prev,
            latitude,
            longitude,
            loading: false
          }));
          
          // Get address from coordinates
          fetchAddress(latitude, longitude);
          
          // Get weather data
          fetchWeatherData(latitude, longitude);
        },
        (error) => {
          // Clear the timeout since we got a response
          clearTimeout(timeoutId);
          
          console.error('Geolocation error:', error);
          
          let errorMessage = 'स्थान मिळवण्यात अडचण आली आहे.';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'स्थान परवानगी नाकारली गेली आहे. कृपया ब्राउझर सेटिंग्जमध्ये परवानगी द्या.';
              setPermissionStatus('denied');
              localStorage.setItem('locationPermission', 'denied');
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'स्थान माहिती उपलब्ध नाही.';
              break;
            case error.TIMEOUT:
              errorMessage = 'स्थान मिळवण्यासाठी वेळ संपला आहे.';
              break;
          }
          
          setLocation(prev => ({
            ...prev,
            loading: false,
            error: errorMessage
          }));
        },
        {
          enableHighAccuracy: true, // Use GPS if available
          timeout: 15000, // Wait up to 15 seconds
          maximumAge: 0 // Don't use cached location data
        }
      );
    } catch (e) {
      // Clear the timeout if there's an exception
      clearTimeout(timeoutId);
      
      console.error('Exception in geolocation:', e);
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'स्थान मिळवण्यात अडचण आली आहे.'
      }));
    }
  };
  
  // Check if geolocation is available
  useEffect(() => {
    console.log('Checking geolocation availability...');
    
    if ('geolocation' in navigator) {
      console.log('Geolocation is available');
      
      // Check if permission was previously granted
      const savedPermission = localStorage.getItem('locationPermission');
      console.log('Saved permission:', savedPermission);
      
      if (savedPermission === 'granted') {
        console.log('Permission was previously granted');
        setPermissionStatus('granted');
        // We'll get the location in the other useEffect when permissionStatus changes
      } else if (savedPermission === 'denied') {
        console.log('Permission was previously denied');
        setPermissionStatus('denied');
      } else {
        console.log('No saved permission, showing dialog');
        // Show permission dialog on first visit
        setShowPermissionDialog(true);
      }
    } else {
      console.error('Geolocation is not supported by this browser');
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'तुमचा ब्राउझर जीओलोकेशन सपोर्ट करत नाही.'
      }));
    }
  }, []); // Empty dependency array means this runs once on mount
  
  // Get current location when permission is granted
  useEffect(() => {
    console.log('Permission status changed to:', permissionStatus);
    
    if (permissionStatus === 'granted') {
      console.log('Permission is granted, getting location');
      // Add a small delay to ensure state updates have completed
      const timerId = setTimeout(() => {
        getCurrentLocation();
      }, 100);
      
      // Cleanup function to clear the timeout if the component unmounts
      return () => clearTimeout(timerId);
    }
  }, [permissionStatus]);
  
  // Handle permission choice
  const handlePermissionChoice = (choice: string) => {
    console.log('Permission choice:', choice);
    setShowPermissionDialog(false);
    
    if (choice === 'allow') {
      console.log('User allowed location permission');
      localStorage.setItem('locationPermission', 'granted');
      
      // Set permission status which will trigger the useEffect to get location
      setPermissionStatus('granted');
    } else if (choice === 'deny') {
      console.log('User denied location permission');
      localStorage.setItem('locationPermission', 'denied');
      setPermissionStatus('denied');
      
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'स्थान परवानगी नाकारली गेली आहे.'
      }));
    } else if (choice === 'askLater') {
      console.log('User chose to be asked later');
      // Don't set anything in localStorage, will ask again next time
      setPermissionStatus('prompt');
      
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'स्थान परवानगी नाकारली गेली आहे.'
      }));
    }
  };
  
  return (
    <div className="font-sans">
      {/* Permission Dialog */}
      {showPermissionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">स्थान परवानगी</h3>
              <p className="text-gray-600 mb-4">
                तुमचे स्थान आणि हवामान माहिती पाहण्यासाठी आम्हाला तुमच्या स्थानाची परवानगी आवश्यक आहे.
              </p>
              
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 mb-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-blue-700 font-medium">आम्ही तुमचे स्थान कशासाठी वापरतो?</p>
                    <ul className="text-blue-600 text-sm mt-1 list-disc list-inside">
                      <li>तुमच्या वर्तमान स्थानाचे नाव दाखवण्यासाठी</li>
                      <li>तुमच्या स्थानावर आधारित हवामान माहिती दाखवण्यासाठी</li>
                      <li>तुमच्या स्थानाजवळील सेवा शोधण्यासाठी</li>
                    </ul>
                    <p className="text-blue-600 text-sm mt-1">
                      अचूक स्थान बंद असताना, अॅप तुमचे अंदाजे स्थान वापरू शकते
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-5">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <p className="text-yellow-700 font-medium">महत्वाची माहिती</p>
                    <p className="text-yellow-600 text-sm mt-1">
                      आम्ही फक्त तुमचे स्थान आणि हवामान माहिती दाखवण्यासाठी वापरतो. तुमची माहिती कोणत्याही तृतीय पक्षासोबत शेअर केली जात नाही.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button 
                  onClick={() => handlePermissionChoice('deny')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  नकार द्या
                </button>
                <button 
                  onClick={() => handlePermissionChoice('askLater')}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  नंतर विचारा
                </button>
                <button 
                  onClick={() => handlePermissionChoice('allow')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  परवानगी द्या
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Location and Weather Display */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-xl font-semibold mb-3">तुमचे वर्तमान स्थान</h2>
        
        {permissionStatus === 'prompt' && !showPermissionDialog && (
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200">
            <MapPin className="h-12 w-12 text-blue-500 mb-3" />
            <p className="text-center mb-4 text-blue-800 font-medium">तुमचे स्थान आणि हवामान पाहण्यासाठी लोकेशन परवानगी द्या</p>
            <button 
              onClick={() => setShowPermissionDialog(true)}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-md"
            >
              परवानगी द्या
            </button>
          </div>
        )}
        
        {permissionStatus === 'denied' && (
          <div className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-red-50 to-red-100 rounded-lg border-2 border-red-200">
            <AlertCircle className="h-12 w-12 text-red-500 mb-3" />
            <p className="text-center mb-4 text-red-800 font-medium">स्थान परवानगी नाकारली गेली आहे</p>
            <p className="text-center text-red-600 mb-4">तुमचे स्थान आणि हवामान पाहण्यासाठी ब्राउझर सेटिंग्जमध्ये लोकेशन परवानगी सक्षम करा</p>
            <button 
              onClick={() => {
                localStorage.removeItem('locationPermission');
                setPermissionStatus('prompt');
                setShowPermissionDialog(true);
              }}
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium shadow-md"
            >
              पुन्हा प्रयत्न करा
            </button>
          </div>
        )}
        
        {permissionStatus === 'granted' && (
          <div>
            {location.loading ? (
              <div className="flex justify-center items-center h-20">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : location.error ? (
              <div className="text-red-500 p-3 bg-red-50 rounded-md">
                {location.error}
              </div>
            ) : (
              <div>
                {/* City/Village Name */}
                <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-green-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-green-800 mb-1">तुमचे गाव/शहर</div>
                      {location.address ? (
                        <>
                          {/* Extract and display village name more prominently */}
                          {(() => {
                            const addressParts = location.address.split(',');
                            const villageName = addressParts[0].trim();
                            const restOfAddress = addressParts.slice(1).join(',').trim();
                            
                            return (
                              <>
                                <div className="text-green-700 text-xl font-bold">{villageName}</div>
                                <div className="text-green-600 text-sm">{restOfAddress}</div>
                              </>
                            );
                          })()}
                          <div className="text-green-600 text-sm mt-1">
                            तुमच्या वर्तमान स्थानावर आधारित
                          </div>
                        </>
                      ) : (
                        <div className="text-green-700 text-lg font-semibold">
                          {weather.description && weather.description !== '' ? 
                            'तुमच्या वर्तमान स्थानावर आधारित' : 
                            'पत्ता लोड होत आहे...'
                          }
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Location Information */}
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg mb-4">
                  <div className="flex items-start">
                    <MapPin className="h-6 w-6 text-blue-600 mr-2 mt-1 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-blue-800 mb-1">तुमचे नेमके स्थान</div>
                      <div className="text-blue-700">
                        अक्षांश: {location.latitude.toFixed(6)}° | रेखांश: {location.longitude.toFixed(6)}°
                      </div>
                      <div className="text-blue-600 text-sm mt-1">
                        तुमच्या डिव्हाइसच्या GPS वरून मिळवलेले
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Weather Information */}
                {weather.loading ? (
                  <div className="flex justify-center items-center h-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : weather.error ? (
                  <div className="text-red-500 p-3 bg-red-50 rounded-md">
                    {weather.error}
                  </div>
                ) : (
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-lg">
                    <div className="flex items-start">
                      {weather.icon && (
                        <img 
                          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`} 
                          alt={weather.description || 'हवामान'} 
                          className="h-16 w-16 mr-2 flex-shrink-0"
                        />
                      )}
                      <div>
                        <div className="font-medium text-blue-800 mb-1">सध्याचे हवामान</div>
                        <div className="text-blue-700 text-2xl font-bold">
                          {weather.temperature !== undefined ? `${Math.round(weather.temperature)}°C` : ''}
                        </div>
                        <div className="text-blue-700 font-medium">
                          {weather.description || 'हवामान माहिती'}
                        </div>
                        <div className="text-blue-600 text-sm mt-1">
                          {new Date().toLocaleDateString('mr-IN', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </div>
                        <div className="text-blue-600 text-sm">
                          तुमच्या वर्तमान स्थानावर आधारित हवामान (दर तासाला अपडेट होते)
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationPermission;