/* eslint-disable react/prop-types */
/* eslint-disable prettier/prettier */
import React from 'react'
import { MapContainer, TileLayer, Marker, Tooltip, Polyline } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { format } from 'date-fns'
import './index.css'
import { ServiceRecord } from '../../types'

const ServiceMap = ({ serviceRecords }) => {
  const center = serviceRecords[0]?.location || { lat: 20.5937, lng: 78.9629 } // Default to India's center

  // Extract the lat-lng pairs for the polyline
  const polylinePositions = serviceRecords.map((record) => [
    record.location.lat,
    record.location.lng,
  ])

  return (
    <div className="rounded-3 overflow-hidden" style={{ width: '800px', height: '400px' }}>
      <MapContainer center={[center.lat, center.lng]} zoom={7}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {serviceRecords.map((record) => (
          <Marker key={record.id} position={[record.location.lat, record.location.lng]}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1} permanent={false}>
              <div className="p-2">
                <h3 className="fw-semibold">{record.serviceType}</h3>
                <p>Cost: ₹{record.cost}</p>
                <p>Date: {format(new Date(record.date), 'PPP')}</p>
                <p>Provider: {record.serviceProvider}</p>
                <p className="small text-muted">{record.location.address}</p>
              </div>
            </Tooltip>
          </Marker>
        ))}
        <Polyline
          positions={polylinePositions}
          color="blue"
          weight={5}
          dashArray="5, 10"
          opacity={0.8}
          arrowheads={{
            size: '10px',
            frequency: 'all',
            fill: true,
            fillColor: 'blue',
          }}
        />
      </MapContainer>
    </div>
  )
}

export default ServiceMap
