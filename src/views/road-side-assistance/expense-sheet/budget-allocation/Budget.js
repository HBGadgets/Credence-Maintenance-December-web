/* eslint-disable prettier/prettier */
import React, { memo, useMemo } from 'react'
import PropTypes from 'prop-types' // Use PropTypes for type validation
import { CCard, CCardBody, CCardHeader, CCol, CRow, CProgress } from '@coreui/react'
import { format } from 'date-fns'

const ServiceMap = React.lazy(() => import('./ServiceMap'))
const BudgetCard = React.lazy(() => import('../../../../components/BudgetCard')) // Fixed typo in 'BudgetCard'

const Budget = ({ trip }) => {
  const {
    allocatedBudget = 0,
    serviceRecords = [],
    startLocation = 'N/A',
    endLocation = 'N/A',
    startDate,
    endDate,
  } = trip

  // Use useMemo to optimize recalculations
  const totalSpent = useMemo(() => {
    return serviceRecords.reduce((sum, record) => sum + (record.cost || 0), 0)
  }, [serviceRecords])

  const remainingBudget = useMemo(() => allocatedBudget - totalSpent, [allocatedBudget, totalSpent])
  const spentPercentage = useMemo(
    () => (allocatedBudget ? ((totalSpent / allocatedBudget) * 100).toFixed(1) : 0),
    [allocatedBudget, totalSpent],
  )

  return (
    <CRow className="d-flex justify-content-center">
      <CCol xs={10}>
        <CCard className="mb-4 shadow-sm">
          <CCardHeader>
            <strong>Budget Allocation</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-4">
              <BudgetCard title="Allocated Budget" value={allocatedBudget} color="blue" />
              <BudgetCard title="Spent Amount" value={totalSpent} color="red" />
              <BudgetCard title="Remaining Budget" value={remainingBudget} color="green" />
            </CRow>
            <div className="mb-4">
              <div className="d-flex justify-content-between mb-1">
                <span className="small">Budget Utilization</span>
                <span className="small">{spentPercentage}%</span>
              </div>
              <CProgress
                value={Math.min(spentPercentage, 100)}
                color="primary"
                aria-valuenow={spentPercentage}
                aria-valuemin="0"
                aria-valuemax="100"
                aria-label={`Budget Utilization: ${spentPercentage}%`}
              />
            </div>
            <div className="d-flex gap-4">
              <div>
                <h3 className="h4 mb-3">Service Locations</h3>
                <ServiceMap serviceRecords={serviceRecords} />
              </div>
              <div className="mb-4 mt-5">
                <h3 className="h4 mb-3" style={{ fontWeight: '700' }}>
                  Trip Details
                </h3>
                <div className="row">
                  <div className="col-6">
                    <p className="text-muted small mb-1">From</p>
                    <p className="fw-bold">{startLocation}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small mb-1">To</p>
                    <p className="fw-bold">{endLocation}</p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small mb-1">Start Date</p>
                    <p className="fw-bold">
                      {startDate ? format(new Date(startDate), 'PP') : 'N/A'}
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-muted small mb-1">End Date</p>
                    <p className="fw-bold">
                      {endDate ? format(new Date(endDate), 'PP') : 'Pending...'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

Budget.propTypes = {
  trip: PropTypes.shape({
    allocatedBudget: PropTypes.number.isRequired,
    serviceRecords: PropTypes.arrayOf(
      PropTypes.shape({
        cost: PropTypes.number,
      }),
    ).isRequired,
    startLocation: PropTypes.string,
    endLocation: PropTypes.string,
    startDate: PropTypes.string,
    endDate: PropTypes.string,
  }).isRequired,
}

export default memo(Budget) // Use React.memo to prevent unnecessary re-renders
