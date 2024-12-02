import { useState, useEffect } from "react";
import "./App.css";
import api from './api/axiosConfig';
import { useUser, SignedIn } from "@clerk/clerk-react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Vehicle from "./pages/vehicle/vehicle";
import Compare from "./pages/compare/compare";

export default function App() {
  const { isSignedIn, user } = useUser();
  const [vehicles, setVehicles] = useState([]);
  const [favoriteVehicleIds, setFavoriteVehicleIds] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const location = useLocation();

  useEffect(() => {
    const fetchOrCreateUser = async () => {
      if (isSignedIn && user) {
        try {
          // Attempt to fetch the user by ID
          const response = await api.get(`/api/v1/users/${user.id}`);
          setFavoriteVehicleIds(response.data.favorites);
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // User not found, create the user
            try {
              const primaryEmail = user.primaryEmailAddress.emailAddress; // Access the first email address
              const createUserResponse = await api.post('/api/v1/users', {
                authid: user.id,
                email: primaryEmail,
                favorites: [],
              });
              console.log('Created user document:', createUserResponse.data);
              setFavoriteVehicleIds(createUserResponse.data.favorites);
            } catch (createError) {
              console.error('Error creating user document:', createError);
            }
          } else {
            console.error('Error fetching user document:', error);
          }
        }
      }
    };

    fetchOrCreateUser();
  }, [isSignedIn, user]);

  const getVehicles = async () => {
    try {
      const response = await api.get("/api/v1/vehicles");
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

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value.toLowerCase());
  };

  const displayedVehicles = showFavorites
    ? vehicles.filter(vehicle => favoriteVehicleIds.includes(vehicle.id))
    : vehicles.filter(vehicle => vehicle.model.toLowerCase().includes(searchValue) || vehicle.year.toLowerCase().includes(searchValue));

  return (
    <>
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
              {location.pathname === "/" && (
          <SignedIn>
            <button onClick={toggleFavorites} className="favorites-button">
              {showFavorites ? "Show All Vehicles" : "Show Favorite Vehicles"}
            </button>
          </SignedIn>
        )}
        <div className="search-container">
                <input
                  type="text"
                  placeholder="Search"
                  id="vehicle-search"
                  value={searchValue}
                  onChange={handleSearchChange}
                />
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