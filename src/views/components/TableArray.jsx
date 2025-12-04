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
  CFormCheck, // Added for checkbox
} from '@coreui/react'
import {
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  FileText,
  ChevronDown,
  ChevronRight,
  CheckSquare,
  Check,
  Square,
} from 'lucide-react' // Added CheckSquare icon

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

  /* Checkbox styling */
  .checkbox-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .checkbox-button:hover {
    background-color: #e9ecef;
  }

  .checkbox-button.checked {
    background-color: rgba(45, 51, 107, 0.1);
  }

  .checkbox-button input[type="checkbox"] {
    display: none;
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

  /* Expand/Collapse row styles */
  .expandable-row {
    cursor: pointer;
  }

  .expanded-details {
    background-color: #f8f9fa;
    transition: all 0.3s ease;
  }

  .products-table {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }

  .products-table th {
    background-color: #f1f3f4 !important;
    font-weight: 600;
  }

  .expand-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    background-color: #e9ecef;
    transition: all 0.2s ease;
  }

  .expand-icon:hover {
    background-color: #dee2e6;
  }
`

function TableArray({
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
  checkButton = false, // Added prop for checkbox button
  handleCheckboxButton, // Added prop for checkbox handler
  getCheckboxChecked, // Add this line
  action = 'Action',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [viewLoadingId, setViewLoadingId] = useState(null)
  const [visiblePasswordRowId, setVisiblePasswordRowId] = useState(null)
  const [expandedRows, setExpandedRows] = useState(new Set())
  const [checkedRows, setCheckedRows] = useState(new Set()) // State for checked rows

  const startIndex = (currentPage - 1) * itemsPerPage
  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage)

  const toggleRowExpansion = (rowId) => {
    const newExpandedRows = new Set(expandedRows)
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId)
    } else {
      newExpandedRows.add(rowId)
    }
    setExpandedRows(newExpandedRows)
  }

  const isRowExpanded = (rowId) => expandedRows.has(rowId)

  const handleCheckboxChange = (rowId) => {
    const newCheckedRows = new Set(checkedRows)
    if (newCheckedRows.has(rowId)) {
      newCheckedRows.delete(rowId)
    } else {
      newCheckedRows.add(rowId)
    }
    setCheckedRows(newCheckedRows)

    // Call the external handler if provided
    if (handleCheckboxButton) {
      handleCheckboxButton(rowId, newCheckedRows.has(rowId))
    }
  }

  const isRowChecked = (rowId) => checkedRows.has(rowId)

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

  const renderProductsTable = (products) => {
    if (!products || products.length === 0) {
      return <div className="p-3 text-center text-muted">No products found</div>
    }

    return (
      <div className="p-3">
        <h6 className="mb-3">Products ({products.length})</h6>
        <CTable striped hover responsive className="products-table">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>Product Name</CTableHeaderCell>
              <CTableHeaderCell>Warehouse</CTableHeaderCell>
              <CTableHeaderCell>Quantity (Kg)</CTableHeaderCell>
              <CTableHeaderCell>Bags</CTableHeaderCell>
              <CTableHeaderCell>Item Weight</CTableHeaderCell>
              <CTableHeaderCell>Item Cost</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {products.map((product, index) => (
              <CTableRow key={product._id || index}>
                <CTableDataCell>{product.productName}</CTableDataCell>
                <CTableDataCell>{product.warehouseName}</CTableDataCell>
                <CTableDataCell>{product.quantityKg}</CTableDataCell>
                <CTableDataCell>{product.bags}</CTableDataCell>
                <CTableDataCell>{product.itemWeight}</CTableDataCell>
                <CTableDataCell>{product.itemCost}</CTableDataCell>
              </CTableRow>
            ))}
          </CTableBody>
        </CTable>
      </div>
    )
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
                  <CTableHeaderCell className="text-center"></CTableHeaderCell>
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
                  {(editButton || deleteButton || viewButton || reportButton || checkButton) && (
                    <CTableHeaderCell className="text-center">{action}</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {isFetching ? (
                  Array.from({ length: itemsPerPage }).map((_, index) => (
                    <CTableRow key={`skeleton-${index}`}>
                      <CTableDataCell className="text-center">
                        <div
                          className="skeleton-loader"
                          style={{ width: '24px', height: '24px' }}
                        />
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div className="skeleton-loader" style={{ height: '20px' }} />
                      </CTableDataCell>
                      {columns.map((_, colIndex) => (
                        <CTableDataCell key={colIndex} className="text-center">
                          <div className="skeleton-loader" style={{ height: '20px' }} />
                        </CTableDataCell>
                      ))}
                      {(editButton ||
                        deleteButton ||
                        viewButton ||
                        reportButton ||
                        checkButton) && (
                        <CTableDataCell className="action-cell">
                          <div className="action-buttons">
                            {checkButton && (
                              <div
                                className="skeleton-loader"
                                style={{ width: '20px', height: '20px' }}
                              />
                            )}
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
                    <CTableDataCell colSpan={columns.length + 3} className="text-center">
                      No {title} found.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentData.map((row, rowIndex) => {
                    const rowId = row.id || row._id
                    const isExpanded = isRowExpanded(rowId)
                    const hasProducts = row.products && row.products.length > 0
                    const isChecked = isRowChecked(rowId)

                    return (
                      <React.Fragment key={rowIndex}>
                        <CTableRow className={hasProducts ? 'expandable-row' : ''}>
                          <CTableDataCell className="text-center">
                            {hasProducts && (
                              <button
                                className="expand-icon action-button"
                                onClick={() => toggleRowExpansion(rowId)}
                                aria-label={isExpanded ? 'Collapse' : 'Expand'}
                              >
                                {isExpanded ? (
                                  <ChevronDown size={16} />
                                ) : (
                                  <ChevronRight size={16} />
                                )}
                              </button>
                            )}
                          </CTableDataCell>
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
                                      {visiblePasswordRowId === rowId ? row.password : '••••••••'}
                                    </span>
                                    <button
                                      onClick={() =>
                                        setVisiblePasswordRowId(
                                          visiblePasswordRowId === rowId ? null : rowId,
                                        )
                                      }
                                      className="btn btn-sm btn-link p-0"
                                      title={
                                        visiblePasswordRowId === rowId
                                          ? 'Show password'
                                          : 'Hide password'
                                      }
                                    >
                                      {visiblePasswordRowId === rowId ? (
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
                          {(editButton ||
                            deleteButton ||
                            viewButton ||
                            reportButton ||
                            checkButton) && (
                            <CTableDataCell className="action-cell">
                              <div className="action-buttons">
                                {checkButton && (
                                  <label
                                    className={`checkbox-button action-button ${isRowChecked(rowId) ? 'checked' : ''}`}
                                    title={isRowChecked(rowId) ? 'Completed' : 'Pending'}
                                  >
                                    <CFormCheck
                                      type="checkbox"
                                      checked={
                                        getCheckboxChecked
                                          ? getCheckboxChecked(row)
                                          : isRowChecked(rowId)
                                      }
                                      onChange={() => {
                                        if (handleCheckboxButton) {
                                          const currentChecked = getCheckboxChecked
                                            ? getCheckboxChecked(row)
                                            : isRowChecked(rowId)
                                          handleCheckboxButton(rowId, !currentChecked)
                                        } else {
                                          handleCheckboxChange(rowId)
                                        }
                                      }}
                                      aria-label="Toggle status"
                                    />
                                    {getCheckboxChecked ? (
                                      getCheckboxChecked(row) ? (
                                        <Check color="#28a745" size={18} />
                                      ) : (
                                        <Square color="#6c757d" size={18} />
                                      )
                                    ) : isRowChecked(rowId) ? (
                                      <Check color="#28a745" size={18} />
                                    ) : (
                                      <Square color="#6c757d" size={18} />
                                    )}
                                  </label>
                                )}

                                {editButton && (
                                  <button
                                    className="action-button"
                                    onClick={() => handleEditButton(rowId)}
                                    aria-label="Edit"
                                  >
                                    <Pencil color="#2D336B" size={18} />
                                  </button>
                                )}
                                {deleteButton && (
                                  <button
                                    className="action-button"
                                    onClick={() => handleDeleteButton(rowId)}
                                    aria-label="Delete"
                                  >
                                    <Trash2 color="#2D336B" size={18} />
                                  </button>
                                )}

                                {reportButton && (
                                  <button
                                    className="action-button"
                                    onClick={() => handleReportButton(rowId)}
                                    aria-label="Report"
                                  >
                                    <FileText color="#2D336B" size={18} />
                                  </button>
                                )}

                                {viewButton && (
                                  <button
                                    className="action-view-button"
                                    onClick={async () => {
                                      setViewLoadingId(rowId)
                                      await handleViewButton(rowId)
                                      setViewLoadingId(null)
                                    }}
                                    disabled={viewLoadingId === rowId}
                                    style={{
                                      backgroundColor: viewButtonColor,
                                      color: 'white',
                                      opacity: viewLoadingId === rowId ? 0.6 : 1,
                                      border: 'none',
                                    }}
                                  >
                                    {viewButtonIcon}
                                    <span>
                                      {viewLoadingId === rowId ? 'Loading...' : viewButtonLabel}
                                    </span>
                                  </button>
                                )}
                              </div>
                            </CTableDataCell>
                          )}
                        </CTableRow>
                        {isExpanded && hasProducts && (
                          <CTableRow className="expanded-details">
                            <CTableDataCell colSpan={columns.length + 3}>
                              {renderProductsTable(row.products)}
                            </CTableDataCell>
                          </CTableRow>
                        )}
                      </React.Fragment>
                    )
                  })
                )}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

TableArray.propTypes = {
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
  checkButton: PropTypes.bool, // Added for checkbox
  handleCheckboxButton: PropTypes.func, // Added for checkbox handler
  getCheckboxChecked: PropTypes.func,
}

TableArray.defaultProps = {
  isFetching: false,
  checkButton: false,
}

export default TableArray
