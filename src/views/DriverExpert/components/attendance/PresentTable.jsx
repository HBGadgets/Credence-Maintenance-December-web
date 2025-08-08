import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { getAddressApi, getDriverLocationApi } from '../../data/drivers' // make sure path is correct
import { toast, ToastContainer } from 'react-toastify'
import BillShow from '../../../components/BillModal/BillShow'

const PresentTable = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const attendanceLocData = state?.presentData || []
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

  // modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const totalPages = Math.ceil(itemsPerPage === -1 ? 1 : (filteredData?.length || 0) / itemsPerPage)

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'name', sortable: true },
    // { label: 'Co-ordinate', key: 'coordinate', sortable: false },
    { label: 'Address', key: 'address', sortable: false },
    { label: 'Status', key: 'status', sortable: true },
  ]

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!attendanceLocData || attendanceLocData.length === 0) {
        setFilteredData([])
        return
      }

      const map = {}

      const updatedData = await Promise.all(
        attendanceLocData.map(async (item) => {
          if (!item.lat || !item.long) {
            return {
              ...item,
              date: item.createdAt,
              name: item.driverName,
              coordinate: 'N/A',
              address: 'N/A',
            }
          }

          const key = `${item.lat},${item.long}`

          if (!map[key]) {
            try {
              map[key] = await getAddressApi(item.lat, item.long)
            } catch (err) {
              console.error('Failed to get address:', err)
              map[key] = 'Address not found'
            }
          }

          return {
            ...item,
            date: item.createdAt,
            name: item.driverName,
            coordinate: `${item.lat}, ${item.long}`,
            address: map[key],
          }
        }),
      )

      const styledData = updatedData.map((data) => ({
        ...data,
        id: data.imageId ?? data.createdAt,
        status: (
          <span
            style={{
              backgroundColor: '#28a745',
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

      setFilteredData([...styledData].reverse()) // reverse order
    }

    fetchAddresses()
  }, [attendanceLocData])

  const isFetching = false

  const handleViewButton = async (imageId) => {
    const selectedRow = filteredData.find((item) => item.imageId === imageId)
    console.log(selectedRow)

    if (!selectedRow?.imageId) {
      toast.warning('No image found for selected entry.')
      return
    }

    try {
      const response = await getDriverLocationApi(selectedRow.imageId)
      const { base64Data, contentType } = response

      if (!base64Data || !contentType) {
        toast.error('Invalid image data.')
        return
      }

      const fileSrc = `data:${contentType};base64,${base64Data}`
      setPdfBase64(fileSrc)
      setModalTitle(
        contentType.includes('pdf')
          ? 'Driver Location Image (PDF)'
          : contentType.includes('image')
            ? 'Driver Location Image'
            : 'Driver Location File',
      )
      setShowModal(true)
    } catch (error) {
      console.error('Image fetch error:', error)
      toast.error('No image found or failed to load.')
    }
  }

  return (
    <>
      <ToastContainer />

      {/* Header Section with Bootstrap Card Styling */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center p-3">
          <h5 className="mb-0 fw-semibold text-dark">
            Present Attendance : <span className="fw-bold">{driverName}</span> | Month:{' '}
            <span className="fw-bold">{formatMonth(monthParam)}</span>
          </h5>
        </div>
      </div>

      <Table
        title="Drivers Attendance Location"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        viewButton={true}
        handleViewButton={handleViewButton}
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

      {/* Modal for Bill/Image */}
      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </>
  )
}

export default PresentTable
