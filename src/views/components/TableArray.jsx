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
import {
  Eye,
  EyeOff,
  Pencil,
  Trash2,
  FileText,
  ChevronDown,
  ChevronRight,
  Check,
  Square,
  X,
  CheckCircle,
} from 'lucide-react'

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

  /* Status icon styling */
  .status-icon-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 6px;
    transition: all 0.2s ease;
  }

  .status-icon-button:hover {
    background-color: #e9ecef;
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
    scrollbar-width: thin;
    scrollbar-color: #c1c1c1 #f1f1f1;
  }

  /* Table header alignment */
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

  /* Table data cell alignment */
  .table tbody td,
  .ctable tbody td,
  .ctable-data-cell {
    vertical-align: middle !important;
    text-align: center !important;
    padding: 12px 8px !important;
  }

  /* Expand/Collapse row styles */
  .expandable-row {
    cursor: pointer;
  }

  .expanded-details {
    background-color: #f8f9fa;
    transition: all 0.3s ease;
  }

  /* Products section styling */
  .products-section {
    padding: 16px !important;
    margin: 8px 0 !important;
    border-radius: 8px;
    background-color: #f8f9fa;
    border: 1px solid #dee2e6;
  }

  .products-section h6 {
    margin-bottom: 12px !important;
    font-weight: 600;
    color: #495057;
    font-size: 14px;
    padding-left: 8px;
  }

  .products-table-container {
    background-color: white;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #dee2e6;
  }

  .products-table {
    margin: 0 !important;
    border-collapse: collapse;
    width: 100%;
  }

  .products-table thead th {
    background-color: #f1f3f4 !important;
    font-weight: 600;
    font-size: 13px;
    padding: 10px 12px !important;
    border-bottom: 2px solid #dee2e6;
    color: #495057;
  }

  .products-table tbody td {
    padding: 8px 12px !important;
    font-size: 13px;
    border-bottom: 1px solid #e9ecef;
  }

  .products-table tbody tr:last-child td {
    border-bottom: none;
  }

  .products-table tbody tr:hover {
    background-color: #f8f9fa;
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

  /* Column widths for products table */
  .product-name-col {
    min-width: 150px;
    text-align: left !important;
  }

  .warehouse-col {
    min-width: 120px;
    text-align: left !important;
  }

  .quantity-col,
  .bags-col,
  .weight-col,
  .cost-col {
    min-width: 100px;
  }

  /* Empty state styling */
  .empty-products {
    padding: 20px;
    text-align: center;
    color: #6c757d;
    font-style: italic;
    background-color: white;
    border-radius: 6px;
    border: 1px dashed #dee2e6;
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
  statusButton = false,
  handleStatusButton,
  statusButtonLabel = 'Status',
  statusButtonIcon = <CheckCircle size={18} />,
  action = 'Action',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [viewLoadingId, setViewLoadingId] = useState(null)
  const [visiblePasswordRowId, setVisiblePasswordRowId] = useState(null)
  const [expandedRows, setExpandedRows] = useState(new Set())

  // Use filteredData directly since it already contains the current page data
  const currentData = filteredData

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

  // Function to determine status icon based on status
  const getStatusIcon = (row) => {
    const status = row?.status?.toLowerCase()

    if (status === 'completed') {
      return <Check color="#28a745" size={18} />
    } else if (status === 'cancelled') {
      return <X color="#dc3545" size={18} />
    } else {
      // Pending or any other status
      return <Square color="#6c757d" size={18} />
    }
  }

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
      return <div className="empty-products">No products found</div>
    }

    return (
      <div className="products-section">
        <h6>Products ({products.length})</h6>
        <div className="products-table-container">
          <CTable striped hover responsive className="products-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell className="product-name-col">Product Name</CTableHeaderCell>
                <CTableHeaderCell className="warehouse-col">Warehouse</CTableHeaderCell>
                <CTableHeaderCell className="quantity-col">Quantity (Kg)</CTableHeaderCell>
                <CTableHeaderCell className="bagSize-col">Bag Size</CTableHeaderCell>
                <CTableHeaderCell className="totalBags-col">Total Bags</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {products.map((product, index) => (
                <CTableRow key={product._id || index}>
                  <CTableDataCell className="product-name-col">
                    {product.productName || '-'}
                  </CTableDataCell>
                  <CTableDataCell className="warehouse-col">
                    {product.warehouseName || '-'}
                  </CTableDataCell>
                  <CTableDataCell className="quantity-col">
                    {product.quantityKg || '0'}
                  </CTableDataCell>
                  <CTableDataCell className="bagSize-col">{product.bagSize || '0'}</CTableDataCell>
                  <CTableDataCell className="totalBags-col">
                    {product.totalBags || '0'}
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </div>
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
                  <CTableHeaderCell
                    className="text-center"
                    style={{ width: '50px' }}
                  ></CTableHeaderCell>
                  <CTableHeaderCell className="text-center" style={{ width: '60px' }}>
                    SN
                  </CTableHeaderCell>
                  {columns
                    .filter((col) => !col.hidden)
                    .map((column, index) => (
                      <CTableHeaderCell
                        key={index}
                        className="text-center"
                        onClick={() => column.sortable && handleSort(column.key)}
                        style={{
                          cursor: column.sortable ? 'pointer' : 'default',
                          minWidth: column.minWidth || 'auto',
                        }}
                      >
                        {column.label} {column.sortable && getSortIcon(column.key)}
                      </CTableHeaderCell>
                    ))}
                  {(editButton || deleteButton || viewButton || reportButton || statusButton) && (
                    <CTableHeaderCell className="text-center" style={{ width: '200px' }}>
                      {action}
                    </CTableHeaderCell>
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
                        statusButton) && (
                        <CTableDataCell className="action-cell">
                          <div className="action-buttons">
                            {statusButton && (
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
                ) : currentData.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell
                      colSpan={columns.length + 3}
                      className="text-center"
                      style={{ padding: '40px' }}
                    >
                      No {title} found.
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentData.map((row, rowIndex) => {
                    const rowId = row.id || row._id
                    const isExpanded = isRowExpanded(rowId)
                    const hasProducts = row.products && row.products.length > 0
                    const statusIcon = getStatusIcon(row)
                    const status = row?.status?.toLowerCase()
                    const isCompletedOrCancelled = status === 'completed' || status === 'cancelled'

                    return (
                      <React.Fragment key={rowIndex}>
                        <CTableRow className={hasProducts ? 'expandable-row' : ''}>
                          <CTableDataCell className="text-center" style={{ padding: '8px' }}>
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
                          <CTableDataCell className="text-center" style={{ padding: '12px 8px' }}>
                            {/* Calculate serial number based on current page */}
                            {(currentPage - 1) * itemsPerPage + rowIndex + 1}
                          </CTableDataCell>
                          {columns
                            .filter((col) => !col.hidden)
                            .map((column) => (
                              <CTableDataCell
                                key={column.key}
                                className="text-center"
                                style={{ padding: '12px 8px' }}
                              >
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
                            statusButton) && (
                            <CTableDataCell className="action-cell" style={{ padding: '8px' }}>
                              <div className="action-buttons">
                                {/* Status Icon Button */}
                                {statusButton && (
                                  <button
                                    className="status-icon-button action-button"
                                    onClick={() => handleStatusButton(rowId)}
                                    aria-label={`Status: ${row?.status || 'Pending'}`}
                                    title={`Status: ${row?.status || 'Pending'}`}
                                  >
                                    {statusIcon}
                                  </button>
                                )}

                                {editButton && (
                                  <button
                                    className="action-button"
                                    onClick={() => handleEditButton(rowId)}
                                    aria-label="Edit"
                                    disabled={isCompletedOrCancelled}
                                    title={
                                      isCompletedOrCancelled
                                        ? 'Cannot edit completed/cancelled records'
                                        : 'Edit'
                                    }
                                  >
                                    <Pencil
                                      color={isCompletedOrCancelled ? '#6c757d' : '#2D336B'}
                                      size={18}
                                    />
                                  </button>
                                )}
                                {deleteButton && (
                                  <button
                                    className="action-button"
                                    onClick={() => handleDeleteButton(rowId)}
                                    aria-label="Delete"
                                    disabled={isCompletedOrCancelled}
                                    title={
                                      isCompletedOrCancelled
                                        ? 'Cannot delete completed/cancelled records'
                                        : 'Delete'
                                    }
                                  >
                                    <Trash2
                                      color={isCompletedOrCancelled ? '#6c757d' : '#2D336B'}
                                      size={18}
                                    />
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
                            <CTableDataCell colSpan={columns.length + 3} style={{ padding: '0' }}>
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
  statusButton: PropTypes.bool,
  handleStatusButton: PropTypes.func,
  statusButtonLabel: PropTypes.string,
  statusButtonIcon: PropTypes.node,
  action: PropTypes.string,
}

TableArray.defaultProps = {
  isFetching: false,
  statusButton: false,
}

export default TableArray
