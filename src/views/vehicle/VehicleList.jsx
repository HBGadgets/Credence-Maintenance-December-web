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

// import React, { useEffect, useMemo, useState } from 'react'
// import { useSelector, useDispatch } from 'react-redux'
// import { fetchVehicles } from '../../slices/vehicleSlice'
// import Table from '../components/Table'
// import { CCol, CRow } from '@coreui/react'
// import SingleSelectDropdown from '../components/SingleSelectDropdown'
// import SearchInput from '../components/SearchInput'
// import { useNavigate } from 'react-router-dom'
// import SmartPagination from '../components/SmartPagination'
// import usePdfExporter from '../customhooks/usePdfExporter'
// import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
// import { PiMicrosoftExcelLogo } from 'react-icons/pi'
// import { HiOutlineLogout } from 'react-icons/hi'
// import IconDropdown from '../Supervisor/IconDropdown'
// import useExcelExporter from '../customhooks/useExcelExporter'

// function VehicleList() {
//   const { exportToPDF } = usePdfExporter()
//   const { exportToExcel } = useExcelExporter()
//   const navigate = useNavigate()
//   const dispatch = useDispatch()
//   const { vehicles, status, error } = useSelector((state) => state.vehicle)
//   console.log('vehiclesssssssssssssss', vehicles)

//   useEffect(() => {
//     if (status === 'idle') {
//       dispatch(fetchVehicles())
//     }
//   }, [dispatch, status])

//   // Memoized vehicle data for rendering
//   const initialData = useMemo(
//     () =>
//       vehicles.map((item, index) => ({
//         // sn: index + 1,
//         name: item.name || 'Unknown Driver',
//         model: item.model || 'No Model',
//         category: item.category || 'N/A',
//         id: item._id || 'No ID',
//       })),
//     [vehicles],
//   )

//   // Search & filter states
//   const [filteredData, setFilteredData] = useState([])
//   const [searchQuery, setSearchQuery] = useState('')
//   const [selectedName, setSelectedName] = useState(null)
//   const [selectedModel, setSelectedModel] = useState(null)
//   const [selectedCategory, setSelectedCategory] = useState(null)
//   const [isFetching, setIsFetching] = useState(true)

//   useEffect(() => {
//     setFilteredData(initialData)
//   }, [initialData])

//   // Columns for table
//   const columns = [
//     { label: 'Name', key: 'name', sortable: true },
//     { label: 'Model', key: 'model', sortable: true },
//     { label: 'Category', key: 'category', sortable: true },
//   ]

//   const handleViewButton = (id) => {
//     console.log('SSSSSSSSSSSSSSSSSss', id)
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
//     setIsFetching(true) // Start loading
//     try {
//       let filtered = initialData

//       if (selectedName) {
//         filtered = filtered.filter((item) => item.name === selectedName.value)
//       }
//       if (selectedModel) {
//         filtered = filtered.filter((item) => item.model === selectedModel.value)
//       }
//       if (selectedCategory) {
//         filtered = filtered.filter((item) => item.category === selectedCategory.value)
//       }

//       setFilteredData(filtered)
//     } catch (error) {
//       console.error('Filtering error:', error)
//     } finally {
//       setTimeout(() => setIsFetching(false), 300) // Optional delay for smoother UX
//     }
//   }, [selectedName, selectedModel, selectedCategory, initialData])

//   // Dropdown options
//   const nameOptions = [...new Set(vehicles.map((v) => v.name))].map((name) => ({
//     value: name,
//     label: name,
//   }))
//   const modelOptions = [...new Set(vehicles.map((v) => v.model))].map((model) => ({
//     value: model,
//     label: model,
//   }))
//   const categoryOptions = [...new Set(vehicles.map((v) => v.category))].map((category) => ({
//     value: category,
//     label: category,
//   }))

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1)
//   const [itemsPerPage, setItemsPerPage] = useState(10)
//   const totalPages = Math.ceil(filteredData.length / itemsPerPage)

//   // Dropdown items for export
//   const dropdownItems = [
//     {
//       icon: FaRegFilePdf,
//       label: 'Download PDF',
//       onClick: () =>
//         exportToPDF({
//           title: 'Vehicle Report', // Dynamic title
//           columns: columns,
//           data: filteredData,
//           fileName: 'Vehicle_Report', // Dynamic file name
//         }),
//     },
//     {
//       icon: PiMicrosoftExcelLogo,
//       label: 'Download Excel',
//       onClick: () =>
//         exportToExcel({
//           title: 'Vehicle Report', // Dynamic title
//           columns: columns,
//           data: filteredData,
//           fileName: 'Vehicle_Report', // Dynamic file name
//         }),
//     },
//     {
//       icon: FaPrint,
//       label: 'Print Page',
//       onClick: () => window.print(),
//     },
//     {
//       icon: HiOutlineLogout,
//       label: 'Logout',
//       onClick: () => handleLogout(),
//     },
//     {
//       icon: FaArrowUp,
//       label: 'Scroll To Top',
//       onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
//     },
//   ]

