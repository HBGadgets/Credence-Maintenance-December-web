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
} from '@coreui/react'
import { Eye, Pencil, Trash2 } from 'lucide-react'

// CSS for skeleton

const skeletonStyles = `
  @keyframes pulse {
    0% { opacity: 1 }
    50% { opacity: 0.4 }
    100% { opacity: 1 }
  }

  .skeleton-loader {
    background: #e0e0e0;
    border-radius: 4px;
    animation: pulse 1.5s infinite;
  }
`

function Table({
  title,
  filteredData,
  setFilteredData,
  columns,
  viewButton,
  handleViewButton,
  editButton,
  handleEditButton,
  deleteButton,
  handleDeleteButton,
  currentPage,
  itemsPerPage,
  isFetching,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      if (aStr < bStr) return direction === 'asc' ? -1 : 1
      if (aStr > bStr) return direction === 'asc' ? 1 : -1
      return 0
    })

    setFilteredData(sorted)
  }

  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  return (
    <CRow>
      <style>{skeletonStyles}</style>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <strong>{title}</strong>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">SN</CTableHeaderCell>
                  {columns.map((column, index) => (
                    <CTableHeaderCell
                      key={index}
                      className="text-center"
                      onClick={() => column.sortable && handleSort(column.key)}
                      style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                    >
                      {column.label} {column.sortable && getSortIcon(column.key)}
                    </CTableHeaderCell>
                  ))}
                  {(editButton || deleteButton || viewButton) && (
                    <CTableHeaderCell className="text-center">Actions</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isFetching ? (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <CTableRow key={`skeleton-${index}`}>
                      <CTableDataCell className="text-center">
                        <div className="skeleton-loader" style={{ height: '20px' }} />
                      </CTableDataCell>
                      {columns.map((_, colIndex) => (
                        <CTableDataCell key={colIndex} className="text-center">
                          <div className="skeleton-loader" style={{ height: '20px' }} />
                        </CTableDataCell>
                      ))}
                      {(editButton || deleteButton || viewButton) && (
                        <CTableDataCell className="d-flex gap-2 justify-content-center align-items-center">
                          {editButton && (
                            <div
                              className="skeleton-loader"
                              style={{ width: '20px', height: '20px' }}
                            />
                          )}
                          {deleteButton && (
                            <div
                              className="skeleton-loader"
                              style={{ width: '20px', height: '20px' }}
                            />
                          )}
                          {viewButton && (
                            <div
                              className="skeleton-loader"
                              style={{ width: '60px', height: '30px' }}
                            />
                          )}
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                ) : filteredData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan={columns.length + 2} className="text-center">
                      No {title} found.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentData.map((row, rowIndex) => (
                    <CTableRow key={rowIndex}>
                      <CTableDataCell className="text-center">
                        {(currentPage - 1) * itemsPerPage + rowIndex + 1}
                      </CTableDataCell>
                      {Object.keys(row).map(
                        (key) =>
                          key !== 'id' &&
                          key !== '_id' && (
                            <CTableDataCell key={key} className="text-center">
                              {row[key]}
                            </CTableDataCell>
                          ),
                      )}
                      {(editButton || deleteButton || viewButton) && (
                        <CTableDataCell className="d-flex gap-2 justify-content-center align-items-center">
                          {editButton && (
                            <button
                              className="btn btn-link p-0 me-2"
                              onClick={() => handleEditButton(row.id)}
                              aria-label="Edit"
                            >
                              <Pencil color="#2D336B" size={20} style={{ cursor: 'pointer' }} />
                            </button>
                          )}
                          {deleteButton && (
                            <button
                              className="btn btn-link p-0 me-3"
                              onClick={() => handleDeleteButton(row.id)}
                              aria-label="Delete"
                            >
                              <Trash2 color="#2D336B" size={20} style={{ cursor: 'pointer' }} />
                            </button>
                          )}
                          {viewButton && (
                            <button
                              className="btn btn-sm d-flex align-items-center gap-1"
                              onClick={() => handleViewButton(row.id)}
                              style={{
                                backgroundColor: 'rgb(10, 45, 99)',
                                color: 'white',
                                borderColor: 'rgb(10, 45, 99)',
                              }}
                            >
                              <Eye size={16} />
                              <span>View</span>
                            </button>
                          )}
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

Table.propTypes = {
  title: PropTypes.string,
  filteredData: PropTypes.array,
  columns: PropTypes.array,
  setFilteredData: PropTypes.func,
  viewButton: PropTypes.bool,
  handleViewButton: PropTypes.func,
  editButton: PropTypes.bool,
  handleEditButton: PropTypes.func,
  deleteButton: PropTypes.bool,
  handleDeleteButton: PropTypes.func,
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  isFetching: PropTypes.bool,
}

Table.defaultProps = {
  isFetching: false,
}

export default Table
