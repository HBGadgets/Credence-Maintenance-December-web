import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import Loader from '../../../components/Loader/Loader'
import Page404 from '../../pages/page404/Page404'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getDriverListApi, markAttendanceBySupervisorApi } from '../data/data'
import SearchInput from '../../components/SearchInput'

const CurrentAttendence = () => {
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [data, setData] = useState([]) // Store full API data
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Fetch driver list
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const data = await getDriverListApi()
        console.log('Fetched Driver Data:', data)
        setData(data)
        setFilteredData(data)
      } catch (err) {
        // If the error is a network error
        if (!err.response) {
          setError('Network Error') // Internet/server unreachable
          toast.error('Failed to fetch driver data!', { position: 'top-right' })
        } else if (err.response.status === 500) {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <Loader />
  if (error) return <Page404 />

  // Handle attendance marking
  const handleMarkAttendance = async (id) => {
    if (!id) {
      toast.error('Invalid Driver ID!', { position: 'top-right' })
      return
    }

    try {
      await markAttendanceBySupervisorApi(id)
      toast.success('Attendance marked successfully!', { position: 'top-right' })

      // **Immediately remove the marked driver from the table**
      setFilteredData((prevData) =>
        prevData.filter((driver) => driver.id !== id && driver._id !== id),
      )
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance', {
        position: 'top-right',
      })
    }
  }

  // Handle Click For Mark Attendance Api.

  const updatedData = filteredData.map((driver) => ({
    ...driver,
    actions: (
      <button
        onClick={() => handleMarkAttendance(driver.id || driver._id)}
        style={{
          backgroundColor: 'green',
          color: 'white',
          border: 'none',
          padding: '5px 10px', // Smaller padding
          fontSize: '12px', // Reduce font size
          fontWeight: 'bold',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 3px #0b5b0b',
          margin: '0 auto', // Centering
          width: '100px', // Smaller width
          height: '30px', // Smaller height
        }}
        onMouseOver={(e) => {
          e.target.style.backgroundColor = '#008000'
          e.target.style.transform = 'translateY(2px)'
          e.target.style.boxShadow = '0 2px #0b5b0b'
        }}
        onMouseOut={(e) => {
          e.target.style.backgroundColor = 'green'
          e.target.style.transform = 'translateY(0px)'
          e.target.style.boxShadow = '0 3px #0b5b0b'
        }}
        onMouseDown={(e) => {
          e.target.style.transform = 'translateY(4px)'
          e.target.style.boxShadow = '0 1px #0b5b0b'
        }}
        onMouseUp={(e) => {
          e.target.style.transform = 'translateY(2px)'
          e.target.style.boxShadow = '0 2px #0b5b0b'
        }}
      >
        Mark Present
      </button>
    ),
  }))

  // Search handler (Filters allData)
  const handleSearch = (query) => {
    setSearchQuery(query)

    if (!query) {
      setFilteredData(data) // Reset to full data if search is empty
      return
    }

    const filtered = data.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
    setFilteredData(filtered)
  }

  // Table columns
  const columns = [
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Contact', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Actions', key: 'actions' }, // Column for button
  ]

  return (
    <div>
      <ToastContainer />

      <div className="mb-2 d-flex justify-content-end align-items-center">
        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="Driver Mark Attendance Lists"
        columns={columns}
        filteredData={updatedData} // ✅ Updated table data
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  )
}

export default CurrentAttendence
