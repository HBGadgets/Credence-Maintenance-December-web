// src/GoogleMapComponent.js

import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 37.7749,  // Latitude for San Francisco
  lng: -122.4194 // Longitude for San Francisco
};

const apiKey = 'YOUR_GOOGLE_MAPS_API_KEY';

const GoogleMapComponent = () => {
  return (
    <LoadScript
      googleMapsApiKey={apiKey}
      loadingElement={<div>Loading...</div>} // Optional: add a loading element
    >
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