//   // if (status === 'loading')
//   //   return (
//   //     <div
//   //       style={{
//   //         position: 'absolute',
//   //         top: '50%',
//   //         left: '50%',
//   //         transform: 'translate(-50%, -50%)',
//   //       }}
//   //     >
//   //       <Loader />
//   //     </div>
//   //   )
//   if (status === 'failed') return <p>Error: {error}</p>

//   return (
//     <>
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
//           {/* <CCol>
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
//           </CCol> */}
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
//         isFetching={isFetching}
//       />

//       <SmartPagination
//         totalPages={totalPages}
//         currentPage={currentPage}
//         onPageChange={setCurrentPage}
//         itemsPerPage={itemsPerPage}
//         onItemsPerPageChange={setItemsPerPage}
//       />

//       <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
//         <IconDropdown items={dropdownItems} />
//       </div>
//     </>
//   )
// }

// export default VehicleList

// ---------------------------------------------------------------------------------------------

// new with fetch api

import { useQuery } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import { useContext, useEffect, useMemo, useState } from 'react'
import { fetchVehicles } from './data/VehicleListData'
import SearchInput from '../components/SearchInput'
import { ToastContainer } from 'react-toastify'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import IconDropdown from '../Supervisor/IconDropdown'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'
import SingleSelectDropdown from '../components/SingleSelectDropdown' // Make sure this exists
import { TokenContext } from '../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'

const VehicleList = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedName, setSelectedName] = useState(null)
  const [nameOptions, setNameOptions] = useState([])

  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  const navigate = useNavigate()

  const { data: vehicles = [], isFetching } = useQuery({
    queryKey: ['vehicles'],
    queryFn: fetchVehicles,
    staleTime: 1000 * 60 * 30, // Cache data for 30 minutes
  })

  // Set name filter options
  useEffect(() => {
    const usernames = [...new Set(vehicles.map((v) => v.username).filter(Boolean))]
    const options = usernames.map((name) => ({ label: name, value: name }))
    setNameOptions(options)
  }, [vehicles])

  // Filtering logic
  useEffect(() => {
    let updatedData = [...vehicles]

    if (searchQuery) {
      const lower = searchQuery.toLowerCase()
      updatedData = updatedData.filter((item) =>
        Object.values(item).some(
          (value) => typeof value === 'string' && value.toLowerCase().includes(lower),
        ),
      )
    }

    if (selectedName) {
      updatedData = updatedData.filter((item) => item.username === selectedName.value)
    }

    setFilteredData(updatedData)
  }, [vehicles, searchQuery, selectedName])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  const columns = [
    { label: 'Vehicle', key: 'name', sortable: true },
    { label: 'Model', key: 'model', sortable: true },
    { label: 'Category', key: 'category', sortable: true },
    { label: 'Username', key: 'username', sortable: true },
  ]

  const handleSearch = (query) => {
    setSearchQuery(query)
  }

  const handleViewButton = (id) => {
    navigate(`/VehicleProfile/${id}`)
  }

  const handleLogout = () => {
    sessionStorage.clear()
    localStorage.clear()
    document.cookie.split(';').forEach((c) => {
      const base = c.trim().split('=')[0]
      document.cookie = `${base}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
    })
    window.history.replaceState(null, '', '/')
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL
  }

  const dropdownItems = useMemo(
    () => [
      {
        icon: FaRegFilePdf,
        label: 'Download PDF',
        onClick: () =>
          exportToPDF({
            title: 'All Vehicle List Report',
            columns,
            data: filteredData,
            fileName: 'Vehicle_List_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () =>
          exportToExcel({
            title: 'All Vehicle List Report',
            columns,
            data: filteredData,
            fileName: 'Vehicle_List_Report',
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
    ],
    [filteredData, columns, exportToPDF, exportToExcel],
  )

  return (
    <>
      <ToastContainer />

      {/* Search & Filter Bar */}
      <div className="row mb-3 align-items-center">
        {userRole === 'superadmin' && (
          <div className="col-12 col-md-4 mb-2 mb-md-0">
            <SingleSelectDropdown
              options={nameOptions}
              value={selectedName}
              onChange={setSelectedName}
              isClearable
              placeholder="Filter by Supervisor Name..."
            />
          </div>
        )}

        <div className={`col-12 ${userRole === 'superadmin' ? 'col-md-8' : 'col-md-12'}`}>
          <div className="d-flex justify-content-end">
            <SearchInput searchQuery={searchQuery} setSearchQuery={handleSearch} />
          </div>
        </div>
      </div>

      {/* Responsive Table */}
      <div className="table-responsive w-100">
        <Table
          title="Vehicle"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          viewButton={true}
          handleViewButton={handleViewButton}
          isFetching={isFetching}
          action="Details"
        />

        {/* Pagination */}
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
      </div>

      {/* Floating Dropdown */}
      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default VehicleList
