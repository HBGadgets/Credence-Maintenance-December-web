/* eslint-disable prettier/prettier */
import React, { useState, useEffect } from 'react'
import axios from "axios"
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
  CFormInput,
  CPaginationItem,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Cookies from 'js-cookie'

const LeaveRequests = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortConfig, setSortConfig] = useState({ key: '', direction: 'asc' }) // Store sorting state
  const [filter, setFilter] = useState('')
  const recordsPerPage = 10
  const [leaveData, setLeaveData] = useState([])


const fetchLeaveData = async () => {
  const token=Cookies.get('crdnsToken')
    try {
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/leave`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
            }
        }
      ); // Adjust endpoint as needed
      console.log("response of leave ",response.data);
      
      setLeaveData(response.data);
      } catch (error) {
        console.error(error);
        }
  };
  useEffect(() => {
    fetchLeaveData();
  }, []);

  // State for leave data
  // const [leaveData, setLeaveData] = useState(
  // //   [
  // //   {
  // //     name: 'John Cena',
  // //     contact: '+91 9876543210',
  // //     date: '01/01/2025 - 02/01/2025',
  // //     description: 'Meeting',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Sarah Johnson',
  // //     contact: '+91 9876543211',
  // //     date: '01/01/2025 - 02/01/2025',
  // //     description: 'Call',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Michael Chen',
  // //     contact: '+91 9876543212',
  // //     date: '02/01/2025 - 03/01/2025',
  // //     description: 'Discussion',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'David Kumar',
  // //     contact: '+91 9876543213',
  // //     date: '03/01/2025 - 04/01/2025',
  // //     description: 'Presentation',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Emma Patel',
  // //     contact: '+91 9876543214',
  // //     date: '05/01/2025 - 06/01/2025',
  // //     description: 'Workshop',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'John Smith',
  // //     contact: '+91 9876543210',
  // //     date: '06/01/2025 - 07/01/2025',
  // //     description: 'Conference',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Sophia Johnson',
  // //     contact: '+91 9876543211',
  // //     date: '07/01/2025 - 08/01/2025',
  // //     description: 'Seminar',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Ethan Brown',
  // //     contact: '+91 9876543212',
  // //     date: '08/01/2025 - 09/01/2025',
  // //     description: 'Training',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Isabella Davis',
  // //     contact: '+91 9876543213',
  // //     date: '09/01/2025 - 10/01/2025',
  // //     description: 'Training',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Liam Wilson',
  // //     contact: '+91 9876543215',
  // //     date: '10/01/2025 - 11/01/2025',
  // //     description: 'Workshop',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Ava Taylor',
  // //     contact: '+91 9876543216',
  // //     date: '11/01/2025 - 12/01/2025',
  // //     description: 'Conference',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Noah Moore',
  // //     contact: '+91 9876543217',
  // //     date: '12/01/2025 - 13/01/2025',
  // //     description: 'Training',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Mia Thomas',
  // //     contact: '+91 9876543218',
  // //     date: '13/01/2025 - 14/01/2025',
  // //     description: 'Seminar',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Oliver Martinez',
  // //     contact: '+91 9876543219',
  // //     date: '14/01/2025 - 15/01/2025',
  // //     description: 'Meeting',
  // //     status: 'Pending...',
  // //   },
  // //   {
  // //     name: 'Ella Garcia',
  // //     contact: '+91 9876543220',
  // //     date: '15/01/2025 - 16/01/2025',
  // //     description: 'Workshop',
  // //     status: 'Pending...',
  // //   },
  // // ]
// )
  const totalPages = Math.ceil(leaveData.length / recordsPerPage)


  // Function to get the sorting icon
  const getSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'asc' ? '▲' : '▼'
    }
    return '↕'
  }

  // Sorting logic
  const sortData = (data) => {
    if (!sortConfig.key) return data
    return [...data].sort((a, b) => {
      const valueA = a[sortConfig.key].toLowerCase()
      const valueB = b[sortConfig.key].toLowerCase()
      if (valueA < valueB) return sortConfig.direction === 'asc' ? -1 : 1
      if (valueA > valueB) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
      
    })
  }

  // const handleApprove = (index) => {
  //   const updatedData = [...leaveData]
  //   const actualIndex = (currentPage - 1) * recordsPerPage + index
  //   updatedData[actualIndex].status = 'Approved'
  //   setLeaveData(updatedData)
  //   toast.success('Leave Approved')
  // }

  // Handle Deny
  // const handleDeny = (index) => {
  //   const updatedData = [...leaveData]
  //   const actualIndex = (currentPage - 1) * recordsPerPage + index
  //   updatedData[actualIndex].status = 'Denied'
  //   setLeaveData(updatedData)
  //   toast.error('Leave Denied')
  // }

  const handleDeny = (id) => {
    console.log("deny ki id",id);
    
    const token=Cookies.get('crdnsToken')
    axios.put(`${import.meta.env.VITE_API_URL }/api/leave/${id}/status`,
      {
        status: 'Rejected'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      console.log(response.data)
      toast.error('Leave Denied')
      fetchLeaveData();
      })
      .catch((error) => {
        console.error(error)
      })
  }
  const handleApprove = (id) => {
    console.log("approve ki id",id);
    
    const token=Cookies.get('crdnsToken')
    axios.put(`${import.meta.env.VITE_API_URL}/api/leave/${id}/status`,
      {
        status: 'Approved'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    )
    .then((response) => {
      console.log(response.data)
      toast.success('Leave Approved')
      fetchLeaveData();
      })
      .catch((error) => {
        console.error(error)
      })
  }

  // Handle sorting
  const handleSort = (key) => {
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  // Filter, sort, and paginate data
  // const filteredData = leaveData.filter((row) =>
  //   row.driverId.name.toLowerCase().includes(filter.toLowerCase()),
  // )
  const filteredData = Array.isArray(leaveData)
  ? leaveData.filter((row) =>
      row?.driverId?.name?.toLowerCase().includes(filter.toLowerCase())
    )
  : [];

  const sortedData = sortData(filteredData)
  const currentRecords = sortedData.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage,
  )

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>Leave Request</strong>
              <CFormInput
                type="text"
                placeholder="Search..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-25"
              />
            </CCardHeader>
            {leaveData.length === 0 ? (
              <p className="text-center">No logs found.</p>
            ) : (
              <>
                <CTable align="middle" className="mb-0 border" hover responsive>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell className="text-center">SN</CTableHeaderCell>
                      {['name', 'contact', 'date', 'description', 'status'].map((col) => (
                        <CTableHeaderCell
                          key={col}
                          className="text-center"
                          onClick={() => handleSort(col)}
                          style={{ cursor: 'pointer' }}
                        >
                          {col.charAt(0).toUpperCase() + col.slice(1)} {getSortIcon(col)}
                        </CTableHeaderCell>
                      ))}
                      <CTableHeaderCell
                        className="text-center"
                        onClick={() => handleSort('status')}
                        style={{ cursor: 'pointer' }}
                      >
                        Action {getSortIcon('status')}
                      </CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {currentRecords.map((item, index) => (
                      <CTableRow key={index}>
                        <CTableDataCell className="text-center">
                          {(currentPage - 1) * recordsPerPage + index + 1}
                        </CTableDataCell>
                        <CTableDataCell className="text-center">{item.driverId.name}</CTableDataCell>
                        <CTableDataCell className="text-center">{item.driverId.email}</CTableDataCell>
                        <CTableDataCell className="text-center">{`${new Date(item.startDate).toLocaleDateString()} - ${new Date(item.endDate).toLocaleDateString()}`}</CTableDataCell>
                        <CTableDataCell className="text-center">{item.reason}</CTableDataCell>
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
                            onClick={() => handleApprove(item._id)}
                          >
                            <CIcon icon={cilCheckCircle} />
                          </CButton>
                          <CButton color="danger" onClick={() => handleDeny(item._id)}>
                            <CIcon icon={cilXCircle} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>

                <CPagination align="center" className="mt-4">
                  <CPaginationItem
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((prev) => prev - 1)}
                  >
                    Previous
                  </CPaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <CPaginationItem
                      key={i}
                      active={i + 1 === currentPage}
                      onClick={() => setCurrentPage(i + 1)}
                    >
                      {i + 1}
                    </CPaginationItem>
                  ))}
                  <CPaginationItem
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                  >
                    Next
                  </CPaginationItem>
                </CPagination>
              </>
            )}
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default LeaveRequests
