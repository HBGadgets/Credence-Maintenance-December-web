// import React, { useState, useEffect, useMemo } from 'react'
// import { useVehicleListData } from './data/VehicleListData'
// import Table from '../components/Table'
// import { CCol, CRow } from '@coreui/react'
// import SingleSelectDropdown from '../components/SingleSelectDropdown'
// import SearchInput from '../components/SearchInput'
// import { useNavigate } from 'react-router-dom'
// import SmartPagination from '../components/SmartPagination'

// function VehicleList() {
//   const navigate = useNavigate()

//   // Extract all necessary states from useVehicleListData
//   const {
//     vehicles,
//     filteredVehicles,
//     filterOptions,
//     nameFilter, // ✅ Now correctly extracted
//     modelFilter,
//     categoryFilter,
//     setNameFilter,
//     setModelFilter,
//     setCategoryFilter,
//     searchQuery,
//     setSearchQuery,
//   } = useVehicleListData()

//   console.log('FILTERED VEHICLE DATA FROM VEHICLE LIST', filteredVehicles)

//   // Processed Data
//   const initialData = useMemo(
//     () =>
//       filteredVehicles.map((item) => ({
//         name: item.name || 'Unknown Driver',
//         model: item.model || 'No Model',
//         category: item.category || 'N/A',
//         id: item._id || 'No ID',
//       })),
//     [filteredVehicles],
//   )

//   const [filteredData, setFilteredData] = useState([])

//   // Sync filteredData when initialData updates
//   useEffect(() => {
//     setFilteredData(initialData)
//   }, [initialData])

//   console.log('Filtered Data:', filteredData)

//   const columns = [
//     { label: 'SN', key: 'sn', sortable: true },
//     { label: 'Name', key: 'name', sortable: true },
//     { label: 'Model', key: 'model', sortable: true },
//     { label: 'Category', key: 'category', sortable: true },
//     { label: 'View', key: 'view', sortable: true },
//   ]

//   const handleViewButton = (data) => {
//     console.log('SUBMIT HUA', data)
//     navigate(`/VehicleProfile/${data}`)
//   }

//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(10)
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage)

//   return (
//     <>
//       <div className="d-flex justify-content-between mb-3">
//         <CRow>
//           <CCol>
//             <SingleSelectDropdown
//               options={filterOptions.names}
//               value={nameFilter}
//               onChange={setNameFilter}
//               isClearable
//               placeholder="Filter by name..."
//             />
//           </CCol>
//           <CCol>
//             <SingleSelectDropdown
//               options={filterOptions.models}
//               value={modelFilter}
//               onChange={setModelFilter}
//               isClearable
//               placeholder="Filter by model..."
//             />
//           </CCol>
//           <CCol>
//             <SingleSelectDropdown
//               options={filterOptions.categories}
//               value={categoryFilter}
//               onChange={setCategoryFilter}
//               isClearable
//               placeholder="Filter by category..."
//             />
//           </CCol>
//         </CRow>

//         <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
//       </div>

//       <Table
//         title="Vehicle"
//         columns={columns}
//         filteredData={filteredData}
//         setFilteredData={setFilteredData}
//         viewButton={true}
//         handleViewButton={handleViewButton}
//         currentPage={currentPage}
//         itemsPerPage={itemsPerPage}
//       />

//       <SmartPagination
//         totalPages={totalPages}
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//         onItemsPerPageChange={(value) => {
//           setItemsPerPage(value)
//           setCurrentPage(1)
//           if (value === -1) {
//             setItemsPerPage(totalItems)
//           } else {
//             setItemsPerPage(value)
//           }
//         }}
//       />
//     </>
//   )
// }

// export default VehicleList

// ---------------------------------------------------------------------------------------------------------

// SLICE ONE CONNECTED CODE

import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchVehicles } from '../../slices/vehicleSlice'
import Table from '../components/Table'
import { CCol, CRow } from '@coreui/react'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import SearchInput from '../components/SearchInput'
import { useNavigate } from 'react-router-dom'
import SmartPagination from '../components/SmartPagination'
import Loader from '../../components/Loader/Loader'
import usePdfExporter from '../customhooks/usePdfExporter'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../Supervisor/IconDropdown'
import useExcelExporter from '../customhooks/useExcelExporter'

