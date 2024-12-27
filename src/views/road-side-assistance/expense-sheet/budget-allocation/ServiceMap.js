/* eslint-disable prettier/prettier */
import React, { useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { ServiceRecord } from '../../types'
import 'leaflet/dist/leaflet.css'
import { format } from 'date-fns'
import './index.css'

const ServiceMap = ({ serviceRecords }) => {
  const center = serviceRecords[0]?.location || { lat: 20.5937, lng: 78.9629 } // Default to India's center
  console.log(serviceRecords[0]?.location)

  return (
    <div className="rounded overflow-hidden" style={{ width: '800px', height: '400px' }}>
      <MapContainer center={[center.lat, center.lng]} zoom={7}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {serviceRecords.map((record) => (
          <Marker key={record.id} position={[record.location.lat, record.location.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="fw-semibold">{record.serviceType}</h3>
                <p>Cost: ₹{record.cost}</p>
                <p>Date: {format(new Date(record.date), 'PPP')}</p>
                <p>Provider: {record.serviceProvider}</p>
                <p className="small text-muted">{record.location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}

ServiceMap.propTypes = {
  serviceRecords: ServiceRecord,
}
export default ServiceMap
