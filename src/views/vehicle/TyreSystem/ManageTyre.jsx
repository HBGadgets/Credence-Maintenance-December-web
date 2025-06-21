import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import TyreAlign from './component/TyreAlign'
import Table from '../../components/Table'
import SmartPagination from '../../components/SmartPagination'
import { deleteTyreSystemApi, getTyreSystemApi } from '../data/VehicleListData'
import Swal from 'sweetalert2'
import TyreAssignModal from './component/TyreAssignModal'

const ManageTyre = () => {
  const { id: vehicleId } = useParams()
  const [filteredData, setFilteredData] = useState([])
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

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
  const handleViewButton = (id) => {
    console.log('View Tyre ID:', id)
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

  return (
    <div>
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

      {/* Add this modal component */}
      <TyreAssignModal
        show={showModal}
        onClose={() => setShowModal(false)}
        tyreLabel={selectedTyreLabel}
        vehicleId={vehicleId}
        refetchData={refetch}
        initialData={editTyreData}
      />
    </div>
  )
}

export default ManageTyre