function VehicleList() {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { vehicles, status, error } = useSelector((state) => state.vehicle)
  console.log('vehiclesssssssssssssss', vehicles)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchVehicles())
    }
  }, [dispatch, status])

  // Memoized vehicle data for rendering
  const initialData = useMemo(
    () =>
      vehicles.map((item, index) => ({
        // sn: index + 1,
        name: item.name || 'Unknown Driver',
        model: item.model || 'No Model',
        category: item.category || 'N/A',
        id: item._id || 'No ID',
      })),
    [vehicles],
  )

  // Search & filter states
  const [filteredData, setFilteredData] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedName, setSelectedName] = useState(null)
  const [selectedModel, setSelectedModel] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [isFetching, setIsFetching] = useState(true)

  useEffect(() => {
    setFilteredData(initialData)
  }, [initialData])

  // Columns for table
  const columns = [
    { label: 'Name', key: 'name', sortable: true },
    { label: 'Model', key: 'model', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
  ]

  const handleViewButton = (id) => {
    console.log('SSSSSSSSSSSSSSSSSss', id)
    navigate(`/VehicleProfile/${id}`)
  }

  // Search handler
  const handleSearch = (query) => {
    setSearchQuery(query)
    const filtered = initialData.filter(
      (item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.model.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()),
    )
    setFilteredData(filtered)
  }

  // Dropdown filter handler
  useEffect(() => {
    try {
      let filtered = initialData

      if (selectedName) {
        filtered = filtered.filter((item) => item.name === selectedName.value)
      }
      if (selectedModel) {
        filtered = filtered.filter((item) => item.model === selectedModel.value)
      }
      if (selectedCategory) {
        filtered = filtered.filter((item) => item.category === selectedCategory.value)
      }

      setFilteredData(filtered)
    } catch (error) {
      throw new Error('error')
    } finally {
      setIsFetching(false)
    }
  }, [selectedName, selectedModel, selectedCategory, initialData])

  // Dropdown options
  const nameOptions = [...new Set(vehicles.map((v) => v.name))].map((name) => ({
    value: name,
    label: name,
  }))
  const modelOptions = [...new Set(vehicles.map((v) => v.model))].map((model) => ({
    value: model,
    label: model,
  }))
  const categoryOptions = [...new Set(vehicles.map((v) => v.category))].map((category) => ({
    value: category,
    label: category,
  }))

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () =>
        exportToPDF({
          title: 'Vehicle Report', // Dynamic title
          columns: columns,
          data: filteredData,
          fileName: 'Vehicle_Report', // Dynamic file name
        }),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () =>
        exportToExcel({
          title: 'Vehicle Report', // Dynamic title
          columns: columns,
          data: filteredData,
          fileName: 'Vehicle_Report', // Dynamic file name
        }),
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
  ]

  if (status === 'loading')
    return (
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Loader />
      </div>
    )
  if (status === 'failed') return <p>Error: {error}</p>

  return (
    <>
      <div className="d-flex justify-content-between mb-3">
        <CRow>
          <CCol>
            <SingleSelectDropdown
              options={nameOptions}
              value={selectedName}
              onChange={setSelectedName}
              isClearable
              placeholder="Filter by name..."
            />
          </CCol>
          <CCol>
            <SingleSelectDropdown
              options={modelOptions}
              value={selectedModel}
              onChange={setSelectedModel}
              isClearable
              placeholder="Filter by model..."
            />
          </CCol>
          <CCol>
            <SingleSelectDropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={setSelectedCategory}
              isClearable
              placeholder="Filter by category..."
            />
          </CCol>
        </CRow>

        <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
      </div>

      <Table
        title="Vehicle"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        viewButton={true}
        handleViewButton={handleViewButton}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default VehicleList

// ---------------------------------------------------------------------------------------------

// import React, { useEffect, useMemo, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { fetchVehicles } from '../../slices/vehicleSlice' // Import the fixed fetchVehicles action
// import Table from '../components/Table'
// import { CCol, CRow } from '@coreui/react'
// import SingleSelectDropdown from '../components/SingleSelectDropdown'
// import SearchInput from '../components/SearchInput'
// import { useNavigate } from 'react-router-dom'
// import SmartPagination from '../components/SmartPagination'
// import Loader from '../../components/Loader/Loader'

// function VehicleList() {
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { vehicles, loading, error } = useSelector((state) => state.vehicle) // 🔹 Extract vehicles, loading, and error

//   useEffect(() => {
//     dispatch(fetchVehicles()) // Correctly dispatch async thunk
//   }, [dispatch])

//   // 🔹 Ensure vehicles is always an array to prevent .map() errors
//   const initialData = useMemo(() => {
//     if (!Array.isArray(vehicles)) return []
//     return vehicles.map((item, index) => ({
//       id: item.id || `No ID ${index}`, // Ensure ID exists
//       name: item.name || 'Unknown Driver',
//       model: item.model || 'No Model',
//       category: item.category || 'N/A',
//     }))
//   }, [vehicles])

//   // Search & filter states
//   const [filteredData, setFilteredData] = useState([])
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedName, setSelectedName] = useState(null)
//   const [selectedModel, setSelectedModel] = useState(null)
//   const [selectedCategory, setSelectedCategory] = useState(null)

