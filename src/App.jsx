import { useState, useEffect } from "react";
import "./App.css";
import api from './api/axiosConfig';
import Header from "./components/header";
import { Routes, Route, Link } from "react-router-dom";
import Vehicle from "./pages/vehicle/vehicle";

export default function App() {
  const [vehicles, setVehicles] = useState([]);

  const getVehicles = async () => {
    try {
      const response = await api.get("/api/v1/vehicles");
      console.log(response.data);
      setVehicles(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getVehicles();
  }, []);

  return (
    <>
      <Header />
      <main>
      <Routes>
          <Route path="/" element={
            <>
              <h1>Select a Vehicle</h1>
              <div className="vehicle-gallery">
                {vehicles.map(vehicle => (
                  <Link key={vehicle.id} to={`/vehicle/${vehicle.model}/${vehicle.year}`}>
                    <img src={vehicle.images[0] || 'placeholder_image_url'} alt={`${vehicle.year} ${vehicle.model}`} className="vehicle-image"/>
                  </Link>
                ))}
              </div>
              <div className="search-container">
                <input type="text" placeholder="Search" id="vehicle-search"/>
              </div>
            </>
          } />
          <Route path="/vehicle/:model/:year" element={<Vehicle />} />
        </Routes>
      </main>
    </>
  );
}