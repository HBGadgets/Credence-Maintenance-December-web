/* eslint-disable prettier/prettier */
import React from 'react'
import { Trip } from '../../types'
import ServiceMap from './ServiceMap'
import { format } from 'date-fns'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CProgress, CCardText } from '@coreui/react'

const Budget = ({ trip }) => {
  const totalSpent = trip.serviceRecords.reduce((sum, record) => sum + record.cost, 0)
  const remainingBudget = trip.allocatedBudget - totalSpent
  const spentPercentage = (totalSpent / trip.allocatedBudget) * 100

  return (
    <CRow className="d-flex justify-content-center">
      <CCol xs={10}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader>
            <h2 className="h2">Budget Allocation</h2>
          </CCardHeader>

          <CCardBody>
            <CRow className="mb-4">
              <CCol md={4}>
                <CCard className="border">
                  <CCardHeader>
                    <h3 className="h5 text-primary">Allocated Budget</h3>
                  </CCardHeader>
                  <CCardBody>
                    <p className="h3 text-primary">₹{trip.allocatedBudget}</p>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4}>
                <CCard className="bg-light border">
                  <CCardHeader>
                    <h3 className="h5" style={{ color: '#14532d' }}>
                      Spent Amount
                    </h3>
                  </CCardHeader>
                  <CCardBody>
                    <p className="h3" style={{ color: '#14532d' }}>
                      ₹{totalSpent}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol md={4}>
                <CCard className="bg-light border">
                  <CCardHeader>
                    <h3 className="h5" style={{ color: '#581c87' }}>
                      Remaining Budget
                    </h3>
                  </CCardHeader>
                  <CCardBody>
                    <p className="h3" style={{ color: '#581c87' }}>
                      ₹{remainingBudget}
                    </p>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>

            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="small">Budget Utilization</span>
                <span className="small">{spentPercentage.toFixed(1)}%</span>
              </div>
              <CProgress
                value={Math.min(spentPercentage, 100)}
                color="primary"
                aria-valuenow={spentPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
              />
            </div>

            <div className="mb-4">
              <h3 className="h4 mb-3">Trip Details</h3>
              <div className="row">
                <div className="col-6">
                  <p className="text-muted small mb-1">From</p>
                  <p className="fw-bold">{trip.startLocation}</p>
                </div>
                <div className="col-6">
                  <p className="text-muted small mb-1">To</p>
                  <p className="fw-bold">{trip.endLocation}</p>
                </div>
                <div className="col-6">
                  <p className="text-muted small mb-1">Start Date</p>
                  <p className="fw-bold">{format(new Date(trip.startDate), 'PP')}</p>
                </div>
                <div className="col-6">
                  <p className="text-muted small mb-1">End Date</p>
                  <p className="fw-bold">{format(new Date(trip.endDate), 'PP')}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="h4 mb-3">Service Locations</h3>
              <ServiceMap serviceRecords={trip.serviceRecords} />
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

Budget.propTypes = {
  trip: Trip,
}

export default Budget
