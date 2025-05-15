import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import styles from "./MapBarcelona.module.css";
import { GetAllCompanies, getCompanyByProductName, getCompanyByName } from "../../../service/companiesService";
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
  const [searchType, setSearchType] = useState<string>("product"); // Nuevo estado para el tipo de búsqueda

  const navigate = useNavigate();

  const handleSearch = async (query: string) => {
    if (query) {
      try {
        let filteredResults: Company[] = [];
        if (searchType === "product") {
          filteredResults = await getCompanyByProductName(query);
        } else if (searchType === "company") {
          filteredResults = await getCompanyByName(query);
        }

        console.log("Resultados filtrados", filteredResults);

        const newMarkers = filteredResults.map((company) => ({
          lat: company.coordenates_lat,
          lng: company.coordenates_lng,
          info: company.description,
          shop: company.name,
          phone: company.phone,
          icon: company.icon,
          score: company.rating,
        }));
        setMarkers(newMarkers);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    } else {
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
  };

  return (
    <div className={styles.mapWrapper}>
      {/* Barra buscadora */}
      <div className={styles.searchBar}>
        <select
          className={styles.searchTypeSelect}
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)} // Cambia el tipo de búsqueda
        >
          <option value="product">Search by Product</option>
          <option value="company">Search by Company</option>
        </select>
        <input
          type="text"
          placeholder={`Search for a ${searchType}...`}
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
            <h2 onClick={() => loadCompanyProfile(selectedCompany)}>
              {selectedCompany.name || "No Name Available"}
            </h2>

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
                      navigate(`/ReserveProducts/${selectedCompany._id}`);
                    }
                  }}
                >
                  Reserve Products
                </button>
                <p> _______________________ </p>
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
                position={[marker.lat, marker.lng]}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleMarkerClick(company),
                  }}
              >
                    {/* <Popup>
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
                    </Popup> */}
              </Marker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default BarcelonaMap;