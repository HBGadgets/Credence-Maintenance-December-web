import React, { useState, useMemo } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import navigation from '../../_nav'
import PermissionService from '../Services/Service'
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
  CTooltip,
} from '@coreui/react'
import { Eye, EyeOff, Pencil, Trash2, FileText, Ban, ChevronDown, ChevronRight } from 'lucide-react'

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

  /* 🔹 Thin scrollbar */
  .table-responsive::-webkit-scrollbar {
    height: 6px;
    width: 6px;
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
    background-color: #fff;
    position: sticky;
    top: 0;
    z-index: 2;
    box-shadow: inset 0 -1px 0 #dee2e6;
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
  cancelButton,
  handleCancelButton,
  currentPage,
  itemsPerPage,
  isFetching,
  reportButton,
  handleReportButton,
  action = 'Action',
  serverPagination = false,
  totalServerItems = 0,
  setCurrentPage,
  setItemsPerPage,
  onViewReport,
  renderActions,
  permission,
  showPagination,
  isRowEditable,
  renderRowDetails = null,
}) {
  const location = useLocation()
  const shouldShowPagination =
    showPagination !== undefined ? showPagination : Boolean(setCurrentPage)
  const resolvedPermission = useMemo(() => {
    if (permission) return permission
    const currentPath = location?.pathname
    if (!currentPath) return null
    const findPermission = (navItems) => {
      for (const item of navItems) {
        if (item.to && item.to.toLowerCase() === currentPath.toLowerCase()) {
          return item.permission
        }
        if (item.items) {
          const found = findPermission(item.items)
          if (found) return found
        }
      }
      return null
    }
    return findPermission(navigation)
  }, [permission, location?.pathname])

  const canEdit = editButton && (!resolvedPermission ? true : PermissionService.hasPermission(resolvedPermission, 'update'))
  const canDelete = deleteButton && (!resolvedPermission ? true : PermissionService.hasPermission(resolvedPermission, 'delete'))
  const canCancel = cancelButton && (!resolvedPermission ? true : PermissionService.hasPermission(resolvedPermission, 'update'))
  const hasActionColumn = canEdit || canDelete || canCancel || viewButton || reportButton || renderActions

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })
  const [viewLoadingId, setViewLoadingId] = useState(null)
  const [visiblePasswordRowId, setVisiblePasswordRowId] = useState(null)
  const [expandedRowIds, setExpandedRowIds] = useState(new Set())

  const toggleRowExpansion = (rowId) => {
    setExpandedRowIds((prev) => {
      const next = new Set(prev)
      if (next.has(rowId)) {
        next.delete(rowId)
      } else {
        next.add(rowId)
      }
      return next
    })
  }

  const isShowAll = itemsPerPage === -1 || itemsPerPage >= 1000000
  const effectiveItemsPerPage = isShowAll ? (filteredData.length || 1) : (itemsPerPage || 10)
  const startIndex = isShowAll ? 0 : (currentPage - 1) * effectiveItemsPerPage
  const currentData = serverPagination
    ? filteredData
    : isShowAll
      ? filteredData
      : filteredData.slice(startIndex, startIndex + effectiveItemsPerPage)

  const totalPages = serverPagination
    ? Math.ceil((totalServerItems || 0) / (itemsPerPage > 0 ? itemsPerPage : 1)) || 1
    : isShowAll
      ? 1
      : Math.ceil(filteredData.length / effectiveItemsPerPage) || 1

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
          {title && (
            <CCardHeader className="d-flex w-100 justify-content-between align-items-center bg-white border-0 py-3 px-4">
              {typeof title === 'string' ? <strong>{title}</strong> : title}
            </CCardHeader>
          )}
          <CCardBody className="flex-grow-1 p-0 d-flex flex-column overflow-hidden">
            <div className="table-responsive flex-grow-1" style={{ overflowY: 'auto', minHeight: 0 }}>
              <CTable striped hover bordered className="mb-0">
                <CTableHead>
                  <CTableRow>
                    {renderRowDetails && (
                      <CTableHeaderCell className="text-center" style={{ width: '45px' }} />
                    )}
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
                    {hasActionColumn && (
                      <CTableHeaderCell className="text-center">{action}</CTableHeaderCell>
                    )}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {isFetching ? (
                    Array.from({ length: isShowAll ? 10 : Math.min(itemsPerPage > 0 ? itemsPerPage : 10, 50) }).map((_, index) => (
                      <CTableRow key={`skeleton-${index}`}>
                        {renderRowDetails && (
                          <CTableDataCell className="text-center" style={{ width: '45px' }}>
                            <div className="skeleton-loader" style={{ height: '20px' }} />
                          </CTableDataCell>
                        )}
                        <CTableDataCell className="text-center">
                          <div className="skeleton-loader" style={{ height: '20px' }} />
                        </CTableDataCell>
                        {columns.map((_, colIndex) => (
                          <CTableDataCell key={colIndex} className="text-center">
                            <div className="skeleton-loader" style={{ height: '20px' }} />
                          </CTableDataCell>
                        ))}
                        {hasActionColumn && (
                          <CTableDataCell className="action-cell">
                            <div className="action-buttons">
                              {canEdit && (
                                <div
                                   className="skeleton-loader"
                                   style={{ width: '20px', height: '20px' }}
                                 />
                               )}
                               {canDelete && (
                                 <div
                                   className="skeleton-loader"
                                   style={{ width: '20px', height: '20px' }}
                                 />
                               )}
                               {canCancel && (
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
                              {renderActions && (
                                <div
                                  className="skeleton-loader"
                                  style={{ width: '80px', height: '30px' }}
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
                      <CTableDataCell
                        colSpan={
                          columns.filter((c) => !c.hidden).length +
                          1 +
                          (hasActionColumn ? 1 : 0) +
                          (renderRowDetails ? 1 : 0)
                        }
                        className="text-center"
                      >
                        No {typeof title === 'string' ? title : 'records'} found.
                      </CTableDataCell>
                    </CTableRow>
                  ) : (
                    currentData.map((row, rowIndex) => {
                      const rowId = row.id || row._id || row.driverId || rowIndex
                      const isExpanded = expandedRowIds.has(rowId)
                      const colSpanTotal =
                        columns.filter((col) => !col.hidden).length +
                        1 +
                        (hasActionColumn ? 1 : 0) +
                        (renderRowDetails ? 1 : 0)

                      return (
                        <React.Fragment key={rowId || rowIndex}>
                          <CTableRow>
                            {renderRowDetails && (
                              <CTableDataCell className="text-center" style={{ width: '45px', verticalAlign: 'middle', padding: '6px' }}>
                                <button
                                  type="button"
                                  className="action-button d-inline-flex align-items-center justify-content-center"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    toggleRowExpansion(rowId)
                                  }}
                                  aria-label={isExpanded ? 'Collapse' : 'Expand'}
                                  title={isExpanded ? 'Collapse Details' : 'Expand Details'}
                                  style={{
                                    width: '28px',
                                    height: '28px',
                                    borderRadius: '4px',
                                    backgroundColor: isExpanded ? '#e2e8f0' : 'transparent',
                                  }}
                                >
                                  {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                                </button>
                              </CTableDataCell>
                            )}
                            <CTableDataCell className="text-center">
                              {startIndex + rowIndex + 1}
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
                            {hasActionColumn && (
                              <CTableDataCell className="action-cell">
                                <div className="action-buttons">
                                  {canEdit && (
                                    <CTooltip
                                      content={
                                        isRowEditable && !isRowEditable(row)
                                          ? 'Cancelled trips cannot be edited'
                                          : 'Edit'
                                      }
                                      placement="top"
                                    >
                                      <button
                                        className="action-button"
                                        onClick={() =>
                                          (!isRowEditable || isRowEditable(row)) &&
                                          handleEditButton(row.id || row._id)
                                        }
                                        aria-label="Edit"
                                        disabled={Boolean(isRowEditable && !isRowEditable(row))}
                                        style={{
                                          opacity: isRowEditable && !isRowEditable(row) ? 0.4 : 1,
                                          cursor:
                                            isRowEditable && !isRowEditable(row)
                                              ? 'not-allowed'
                                              : 'pointer',
                                        }}
                                      >
                                        <Pencil color="#2D336B" size={18} />
                                      </button>
                                    </CTooltip>
                                  )}
                                  {canDelete && (
                                    <CTooltip content="Delete" placement="top">
                                      <button
                                        className="action-button"
                                        onClick={() => handleDeleteButton(row.id || row._id)}
                                        aria-label="Delete"
                                      >
                                        <Trash2 color="#2D336B" size={18} />
                                      </button>
                                    </CTooltip>
                                  )}
                                  {canCancel && (
                                    <CTooltip
                                      content={
                                        row.rawStatus?.toLowerCase() === 'cancelled'
                                          ? 'Trip already cancelled'
                                          : 'Cancel Trip'
                                      }
                                      placement="top"
                                    >
                                      <button
                                        className="action-button"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          handleCancelButton?.(row.id || row._id, row)
                                        }}
                                        aria-label="Cancel Trip"
                                        disabled={row.rawStatus?.toLowerCase() === 'cancelled'}
                                        style={{
                                          opacity:
                                            row.rawStatus?.toLowerCase() === 'cancelled' ? 0.4 : 1,
                                          cursor:
                                            row.rawStatus?.toLowerCase() === 'cancelled'
                                              ? 'not-allowed'
                                              : 'pointer',
                                        }}
                                      >
                                        <Ban color="#dc3545" size={18} />
                                      </button>
                                    </CTooltip>
                                  )}

                                  {reportButton && (
                                    <CTooltip content="Report" placement="top">
                                      <button
                                        className="action-button"
                                        onClick={() => handleReportButton(row.id || row._id)}
                                        aria-label="Report"
                                      >
                                        <FileText color="#2D336B" size={18} />
                                      </button>
                                    </CTooltip>
                                  )}

                                  {renderActions && renderActions(row)}

                                  {viewButton && (
                                    <button
                                      className="action-view-button"
                                      onClick={async () => {
                                        const targetId = row.id || row._id
                                        setViewLoadingId(targetId)
                                        try {
                                          await handleViewButton(targetId)
                                        } finally {
                                          setViewLoadingId(null)
                                        }
                                      }}
                                      disabled={viewLoadingId === (row.id || row._id)}
                                      style={{
                                        backgroundColor: viewButtonColor,
                                        color: 'white',
                                        opacity: viewLoadingId === (row.id || row._id) ? 0.6 : 1,
                                        border: 'none',
                                      }}
                                    >
                                      {viewButtonIcon}
                                      <span>
                                        {viewLoadingId === (row.id || row._id)
                                          ? 'Loading...'
                                          : viewButtonLabel}
                                      </span>
                                    </button>
                                  )}
                                </div>
                              </CTableDataCell>
                            )}
                          </CTableRow>
                          {isExpanded && renderRowDetails && (
                            <CTableRow className="expanded-row-details">
                              <CTableDataCell
                                colSpan={colSpanTotal}
                                style={{ padding: '0', backgroundColor: '#f8fafc' }}
                              >
                                {renderRowDetails(row, isExpanded, () => toggleRowExpansion(rowId))}
                              </CTableDataCell>
                            </CTableRow>
                          )}
                        </React.Fragment>
                      )
                    })
                  )}
                </CTableBody>
              </CTable>
            </div>
          </CCardBody>

          {/* Pagination Footer */}
          {shouldShowPagination && (
            <div className="d-flex flex-wrap justify-content-between align-items-center p-2 border-top bg-white w-100">
              <div className="d-flex align-items-center gap-3 mb-2 mb-sm-0">
                <div className="text-muted text-nowrap" style={{ fontSize: '13px' }}>
                  Showing {filteredData.length > 0 ? startIndex + 1 : 0} to {Math.min(startIndex + (isShowAll ? filteredData.length : effectiveItemsPerPage), filteredData.length)} of {filteredData.length} results
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
                    style={{ width: '75px', cursor: 'pointer', borderRadius: '6px', fontSize: '12px', padding: '0.25rem 1.5rem 0.25rem 0.5rem' }}
                    value={isShowAll ? 1000000 : itemsPerPage}
                    onChange={(e) => {
                      const val = Number(e.target.value)
                      if (setItemsPerPage) setItemsPerPage(val === 1000000 ? -1 : val)
                      if (setCurrentPage) setCurrentPage(1)
                    }}
                  >
                    <option value="5">5</option>
                    <option value="7">7</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value="50">50</option>
                    <option value="1000000">All</option>
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
                    disabled={currentPage <= 1 || isShowAll}
                  >
                    {'<<'}
                  </button>
                  <button
                    className="btn btn-sm btn-light border d-flex align-items-center justify-content-center bg-white shadow-sm"
                    style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                    onClick={goToPrevPage}
                    disabled={currentPage <= 1 || isShowAll}
                  >
                    {'<'}
                  </button>
                  <button
                    className="btn btn-sm btn-light border d-flex align-items-center justify-content-center bg-white shadow-sm"
                    style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                    onClick={goToNextPage}
                    disabled={currentPage >= totalPages || isShowAll}
                  >
                    {'>'}
                  </button>
                  <button
                    className="btn btn-sm btn-light border d-flex align-items-center justify-content-center bg-white shadow-sm"
                    style={{ width: '28px', height: '28px', borderRadius: '6px' }}
                    onClick={goToLastPage}
                    disabled={currentPage >= totalPages || isShowAll}
                  >
                    {'>>'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </CCard>
      </CCol>
    </CRow>
  )
}

Table.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
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
  cancelButton: PropTypes.bool,
  handleCancelButton: PropTypes.func,
  currentPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  isFetching: PropTypes.bool,
  reportButton: PropTypes.bool,
  handleReportButton: PropTypes.func,
  serverPagination: PropTypes.bool,
  renderActions: PropTypes.func,
  showPagination: PropTypes.bool,
  isRowEditable: PropTypes.func,
  renderRowDetails: PropTypes.func,
}

Table.defaultProps = {
  isFetching: false,
  serverPagination: false,
}

export default Table
