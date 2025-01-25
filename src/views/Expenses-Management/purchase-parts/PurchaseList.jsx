import React, { useState } from 'react'
import {
  CCard,
  CCol,
  CRow,
  CCardBody,
  CCardHeader,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CButtonGroup,
} from '@coreui/react'
import { IconButton } from '@mui/material'
import { AiFillDelete, AiFillEdit } from 'react-icons/ai'
import { FaPrint } from 'react-icons/fa'
import { MdOutlinePreview } from 'react-icons/md'

// Define the column structure
const columns = [
  { label: 'Part Name', key: 'partName', sortable: true },
  { label: 'Vehicle', key: 'vehicle', sortable: true },
  { label: 'Category', key: 'category', sortable: true },
  { label: 'Vendor', key: 'vendor', sortable: true },
  { label: 'Quantity', key: 'quantity', sortable: true },
  { label: 'Cost Per Unit', key: 'costPerUnit', sortable: true },
  { label: 'Purchase Date', key: 'purchaseDate', sortable: true },
  { label: 'Invoice/Bill Number', key: 'invoiceNumber', sortable: true },
  { label: 'Document', key: 'document', sortable: true },
  { label: 'Actions', key: 'actions', sortable: true },
]

const PurchaseList = ({ purchases, searchTerm, onView, onEdit, onDelete, onPrint }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' })

  // Filter purchases based on the search term
  const filteredPurchases = purchases.filter((purchase) =>
    purchase.partName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Handle sorting logic
  const handleSort = (key) => {
    if (!columns.find((column) => column.key === key && column.sortable)) return

    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })

    filteredPurchases.sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1
      return 0
    })
  }

  // Get sorting icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  // Reusable action buttons
  const ActionButtons = ({ purchase }) => (
    <CButtonGroup>
      <IconButton
        aria-label="view"
        onClick={() => onView(purchase)}
        style={{ margin: '0 5px', color: '#1976d2' }}
      >
        <MdOutlinePreview />
      </IconButton>
      <IconButton
        aria-label="edit"
        onClick={() => onEdit(purchase)}
        style={{ margin: '0 5px', color: 'orange' }}
      >
        <AiFillEdit style={{ fontSize: '20px' }} />
      </IconButton>
      <IconButton
        aria-label="delete"
        onClick={() => onDelete(purchase)}
        style={{ margin: '0 5px', color: 'red' }}
      >
        <AiFillDelete style={{ fontSize: '20px' }} />
      </IconButton>
      <IconButton
        aria-label="print"
        onClick={() => onPrint(purchase)}
        style={{ margin: '0 5px', color: 'green' }}
      >
        <FaPrint style={{ fontSize: '20px' }} />
      </IconButton>
    </CButtonGroup>
  )

  return (
    <CRow style={{ marginTop: '1rem' }}>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Purchase Expenses</strong>
          </CCardHeader>
          <CCardBody>
            {filteredPurchases.length === 0 ? (
              <p className="text-center">No purchases available.</p>
            ) : (
              <CTable striped hover responsive>
                <CTableHead>
                  <CTableRow>
                    {columns.map((column, index) => (
                      <CTableHeaderCell
                        key={index}
                        className="text-center"
                        onClick={() => column.sortable && handleSort(column.key)}
                        style={{ cursor: column.sortable ? 'pointer' : 'default' }}
                        role="columnheader"
                        aria-sort={sortConfig.key === column.key ? sortConfig.direction : 'none'}
                      >
                        {column.label} {column.sortable && getSortIcon(column.key)}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredPurchases.map((purchase, index) => (
                    <CTableRow key={purchase.id}>
                      {columns.map((column) => {
                        if (column.key === 'actions') {
                          return (
                            <CTableDataCell
                              key={column.key}
                              className="text-center text-nowrap"
                              style={{ paddingLeft: '15px', paddingRight: '15px' }}
                            >
                              <ActionButtons purchase={purchase} />
                            </CTableDataCell>
                          )
                        }
                        return (
                          <CTableDataCell
                            key={column.key}
                            className="text-center text-nowrap"
                            style={{ paddingLeft: '15px', paddingRight: '15px' }}
                          >
                            {purchase[column.key]?.toString() || ''}
                          </CTableDataCell>
                        )
                      })}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            )}
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default PurchaseList
