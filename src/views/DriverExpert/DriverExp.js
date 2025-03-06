import React, { useState, useEffect } from 'react'
import Table from '../components/Table'
import { drivers } from './data/drivers'

const DriversExp = () => {
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

  return (
    <>
      <Table
        title={'Drivers'}
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
      />
    </>
  )
}

export default DriversExp
