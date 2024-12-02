import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/axiosConfig';
import { SignedIn, useUser } from '@clerk/clerk-react';
import './vehicle.css';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const Vehicle = () => {
  const { model, year } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [selectedTrim, setSelectedTrim] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isSignedIn, user } = useUser();


  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await api.get(`/api/v1/vehicles/${model}/${year}`);
        setVehicle(response.data);
        setSelectedTrim(response.data.trims[0]); // Set the default selected trim

        // Check if the vehicle is favorited
        if (isSignedIn && user && user.id) {
          const userResponse = await api.get(`/api/v1/users/${user.id}`);
          setIsFavorited(userResponse.data.favorites.includes(response.data.id));
        }
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
        setError(error.message);
      }
    };

    fetchVehicleDetails();
  }, [model, year, isSignedIn, user]);

  const handleTrimChange = (event) => {
    const selectedTrimValue = event.target.value;
    const [trimName, driveType, engineModel] = selectedTrimValue.split(' - ');
    const trim = vehicle.trims.find(trim => 
      trim.name === trimName && 
      trim.drivetrain.drive_type === driveType && 
      trim.engine.engine_model === engineModel
    );
    setSelectedTrim(trim);
    console.log('Trim changed to:', trim); // Debugging log
  };

  const handleCompareClick = () => {
    navigate(`/compare?vehicle=${model}-${year}&trim=${selectedTrim.name}-${selectedTrim.drivetrain.drive_type}-${selectedTrim.engine.engine_model}`);
  };

  const handleFavoriteClick = async () => {
    if (isSignedIn && user && user.id) {
      try {
        console.log(vehicle.model);
        console.log(vehicle.id);

        if (isFavorited) {
          // Remove from favorites
          const response = await api.delete(`/api/v1/users/${user.id}/favorites/${vehicle.id}`);
          console.log('Favorite status updated:', response);
          setIsFavorited(false);
        } else {
          // Add to favorites
          const response = await api.post(`/api/v1/users/${user.id}/favorites/${vehicle.id}`);
          console.log('Favorite status updated:', response);
          setIsFavorited(true);
        }
      } catch (error) {
        console.error('Error updating favorite status:', error);
      }
    } else {
      console.error('User is not signed in or user ID is not available');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!vehicle || !selectedTrim) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <main>
        <section className="vehicle-info">
          <h2 id="vehicleTitle">{vehicle.year} {capitalizeFirstLetter(vehicle.model)}</h2>
          <img id="vehicleImage" src={vehicle.images[0] || 'placeholder_image_url'} alt="Vehicle Image" className="vehicle-image" />
          <select id="trimSelector" className="vehicle-select" onChange={handleTrimChange} value={`${selectedTrim.name} - ${selectedTrim.drivetrain.drive_type} - ${selectedTrim.engine.engine_model}`}>
            {vehicle.trims.map(trim => (
              <option key={`${trim.name}-${trim.drivetrain.drive_type}-${trim.engine.engine_model}`} value={`${trim.name} - ${trim.drivetrain.drive_type} - ${trim.engine.engine_model}`}>
                {trim.name} - {trim.drivetrain.drive_type} - {trim.engine.engine_model}
              </option>
            ))}
          </select>
          <button id="compareButton" className="btn" onClick={handleCompareClick}>Compare This Vehicle</button>
          <SignedIn><button id="favoriteButton" className="btn" onClick={handleFavoriteClick}>
            {isFavorited ? 'Unfavorite' : 'Favorite'}
          </button>
          </SignedIn>
        </section>
        <section className="vehicle-details">
          <h3>General Information</h3>
          <ul>
            <li id="TrimLevel">Trim Level: {selectedTrim.name}</li>
            <li id="startingprice">Starting Price: ${selectedTrim.starting_msrp ? selectedTrim.starting_msrp : 'N/A'}</li>
            <li id="engine">Engine: {selectedTrim.engine.engine_model}</li>
            <li id="Horsepower">Horsepower: {selectedTrim.engine.horsepower ? selectedTrim.engine.horsepower : 'N/A'} HP</li>
            <li id="torque">Torque: {selectedTrim.engine.torque ? selectedTrim.engine.torque : 'N/A'} lb-ft</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Vehicle;