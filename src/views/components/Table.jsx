/* eslint-disable prettier/prettier */
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
  CButton,
} from '@coreui/react'
import { Eye, Pencil, Trash2 } from 'lucide-react'

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
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[key]
      const bValue = b[key]

      // Numerical comparison
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return direction === 'asc' ? aValue - bValue : bValue - aValue
      }

      // String comparison (case-insensitive)
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

  console.log('CURRENT DATA FROM TABLE COMPONENT', currentData)

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>{title}</strong>
            </CCardHeader>
            <CCardBody>
              {!filteredData.length ? (
                <p className="text-center">No {title} found.</p>
              ) : (
                <CTable striped hover responsive bordered>
                  <CTableHead>
                    <CTableRow>
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
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentData.map((row, rowIndex) => (
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
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

Table.propTypes = {
  title: PropTypes.string.isRequired,
  filteredData: PropTypes.array.isRequired,
  columns: PropTypes.array.isRequired,
  setFilteredData: PropTypes.func.isRequired,
  viewButton: PropTypes.bool,
  handleViewButton: PropTypes.func,
  editButton: PropTypes.bool,
  handleEditButton: PropTypes.func,
  deleteButton: PropTypes.bool,
  handleDeleteButton: PropTypes.func,
}

export default Table
