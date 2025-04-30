import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Info, CheckCircle, AlertTriangle } from 'lucide-react' // Importing icons

const ServiceInfo = ({ title, data }) => {
  const getIcon = (highlight) => {
    if (highlight) return <AlertTriangle className="text-danger" size={18} />
    return <CheckCircle className="text-success" size={18} />
  }

  return (
    <CCard className="mb-3 shadow-sm border-0">
      {title && (
        <CCardHeader className=" text-black d-flex align-items-center">
          <Info size={20} className="me-2" />
          <h5 className="mb-0">{title}</h5>
        </CCardHeader>
      )}
      <CCardBody className="d-flex flex-wrap justify-content-between">
        {data.map(({ label, value, highlight }, index) => (
          <div key={index} className="d-flex flex-column">
            <div className="d-flex align-items-center text-muted text-uppercase small">
              {getIcon(highlight)}
              <span>{label}</span>
            </div>
            <span className={`fw-bold ${highlight ? 'text-danger' : 'text-dark'}`}>
              {value || 'N/A'}
            </span>
          </div>
        ))}
      </CCardBody>
    </CCard>
  )
}

export default ServiceInfo