//   useEffect(() => {
//     setFilteredData(initialData)
//   }, [initialData])

//   // Columns for table
//   const columns = [
//     { label: 'SN', key: 'sn', sortable: true },
//     { label: 'Name', key: 'name', sortable: true },
//     { label: 'Model', key: 'model', sortable: true },
//     { label: 'Category', key: 'category', sortable: true },
//     { label: 'View', key: 'view', sortable: false },
//   ]

//   const handleViewButton = (id) => {
//     navigate(`/VehicleProfile/${id}`)
//   }

//   // Search handler
//   const handleSearch = (query) => {
//     setSearchQuery(query)
//     const filtered = initialData.filter(
//       (item) =>
//         item.name.toLowerCase().includes(query.toLowerCase()) ||
//         item.model.toLowerCase().includes(query.toLowerCase()) ||
//         item.category.toLowerCase().includes(query.toLowerCase()),
//     )
//     setFilteredData(filtered)
//   }

//   // Dropdown filter handler
//   useEffect(() => {
//     let filtered = initialData

//     if (selectedName) {
//       filtered = filtered.filter((item) => item.name === selectedName.value)
//     }
//     if (selectedModel) {
//       filtered = filtered.filter((item) => item.model === selectedModel.value)
//     }
//     if (selectedCategory) {
//       filtered = filtered.filter((item) => item.category === selectedCategory.value)
//     }

//     setFilteredData(filtered)
//   }, [selectedName, selectedModel, selectedCategory, initialData])

//   // Dropdown options
//   const nameOptions = vehicles?.length
//     ? [...new Set(vehicles.map((v) => v.name))].map((name) => ({
//         value: name,
//         label: name,
//       }))
//     : []

//   const modelOptions = vehicles?.length
//     ? [...new Set(vehicles.map((v) => v.model))].map((model) => ({
//         value: model,
//         label: model,
//       }))
//     : []

//   const categoryOptions = vehicles?.length
//     ? [...new Set(vehicles.map((v) => v.category))].map((category) => ({
//         value: category,
//         label: category,
//       }))
//     : []

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(10)
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage)

//   return (
//     <>
//       {loading && <Loader />} {/* 🔹 Show loader while fetching */}
//       {error && <div className="alert alert-danger">{error}</div>}{' '}
//       {/* 🔹 Show error if API fails */}
//       <div className="d-flex justify-content-between mb-3">
//         <CRow>
//           <CCol>
//             <SingleSelectDropdown
//               options={nameOptions}
//               value={selectedName}
//               onChange={setSelectedName}
//               isClearable
//               placeholder="Filter by name..."
//             />
//           </CCol>
//           <CCol>
//             <SingleSelectDropdown
//               options={modelOptions}
//               value={selectedModel}
//               onChange={setSelectedModel}
//               isClearable
//               placeholder="Filter by model..."
//             />
//           </CCol>
//           <CCol>
//             <SingleSelectDropdown
//               options={categoryOptions}
//               value={selectedCategory}
//               onChange={setSelectedCategory}
//               isClearable
//               placeholder="Filter by category..."
//             />
//           </CCol>
//         </CRow>

//         <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
//       </div>
//       <Table
//         title="Vehicle"
//         columns={columns}
//         filteredData={filteredData}
//         setFilteredData={setFilteredData}
//         viewButton={true}
//         handleViewButton={handleViewButton}
//         currentPage={currentPage}
//         itemsPerPage={itemsPerPage}
//       />
//       <SmartPagination
//         totalPages={totalPages}
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//         itemsPerPage={itemsPerPage}
//         onItemsPerPageChange={setItemsPerPage}
//       />
//     </>
//   )
// }

// export default VehicleList
