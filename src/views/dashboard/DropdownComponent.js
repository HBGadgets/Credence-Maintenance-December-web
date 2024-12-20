// src/DropdownComponent.js
import React, { useState } from 'react';
import { useColorModes } from '@coreui/react';

const DropdownComponent = () => {
  const [selectedOption, setSelectedOption] = useState('All');
  const { colorMode } = useColorModes();

  const handleChange = (event) => {
    setSelectedOption(event.target.value);
  };

  // Inline styles based on theme
  const containerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    border: `1px solid ${colorMode === 'dark' ? '#444' : '#ddd'}`,
    borderRadius: '4px',
    maxWidth: '1043px',
    margin: 'auto',
    backgroundColor: colorMode === 'dark' ? '#333' : '#f9f9f9',
  };

  const selectStyle = {
    padding: '1px',
    fontSize: '16px',
    borderRadius: '4px',
    border: `1px solid ${colorMode === 'dark' ? '#666' : '#ccc'}`,
    backgroundColor: colorMode === 'dark' ? '#555' : '#fff',
    color: colorMode === 'dark' ? '#fff' : '#000',
    cursor: 'pointer',
    width: '64em', // Ensures dropdown takes full width of the container
  };

  return (
    <div style={containerStyle}>
      <select
        id="dropdown"
        value={selectedOption}
        onChange={handleChange}
        style={selectStyle}
      >
        <option value="All">All</option>
        <option value="Camera">Cameras</option>
        <option value="Bpatrak">Bpatrak</option>
        <option value="Police Stations">Police Stations</option>
        <option value="Criminals">Criminals</option>
        <option value="Sensitive Area">Sensitive Area</option>
      </select>
    </div>
  );
};

export default DropdownComponent;
