/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import { Card, Badge, Dropdown, ButtonGroup } from 'react-bootstrap'
import { RotateCcw, MoreVertical, MapPin } from 'lucide-react'
import PropTypes from 'prop-types'

const ServiceHistoryCard = ({ paginatedData = [], onEdit, onDelete, onView, loadingView }) => {
  const [openMenuId, setOpenMenuId] = useState(null)

  const handleMenuToggle = (isOpen, id) => {
    setOpenMenuId(isOpen ? id : null)
  }

  return (
    <Card className="p-3 rounded-3 border-0 shadow-sm">
      <div className="d-flex align-items-center mb-3">
        <div
          className="bg-success-subtle rounded-circle p-2 me-2 d-flex align-items-center justify-content-center"
          style={{ width: 40, height: 40 }}
        >
          <RotateCcw size={20} className="text-success" />
        </div>
        <h5 className="mb-0 fw-semibold">Service History</h5>
      </div>

      {paginatedData.length === 0 ? (
        <div className="text-center text-muted py-4 fs-6 fw-semibold">
          No service history found.
        </div>
      ) : (
        paginatedData.map((entry, index) => (
          <Card
            key={entry.id || index}
            className="border-0 mb-3 shadow-sm px-3 pt-3 pb-2 position-relative"
          >
            {/* Card Header with Dropdown */}
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div>
                <Badge bg="primary" className="mb-1">
                  {entry.serviceType}
                </Badge>
                <div className="fw-semibold small">{entry.date}</div>
              </div>

              <Dropdown
                as={ButtonGroup}
                show={openMenuId === entry.id}
                onToggle={(isOpen) => handleMenuToggle(isOpen, entry.id)}
              >
                <Dropdown.Toggle variant="link" bsPrefix="p-0 border-0 bg-transparent">
                  <MoreVertical size={18} />
                </Dropdown.Toggle>

                <Dropdown.Menu align="end">
                  <Dropdown.Item
                    onClick={() => {
                      onEdit(entry.id)
                      setOpenMenuId(null)
                    }}
                  >
                    Edit
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      onDelete(entry.id)
                      setOpenMenuId(null)
                    }}
                  >
                    Delete
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      if (!loadingView) {
                        onView(entry.id)
                        setOpenMenuId(null)
                      }
                    }}
                    disabled={loadingView}
                  >
                    {loadingView ? 'Loading Bill...' : 'View Bill'}
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            {/* Card Body */}
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <div className="fw-semibold">Description: {entry.description}</div>
                <div className="fw-semibold">Last Service Odometer: {entry.odometer} km</div>

                {entry.driverName && <div className="fw-semibold">Driver: {entry.driverName}</div>}

                {entry.vendor && <div className="fw-semibold">Shop Name: {entry.vendor}</div>}

                {entry.location && (
                  <div className="fw-semibold small d-flex align-items-center mt-1">
                    <MapPin size={14} className="me-1" />
                    <span>Location: {entry.location}</span>
                  </div>
                )}
              </div>

              <div className="text-end">
                <div className="fw-bold text-dark">₹{entry.amount}</div>
                <div className="fw-semibold small">Next Service Km: {entry.nextServiceKm} km</div>

                {entry.paymentMode && (
                  <div className="mt-1">
                    <span
                      style={{
                        backgroundColor:
                          entry.paymentMode === 'upi'
                            ? '#0000FF'
                            : entry.paymentMode === 'cash'
                              ? '#28a745'
                              : entry.paymentMode === 'card'
                                ? '#f5a623'
                                : '#0000FF',
                        color: 'white',
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        fontSize: '0.75rem',
                        display: 'inline-block',
                        textTransform: 'capitalize',
                      }}
                    >
                      {entry.paymentMode}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))
      )}
    </Card>
  )
}

ServiceHistoryCard.propTypes = {
  paginatedData: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onView: PropTypes.func.isRequired,
  loadingView: PropTypes.bool,
}

export default ServiceHistoryCard
