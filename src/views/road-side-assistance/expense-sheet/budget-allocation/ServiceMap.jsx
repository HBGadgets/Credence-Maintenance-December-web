/* eslint-disable prettier/prettier */
import React from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { ServiceRecord } from '../../types'
import 'leaflet/dist/leaflet.css'
import { format } from 'date-fns'

const ServiceMap = ({ serviceRecords }) => {
  const center = serviceRecords[0]?.location || { lat: 20.5937, lng: 78.9629 } // Default to India's center

  return (
    <div className="w-100 rounded overflow-hidden" style={{ height: '500px' }}>
      <MapContainer center={[center.lat, center.lng]} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* {serviceRecords.map((record) => (
          <Marker key={record.id} position={[record.location.lat, record.location.lng]}>
            <Popup>
              <div className="p-2">
                <h3 className="fw-semibold">{record.serviceType}</h3>
                <p>Cost: ₹{record.cost}</p>
                <p>Date: {format(new Date(record.date), 'PPP')}</p>
                <p>Provider: {record.serviceProvider}</p>
                <p className="fs-6 text-muted">{record.location.address}</p>
              </div>
            </Popup>
          </Marker>
        ))} */}
      </MapContainer>
    </div>
  )
}

ServiceMap.propTypes = {
  serviceRecords: ServiceRecord,
}
export default ServiceMap
