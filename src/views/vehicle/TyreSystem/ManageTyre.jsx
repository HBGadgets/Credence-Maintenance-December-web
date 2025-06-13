import React, { useEffect, useState } from 'react'
import TyreAlign from './component/TyreAlign'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'

const ManageTyre = () => {
  const [filteredData, setFilteredData] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const tyres = [
    {
      id: 1,
      driverName: 'Ronny',
      vehicleName: 'Mh49yy4949',
    },
    {
      id: 2,
      driverName: 'Gagan',
      vehicleName: 'Mh41bf7373',
    },
    {
      id: 3,
      driverName: 'Prasad',
      vehicleName: 'Mh50aw2102',
    },
  ]

  const columns = [
    { label: 'Driver Name', key: 'driverName', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
  ]

  // Set the tyre data into filteredData on component mount
  useEffect(() => {
    setFilteredData(tyres)
  }, [])

  // handle view
  const handleViewButton = (id) => {
    console.log('idzz', id)
  }

  //

  return (
    <div>
      <TyreAlign />

      <Table
        title="Vehicle Trips"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        handleViewButton={handleViewButton}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
          if (value === -1) {
            setItemsPerPage(filteredData.length)
          }
        }}
      />
    </div>
  )
}

export default ManageTyre
