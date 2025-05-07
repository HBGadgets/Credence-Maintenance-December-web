import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet's default icon issue with ES Module imports
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

const locationCoords = {
  Nagpur: [21.1458, 79.0882],
  Kolkata: [22.5726, 88.3639],
  Mumbai: [19.076, 72.8777],
  Pune: [18.5204, 73.8567],
  Delhi: [28.6139, 77.209],
}

const TripMap = ({ mainTrip, subTrips, showSubTrips }) => {
  const getCoordinates = (location) => locationCoords[location] || [0, 0]
  const mapCenter = [21.1458, 79.0882]

  const mainTripPath = mainTrip
    ? [getCoordinates(mainTrip?.startLocation), getCoordinates(mainTrip?.endLocation)]
    : []

  const subTripPaths =
    subTrips?.map((trip) => [
      getCoordinates(trip.startLocation),
      getCoordinates(trip.endLocation),
    ]) || []

  const hasMainTrip = mainTrip && mainTrip.startLocation && mainTrip.endLocation
  const hasSubTrips = subTrips && subTrips.length > 0

  if (!hasMainTrip && !hasSubTrips) {
    return (
      <div
        style={{
          height: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#888',
        }}
      >
        No trip data available to display on map.
      </div>
    )
  }

  return (
    <MapContainer center={mapCenter} zoom={5} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Main Trip */}
      {hasMainTrip && (
        <>
          <Marker position={getCoordinates(mainTrip.startLocation)}>
            <Popup>Main Trip Start: {mainTrip.startLocation}</Popup>
          </Marker>
          <Marker position={getCoordinates(mainTrip.endLocation)}>
            <Popup>Main Trip End: {mainTrip.endLocation}</Popup>
          </Marker>
          <Polyline positions={mainTripPath} color="blue" />
        </>
      )}

      {/* Sub Trips */}
      {showSubTrips &&
        hasSubTrips &&
        subTrips.map((trip, idx) => (
          <React.Fragment key={idx}>
            <Marker position={getCoordinates(trip.startLocation)}>
              <Popup>
                SubTrip {idx + 1} Start: {trip.startLocation}
              </Popup>
            </Marker>
            <Marker position={getCoordinates(trip.endLocation)}>
              <Popup>
                SubTrip {idx + 1} End: {trip.endLocation}
              </Popup>
            </Marker>
            <Polyline positions={subTripPaths[idx]} color="green" />
          </React.Fragment>
        ))}
    </MapContainer>
  )
}

export default TripMap
