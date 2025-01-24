import React, { useState } from 'react'
import PropTypes from 'prop-types'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableDataCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CButton,
  CInputGroup,
  CFormInput,
} from '@coreui/react'
const DateRangeFilter = React.lazy(() => import('../DateRangeFilter'))

function VehicleTripModal({ trip = [], setOpen, open, columns = [] }) {
  const [filteredLogs, setFilteredLogs] = useState(trip)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Handle sorting
  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredLogs].sort((a, b) => {
      let valueA = a[key]
      let valueB = b[key]

      // Handle numeric and date sorting
      if (key === 'startDate' || key === 'endDate') {
        valueA = new Date(valueA)
        valueB = new Date(valueB)
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        valueA = parseFloat(valueA)
        valueB = parseFloat(valueB)
      } else {
        valueA = valueA?.toString().toLowerCase()
        valueB = valueB?.toString().toLowerCase()
      }

      if (valueA < valueB) return direction === 'asc' ? -1 : 1
      if (valueA > valueB) return direction === 'asc' ? 1 : -1
      return 0
    })

    setFilteredLogs(sorted)
  }

  // Get the sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  // Handle date filter
  const handleDateFilter = (startDate, endDate) => {
    if (!trip.length) return

    const filtered = trip.filter((t) => {
      const tripDate = new Date(t.startDate)
      return tripDate >= new Date(startDate) && tripDate <= new Date(endDate)
    })
    setFilteredLogs(filtered)
  }

  // Handle clearing filter
  const handleClearFilter = () => {
    setFilteredLogs(trip)
    setSearchQuery('')
  }

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query)
    const lowercasedQuery = query.toLowerCase()
    const filtered = trip.filter((t) =>
      Object.values(t).some((value) => String(value).toLowerCase().includes(lowercasedQuery)),
    )
    setFilteredLogs(filtered)
  }

  return (
    <CModal alignment="center" scrollable visible={open} onClose={() => setOpen(false)} fullscreen>
      <CModalHeader closeButton />
      <CModalBody className="d-flex flex-column gap-3">
        <div className="d-flex gap-3 align-items-end">
          <DateRangeFilter onFilter={handleDateFilter} />
          <CInputGroup className="w-50">
            <CFormInput
              type="text"
              placeholder="Search trips..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </CInputGroup>
          <CButton color="secondary" onClick={handleClearFilter} title="Clear Filter">
            Clear Filter
          </CButton>
        </div>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Trips</strong>
              </CCardHeader>
              <CCardBody>
                {filteredLogs.length === 0 ? (
                  <p className="text-center">No trips match the filter criteria.</p>
                ) : (
                  <div className="table-responsive">
                    <CTable striped hover responsive bordered>
                      <CTableHead>
                        <CTableRow>
                          {columns.map((column, index) => (
                            <CTableHeaderCell
                              key={index}
                              className="text-center"
                              onClick={() => handleSort(column)}
                              style={{ cursor: 'pointer' }}
                            >
                              {column} {getSortIcon(column)}
                            </CTableHeaderCell>
                          ))}
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {filteredLogs.map((row, rowIndex) => (
                          <CTableRow key={rowIndex}>
                            <CTableDataCell className="text-center">{row.driver}</CTableDataCell>
                            <CTableDataCell className="text-center">
                              {row.startLocation} &rarr; {row.endLocation}
                            </CTableDataCell>
                            <CTableDataCell className="text-center">{row.distance}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.startDate}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.endDate}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.duration}</CTableDataCell>
                            <CTableDataCell className="text-center">{row.totalCost}</CTableDataCell>
                            <CTableDataCell
                              className={`text-center ${
                                row.status === 'completed'
                                  ? 'text-success'
                                  : row.status === 'in-progress'
                                    ? 'text-warning'
                                    : 'text-danger'
                              }`}
                            >
                              {row.status}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setOpen(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModalBody>
    </CModal>
  )
}

VehicleTripModal.propTypes = {
  trip: PropTypes.arrayOf(
    PropTypes.shape({
      driver: PropTypes.string,
      startLocation: PropTypes.string,
      endLocation: PropTypes.string,
      distance: PropTypes.number,
      startDate: PropTypes.string,
      endDate: PropTypes.string,
      duration: PropTypes.string,
      totalCost: PropTypes.number,
      status: PropTypes.string,
    }),
  ),
  setOpen: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  columns: PropTypes.arrayOf(PropTypes.string),
}

export default VehicleTripModal
