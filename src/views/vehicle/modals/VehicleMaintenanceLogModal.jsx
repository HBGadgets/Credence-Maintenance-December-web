import React, { useState } from 'react'
import Table from '../../components/Table'
import { vehicles } from '../data/data'
import { useNavigate, useParams } from 'react-router-dom'
import SmartPagination from '../../components/SmartPagination'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import SearchInput from '../../components/SearchInput'

const VehicleMaintenanceLogModal = () => {
  const navigate = useNavigate()

  const vehicle = vehicles.find((v) => v.id === 'V001')
  const [filteredData, setFilteredData] = useState(vehicle.maintenanceLogs)

  const columns = [
    { label: 'Service Date', key: 'servicedate', sortable: true },
    { label: 'Mileage', key: 'mileage', sortable: true },
    { label: 'Work Performed', key: 'workperformed', sortable: true },
    { label: 'Performed By', key: 'performedby', sortable: true },
    { label: 'Cost', key: 'cost', sortable: true },
    { label: 'Notes', key: 'note', sortable: true },
    { label: 'Receipt', key: 'receipt', sortable: true },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const { id } = useParams()
  console.log('iddddddddsssssssssssss', id)

  // Modal state
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)

  const handleViewButton = (data) => {
    console.log('Navigating to:', data)
    navigate(`/VehicleProfile/${data}`)
  }

  // Function to open modal with selected image
  const handleViewReceipt = (imageUrl) => {
    setSelectedImage(imageUrl)
    setModalVisible(true)
  }

  return (
    <div>
      <div className="mb-2 d-flex justify-content-between align-items-center">
        <DateRangeFilterCredence title="Date Range" />
        <SearchInput />
      </div>

      <div>
        <Table
          title="Vehicle"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          viewButton={true}
          handleViewButton={handleViewReceipt}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
        />

        <SmartPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1)
            if (value === -1) {
              setItemsPerPage(totalItems)
            } else {
              setItemsPerPage(value)
            }
          }}
        />
      </div>

      {/* Image Modal */}
      <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        size="l"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        backdrop="static"
        centered
      >
        <CModalHeader>
          <CModalTitle>Receipt Image</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center">
          {selectedImage ? (
            <img src={selectedImage} alt="Receipt" className="img-fluid rounded" />
          ) : (
            'No Image Available'
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default VehicleMaintenanceLogModal
