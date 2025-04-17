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
  phone?: string;
  icon?: string;
  score?: number;
}


const BarcelonaMap: React.FC = () => {
  const [markers, setMarkers] = useState<MarkerInfo[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [reloadCompanies, setReloadCompanies] = useState<boolean>(false);
  
  const handleSearch = (query: string) => {
    if(query){

    
    //Por si queremos filtar por nombre
    // const filteredCompanies = companies.filter((company) =>
    //   company.name.toLowerCase().includes(query.toLowerCase())
    // );

  const filteredByProducts = companies.filter((company) =>
      company.products.some((product: any) =>
          product.name.toLowerCase().includes(query.toLowerCase())
      )
  );
  
  console.log("productos filtrados", filteredByProducts);

    const newMarkers = filteredByProducts.map((company) => ({
      lat: company.coordenates_lat, 
      lng: company.coordenates_lng,
      info: company.description,
      shop: company.name,
      phone: company.phone,
      icon: company.icon, 
      score: company.rating, 
  }));
    setMarkers(newMarkers);
}else{
  setReloadCompanies(true);
}

  };

  useEffect(() => {
    const handleCompanies = async () => {
      const newCompanies: Company[] = await GetAllCompanies();
      setCompanies(newCompanies);
      console.log(newCompanies); // Verifica la estructura de los datos
      const newMarkers = newCompanies.map((company) => ({
        lat: company.coordenates_lat, 
        lng: company.coordenates_lng,
        info: company.description,
        shop: company.name,
        phone: company.phone,
        icon: company.icon, 
        score: company.rating, 
      }));
      setMarkers(newMarkers);
    };
    handleCompanies();
    setReloadCompanies(false);
  }, [reloadCompanies]);

  return (
    <div className={styles.mapWrapper}>
        {/* Barra buscadora */}
        <div className={styles.searchBar}>
            <input
                type="text"
                placeholder="Search for a product..."
                className={styles.searchInput}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(e.currentTarget.value);
                }}
            />
            <button
                className={styles.searchButton}
                onClick={() => {
                    const input = document.querySelector<HTMLInputElement>(
                        `.${styles.searchInput}`
                    );
                    if (input) handleSearch(input.value);
                }}
            >
                Search
            </button>
        </div>

        {/* Contenedor del mapa */}
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
                        <h3>{marker.shop}</h3>
                        <p><strong>Description:</strong> {marker.info}</p>
                        {marker.icon && (
                            <div className={styles.iconContainer}>
                                <img
                                    src={marker.icon}
                                    alt="Icon"
                                    className={styles.iconImage}
                                />
                            </div>
                        )}
                        {marker.phone && (
                          <p><strong>Phone:</strong> {marker.phone}</p>
                        )}
                        {marker.score && (
                          <p><strong>Rating:</strong> {marker.score} ⭐</p>
                        )}
                        {companies
                          .find((company) => company.name === marker.shop)
                          ?.products.length ? (
                          <>
                            <p><strong>Products:</strong></p>
                            <div className={styles.productsContainer}>
                              {companies
                                .find((company) => company.name === marker.shop)
                                ?.products.map((product: any, i) => (
                                  <div key={i} className={styles.productCard}>
                                    <p><strong>Name:</strong> {product.name}</p>
                                    <p><strong>Rating:</strong> {product.rating} ⭐</p>
                                    <p><strong>Description:</strong> {product.description}</p>
                                    <p><strong>Price:</strong> {product.price}€</p>
                                  </div>
                                ))}
                            </div>
                          </>
                        ) : null}
                      </div>
                    </Popup>
              </Marker>
          ))}
        </MapContainer>
    </div>
);
};

export default BarcelonaMap;
