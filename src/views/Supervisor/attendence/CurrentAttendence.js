/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import Table from '../../components/Table'

const CurrentAttendence = () => {
  const fetchData = [
    {
      _id: '67c699967b47884af430978c',
      driverId: {
        _id: '67c69166d266e1551793672f',
        name: 'gagan',
        currentVehicleName: null,
      },
      vehicleId: '65a7f1b8c3a9d99a0b8a1235',
      amount: 789,
      shopName: 'ngp shop',
      location: 'nagpur',
      description: 'food',
      date: '2025-03-04T11:41:34.803Z',
      paymentMode: 'phonepay',
      createdAt: '2025-03-04T11:41:34.808Z',
      updatedAt: '2025-03-04T11:41:34.808Z',
    },
    {
      _id: '67c69e18e2aa029479dfb5ba',
      driverId: {
        _id: '67c69166d266e1551793672f',
        name: 'gagan',
        currentVehicleName: null,
      },
      vehicleId: '65a7f1b8c3a9d99a0b8a1235',
      amount: 147,
      shopName: 'ngp shop',
      location: 'nagpur',
      description: 'food',
      date: '2025-03-04T12:00:48.346Z',
      paymentMode: 'phonepay',
      createdAt: '2025-03-04T12:00:48.351Z',
      updatedAt: '2025-03-04T12:00:48.351Z',
    },
    {
      _id: '67c69e1ae2aa029479dfb5bd',
      driverId: {
        _id: '67c69166d266e1551793672f',
        name: 'gagan',
        currentVehicleName: null,
      },
      vehicleId: '65a7f1b8c3a9d99a0b8a1235',
      amount: 258,
      shopName: 'ngp shop',
      location: 'nagpur',
      description: 'food',
      date: '2025-03-04T12:00:50.545Z',
      paymentMode: 'phonepay',
      createdAt: '2025-03-04T12:00:50.547Z',
      updatedAt: '2025-03-04T12:00:50.547Z',
    },
    {
      _id: '67c7f16dc37f9c3ec232ee15',
      driverId: {
        _id: '67c29a7d521c46fefe6e4a73',
        name: 'piyushDoe',
        currentVehicleName: 'MH49BB9711',
      },
      vehicleId: '67c29a7d521c46fefe6e4a73',
      amount: 800,
      shopName: 'ngp shop',
      location: 'nagpur',
      description: 'food',
      date: '2025-03-05T12:08:37.035Z',
      paymentMode: 'phonepay',
      createdAt: '2025-03-05T12:08:37.042Z',
      updatedAt: '2025-03-05T12:09:42.704Z',
    },
  ]
  const initialData = fetchData.map((data, index) => {
    return {
      name: data.driverId.name,
      shopName: data.shopName,
      paymentMode: data.paymentMode,
      amount: data.amount,
      id: data._id,
    }
  })
  const [filteredData, setFilteredData] = useState(initialData)
  const columns = [
    { label: 'SN', key: 'sn', sortable: false },
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Payment Mode', key: 'paymentMode', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Action', key: 'action', sortable: false },
  ]

  const handleViewButton = (data) => {
    console.log('SUBMIT HUA', data)
  }

  const handleEditButton = (data) => {
    console.log('EDIT BUTTON', data)
  }

  const handleDeleteButton = (data) => {
    console.log('DELETE BUTTON', data)
  }

  return (
    <>
      <Table
        title={'Vehicle'}
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        viewButton={true}
        handleViewButton={handleViewButton}
        editButton={true}
        handleEditButton={handleEditButton}
        deleteButton={true}
        handleDeleteButton={handleDeleteButton}
      />
    </>
  )
}

export default CurrentAttendence
