/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import Table from './Table'
import { driverExpenses, getDriverBillApi } from '../DriverExpert/data/drivers'
import { useQuery } from '@tanstack/react-query'
import SmartPagination from './SmartPagination'
import { toast } from 'react-toastify'
import BillShow from './BillModal/BillShow'

function DriverExpenses({ id }) {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const { data: driverExpensesData = [], isFetching } = useQuery({
    queryKey: ['DriverExpenses', id],
    queryFn: () => driverExpenses(id),
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    if (driverExpensesData) {
      setFilteredData(driverExpensesData)
    }
  }, [driverExpensesData])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Pagination: Slice the data for current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Description', key: 'description', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Shop Name', key: 'shopName', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    { label: 'Payment Mode', key: 'payment', sortable: true },
  ]

  console.log('Filtered Data:', filteredData)

  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (!selectedRow) return toast.error('Data not found for this ID')
    if (!selectedRow.billImg) return toast.warn('No bill image available for this entry.')

    try {
      const response = await getDriverBillApi(selectedRow.billImg)
      const { base64Data, contentType } = response

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
        setPdfBase64(fileSrc)
        setModalTitle(
          contentType.startsWith('application/pdf')
            ? 'Vehicle Bill (PDF)'
            : contentType.startsWith('image')
              ? 'Vehicle Bill (Image)'
              : 'Vehicle Bill (File)',
        )
        setShowModal(true)
      } else {
        toast.error('Invalid bill image data.')
      }
    } catch (error) {
      console.error('Failed to fetch bill image:', error)
      toast.error('No bill image found.')
    }
  }

  return (
    <>
      <Table
        title="Driver Expenses"
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

      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </>
  )
}

export default DriverExpenses
