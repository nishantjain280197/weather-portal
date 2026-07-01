import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';

function MapUpdater({ lat, lon }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lon], 12);
  }, [lat, lon, map]);
  return null;
}

function WeatherMap({ lat, lon, assessment }) {
  const riskLevel = assessment?.assessment?.overall || 'Unknown';

  return (
    <MapContainer
      center={[lat, lon]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      <Marker position={[lat, lon]}>
        <Popup>
          <div style={{ color: '#1e293b', fontSize: '12px' }}>
            <strong>Risk Level: {riskLevel}</strong><br />
            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
          </div>
        </Popup>
      </Marker>
      <MapUpdater lat={lat} lon={lon} />
    </MapContainer>
  );
}

export default WeatherMap;
