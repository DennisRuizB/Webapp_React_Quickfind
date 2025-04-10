import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./MapBarcelona.module.css";
import { GetAllCompanies } from "../../service/companiesService";
import { Company } from "../../models/Company";

const customIcon = new L.Icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);

  useEffect(() => {
    const handleCompanies = async () => {
      const companies: Company[] = await GetAllCompanies();
      console.log(companies); // Verifica la estructura de los datos
      const newMarkers = companies.map((company) => ({
        lat: company.coordenates_lat, // Ajusta según la estructura de tu modelo Company
        lng: company.coordenates_lng, // Ajusta según la estructura de tu modelo Company
        info: company.description, // Ajusta según la estructura de tu modelo Company
        shop: company.name, // Ajusta según la estructura de tu modelo Company
        photo: company.phone, // Ajusta según la estructura de tu modelo Company
        score: company.rating, // Ajusta según la estructura de tu modelo Company
      }));
      setMarkers(newMarkers);
    };
    handleCompanies();
  }, []);

  return (
    <MapContainer
      center={[41.3784, 2.1926]}
      zoom={13}
      className={styles.mapContainer}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker, index) => (
        <Marker
          key={index}
          position={[marker.lat, marker.lng]}
          icon={customIcon}
        >
          <Popup>
            <div className={styles.popupContainer}>
              <h3>{marker.info}</h3>
              {marker.photo && (
                <img
                  src={marker.photo}
                  alt={marker.info}
                  className={styles.popupImage}
                />
              )}
              {marker.shop && (
                <p className={styles.popupText}>
                  <strong>Tienda:</strong> {marker.shop}
                </p>
              )}
              {marker.score && (
                <p className={styles.popupText}>
                  <strong>Score:</strong> {marker.score}
                </p>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default BarcelonaMap;
