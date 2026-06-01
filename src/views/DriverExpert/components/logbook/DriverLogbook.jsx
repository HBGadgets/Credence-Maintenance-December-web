import React, { useEffect, useMemo, useState } from 'react'
import { driverLogbook, getDailyLogSign } from '../../data/drivers'
import { useQuery } from '@tanstack/react-query'
import { CContainer } from '@coreui/react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import DateRangePicker from '../../../components/DateRangePicker'
import BillShow from '../../../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import usePdfExporter from '../../../customhooks/usePdfExporter'
import useExcelExporter from '../../../customhooks/useExcelExporter'
import IconDropdown from '../../../Supervisor/IconDropdown'

const DriverLogbook = ({ id }) => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const navigate = useNavigate()

  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7))

  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const {
    data: driverLogbookData = [],
    isFetching,
    isFetched,
    isError,
  } = useQuery({
    queryKey: ['logbook', id, selectedMonth],
    queryFn: () => driverLogbook(id, selectedMonth),
    staleTime: 1000 * 60 * 30,
    retry: 0,
  })

  useEffect(() => {
    if (driverLogbookData && JSON.stringify(driverLogbookData) !== JSON.stringify(filteredData)) {
      setFilteredData(driverLogbookData)
    }
  }, [driverLogbookData])

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
    { label: 'Driver Name', key: 'driverName', sortable: true },
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

  // handle navigate
  const handleViewDetailedReport = (id) => {
    navigate(`/LogsDriver/${id}`)
  }

  // Handle Logout
  const handleLogout = () => {
    // Clear sessionStorage and localStorage
    sessionStorage.clear()
    localStorage.clear()

    // Optional: Clear cookies (will only clear cookies accessible via JavaScript)
    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })

    // Redirect to Credence
    window.history.replaceState(null, '', '/')
    // window.location.href = 'http://localhost:3000'
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL
  }

  // Memoized dropdown items for export
  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: 'Driver LogBook Report',
            columns,
            data: filteredData,
            fileName: 'Driver_LogBook_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'Driver LogBook Report',
            columns,
            data: filteredData,
            fileName: 'Driver_LogBook_Report',
          })
        },
      },
      {
        icon: FaPrint,
        label: 'Print Page',
        onClick: () => window.print(),
      },
      {
        icon: HiOutlineLogout,
        label: 'Logout',
        onClick: () => handleLogout(),
      },
      {
        icon: FaArrowUp,
        label: 'Scroll To Top',
        onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
      },
    ],
    [filteredData, columns, exportToPDF, exportToExcel],
  )

  return (
    <>
      <ToastContainer />

      <CContainer className="px-2" fluid>
        <>
          <Table
            title="Driver LogBooks"
            columns={columns}
            filteredData={paginatedData}
            setFilteredData={setFilteredData}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
            isFetching={isFetching}
            isFetched={isFetched}
            isError={isError}
            viewButton={true}
            handleViewButton={handleViewButton}
            action="Images"
          />
        </>
        {/* Modal for displaying signature */}
        <BillShow
          showModal={showModal}
          setShowModal={setShowModal}
          pdfBase64={pdfBase64}
          modalTitle={modalTitle}
        />

        <div className="mt-3 text-end">
          <button
            onClick={() => handleViewDetailedReport(id)}
            className="rounded ps-3 pe-3 btn btn-outline-primary custom-hover"
          >
            View Detailed Report
          </button>
        </div>
      </CContainer>
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default DriverLogbook
