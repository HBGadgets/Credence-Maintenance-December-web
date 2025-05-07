import React, { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

// Helper: get coordinates from city/location name using MapTiler
const geocodeLocation = async (location) => {
  const response = await fetch(
    `https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=b4nqY1lWEwqzMndLshVD`,
  )
  const data = await response.json()

  if (data && data.features && data.features.length > 0) {
    const [lon, lat] = data.features[0].center
    return [lat, lon]
  }

  return [0, 0]
}

const TripMap = ({ mainTrip, subTrips, showSubTrips }) => {
  const [mainStartCoords, setMainStartCoords] = useState(null)
  const [mainEndCoords, setMainEndCoords] = useState(null)
  const [subTripCoords, setSubTripCoords] = useState([])

  // Load main trip coordinates
  useEffect(() => {
    const fetchMain = async () => {
      if (mainTrip?.startLocation) {
        const coords = await geocodeLocation(mainTrip.startLocation)
        setMainStartCoords(coords)
      }
      if (mainTrip?.endLocation) {
        const coords = await geocodeLocation(mainTrip.endLocation)
        setMainEndCoords(coords)
      }
    }
    fetchMain()
  }, [mainTrip])

  // Load subTrip coordinates
  useEffect(() => {
    const fetchSubTrips = async () => {
      if (showSubTrips && subTrips?.length > 0) {
        const allCoords = await Promise.all(
          subTrips.map(async (trip) => {
            const start = await geocodeLocation(trip.startLocation)
            const end = await geocodeLocation(trip.endLocation)
            return { start, end, ...trip }
          }),
        )
        setSubTripCoords(allCoords)
      } else {
        setSubTripCoords([]) // hide subTrips if toggle is off
      }
    }
    fetchSubTrips()
  }, [subTrips, showSubTrips])

  const hasMainTrip = mainStartCoords && mainEndCoords
  const hasSubTrips = subTripCoords.length > 0

  if (!hasMainTrip && !hasSubTrips) {
    return (
      <div
        style={{ height: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        No trip data available to display on map.
      </div>
    )
  }

  return (
    <MapContainer
      center={mainStartCoords || [20, 78]}
      zoom={5}
      style={{ height: '400px', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/">Credence Maintenance</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Main Trip */}
      {hasMainTrip && (
        <>
          <Marker position={mainStartCoords}>
            <Popup>Main Trip Start: {mainTrip.startLocation}</Popup>
          </Marker>
          <Marker position={mainEndCoords}>
            <Popup>Main Trip End: {mainTrip.endLocation}</Popup>
          </Marker>
          <Polyline positions={[mainStartCoords, mainEndCoords]} color="blue" />
        </>
      )}

      {/* Sub Trips */}
      {showSubTrips &&
        hasSubTrips &&
        subTripCoords.map((trip, idx) => (
          <React.Fragment key={idx}>
            <Marker position={trip.start}>
              <Popup>
                SubTrip {idx + 1} Start: {trip.startLocation}
              </Popup>
            </Marker>
            <Marker position={trip.end}>
              <Popup>
                SubTrip {idx + 1} End: {trip.endLocation}
              </Popup>
            </Marker>
            <Polyline positions={[trip.start, trip.end]} color="green" />
          </React.Fragment>
        ))}
    </MapContainer>
  )
}

export default TripMap
