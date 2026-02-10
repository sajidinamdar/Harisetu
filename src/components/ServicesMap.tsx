import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

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

const ServicesMap: React.FC<MapProps> = ({ latitude, longitude, services, onServiceSelect }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    if (!mapContainerRef.current || !latitude || !longitude) return;

    // Initialize map
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([latitude, longitude], 13);

      const apiKey = import.meta.env.VITE_MAP_API_KEY;
      // Use LocationIQ tiles
      L.tileLayer(`https://{s}.locationiq.com/v2/obm/tiles.json?key=${apiKey}&v=1.1.0&s={s}&x={x}&y={y}&z={z}`, {
        attribution: '&copy; <a href="https://locationiq.com">LocationIQ</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView([latitude, longitude]);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add user marker
    const userMarker = L.circleMarker([latitude, longitude], {
      color: '#ffffff',
      fillColor: '#4285F4',
      fillOpacity: 1,
      radius: 8,
      weight: 2
    }).addTo(mapRef.current).bindPopup('तुमचे स्थान');

    // @ts-ignore
    markersRef.current.push(userMarker);

    // Add service markers using real latitude and longitude
    services.forEach(service => {
      if (service.latitude === undefined || service.longitude === undefined) return;

      const marker = L.marker([service.latitude, service.longitude])
        .addTo(mapRef.current!)
        .bindPopup(`
          <div style="padding: 5px;">
            <h3 style="font-weight: bold; margin-bottom: 2px;">${service.name}</h3>
            <p style="font-size: 11px; margin-bottom: 2px;">${service.address}</p>
            <p style="font-size: 11px;">${service.distance} किमी</p>
          </div>
        `);

      marker.on('click', () => {
        if (onServiceSelect) onServiceSelect(service.id);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds if markers exist
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapRef.current.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      // Cleanup is usually handled by ref persistence in Leaflet
    };
  }, [latitude, longitude, services]);

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden shadow-md border border-gray-200">
      <div ref={mapContainerRef} className="w-full h-full" style={{ zIndex: 1 }}></div>
    </div>
  );
};

export default ServicesMap;