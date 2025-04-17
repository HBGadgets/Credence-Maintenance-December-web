import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehicleProfileData } from './data/VehicleListData'
import Loader from '../../components/Loader/Loader'
import VehicleDocument from './VehicleDocument'
import { CButton, CContainer } from '@coreui/react'
import './VehicleProfile.css'
import { IoCarOutline, IoSpeedometerOutline } from 'react-icons/io5'
import { TbCategory } from 'react-icons/tb'

function VehicleProfile() {
  const navigate = useNavigate()
  const { vehicles, status, error } = useVehicleProfileData()

  if (status === 'loading') {
    return (
      <div className="center-screen">
        <Loader />
      </div>
    )
  }

  if (status === 'failed') {
    return <p>Error: {error || 'An unknown error occurred'}</p>
  }

  return (
    <CContainer fluid className="py-2">
      {!vehicles ? (
        <div className="center-screen">
          <Loader />
        </div>
      ) : (
        <>
          {/* 🚘 Vehicle Header */}
          <div className="vehicle-heading">
            <div className="vehicle-icon">
              <IoCarOutline />
            </div>
            <div className="heading-content">
              <h2 className="vehicle-title">{vehicles.device?.name || 'Vehicle Name'}</h2>
              <p className="vehicle-subtitle">
                Model: <strong>{vehicles.device?.model || 'N/A'}</strong> | Category:{' '}
                <strong>{vehicles.device?.category || 'N/A'}</strong>
              </p>
            </div>
          </div>

          {/* 📄 Vehicle Documents */}
          <div className="custom-doc mt-4">
            <VehicleDocument
              Insurance={vehicles.vehicleDocument?.Insurance}
              fitnessCertificate={vehicles.vehicleDocument?.fitnessCertificate}
              rc={vehicles.vehicleDocument?.rc}
              puc={vehicles.vehicleDocument?.puc}
            />
          </div>

          {/* 🔧 Action Section */}

          {/* First code */}
          {/* <div className="action-section mt-4">
            {[
              { title: 'Maintenance Log', route: 'MaintenanceLog' },
              { title: 'Trip', route: 'VehicleTrips' },
              { title: 'Tyre Management', route: 'tyredetails' },
            ].map((item, index) => (
              <div key={index} className="action-tile" onClick={() => navigate(item.route)}>
                <div className="action-title">{item.title}</div>
                <div className="action-link">View Details →</div>
              </div>
            ))}
          </div> */}

          {/* Second code */}
          <div className="action-section-grid mt-4">
            {[
              { title: 'Maintenance Log', route: 'MaintenanceLog', icon: <IoCarOutline /> },
              { title: 'Trip', route: 'VehicleTrips', icon: <IoSpeedometerOutline /> },
              { title: 'Tyre Management', route: 'tyredetails', icon: <TbCategory /> },
            ].map((item, index) => (
              <div key={index} className="action-card" onClick={() => navigate(item.route)}>
                <div className="card-icon">{item.icon}</div>
                <div className="card-title">{item.title}</div>
                <div className="card-footer">Go to Details →</div>
              </div>
            ))}
          </div>

          {/* Third code */}
          {/* <div className="action-section-vertical mt-4">
            {[
              { title: 'Maintenance Log', route: 'MaintenanceLog' },
              { title: 'Trip', route: 'VehicleTrips' },
              { title: 'Tyre Management', route: 'tyredetails' },
            ].map((item, index) => (
              <div
                key={index}
                className="action-tile-vertical"
                onClick={() => navigate(item.route)}
              >
                <div className="action-title">{item.title}</div>
                <div className="action-link">View Details →</div>
              </div>
            ))}
          </div> */}
        </>
      )}
    </CContainer>
  )
}

export default VehicleProfile
