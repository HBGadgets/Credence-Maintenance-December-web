import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useVehicleProfileData } from './data/VehicleListData'
import Loader from '../../components/Loader/Loader'
import VehicleDoc from './VehicleDocuments'
import ServiceInfo from '../components/ServiceInfo'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import './VehicleProfile.css'
import VehicleDocument from './VehicleDocument'
import { IoCarOutline, IoSpeedometerOutline } from 'react-icons/io5'
import { TbCategory } from 'react-icons/tb'

function VehicleProfile() {
  const navigate = useNavigate()
  const { vehicles, selectedVehicle, filteredLogs } = useVehicleProfileData()

  console.log('Selected Vehicle:', selectedVehicle)
  console.log('Filtered Logs:', filteredLogs)
  console.log('gagannnnnnnnnnnnnnnnnn', vehicles)

  // Services Info
  const servicesVehicle = {
    mileage: '130,000 km',
    lastMaintenance: '110,000 km',
    nextMaintenance: '140,000 km',
  }

  const vehicleServiceData = [
    { label: 'Current Mileage', value: servicesVehicle.mileage },
    { label: 'Last Maintenance', value: servicesVehicle.lastMaintenance },
    { label: 'Next Maintenance', value: servicesVehicle.nextMaintenance, highlight: true },
  ]

  return (
    <div>
      {!vehicles ? (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Loader />
        </div>
      ) : (
        <>
          <div className="vehicle-heading">
            {/* 🚘 Vehicle Icon */}
            <div className="vehicle-icon">
              <IoCarOutline />
            </div>

            {/* 🚗 Heading Content */}
            <div className="heading-content">
              <h2 className="vehicle-title">{vehicles.device?.name || 'Vehicle Name'}</h2>
              <p className="vehicle-subtitle">
                Model: <strong>{vehicles.device?.model || 'N/A'}</strong> | Category:{' '}
                <strong>{vehicles.device?.category || 'N/A'}</strong>
              </p>
            </div>
          </div>
          <br />

          {/* Document section */}
          {/* <VehicleDoc /> */}
          <div className="custom-doc">
            <VehicleDocument
              Insurance={vehicles.vehicleDocument?.Insurance}
              fitnessCertificate={vehicles.vehicleDocument?.fitnessCertificate}
              rc={vehicles.vehicleDocument?.rc}
              puc={vehicles.vehicleDocument?.puc}
            />
          </div>
          <br />

          {/* Services section */}
          <ServiceInfo title="Services Information" data={vehicleServiceData} />
          <br />

          <div className="p-2">
            <CRow className="justify-content-between">
              <CCol>
                <CCard className="custom-card">
                  <CCardBody className="text-center">
                    <h5 className="fw-bold mb-3">Maintenance Log</h5>
                    <CButton onClick={() => navigate('maintenancelog')} className="custom-btn">
                      View Details
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol>
                <CCard className="custom-card">
                  <CCardBody className="text-center">
                    <h5 className="fw-bold mb-3">Trip</h5>
                    <CButton onClick={() => navigate('tripinfo')} className="custom-btn">
                      View Details
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol>
                <CCard className="custom-card">
                  <CCardBody className="text-center">
                    <h5 className="fw-bold mb-3">Tyre Management</h5>
                    <CButton onClick={() => navigate('tyredetails')} className="custom-btn">
                      View Details
                    </CButton>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </div>
        </>
      )}
    </div>
  )
}

export default VehicleProfile
