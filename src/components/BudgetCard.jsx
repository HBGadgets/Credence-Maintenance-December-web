/* eslint-disable prettier/prettier */
import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CProgress } from '@coreui/react'

function BudgetCard({ title, value, color }) {
  return (
    <CCol md={4}>
      <CCard className="bg-light border">
        <CCardHeader>
          <h3 className="h5" style={{ color }}>
            {title}
          </h3>
        </CCardHeader>
        <CCardBody>
          <p className="h3" style={{ color }}>
            ₹{value}
          </p>
        </CCardBody>
      </CCard>
    </CCol>
  )
}
export default BudgetCard
