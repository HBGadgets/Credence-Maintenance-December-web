import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getAllVehicleInpectionApi, getAllFailInpectionImageApi } from '../../data/data'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import BillShow from '../../../components/BillModal/BillShow'
import { toast, ToastContainer } from 'react-toastify'
import { Eye } from 'lucide-react'

const InpectionTable = () => {
  const { id } = useParams()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [loadingId, setLoadingId] = useState(null)

  // Modal state
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  const { data: allInspections, isFetching } = useQuery({
    queryKey: ['allvehicleinpection'],
    queryFn: getAllVehicleInpectionApi,
    staleTime: 1000 * 60 * 30,
    onError: (err) => console.error('Error fetching inspection data:', err),
  })

  useEffect(() => {
    if (allInspections) {
      const inspection = allInspections.find((item) => item.id === id)

      if (inspection) {
        const failedFields = Object.entries(inspection.items || {})
          .filter(([_, value]) => value.status === 'Fail')
          .map(([key, value], index) => ({
            id: index,
            item: key,
            description: value.description,
            imageId: value.image || null,
          }))

        setFilteredData(failedFields)
      }
    }
  }, [allInspections, id])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  //   table column
  const columns = [
    { label: 'Item Name', key: 'item' },
    { label: 'Description', key: 'description' },
    {
      label: 'Image',
      key: 'imageId',
      render: (row) =>
        row.imageId ? (
          <div className="d-flex justify-content-center align-items-center">
            <button
              className="btn btn-sm d-flex align-items-center gap-1 text-white"
              style={{ backgroundColor: 'rgb(10, 45, 99)' }}
              onClick={() => handleViewButton(row)}
              disabled={loadingId === row.id}
            >
              <Eye size={16} />
              {loadingId === row.id ? 'Viewing...' : 'View'}
            </button>
          </div>
        ) : (
          <div className="text-center text-muted">No Image</div>
        ),
    },
  ]

  //   handle view button
  const handleViewButton = async (row) => {
    if (!row.imageId) {
      toast.warning('No image available for this item.')
      return
    }

    setLoadingId(row.id) // start loading

    try {
      const response = await getAllFailInpectionImageApi(row.imageId)
      const { base64Data, contentType } = response?.image || response

      if (!base64Data || !contentType) {
        toast.error('Invalid or missing image data.')
        return
      }

      const fileSrc = `data:${contentType};base64,${base64Data}`
      setPdfBase64(fileSrc)

      if (contentType.startsWith('application/pdf')) {
        setModalTitle(`Inspection Image (PDF) - ${row.item}`)
      } else if (contentType.startsWith('image')) {
        setModalTitle(`Inspection Image - ${row.item}`)
      } else {
        setModalTitle(`Inspection File - ${row.item}`)
      }

      setShowModal(true) // Show modal only after valid image
    } catch (error) {
      console.error('Failed to fetch image:', error)
      toast.error('Error fetching image for this inspection item.')
    } finally {
      setLoadingId(null) //  Reset loading state
    }
  }

  return (
    <div>
      <ToastContainer />
      <Table
        title="Failed Inspection Items"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? filteredData.length : value)
          setCurrentPage(1)
        }}
      />

      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />
    </div>
  )
}

export default InpectionTable
