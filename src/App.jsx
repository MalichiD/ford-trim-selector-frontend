import { useState, useEffect } from "react";
import "./App.css";
import api from './api/axiosConfig';
import { useUser, SignedIn } from "@clerk/clerk-react";
import { Routes, Route, Link } from "react-router-dom";
import Vehicle from "./pages/vehicle/vehicle";
import Compare from "./pages/compare/compare";

export default function App() {
  // const { isSignedIn, user } = useUser();
  const [vehicles, setVehicles] = useState([]);
  const [favoriteVehicleIds, setFavoriteVehicleIds] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  // useEffect(() => {
  //   const fetchOrCreateUser = async () => {
  //     if (isSignedIn && user) {
  //       try {
  //         const response = await api.post('/api/users', {
  //           userId: user.id,
  //           email: user.primaryEmailAddress.emailAddress,
  //         });
  //         console.log('User document:', response.data);
  //         setFavoriteVehicleIds(response.data.favoriteVehicleIds || []);
  //       } catch (error) {
  //         console.error('Error fetching or creating user document:', error);
  //       }
  //     }
  //   };

  //   fetchOrCreateUser();
  // }, [isSignedIn, user]);

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

  
  const toggleFavorites = () => {
    setShowFavorites(!showFavorites);
  };

  const displayedVehicles = showFavorites
  ? vehicles.filter(vehicle => favoriteVehicleIds.includes(vehicle.id))
  : vehicles;

  return (
    <>
      <SignedIn>
        <button onClick={toggleFavorites}>
          {showFavorites ? "Show All Vehicles" : "Show Favorite Vehicles"}
        </button>
      </SignedIn>
      <main>
        <Routes>
          <Route path="/" element={
            <>
              <h1>Select a Vehicle</h1>
              <div className="vehicle-gallery">
                {displayedVehicles.map(vehicle => (
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
          <Route path="/compare" element={<Compare />} />
        </Routes>
      </main>
    </>
  );
}