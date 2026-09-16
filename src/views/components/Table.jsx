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
import { Eye, EyeOff, Pencil, Trash2, FileText } from 'lucide-react'

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

  .action-cell {
    padding: 8px !important;
  }

  .action-buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.75rem;
  }

  .action-button {
    border: none;
    background: none;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.2s ease;
    cursor: pointer;
  }

  .action-button:hover {
    background-color: #e9ecef;
  }

  .action-view-button {
    padding: 4px 12px;
    border-radius: 6px;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* 🔹 Thin horizontal scrollbar */
  .table-responsive::-webkit-scrollbar {
    height: 6px;
  }
  .table-responsive::-webkit-scrollbar-thumb {
    background: #c1c1c1;
    border-radius: 10px;
  }
  .table-responsive::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .table-responsive {
    scrollbar-width: thin; /* Firefox */
    scrollbar-color: #c1c1c1 #f1f1f1;
  }

  /* Table header alignment fix (only for header, not data rows) */
  .table thead th,
  .ctable thead th,
  .ctable-header-cell {
    vertical-align: middle !important;
    text-align: center !important;
    white-space: nowrap;
    padding: 10px 8px !important;
    line-height: 1.2;
    height: 45px;
  }
`

function Table({
  title,
  filteredData,
  setFilteredData,
  columns,
  viewButton,
  viewButtonLabel = 'View',
  viewButtonIcon = <Eye size={16} />,
  viewButtonColor = 'rgb(10, 45, 99)',
  handleViewButton,
  editButton,
  handleEditButton,
  deleteButton,
  handleDeleteButton,
  currentPage,
  itemsPerPage,
  isFetching,
  reportButton,
  handleReportButton,
  action = 'Action',
  serverPagination = false,
  setCurrentPage,
  setItemsPerPage,
  onViewReport,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [viewLoadingId, setViewLoadingId] = useState(null)
  const [visiblePasswordRowId, setVisiblePasswordRowId] = useState(null)

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = serverPagination
    ? filteredData
    : filteredData.slice(startIndex, startIndex + itemsPerPage)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage) || 1

  const goToFirstPage = () => setCurrentPage?.(1)
  const goToLastPage = () => setCurrentPage?.(totalPages)
  const goToPrevPage = () => setCurrentPage?.((prev) => Math.max(prev - 1, 1))
  const goToNextPage = () => setCurrentPage?.((prev) => Math.min(prev + 1, totalPages))


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
  }

  return (
    <CRow className="h-100 m-0">
      <style>{skeletonStyles}</style>
      <CCol xs={12} className="h-100 p-0">
        <CCard className="mb-4 h-100 d-flex flex-column shadow-sm border-0">
          <CCardHeader className="d-flex w-100 justify-content-between align-items-center bg-white border-0 py-3 px-4">
            {typeof title === 'string' ? <strong>{title}</strong> : title}
          </CCardHeader>
          <CCardBody className="flex-grow-1">
            <CTable striped hover responsive bordered>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell className="text-center">SN</CTableHeaderCell>
                  {columns
                    .filter((col) => !col.hidden)
                    .map((column, index) => (
                      <CTableHeaderCell
                        key={index}
                        className="text-center"
                        onClick={() => column.sortable && handleSort(column.key)}
                        style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                      >
                        {column.label} {column.sortable && getSortIcon(column.key)}
                      </CTableHeaderCell>
                    ))}
                  {(editButton || deleteButton || viewButton || reportButton) && (
                    <CTableHeaderCell className="text-center">{action}</CTableHeaderCell>
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
                      {(editButton || deleteButton || viewButton || reportButton) && (
                        <CTableDataCell className="action-cell">
                          <div className="action-buttons">
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
                            {reportButton && (
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
                          </div>
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
                      {columns
                        .filter((col) => !col.hidden)
                        .map((column) => (
                          <CTableDataCell key={column.key} className="text-center">
                            {column.key === 'password' ? (
                              <div className="d-flex align-items-center justify-content-center gap-2">
                                <span>
                                  {visiblePasswordRowId === row.id || row._id
                                    ? row.password
                                    : '••••••••'}
                                </span>
                                <button
                                  onClick={() =>
                                    setVisiblePasswordRowId(
                                      visiblePasswordRowId === row.id ? null : row.id,
                                    )
                                  }
                                  className="btn btn-sm btn-link p-0"
                                  title={
                                    visiblePasswordRowId === row.id || row._id
                                      ? 'Show password'
                                      : 'Hide password'
                                  }
                                >
                                  {visiblePasswordRowId === row.id || row._id ? (
                                    <Eye size={18} />
                                  ) : (
                                    <EyeOff size={18} />
                                  )}
                                </button>
                              </div>
                            ) : column.render ? (
                              column.render(row)
                            ) : (
                              row[column.key]
                            )}
                          </CTableDataCell>
                        ))}
                      {(editButton || deleteButton || viewButton || reportButton) && (
                        <CTableDataCell className="action-cell">
                          <div className="action-buttons">
                            {editButton && (
                              <button
                                className="action-button"
                                onClick={() => handleEditButton(row.id || row._id)}
                                aria-label="Edit"
                              >
                                <Pencil color="#2D336B" size={18} />
                              </button>
                            )}
                            {deleteButton && (
                              <button
                                className="action-button"
                                onClick={() => handleDeleteButton(row.id || row._id)}
                                aria-label="Delete"
                              >
                                <Trash2 color="#2D336B" size={18} />
                              </button>
                            )}

                            {reportButton && (
                              <button
                                className="action-button"
                                onClick={() => handleReportButton(row.id || row._id)}
                                aria-label="Report"
                              >
                                <FileText color="#2D336B" size={18} />
                              </button>
                            )}

                            {viewButton && (
                              <button
                                className="action-view-button"
                                onClick={async () => {
                                  setViewLoadingId(row.id || row._id)
                                  await handleViewButton(row.id || row._id)
                                  setViewLoadingId(null)
                                }}
                                disabled={viewLoadingId === row.id || row._id}
                                style={{
                                  backgroundColor: viewButtonColor,
                                  color: 'white',
                                  opacity: viewLoadingId === row.id || row._id ? 0.6 : 1,
                                  border: 'none',
                                }}
                              >
                                {viewButtonIcon}
                                <span>
                                  {viewLoadingId === row.id || row._id
                                    ? 'Loading...'
                                    : viewButtonLabel}
                                </span>
                              </button>
                            )}
                          </div>
                        </CTableDataCell>
                      )}
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </CCardBody>

          {/* Pagination Footer */}
          <div className="d-flex flex-wrap justify-content-between align-items-center p-2 border-top bg-white w-100">
            <div className="d-flex align-items-center gap-3 mb-2 mb-sm-0">
              <div className="text-muted text-nowrap" style={{ fontSize: '13px' }}>
                Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + itemsPerPage, filteredData.length)} of {filteredData.length} results
              </div>
              {onViewReport && (
                <button
                  onClick={onViewReport}
                  className="btn btn-sm btn-outline-primary fw-semibold px-2 py-1 text-nowrap"
                  style={{ borderRadius: '6px', fontSize: '12px' }}
                >
                  View Detailed Report
                </button>
              )}
            </div>

            <div className="d-flex align-items-center flex-wrap gap-3">
              <div className="d-flex align-items-center gap-2">
                <span className="fw-semibold text-dark text-nowrap" style={{ fontSize: '13px' }}>Rows per page</span>
                <select
                  className="form-select form-select-sm"
                  style={{ width: '65px', cursor: 'pointer', borderRadius: '6px', fontSize: '12px', padding: '0.25rem 1.5rem 0.25rem 0.5rem' }}
                  value={itemsPerPage}
                  onChange={(e) => {
                    if (setItemsPerPage) setItemsPerPage(Number(e.target.value))
                    if (setCurrentPage) setCurrentPage(1)
                  }}
                >
                  <option value="5">5</option>
                  <option value="7">7</option>
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="50">50</option>
                </select>
              </div>

              <div className="fw-bold text-dark text-nowrap" style={{ fontSize: '13px' }}>
                Page {currentPage} of {totalPages}
              </div>

              <div className="d-flex gap-1">
                <button
                  className="btn btn-sm btn-light border d-flex align-items-center justify-content-center bg-white shadow-sm"
                  style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                  onClick={goToFirstPage}
                  disabled={currentPage === 1}
                >
                  {'<<'}
                </button>
                <button
                  className="btn btn-sm btn-light border d-flex align-items-center justify-content-center bg-white shadow-sm"
                  style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                  onClick={goToPrevPage}
                  disabled={currentPage === 1}
                >
                  {'<'}
                </button>
                <button
                  className="btn btn-sm btn-light border d-flex align-items-center justify-content-center bg-white shadow-sm"
                  style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                >
                  {'>'}
                </button>
                <button
                  className="btn btn-sm btn-light border d-flex align-items-center justify-content-center bg-white shadow-sm"
                  style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                  onClick={goToLastPage}
                  disabled={currentPage === totalPages}
                >
                  {'>>'}
                </button>
              </div>
            </div>
          </div>
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
  viewButtonLabel: PropTypes.string,
  viewButtonIcon: PropTypes.node,
  viewButtonColor: PropTypes.string,
  handleViewButton: PropTypes.func,
  editButton: PropTypes.bool,
  handleEditButton: PropTypes.func,
  deleteButton: PropTypes.bool,
  handleDeleteButton: PropTypes.func,
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  isFetching: PropTypes.bool,
  reportButton: PropTypes.bool,
  handleReportButton: PropTypes.func,
  serverPagination: PropTypes.bool,
}

Table.defaultProps = {
  isFetching: false,
  serverPagination: false,
}

export default Table
