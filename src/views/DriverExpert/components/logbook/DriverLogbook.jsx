import React, { useEffect, useState } from 'react'
import { driverLogbook, getDailyLogSign } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import { CContainer } from '@coreui/react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import DateRangePicker from '../../../components/DateRangePicker'
import BillShow from '../../../components/BillModal/BillShow'

const DriverLogbook = ({ id }) => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  // Use state for modal
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const { data: driverLogbookData = [], isFetching } = useQuery({
    queryKey: ['logbook'],
    queryFn: () => driverLogbook(id, selectedMonth),
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    if (driverLogbookData && JSON.stringify(driverLogbookData) !== JSON.stringify(filteredData)) {
      setFilteredData(driverLogbookData)
    }
  }, [driverLogbookData])

  useEffect(() => {
    console.log('OYEEEEEEEEEEEEEEEEEEEEEEEEEEEE🙄🙄🙄')
    driverLogbook(id, selectedMonth)
  }, [id, selectedMonth])

  // console.log('All logbook data ', driverLogbookData)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Pagination: Slice the data for current page
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  const columns = [
    { label: 'Date', key: 'originalDate', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Time', key: 'startDate', sortable: true },
    { label: 'End Time', key: 'endDate', sortable: true },
    { label: 'Duration', key: 'duration', sortable: true },
    { label: 'Log KM', key: 'logKM', sortable: true },
    { label: 'GPS KM', key: 'gpsKM', sortable: true },
  ]

  console.log('Filtered Data:', filteredData)

  // handle view button

  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    if (!selectedRow) {
      return toast.error('Data not found for this ID')
    }

    if (!selectedRow.signatureId) {
      return toast.warn('No bill image available for this entry.')
    }

    try {
      const response = await getDailyLogSign(selectedRow.signatureId)
      const { base64Data, contentType } = response.signatureImg || response

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
        console.log('Daily log signature image:', fileSrc)
        setPdfBase64(fileSrc)

        if (contentType.startsWith('application/pdf')) {
          setModalTitle('Driver signature (PDF)')
        } else if (contentType.startsWith('image')) {
          setModalTitle('Driver signature (Image)')
        } else {
          setModalTitle('Driver signature (File)')
        }

        setShowModal(true)
      } else {
        toast.error('Invalid Driver signature image data.')
      }
    } catch (error) {
      console.error('Failed to fetch Driver signature image:', error)
      toast.error('No Driver signature image Found.')
    }
  }

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

        {/* Modal Component */}
        <BillShow
          showModal={showModal}
          setShowModal={setShowModal}
          pdfBase64={pdfBase64}
          modalTitle={modalTitle}
        />
      </CContainer>
    </>
  )
}

export default DriverLogbook
