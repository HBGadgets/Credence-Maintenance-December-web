import React from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'

const ServiceInfo = ({ title, data }) => {
  return (
    <CCard className="mb-3">
      {title && (
        <CCardHeader>
          <h5 className="mb-0">{title}</h5>
        </CCardHeader>
      )}
      <CCardBody className="d-flex gap-5">
        {data.map(({ label, value, highlight }, index) => (
          <div key={index} className="d-flex flex-column gap-2">
            <span>{label}</span>
            <span className={highlight ? 'text-danger' : ''}>
              <strong>{value || 'N/A'}</strong>
            </span>
          </div>
        ))}
      </CCardBody>
    </CCard>
  )
}

export default ServiceInfo
