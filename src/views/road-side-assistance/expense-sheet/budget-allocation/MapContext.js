/* eslint-disable prettier/prettier */

import React, { createContext, useContext, useState } from 'react'

// Create a MapContext
const MapContext = createContext()

export const MapProvider = ({ children }) => {
  const [map, setMap] = useState(null) // Store map instance
  const [flyToCoordinates, setFlyToCoordinates] = useState(null) // Coordinates to fly to

  return (
    <MapContext.Provider value={{ map, setMap, flyToCoordinates, setFlyToCoordinates }}>
      {children}
    </MapContext.Provider>
  )
}

// Hook to use MapContext
export const useMapContext = () => useContext(MapContext)
