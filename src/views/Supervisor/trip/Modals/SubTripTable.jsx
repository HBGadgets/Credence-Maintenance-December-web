import React, { useState, useEffect } from 'react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { useNavigate } from 'react-router-dom'

const SubTripTable = ({ subTrips, id }) => {
  const navigate = useNavigate()

  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)
  const [isFetching, setIsFetching] = useState(false)

  const getStatusStyle = (status) => {
    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 10px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      backgroundColor:
        status === 'in-progress'
          ? '#f5a623'
          : status === 'completed'
            ? '#28a745'
            : status === 'cancelled'
              ? '#dc3545'
              : '#6c757d',
      color: 'white',
    }
  }
  // Columns for reusable Table component
  const columns = [
    { label: 'Date', key: 'date' },
    { label: 'Company Name', key: 'companyName' },
    { label: 'Start Route', key: 'startLocation' },
    { label: 'End Route', key: 'endLocation' },
    {
      label: 'Budget',
      key: 'budgetAllocated',
      render: (row) => `₹${row.budgetAllocated}`,
    },
    {
      label: 'Status',
      key: 'status',
      render: (row) => <span style={getStatusStyle(row.status)}>{row.status || '-'}</span>,
    },
    { label: 'Material', key: 'materialType', render: (row) => row.materialType || '-' },
  ]

  useEffect(() => {
    setIsFetching(true)
    setFilteredData(subTrips)
    setIsFetching(false)
  }, [subTrips])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const handleViewDetailedReport = (id) => {
    navigate(`/TableSubTrip/${id}`)
  }

  return (
    <div>
      <Table
        title="Subtrips Trips"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
      />

      {/* <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? filteredData.length : value)
          setCurrentPage(1)
        }}
      /> */}

      <div className="text-end">
        <button
          onClick={() => handleViewDetailedReport(id)}
          className="rounded ps-3 pe-3 btn btn-outline-primary custom-hover"
        >
          View Detailed Report
        </button>
      </div>
    </div>
  )
}

export default SubTripTable
