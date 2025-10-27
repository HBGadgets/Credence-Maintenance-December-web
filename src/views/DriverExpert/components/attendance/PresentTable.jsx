/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react'
import { useLocation, useParams, useSearchParams } from 'react-router-dom'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import { getAddressApi, getDriverLocationApi } from '../../data/drivers'
import { toast, ToastContainer } from 'react-toastify'
import BillShow from '../../../components/BillModal/BillShow'

const PresentTable = () => {
  const { id } = useParams()
  const { state } = useLocation()
  const attendanceLocData = state?.presentData || []
  const [searchParams] = useSearchParams()
  const monthParam = searchParams.get('month') // e.g., "2025-07"

  // ✅ Format month like "July 2025"
  const formatMonth = (monthString) => {
    if (!monthString) return 'N/A'
    const [year, month] = monthString.split('-')
    const date = new Date(`${year}-${month}-01`)
    return date.toLocaleString('default', { month: 'long', year: 'numeric' })
  }

  // ✅ Helper: Only date (DD/MM/YYYY)
  const formatDateToDDMMYYYY = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    if (isNaN(date)) return 'N/A'

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    return `${day}/${month}/${year}`
  }

  // ✅ Helper: Full date + time (24-hour format)
  const formatDateTime = (timeString) => {
    if (!timeString) return 'N/A'

    let date
    try {
      date = new Date(timeString)
      if (isNaN(date)) {
        const parsed = Date.parse(timeString)
        if (!isNaN(parsed)) {
          date = new Date(parsed)
        } else {
          return 'Invalid Date'
        }
      }
    } catch (error) {
      console.error('Date parse error:', error, timeString)
      return 'Invalid Date'
    }

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()

    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`
  }

  const driverName = attendanceLocData[0]?.driverName || 'Unknown'

  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Modal states
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const totalPages = Math.ceil(itemsPerPage === -1 ? 1 : (filteredData?.length || 0) / itemsPerPage)

  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Driver Name', key: 'name', sortable: true },
    { label: 'Check-In Time', key: 'checkinTime', sortable: true },
    { label: 'Check-In Address', key: 'address', sortable: false },
    { label: 'Check-Out Time', key: 'checkoutTime', sortable: false },
    { label: 'Check-Out Address', key: 'endAddress', sortable: false },
    { label: 'Status', key: 'status', sortable: true },
  ]

  useEffect(() => {
    const fetchAddresses = async () => {
      if (!attendanceLocData || attendanceLocData.length === 0) {
        setFilteredData([])
        return
      }

      const addressCache = {}

      const updatedData = await Promise.all(
        attendanceLocData.map(async (item) => {
          // ---- Check-In Address ----
          let startAddress = 'N/A'
          if (item.lat && item.long) {
            const startKey = `${item.lat},${item.long}`
            if (!addressCache[startKey]) {
              try {
                addressCache[startKey] = await getAddressApi(item.lat, item.long)
              } catch (err) {
                console.error('Check-In Address error:', err)
                addressCache[startKey] = 'Address not found'
              }
            }
            startAddress = addressCache[startKey]
          }

          // ---- Check-Out Address ----
          let endAddress = 'N/A'
          if (item.endLat && item.endLong) {
            const endKey = `${item.endLat},${item.endLong}`
            if (!addressCache[endKey]) {
              try {
                addressCache[endKey] = await getAddressApi(item.endLat, item.endLong)
              } catch (err) {
                console.error('Check-Out Address error:', err)
                addressCache[endKey] = 'Address not found'
              }
            }
            endAddress = addressCache[endKey]
          }

          // ✅ Format date and time
          const formattedDate = item.createdAt ? formatDateToDDMMYYYY(item.createdAt) : 'N/A'
          const formattedCheckin = item.createdAt ? formatDateTime(item.createdAt) : 'N/A'
          const formattedCheckout = item.checkoutTime ? formatDateTime(item.checkoutTime) : 'N/A'

          return {
            ...item,
            date: formattedDate,
            name: item.driverName,
            coordinate: `${item.lat || 'N/A'}, ${item.long || 'N/A'}`,
            address: startAddress,
            endAddress: endAddress,
            checkinTime: formattedCheckin,
            checkoutTime: formattedCheckout,
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

      {/* Header */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body d-flex justify-content-between align-items-center p-3">
          <h5 className="mb-0 fw-semibold text-dark">
            Present Attendance : <span className="fw-bold">{driverName}</span> | Month:{' '}
            <span className="fw-bold">{formatMonth(monthParam)}</span>
          </h5>
        </div>
      </div>

      {/* Table */}
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
        action="Image"
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

      {/* Modal */}
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
