import React, { useState } from 'react'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import { drivers } from './data/drivers'

function DriversPage() {
  const initialData = drivers.map((data) => {
    return {
      name: data.name,
      contactNumber: data.contactNumber,
      email: data.contactNumber,
      password: data.password,
      licenseNumber: data.licenseNumber,
      aadharNumber: data.aadharNumber,
      id: data.id,
    }
  })

  const [filteredData, setFilteredData] = useState(initialData)

  const columns = [
    { label: 'SN', key: 'sn', sortable: false },
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Contact Number', key: 'contactNumber', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Aadhar Number', key: 'aadharNumber', sortable: true },
    { label: 'License Number', key: 'licenseNumber', sortable: true },
    { label: 'Password', key: 'password', sortable: true },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  return (
    <>
      <Table
        title="Drivers"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
      />
      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value)
          setCurrentPage(1)
          if (value === -1) {
            setItemsPerPage(totalItems)
          } else {
            setItemsPerPage(value)
          }
        }}
      />
    </>
  )
}

export default DriversPage
