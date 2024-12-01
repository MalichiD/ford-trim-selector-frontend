import React, { useState, useEffect, useMemo} from 'react';
import { Link, useLocation} from 'react-router-dom';
import api from '../../api/axiosConfig';
import './compare.css';

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const Compare = () => {
  const [vehicles, setVehicles] = useState([]);
  const [vehicle1, setVehicle1] = useState(null);
  const [vehicle2, setVehicle2] = useState(null);
  const [selectedTrim1, setSelectedTrim1] = useState(null);
  const [selectedTrim2, setSelectedTrim2] = useState(null);
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  useEffect(() => {
    console.log('Fetching vehicles...');
    const fetchVehicles = async () => {
      try {
        const response = await api.get('/api/v1/vehicles');
        console.log('Fetched vehicles:', response.data);
        setVehicles(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    const vehicleParam = query.get('vehicle');
    const trimParam = query.get('trim');
    console.log('Query parameters:', { vehicleParam, trimParam });
    if (vehicleParam && trimParam) {
      const [model, year] = vehicleParam.split('-');
      const [trimName, driveType, engineModel] = trimParam.split('-');
      console.log('Fetching vehicle details for:', { model, year, trimName, driveType, engineModel });
      const fetchVehicleDetails = async () => {
        try {
          const response = await api.get(`/api/v1/vehicles/${model}/${year}`);
          console.log('Fetched vehicle details:', response.data);
          setVehicle1(response.data);
          const trim = response.data.trims.find(trim => 
            trim.name === trimName && 
            trim.drivetrain.drive_type === driveType && 
            trim.engine.engine_model === engineModel
          );
          setSelectedTrim1(trim);
          console.log('Selected trim:', trim);
        } catch (error) {
          console.error('Error fetching vehicle details:', error);
        }
      };

      fetchVehicleDetails();
    }
  }, [query]);

  const handleVehicle1Change = async (event) => {
    const selectedVehicle = event.target.value;
    const [model, year] = selectedVehicle.split('-');
    try {
      const response = await api.get(`/api/v1/vehicles/${model}/${year}`);
      setVehicle1(response.data);
      setSelectedTrim1(response.data.trims[0]);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    }
  };

  const handleVehicle2Change = async (event) => {
    const selectedVehicle = event.target.value;
    const [model, year] = selectedVehicle.split('-');
    try {
      const response = await api.get(`/api/v1/vehicles/${model}/${year}`);
      setVehicle2(response.data);
      setSelectedTrim2(response.data.trims[0]);
    } catch (error) {
      console.error('Error fetching vehicle details:', error);
    }
  };

  const handleTrim1Change = (event) => {
    const selectedTrimValue = event.target.value;
    const [trimName, driveType, engineModel] = selectedTrimValue.split(' - ');
    const trim = vehicle1.trims.find(trim => 
      trim.name === trimName && 
      trim.drivetrain.drive_type === driveType && 
      trim.engine.engine_model === engineModel
    );
    setSelectedTrim1(trim);
  };

  const handleTrim2Change = (event) => {
    const selectedTrimValue = event.target.value;
    const [trimName, driveType, engineModel] = selectedTrimValue.split(' - ');
    const trim = vehicle2.trims.find(trim => 
      trim.name === trimName && 
      trim.drivetrain.drive_type === driveType && 
      trim.engine.engine_model === engineModel
    );
    setSelectedTrim2(trim);
  };

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Compare Vehicles</h1>
      <main>
        <div className="vehicle-comparison">
          <div className="vehicle-container">
            <select id="vehicle1Selector" className="vehicle-select" onChange={handleVehicle1Change}>
              <option value="">Select a vehicle</option>
              {vehicles.map(vehicle => (
                <option key={`${vehicle.model}-${vehicle.year}`} value={`${vehicle.model}-${vehicle.year}`}>
                  {vehicle.year} {capitalizeFirstLetter(vehicle.model)}
                </option>
              ))}
            </select>
            {vehicle1 && (
              <>
                <select id="trim1Selector" className="trim-select" onChange={handleTrim1Change} value={selectedTrim1 ? `${selectedTrim1.name} - ${selectedTrim1.drivetrain.drive_type} - ${selectedTrim1.engine.engine_model}` : ''}>
                  <option value="">Select a trim</option>
                  {vehicle1.trims.map(trim => (
                    <option key={`${trim.name}-${trim.drivetrain.drive_type}-${trim.engine.engine_model}`} value={`${trim.name} - ${trim.drivetrain.drive_type} - ${trim.engine.engine_model}`}>
                      {trim.name} - {trim.drivetrain.drive_type} - {trim.engine.engine_model}
                    </option>
                  ))}
                </select>
                <img id="vehicle1Image" src={vehicle1.images[0] || 'placeholder_image_url'} alt="Vehicle Image" className="vehicle-image" />
                <ul className="vehicle-details" id="vehicle1Details">
                  <li>Title: {vehicle1.year} {capitalizeFirstLetter(vehicle1.model)}</li>
                  {selectedTrim1 && (
                    <>
                      <li>Trim Level: {selectedTrim1.name}</li>
                      <li>Starting Price: ${selectedTrim1.starting_msrp ? selectedTrim1.starting_msrp : 'N/A'}</li>
                      <li>Engine: {selectedTrim1.engine.engine_model}</li>
                      <li>Horsepower: {selectedTrim1.engine.horsepower ? selectedTrim1.engine.horsepower : 'N/A'} HP</li>
                      <li>Torque: {selectedTrim1.engine.torque ? selectedTrim1.engine.torque : 'N/A'} lb-ft</li>
                    </>
                  )}
                </ul>
              </>
            )}
          </div>
          <div className="vehicle-container">
            <select id="vehicle2Selector" className="vehicle-select" onChange={handleVehicle2Change}>
              <option value="">Select a vehicle</option>
              {vehicles.map(vehicle => (
                <option key={`${vehicle.model}-${vehicle.year}`} value={`${vehicle.model}-${vehicle.year}`}>
                  {vehicle.year} {capitalizeFirstLetter(vehicle.model)}
                </option>
              ))}
            </select>
            {vehicle2 && (
              <>
                <select id="trim2Selector" className="trim-select" onChange={handleTrim2Change} value={selectedTrim2 ? `${selectedTrim2.name} - ${selectedTrim2.drivetrain.drive_type} - ${selectedTrim2.engine.engine_model}` : ''}>
                  <option value="">Select a trim</option>
                  {vehicle2.trims.map(trim => (
                    <option key={`${trim.name}-${trim.drivetrain.drive_type}-${trim.engine.engine_model}`} value={`${trim.name} - ${trim.drivetrain.drive_type} - ${trim.engine.engine_model}`}>
                      {trim.name} - {trim.drivetrain.drive_type} - {trim.engine.engine_model}
                    </option>
                  ))}
                </select>
                <img id="vehicle2Image" src={vehicle2.images[0] || 'placeholder_image_url'} alt="Vehicle Image" className="vehicle-image" />
                <ul className="vehicle-details" id="vehicle2Details">
                  <li>Title: {vehicle2.year} {capitalizeFirstLetter(vehicle2.model)}</li>
                  {selectedTrim2 && (
                    <>
                      <li>Trim Level: {selectedTrim2.name}</li>
                      <li>Starting Price: ${selectedTrim2.starting_msrp ? selectedTrim2.starting_msrp : 'N/A'}</li>
                      <li>Engine: {selectedTrim2.engine.engine_model}</li>
                      <li>Horsepower: {selectedTrim2.engine.horsepower ? selectedTrim2.engine.horsepower : 'N/A'} HP</li>
                      <li>Torque: {selectedTrim2.engine.torque ? selectedTrim2.engine.torque : 'N/A'} lb-ft</li>
                    </>
                  )}
                </ul>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Compare;