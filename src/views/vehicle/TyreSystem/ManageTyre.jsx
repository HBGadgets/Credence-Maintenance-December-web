import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import TyreAlign from './component/TyreAlign'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import {
  deleteTyreSystemApi,
  getTyerSystemBillApi,
  getTyreSystemApi,
} from '../data/VehicleListData'
import Swal from 'sweetalert2'
import TyreAssignModal from './component/TyreAssignModal'
import BillShow from '../../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import usePdfExporter from '../../customhooks/usePdfExporter'
import useExcelExporter from '../../customhooks/useExcelExporter'
import IconDropdown from '../../Supervisor/IconDropdown'

const ManageTyre = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const { id: vehicleId } = useParams()
  const [filteredData, setFilteredData] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // Use state for modal for bill
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showBillModal, setShowBillModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // Add these state variables
  const [showModal, setShowModal] = useState(false)
  const [selectedTyreLabel, setSelectedTyreLabel] = useState('')
  const [editTyreData, setEditTyreData] = useState(null)

  const formatDateToInput = (dateStr) => {
    if (!dateStr) return ''
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
    const [dd, mm, yyyy] = dateStr.split('-')
    return `${yyyy}-${mm}-${dd}`
  }

  // payment colors
  const getPaymentStyle = (payment) => {
    return {
      display: 'inline-block',
      minWidth: '70px',
      padding: '1px 8px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      backgroundColor:
        payment === 'upi'
          ? '#0000FF'
          : payment === 'cash'
            ? '#28a745'
            : payment === 'card'
              ? '#f5a623'
              : '#0000FF',
      color: 'white',
    }
  }

  // tyre conditions
  const getTyreStyle = (status) => {
    return {
      display: 'inline-block',
      minWidth: '100px',
      padding: '2px 10px',
      borderRadius: '10px',
      textAlign: 'center',
      textTransform: 'capitalize',
      fontWeight: '400',
      backgroundColor:
        status === 'new'
          ? '#4CAF50' // Fresh Green
          : status === 'in-use'
            ? '#2196F3' // Bright Blue
            : status === 'need-replacement'
              ? '#F44336' // Vivid Red
              : status === 'second-hand'
                ? '#FF9800' // Orange
                : '#9E9E9E', // Default Grey
      color: 'white',
    }
  }

  const {
    data: tyresystem = [],
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['tyresystem', vehicleId],
    queryFn: () => getTyreSystemApi(vehicleId),
    enabled: !!vehicleId,
    staleTime: Infinity, // never mark as stale
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  })

  useEffect(() => {
    if (tyresystem?.length > 0) {
      setFilteredData(tyresystem)
    } else {
      setFilteredData([])
    }
  }, [tyresystem])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const columns = [
    { label: 'Date', key: 'installationDate', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
    { label: 'Position', key: 'position', sortable: true },
    { label: 'Tyre Sr.No', key: 'tyreSerialNumber', sortable: true },
    { label: 'Brand Name', key: 'brandName', sortable: true },
    {
      label: 'Tyre Status',
      key: 'tyreStatus',
      render: (row) => <span style={getTyreStyle(row.tyreStatus)}>{row.tyreStatus}</span>,
      sortable: true,
    },
    { label: 'Vendor Name', key: 'vendorName', sortable: true },
    { label: 'Location', key: 'location', sortable: true },
    { label: 'Latitude', key: 'lat', sortable: true },
    { label: 'Longitude', key: 'long', sortable: true },
    { label: 'Tyre Size', key: 'tyreSize', sortable: true },
    { label: 'Amount', key: 'amount', sortable: true },
    {
      label: 'Payment Mode',
      key: 'paymentMode',
      render: (row) => <span style={getPaymentStyle(row.paymentMode)}>{row.paymentMode}</span>,
      sortable: true,
    },
  ]

  // handle view
  const handleViewButton = async (id) => {
    const selectedRow = filteredData.find((item) => item.id === id)
    console.log('id', id)
    if (!selectedRow) {
      return toast.error('Data not found for this ID')
    }

    if (!selectedRow.billImg) {
      return toast.warn('No bill image available for this entry.')
    }

    try {
      const response = await getTyerSystemBillApi(selectedRow.billImg)
      const { base64Data, contentType } = response

      if (base64Data && contentType) {
        const fileSrc = `data:${contentType};base64,${base64Data}`
        console.log('Document bill image:', fileSrc)
        setPdfBase64(fileSrc)

        if (contentType.startsWith('application/pdf')) {
          setModalTitle('Driver Bill (PDF)')
        } else if (contentType.startsWith('image')) {
          setModalTitle('Driver Bill (Image)')
        } else {
          setModalTitle('Driver Bill (File)')
        }
        // Open the modal
        setShowBillModal(true)
      } else {
        toast.error('Invalid bill image data.')
      }
    } catch (error) {
      console.error('Failed to fetch bill image:', error)
      toast.error('No bill image found.')
    }
  }

  // handle edit
  const handleEditButton = (id) => {
    const tyreToEdit = filteredData.find((item) => item.id === id)

    if (tyreToEdit) {
      setSelectedTyreLabel(tyreToEdit.position || '') // position is tyreLabel
      setEditTyreData({
        ...tyreToEdit,
        installationDate: formatDateToInput(tyreToEdit.installationDate),
      })
      setShowModal(true)
    }
  }

  // handle delete
  const handleDeleteButton = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete the tyre record permanently!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    })

    if (confirm.isConfirmed) {
      try {
        await deleteTyreSystemApi(id)
        await Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'The tyre record has been deleted.',
          timer: 1500,
          showConfirmButton: false,
        })
        refetch()
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Delete Failed',
          text: error?.response?.data?.message || 'An error occurred while deleting.',
        })
      }
    }
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
        onClick: () => {
          const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
            ...rest,
            paymentMode:
              typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '',
            tyreStatus:
              typeof rest.tyreStatus === 'string'
                ? rest.tyreStatus
                : rest.tyreStatus?.props?.children || '',
          }))
          exportToPDF({
            title: 'Vehicle Tyres Report',
            columns,
            data: cleanedData,
            fileName: 'Vehicle_Tyres_Report',
          })
        },
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          const cleanedData = filteredData.map(({ paymentMode, ...rest }) => ({
            ...rest,
            paymentMode:
              typeof paymentMode === 'string' ? paymentMode : paymentMode?.props?.children || '',
            tyreStatus:
              typeof rest.tyreStatus === 'string'
                ? rest.tyreStatus
                : rest.tyreStatus?.props?.children || '',
          }))
          exportToExcel({
            title: 'Vehicle Tyres Report',
            columns,
            data: cleanedData,
            fileName: 'Vehicle_Tyres_Report',
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
    <div>
      <ToastContainer />
      <div className="row mb-3">
        <div className="col-12 d-flex justify-content-between align-items-center">
          {tyresystem[0]?.vehicleName && (
            <span className="fw-bold fs-4">Vehicle Name: {tyresystem[0].vehicleName}</span>
          )}
        </div>
      </div>

      <TyreAlign attachedTyres={filteredData} refetchData={refetch} />

      <Table
        title="Tyre Management"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        viewButton={true}
        handleViewButton={handleViewButton}
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
        deleteButton={true}
        handleDeleteButton={handleDeleteButton}
        viewButtonLabel="Image"
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

      {/*  Bill Modal */}
      <BillShow
        showModal={showBillModal} // Corrected prop name (was showModalFrom)
        setShowModal={setShowBillModal} // Corrected prop name (was setShowModalFrom)
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />

      {/* Add this modal component */}
      <TyreAssignModal
        show={showModal}
        onClose={() => setShowModal(false)}
        tyreLabel={selectedTyreLabel}
        vehicleId={vehicleId}
        refetchData={refetch}
        initialData={editTyreData}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </div>
  )
}

export default ManageTyre
