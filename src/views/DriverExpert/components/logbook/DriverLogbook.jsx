import React, { useEffect, useState } from 'react'
import { driverLogbookApi } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import { CContainer } from '@coreui/react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import DateRangePicker from '../../../components/DateRangePicker'

const DriverLogbook = ({ id }) => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const { data: driverLogbookData = [], isFetching } = useQuery({
    queryKey: ['logbook', id, selectedMonth],
    queryFn: () => driverLogbookApi(id, selectedMonth),
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    if (driverLogbookData && JSON.stringify(driverLogbookData) !== JSON.stringify(filteredData)) {
      setFilteredData(driverLogbookData)
    }
  }, [driverLogbookData])

  console.log('All logbook data ', driverLogbookData)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Pagination: Slice the data for current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const columns = [
    { label: 'Date', key: 'startDate', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Log KM', key: 'logKM', sortable: true },
    { label: 'GPS KM', key: 'gpsKM', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Signature', key: 'signatureId', sortable: false },
  ]

  console.log('Filtered Data:', filteredData)

  return (
    <>
      <CContainer className="px-2" fluid>
        <div className="col-md-2 d-flex align-items-center py-2">
          <DateRangePicker
            value={selectedMonth}
            label={false}
            onMonthChange={(newMonth) => {
              if (newMonth !== selectedMonth) {
                setSelectedMonth(newMonth)
              }
            }}
          />
        </div>
        <Table
          title="Driver LogBooks"
          columns={columns}
          filteredData={paginatedData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          isFetching={isFetching}
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
      </CContainer>
    </>
  )
}

export default DriverLogbook
