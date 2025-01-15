/* eslint-disable prettier/prettier */
import React, { useState } from 'react'
import {
  CCard,
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
  CPagination,
  CPaginationItem,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const LeaveRequests = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  // State for leave data
  const [leaveData, setLeaveData] = useState([
    {
      name: 'John Cena',
      contact: '+91 9876543210',
      date: '01/01/2025 - 02/01/2025',
      description: 'Meeting',
      status: 'Pending...',
    },
    {
      name: 'Sarah Johnson',
      contact: '+91 9876543211',
      date: '01/01/2025 - 02/01/2025',
      description: 'Call',
      status: 'Pending...',
    },
    {
      name: 'Michael Chen',
      contact: '+91 9876543212',
      date: '02/01/2025 - 03/01/2025',
      description: 'Discussion',
      status: 'Pending...',
    },
    {
      name: 'David Kumar',
      contact: '+91 9876543213',
      date: '03/01/2025 - 04/01/2025',
      description: 'Presentation',
      status: 'Pending...',
    },
    {
      name: 'Emma Patel',
      contact: '+91 9876543214',
      date: '05/01/2025 - 06/01/2025',
      description: 'Workshop',
      status: 'Pending...',
    },
    {
      name: 'John Smith',
      contact: '+91 9876543210',
      date: '06/01/2025 - 07/01/2025',
      description: 'Conference',
      status: 'Pending...',
    },
    {
      name: 'Sophia Johnson',
      contact: '+91 9876543211',
      date: '07/01/2025 - 08/01/2025',
      description: 'Seminar',
      status: 'Pending...',
    },
    {
      name: 'Ethan Brown',
      contact: '+91 9876543212',
      date: '08/01/2025 - 09/01/2025',
      description: 'Training',
      status: 'Pending...',
    },
    {
      name: 'Isabella Davis',
      contact: '+91 9876543213',
      date: '09/01/2025 - 10/01/2025',
      description: 'Training',
      status: 'Pending...',
    },
    {
      name: 'Liam Wilson',
      contact: '+91 9876543215',
      date: '10/01/2025 - 11/01/2025',
      description: 'Workshop',
      status: 'Pending...',
    },
    {
      name: 'Ava Taylor',
      contact: '+91 9876543216',
      date: '11/01/2025 - 12/01/2025',
      description: 'Conference',
      status: 'Pending...',
    },
    {
      name: 'Noah Moore',
      contact: '+91 9876543217',
      date: '12/01/2025 - 13/01/2025',
      description: 'Training',
      status: 'Pending...',
    },
    {
      name: 'Mia Thomas',
      contact: '+91 9876543218',
      date: '13/01/2025 - 14/01/2025',
      description: 'Seminar',
      status: 'Pending...',
    },
    {
      name: 'Oliver Martinez',
      contact: '+91 9876543219',
      date: '14/01/2025 - 15/01/2025',
      description: 'Meeting',
      status: 'Pending...',
    },
    {
      name: 'Ella Garcia',
      contact: '+91 9876543220',
      date: '15/01/2025 - 16/01/2025',
      description: 'Workshop',
      status: 'Pending...',
    },
  ])
  const [filter, setFilter] = useState('')
  const totalPages = Math.ceil(leaveData.length / recordsPerPage)

  // Update records based on the current page and filter
  const currentRecords = leaveData
    .filter((row) => row.name.toLowerCase().includes(filter.toLowerCase()))
    .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)

  // Handle Approve
  const handleApprove = (index) => {
    const updatedData = [...leaveData]
    const actualIndex = (currentPage - 1) * recordsPerPage + index
    updatedData[actualIndex].status = 'Approved'
    setLeaveData(updatedData)
    toast.success('Leave Approved')
  }

  // Handle Deny
  const handleDeny = (index) => {
    const updatedData = [...leaveData]
    const actualIndex = (currentPage - 1) * recordsPerPage + index
    updatedData[actualIndex].status = 'Denied'
    setLeaveData(updatedData)
    toast.error('Leave Denied')
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value)
    setCurrentPage(1) // Reset to the first page on search
  }

  return (
    <div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Filter by Name"
          value={filter}
          onChange={handleFilterChange}
        />
      </div>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Leave Request</strong>
            </CCardHeader>
            {leaveData.length === 0 ? (
              <p className="text-center">No logs found.</p>
            ) : (
              <>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead>
                    <CTableRow scope="col">
                      <CTableHeaderCell className="text-center">Sn.no</CTableHeaderCell>

                      <CTableHeaderCell className="text-center">Name</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Contact</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Date</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Description</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                      <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentRecords.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center">
                          {(currentPage - 1) * recordsPerPage + index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{item.name}</CTableDataCell>
                        <CTableDataCell className="text-center">{item.contact}</CTableDataCell>
                        <CTableDataCell className="text-center">{item.date}</CTableDataCell>
                        <CTableDataCell className="text-center">{item.description}</CTableDataCell>
                        <CTableDataCell
                          className="text-center"
                          style={{
                            color:
                              item.status === 'Approved'
                                ? 'green'
                                : item.status === 'Denied'
                                  ? 'red'
                                  : 'orange',
                          }}
                        >
                          {item.status}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">
                          <CButton
                            color="success"
                            className="me-2"
                            onClick={() => handleApprove(index)}
                          >
                            <CIcon icon={cilCheckCircle} />
                          </CButton>
                          <CButton color="danger" onClick={() => handleDeny(index)}>
                            <CIcon icon={cilXCircle} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                {/* CoreUI Pagination */}
                <CPagination align="center" className="mt-4">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  >
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <CPaginationItem
                      key={i + 1}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </>
            )}
          </CCard>
        </CCol>
      </CRow>

      <ToastContainer />
    </div>
  )
}

export default LeaveRequests
