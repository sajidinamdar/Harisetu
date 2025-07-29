import React, { useEffect, useRef } from 'react';

interface MapProps {
  latitude: number;
  longitude: number;
  services: Array<{
    id: string;
    name: string;
    type: string;
    address: string;
    latitude?: number;
    longitude?: number;
    distance: number;
  }>;
  onServiceSelect?: (serviceId: string) => void;
}

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const ServicesMap: React.FC<MapProps> = ({ latitude, longitude, services, onServiceSelect }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  
  // Initialize map when component mounts
  useEffect(() => {
    // Skip if no coordinates or if Google Maps API is not loaded
    if (!latitude || !longitude || !window.google) return;
    
    // Create map instance
    const mapOptions = {
      center: { lat: latitude, lng: longitude },
      zoom: 12,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
      zoomControl: true,
    };
    
    googleMapRef.current = new window.google.maps.Map(mapRef.current, mapOptions);
    
    // Add user location marker
    new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map: googleMapRef.current,
      title: 'तुमचे स्थान',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 2,
      },
    });
    
    // Add service markers
    addServiceMarkers();
    
    return () => {
      // Clean up markers when component unmounts
      if (markersRef.current) {
        markersRef.current.forEach(marker => marker.setMap(null));
        markersRef.current = [];
      }
    };
  }, [latitude, longitude, services]);
  
  // Add markers for services
  const addServiceMarkers = () => {
    if (!googleMapRef.current || !services.length) return;
    
    // Clear existing markers
    if (markersRef.current) {
      markersRef.current.forEach(marker => marker.setMap(null));
      markersRef.current = [];
    }
    
    // Service coordinates (mock data - in a real app, these would come from the API)
    const serviceCoordinates: Record<string, { lat: number, lng: number }> = {
      'vet1': { lat: latitude + 0.02, lng: longitude + 0.03 },
      'vet2': { lat: latitude + 0.08, lng: longitude - 0.05 },
      'vet3': { lat: latitude - 0.01, lng: longitude + 0.01 },
      'shop1': { lat: latitude + 0.015, lng: longitude + 0.02 },
      'shop2': { lat: latitude - 0.03, lng: longitude + 0.04 },
      'shop3': { lat: latitude + 0.04, lng: longitude - 0.03 },
      'diag1': { lat: latitude - 0.05, lng: longitude - 0.04 },
      'adv1': { lat: latitude + 0.06, lng: longitude + 0.06 },
      'equip1': { lat: latitude - 0.06, lng: longitude + 0.05 },
      'equip2': { lat: latitude + 0.07, lng: longitude - 0.06 },
      'logis1': { lat: latitude - 0.07, lng: longitude - 0.07 },
      'fin1': { lat: latitude + 0.025, lng: longitude - 0.02 },
      'fin2': { lat: latitude - 0.04, lng: longitude + 0.03 }
    };
    
    // Get icon for service type
    const getIconForType = (type: string) => {
      switch (type) {
        case 'veterinary':
          return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
        case 'agri-supply':
          return 'https://maps.google.com/mapfiles/ms/icons/green-dot.png';
        case 'diagnostic':
          return 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png';
        case 'equipment':
          return 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
        case 'financial':
          return 'https://maps.google.com/mapfiles/ms/icons/purple-dot.png';
        case 'advisory':
          return 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png';
        default:
          return 'https://maps.google.com/mapfiles/ms/icons/red-dot.png';
      }
    };
    
    // Create info window for markers
    const infoWindow = new window.google.maps.InfoWindow();
    
    // Add markers for each service
    services.forEach(service => {
      const coords = serviceCoordinates[service.id];
      if (!coords) return;
      
      const marker = new window.google.maps.Marker({
        position: coords,
        map: googleMapRef.current,
        title: service.name,
        icon: getIconForType(service.type),
      });
      
      // Add click listener to marker
      marker.addListener('click', () => {
        // Show info window
        infoWindow.setContent(`
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="font-weight: bold; margin-bottom: 4px;">${service.name}</h3>
            <p style="font-size: 12px; margin-bottom: 4px;">${service.address}</p>
            <p style="font-size: 12px;">${service.distance} किमी</p>
          </div>
        `);
        infoWindow.open(googleMapRef.current, marker);
        
        // Call onServiceSelect if provided
        if (onServiceSelect) {
          onServiceSelect(service.id);
        }
      });
      
      markersRef.current.push(marker);
    });
    
    // Adjust map bounds to include all markers
    const bounds = new window.google.maps.LatLngBounds();
    bounds.extend({ lat: latitude, lng: longitude }); // Include user location
    
    markersRef.current.forEach(marker => {
      bounds.extend(marker.getPosition());
    });
    
    googleMapRef.current.fitBounds(bounds);
  };
  
  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} className="w-full h-full"></div>
    </div>
  );
};

export default ServicesMap;