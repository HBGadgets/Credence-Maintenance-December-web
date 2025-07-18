import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { toast, ToastContainer } from 'react-toastify'

const AbsentTable = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const attendanceLocData = state?.absentData || []
  const [searchParams] = useSearchParams()
  const monthParam = searchParams.get('month') // e.g., "2025-07"

  const formatMonth = (monthString) => {
    if (!monthString) return 'N/A'
    const [year, month] = monthString.split('-')
    const date = new Date(`${year}-${month}-01`)
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  const driverName = attendanceLocData[0]?.driverName || 'Unknown'

  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(itemsPerPage === -1 ? 1 : (filteredData?.length || 0) / itemsPerPage)

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Status', key: 'status', sortable: true },
  ]

  useEffect(() => {
    const fetchAbsentData = async () => {
      if (!attendanceLocData || attendanceLocData.length === 0) {
        setFilteredData([])
        return
      }

      const updatedData = attendanceLocData.map((item) => ({
        ...item,
        date: item.createdAt,
        name: item.driverName,
      }))

      const styledData = updatedData.map((data) => ({
        ...data,
        status: (
          <span
            style={{
              backgroundColor: '#dc3545',
              color: 'white',
              padding: '4px 10px',
              borderRadius: '20px',
              fontWeight: 'bold',
              fontSize: '0.75rem',
              display: 'inline-block',
              textTransform: 'capitalize',
            }}
          >
            {data.status}
          </span>
        ),
      }))

      setFilteredData(styledData)
    }

    fetchAbsentData()
  }, [attendanceLocData])

  const isFetching = false

  return (
    <>
      <ToastContainer />

      {/* Header Section */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center p-3">
          <h5 className="mb-0 fw-semibold text-dark">
            Absent Attendance: <span className="fw-bold">{driverName}</span> | Month:{' '}
            <span className="fw-bold">{formatMonth(monthParam)}</span>
          </h5>
        </div>
      </div>

      {/* Attendance Table */}
      <Table
        title="Drivers Absent Records"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
      />

      {/* Pagination */}
      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          const newItems = value === -1 ? filteredData.length : value
          setItemsPerPage(newItems)
          setCurrentPage(1)
        }}
      />
    </>
  )
}

export default AbsentTable
