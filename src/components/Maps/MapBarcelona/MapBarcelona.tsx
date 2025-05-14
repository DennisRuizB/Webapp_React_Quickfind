import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./MapBarcelona.module.css";
import { GetAllCompanies } from "../../../service/companiesService";
import { Company } from "../../../models/Company";
import { useNavigate } from "react-router-dom";
import ReserveProducts from "../../ReserveProducts/ReserveProducts";
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
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  
  const navigate = useNavigate() 

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

  const handleMarkerClick = (company: Company) => {
    console.log("Marker clicked:", company);
    setSelectedCompany(company);
  };

  const closeSidebar = () => {
    setSelectedCompany(null);
  };

  const loadCompanyProfile = (company: Company) => {
    console.log("Loading company profile:", company);
    navigate(`/company/${company._id}`); // Redirige a la página del perfil de la empresa
    // Aquí puedes implementar la lógica para cargar el perfil de la empresa
  }

  return (
    <div className={styles.mapWrapper}>
      {/* Barra buscadora */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search for a product..."
          className={styles.searchInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSearch(e.currentTarget.value);
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
  
      {/* Contenedor del mapa y la barra lateral */}
      <div className={styles.mapContainer}>
        {selectedCompany && (
          <div className={`${styles.sidebar} ${styles.open}`}>
            <button className={styles.closeButton} onClick={closeSidebar}>
              Close
            </button>
            <h2 onClick={() => loadCompanyProfile(selectedCompany)}>{selectedCompany.name || "No Name Available"}</h2>

            {selectedCompany.icon && (
              <img
                src={selectedCompany.icon}
                alt="Icon"
                className={styles.iconImage}
              />
            )}
            <p>
              <strong>Description:</strong>{" "}
              {selectedCompany.description || "No Description Available"}
            </p>
            <p>
              <strong>Phone:</strong>{" "}
              {selectedCompany.phone || "No Phone Available"}
            </p>
            <p>
              <strong>Rating:</strong>{" "}
              {selectedCompany.rating
                ? `${selectedCompany.rating} ⭐`
                : "No Rating Available"}
            </p>
            {selectedCompany.products && selectedCompany.products.length > 0 ? (
              <>
                <p>
                  <strong>Products:</strong>
                </p>
                <div className={styles.productsContainer}>
                  {selectedCompany.products.map((product, index) => (
                    <div key={index} className={styles.productCard}>
                      <p>
                        <strong>Name:</strong> {product.name || "No Name"}
                      </p>
                      <p>
                        <strong>Rating:</strong>{" "}
                        {product.rating ? `${product.rating} ⭐` : "No Rating"}
                      </p>
                      <p>
                        <strong>Description:</strong>{" "}
                        {product.description || "No Description"}
                      </p>
                      <p>
                        <strong>Price:</strong>{" "}
                        {product.price ? `${product.price}€` : "No Price"}
                      </p>
                    </div>
                  ))}
                  
                </div>
                <button
                  className={styles.reserveButton}
                  onClick={() => {
                    if (selectedCompany) {
                      navigate(
                        `/ReserveProducts/${selectedCompany._id}`
                      ); // Redirige a la página de reserva de productos
                    }
                  }}
                >
                  Reserve Products
                </button>
                <p> _______________________  </p>
              </>
            ) : (
              <p>No Products Available</p>
            )}
          </div>
        )}

  
        <MapContainer
          center={[41.3784, 2.1926]}
          zoom={13}
          className={styles.mapContainer}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {markers.map((marker, index) => {
            const company = companies.find(
              (company) =>
                company.coordenates_lat === marker.lat &&
                company.coordenates_lng === marker.lng
            );
  
            if (!company) return null;

          return (
              <Marker
                  key={index}
                  position={[marker.lat, marker.lng, company.coordenates_lng]}
                  icon={customIcon}
                  eventHandlers={{
                  click: () => handleMarkerClick(company),
                  }}
              >
              </Marker>
            );
      })}
        </MapContainer>
       </div>
    </div>

);
};

export default BarcelonaMap;