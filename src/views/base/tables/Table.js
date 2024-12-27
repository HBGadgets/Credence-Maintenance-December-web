/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React from 'react'
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
import { Eye } from 'lucide-react'

const Table = ({ columns, data, title, handleView }) => {
  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>{title}</strong>
          </CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  {columns.map((column, index) => (
                    <CTableHeaderCell key={index} className="text-center" scope="col">
                      {column}
                    </CTableHeaderCell>
                  ))}
                  {handleView && (
                    <CTableHeaderCell className="text-center" scope="col">
                      Actions
                    </CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.map((row, rowIndex) => (
                  <CTableRow key={rowIndex}>
                    {Object.values(row).map((cell, cellIndex) => (
                      <CTableDataCell key={cellIndex} className="text-center">
                        {cell}
                      </CTableDataCell>
                    ))}
                    {handleView && (
                      <CTableDataCell className="text-center">
                        <CButton color="primary" size="sm" onClick={() => handleView(row)}>
                          <Eye className="me-1" size={16} />
                          View
                        </CButton>
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Table
