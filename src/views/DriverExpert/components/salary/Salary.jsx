import React, { useEffect, useState } from 'react'
import { driverSalary } from '../../data/drivers'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { useQuery } from '@tanstack/react-query'
import SalaryInvoiceModal from './SalaryInvoiceModal'

const Salary = ({ id }) => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [selectedSalary, setSelectedSalary] = useState(null)

  const {
    data: driverSalaryData = [],
    isFetching,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['DriverSalary', id],
    queryFn: () => driverSalary(id),
  })

  useEffect(() => {
    if (driverSalaryData.length > 0) {
      setFilteredData(driverSalaryData)
    }
  }, [driverSalaryData])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const columns = [
    { label: 'Date', key: 'createdAt', sortable: true },
    { label: 'Basic Pay', key: 'basicPay', sortable: true },
    { label: 'Overtime Pay', key: 'overtime', sortable: true },
    { label: 'Incentives', key: 'incentives', sortable: true },
    { label: 'Deductions', key: 'deductions', sortable: true },
    { label: 'Net Pay', key: 'netPay', sortable: true },
  ]

  const handleViewButton = (id) => {
    const selectedRow = driverSalaryData.find((item) => item.id === id)
    if (selectedRow) {
      setSelectedSalary(selectedRow)
      setShowInvoiceModal(true)
    }
  }

  return (
    <>
      {isFetching ? (
        <p>Loading salary data...</p>
      ) : isError ? (
        <p>No salary data.</p>
      ) : isFetched && driverSalaryData.length === 0 ? (
        <p>No salary created.</p>
      ) : (
        <>
          <Table
            title="Driver Salary"
            columns={columns}
            filteredData={paginatedData}
            setFilteredData={setFilteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isFetching={isFetching}
            viewButton={true}
            handleViewButton={handleViewButton}
          />

          <SmartPagination
            totalPages={totalPages}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            onItemsPerPageChange={(value) => {
              if (value === -1) {
                setItemsPerPage(filteredData.length)
                setCurrentPage(1)
              } else {
                setItemsPerPage(value)
                setCurrentPage(1)
              }
            }}
          />
        </>
      )}

      <SalaryInvoiceModal
        visible={showInvoiceModal}
        onClose={() => setShowInvoiceModal(false)}
        salaryData={selectedSalary}
      />
    </>
  )
}

export default Salary
