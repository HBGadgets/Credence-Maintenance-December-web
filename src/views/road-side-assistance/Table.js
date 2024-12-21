/* eslint-disable prettier/prettier */
import { React, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { Eye, EyeOff, Pencil, Trash } from 'lucide-react'

function Table() {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    setOpen(!open)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">USER NAME</CTableHeaderCell>
                  <CTableHeaderCell scope="col">EMAIL</CTableHeaderCell>
                  <CTableHeaderCell scope="col">COMPANY</CTableHeaderCell>
                  <CTableHeaderCell scope="col">CREATED</CTableHeaderCell>
                  <CTableHeaderCell scope="col">LAST EDITED</CTableHeaderCell>
                  <CTableHeaderCell scope="col">ACTION</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell>1</CTableHeaderCell>
                  <CTableDataCell>Mark</CTableDataCell>
                  <CTableDataCell>Otto</CTableDataCell>
                  <CTableDataCell>@mdo</CTableDataCell>
                  <CTableDataCell>21-12-2024</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-4 justify-content-center">
                      <button
                        className="btn p-0 bg-transparent border-0"
                        onClick={handleClick}
                        type="button"
                        aria-pressed={open}
                      >
                        {open ? <EyeOff size={24} /> : <Eye size={24} />}
                      </button>
                      <button className="btn p-0 bg-transparent border-0">
                        <Pencil size={24} />
                      </button>
                      <button className="btn p-0 bg-transparent border-0">
                        <Trash size={24} />
                      </button>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Table
