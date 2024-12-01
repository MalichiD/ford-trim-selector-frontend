import { useState, useEffect } from 'react';
import { useParams} from 'react-router-dom';
import './vehicle.css';
import api from '../../api/axiosConfig';
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};


const Vehicle = () => {
  const { model, year } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [selectedTrim, setSelectedTrim] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const response = await api.get(`/api/v1/vehicles/${model}/${year}`);
        setVehicle(response.data);
        setSelectedTrim(response.data.trims[0]); 
      } catch (error) {
        console.error('Error fetching vehicle details:', error);
        setError(error.message);
      }
    };

    fetchVehicleDetails();
  }, [model, year]);

  const handleTrimChange = (event) => {
    const selectedTrimName = event.target.value;
    const trim = vehicle.trims.find(trim => trim.name === selectedTrimName);
    setSelectedTrim(trim);
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
          <select id="trimSelector" className="vehicle-select" onChange={handleTrimChange} value={selectedTrim.name}>
            {vehicle.trims.map(trim => (
              <option key={trim.name} value={trim.name}>
                {trim.name} - {trim.drivetrain.drive_type} - {trim.engine.engine_model}
              </option>
            ))}
          </select>
          <button id="compareButton" className="btn">Compare This Vehicle</button>
        </section>
        <section className="vehicle-details">
          <h3>General Information</h3>
          <ul>
            <li id="TrimLevel">Trim Level: {selectedTrim.name}</li>
            <li id="startingprice">Starting Price: ${selectedTrim.starting_msrp}</li>
            <li id="engine">Engine: {selectedTrim.engine.engine_model}</li>
            <li id="Horsepower">Horsepower: {selectedTrim.engine.horsepower} HP</li>
            <li id="torque">Torque: {selectedTrim.engine.torque} lb-ft</li>
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Vehicle;