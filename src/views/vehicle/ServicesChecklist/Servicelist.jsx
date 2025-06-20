import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import ServiceCards from './component/ServiceCards'
import { ImMeter } from 'react-icons/im'
import { MdOutlineNextWeek } from 'react-icons/md'
import { GrHostMaintenance } from 'react-icons/gr'
import { Button, Card } from 'react-bootstrap'
import ServiceHistoryCard from './component/ServiceHistoryCard'
import SmartPagination from '../../components/SmartPagination'
import DateRangeFilterCredence from '../../../components/DateRangeFilterCredence'
import AddFormButton from './component/AddFormButton'

const ServiceList = () => {
  const { id } = useParams()
  console.log(id)

  const [showForm, setShowForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editData, setEditData] = useState(null)

  // Add button section
  const fields = [
    { name: 'date', label: 'Date', type: 'date' },
    {
      name: 'serviceType',
      label: 'Services Type',
      type: 'select',
      required: true,
      options: [
        { value: 'engineOil', label: 'Engine Oil Change & Filters.' },
        { value: 'brakeMaintenance', label: 'Brake Maintenance.' },
        { value: 'tireWheel', label: 'Tire & Wheel Service.' },
        { value: 'fuel', label: 'Fuels and Gas Service.' },
        { value: 'battery', label: 'Battery & Electrical.' },
        { value: 'newPartService', label: 'Part Changes Or New Parts Buys for vehicle' },
        {
          value: 'other',
          label: 'Major mechanical issues or part replacements or Service Requriment(Other).',
        },
      ],
    },
    { name: 'description', label: 'Description', type: 'text', placeholder: 'Description' },
    { name: 'amount', label: 'Amount', type: 'number', placeholder: 'Amount' },
    {
      name: 'nextServiceKm',
      label: 'Next Service KM',
      type: 'number',
      placeholder: 'Next Service Km',
    },
  ]

  const handleSubmit = (formData) => {
    console.log(editMode ? 'Updating data:' : 'Creating new:', formData)
    setShowForm(false)
    setEditMode(false)
    setEditData(null)
  }

  // card section
  const fullData = [
    {
      id: 1,
      serviceType: 'Oil Change',
      date: '2024-01-15',
      description: 'Regular oil change and filter replacement',
      odometer: 40000,
      amount: '89.99',
      nextServiceKm: 45000,
    },
    {
      id: 2,
      serviceType: 'Full Service',
      date: '2023-11-20',
      description: 'Complete vehicle inspection and maintenance',
      odometer: 35000,
      amount: '249.99',
      nextServiceKm: 40000,
    },
    {
      id: 3,
      serviceType: 'Full Service',
      date: '2023-10-15',
      description: 'Brake inspection and tire rotation',
      odometer: 30000,
      amount: '199.99',
      nextServiceKm: 35000,
    },
    {
      id: 4,
      serviceType: 'Full Service',
      date: '2023-09-12',
      description: 'Air filter and spark plugs replacement',
      odometer: 25000,
      amount: '220.00',
      nextServiceKm: 30000,
    },
    {
      id: 5,
      serviceType: 'Oil Change',
      date: '2023-08-10',
      description: 'Oil change with premium synthetic oil',
      odometer: 20000,
      amount: '99.99',
      nextServiceKm: 25000,
    },
    {
      id: 6,
      serviceType: 'Inspection',
      date: '2023-07-05',
      description: 'Basic inspection and battery check',
      odometer: 15000,
      amount: '79.99',
      nextServiceKm: 20000,
    },
  ]

  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(5)

  const totalPages = useMemo(() => {
    return itemsPerPage === -1 ? 1 : Math.ceil(fullData.length / itemsPerPage)
  }, [fullData.length, itemsPerPage])

  const paginatedData = useMemo(() => {
    if (itemsPerPage === -1) return fullData
    const startIndex = (currentPage - 1) * itemsPerPage
    return fullData.slice(startIndex, startIndex + itemsPerPage)
  }, [fullData, currentPage, itemsPerPage])

  const handleEdit = (id) => {
    const item = fullData.find((d) => d.id === id)
    if (item) {
      setEditMode(true)
      setEditData(item)
      setShowForm(true)
    }
  }

  const handleDelete = (id) => {
    alert(`Delete clicked for ID: ${id}`)
  }

  // date range
  const handleDateRangeChange = (id) => {
    console.log('idz,', id)
  }

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <DateRangeFilterCredence title="Date Range" onDateRangeChange={handleDateRangeChange} />
        <AddFormButton
          buttonLabel="Add Service"
          formFields={fields}
          initialData={editData}
          editMode={!!editData}
          showExternally={!!editData}
          onSubmit={(formData) => {
            console.log('Submitted:', formData)
            setEditData(null)
          }}
          onCloseExternal={() => setEditData(null)}
        />
      </div>

      <div>
        <Card className="shadow-sm rounded-3 border-0 mt-3">
          <Card.Header className="bg-secondary text-white fw-semibold fs-5">
            Service List <span className="ms-2">#{id || 'N/A'}</span>
          </Card.Header>
          <Card.Body className="px-4 py-3">
            <div className="mb-4">
              <h6 className="text-muted mb-1">Vehicle Name</h6>
              <h5 className="fw-bold text-dark">MH49BB9711</h5>
            </div>
            <div className="row">
              <div className="col-md-4 mb-4">
                <ServiceCards
                  title="Current Odometer"
                  value={8200}
                  unit="KM"
                  icon={ImMeter}
                  iconColor="#0d6efd"
                />
              </div>
              <div className="col-md-4 mb-4">
                <ServiceCards
                  title="Next Service Due"
                  value={17000}
                  unit="km"
                  icon={GrHostMaintenance}
                  iconColor="#f40adb"
                />
              </div>
              <div className="col-md-4 mb-4">
                <ServiceCards
                  title="Last Service"
                  value={1000}
                  unit="km"
                  icon={MdOutlineNextWeek}
                  iconColor="#04fe3e"
                />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      <div className="mt-4">
        <ServiceHistoryCard
          paginatedData={paginatedData}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <SmartPagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={(value) => {
            setItemsPerPage(value)
            setCurrentPage(1) // Reset to first page on page size change
          }}
        />
      </div>
    </>
  )
}

export default ServiceList
