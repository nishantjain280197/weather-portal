
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, 12);
  return null;
}

function WeatherMap({ lat, lon, assessment }) {
  const position = [lat, lon];
  const riskLevel = assessment?.assessment?.overall || 'Low';

  return (
    <MapContainer center={position} zoom={12} style={{ height: '100%', width: '100%' }}>
      <ChangeView center={position} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <div className="text-sm">
            <strong>Risk Level: {riskLevel}</strong>
            <br />
            Lat: {lat.toFixed(4)}, Lon: {lon.toFixed(4)}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default WeatherMap;
