import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import styles from './MapBarcelona.module.css'; // Importa el archivo CSS

// Configuración del ícono de marcador
const customIcon = new L.Icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  shadowSize: [41, 41],
});

interface MarkerInfo {
  lat: number;
  lng: number;
  info: string;
  shop?: string;
  photo?: string;
  score?: number;
}

const BarcelonaMap: React.FC = () => {
  const markers: MarkerInfo[] = [
    {
      lat: 41.39,
      lng: 2.1926,
      info: 'Parque Guell',
      shop: 'Churreria',
      photo: 'https://live.staticflickr.com/3028/2490030185_8663c16487_b.jpg',
      score: 4.2
    },
    {
      lat: 41.28433811688789,
      lng: 1.981488925793924,
      info: 'Carrer de la Esglesia',
      shop: 'Paca',
      photo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRTDrAhc41JMn0UHfV_EkgVIHzZhj3EZb3XyQ&s',
      score: 5
    },
    { lat: 41.3784, lng: 2.1926, info: 'Plaza Guell' },
    { lat: 41.3802, lng: 2.1927, info: 'Sagrada Familia' }
  ];

  return (
    <MapContainer center={[41.3784, 2.1926]} zoom={13} className={styles.mapContainer}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker, index) => (
        <Marker key={index} position={[marker.lat, marker.lng]} icon={customIcon}>
          <Popup>
            <div className={styles.popupContainer}>
              <h3>{marker.info}</h3>
              {marker.photo && (
                <img
                  src={marker.photo}
                  alt={marker.info}
                  className={styles.popupImage} // Aplica la clase para la imagen
                />
              )}
              {marker.shop && <p className={styles.popupText}><strong>Tienda:</strong> {marker.shop}</p>}
              {marker.score && <p className={styles.popupText}><strong>Score:</strong> {marker.score}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default BarcelonaMap;