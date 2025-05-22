import React, { useEffect, useMemo, useState } from 'react'
import BillShow from '../../../components/BillModal/BillShow'
import SmartPagination from '../../../components/SmartPagination'
import Table from '../../../components/Table'
import DateRangePicker from '../../../components/DateRangePicker'
import { CContainer } from '@coreui/react'
import { driverLogbook, getDailyLogSign } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import SearchInput from '../../../components/SearchInput'

const LogsDriver = () => {
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))
  const [searchQuery, setSearchQuery] = useState('')

  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')
  const { id } = useParams()
  const {
    data: driverLogbookData = [],
    isFetching,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['logbook', id, selectedMonth],
    queryFn: () => driverLogbook(id, selectedMonth),
    staleTime: 1000 * 60 * 30,
  })

  useEffect(() => {
    let filtered = [...driverLogbookData]

    // Apply search filter
    if (searchQuery) {
      const lowercasedQuery = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        Object.values(item).some(
          (value) =>
            value && typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
        ),
      )
    }

    setFilteredData(filtered)
  }, [driverLogbookData, searchQuery])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Memoized paginatedData
  const paginatedData = useMemo(() => {
    return filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
  }, [filteredData, currentPage, itemsPerPage])

  // Memoized totalPages
  const totalPages = useMemo(() => {
    return Math.ceil(filteredData.length / itemsPerPage)
  }, [filteredData.length, itemsPerPage])

  const columns = [
    { label: 'Date', key: 'originalDate', sortable: true },
    { label: 'Vehicle Name', key: 'vehicleName', sortable: true },
    { label: 'Start Time', key: 'startDate', sortable: true },
    { label: 'End Time', key: 'endDate', sortable: true },
    { label: 'Duration', key: 'duration', sortable: true },
    { label: 'Log KM', key: 'logKM', sortable: true },
    { label: 'GPS KM', key: 'gpsKM', sortable: true },
  ]

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

  // Handle Search
  const handleSearch = (query) => {
    setSearchQuery(query)
  }
  return (
    <>
      <CContainer className="px-2" fluid>
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="mb-2 d-flex justify-content-between align-items-center">
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
            <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
          </div>
          <Table
            title="Driver LogBooks"
            columns={columns}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isFetching={isFetching}
            isFetched={isFetched}
            isError={isError}
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
        {/* Modal for displaying signature */}
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

export default LogsDriver
