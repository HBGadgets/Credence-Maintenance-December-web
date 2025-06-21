import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehicleProfileData } from './data/VehicleListData'
import VehicleDocument from './VehicleDocument'
import LoaderBus from '../../components/Loader3/LoaderBus'
import { CButton, CContainer } from '@coreui/react'
import './VehicleProfile.css'
import { IoCarOutline, IoSpeedometerOutline } from 'react-icons/io5'
import { TbCategory } from 'react-icons/tb'
import { GiCarWheel, GiPathDistance } from 'react-icons/gi'
import { BsFuelPumpDiesel } from 'react-icons/bs'
import ServiceInfo from '../components/ServiceInfo'
import { MdOutlineMiscellaneousServices } from 'react-icons/md'

function VehicleProfile() {
  const navigate = useNavigate()

  const { data, isLoading, isError, error } = useVehicleProfileData()

  const { vehicleDocument, device } = data || {}

  console.log('data coming', vehicleDocument)

  if (isLoading) {
    return (
      <div className="center-screen">
        <LoaderBus />
      </div>
    )
  }

  if (isError) {
    return <p>Error: {error || 'An unknown error occurred'}</p>
  }

  const serviceData = [
    { label: 'Current Odometer', value: '1000km', highlight: false },
    { label: 'Previous Km service', value: '100km', highlight: false },
    { label: 'Next Km service', value: '2000km', highlight: false },
  ]

  return (
    <CContainer fluid className="py-2 mb-5">
      {!vehicleDocument ? (
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
              <h2 className="vehicle-title">{device?.name || 'Vehicle Name'}</h2>
              <p className="vehicle-subtitle">
                Model: <strong>{device?.model || 'N/A'}</strong> | Category:{' '}
                <strong>{device?.category || 'N/A'}</strong>
              </p>
            </div>
          </div>

          {/* 📄 Vehicle Documents */}
          <div className="custom-doc mt-4">
            <VehicleDocument
              Insurance={vehicleDocument?.Insurance}
              fitnessCertificate={vehicleDocument?.fitnessCertificate}
              rc={vehicleDocument?.rc}
              puc={vehicleDocument?.puc}
              id={data.id}
            />
          </div>

          {/* <div className="mt-4">
            <ServiceInfo title="Service Overview" data={serviceData} />
          </div> */}

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
              { title: 'Vehicle Expenses', route: 'VehicleExpenses', icon: <IoCarOutline /> },
              { title: 'Vehicle Trips', route: 'VehicleTrips', icon: <GiPathDistance /> },
              // { title: 'Tyre Management', route: 'tyredetails', icon: <TbCategory /> },
              { title: 'Tyres System', route: 'ManageTyre', icon: <GiCarWheel /> },
              { title: 'Fuel System', route: 'Fuelsystem', icon: <BsFuelPumpDiesel /> },
              {
                title: 'Service Checkup List',
                route: 'ServiceList',
                icon: <MdOutlineMiscellaneousServices />,
              },

              // Add more items here if needed
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
