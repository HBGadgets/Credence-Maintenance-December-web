import React, { useState, useEffect, useMemo } from 'react'
import Table from '../../../components/Table'
import SmartPagination from '../../../components/SmartPagination'
import IconDropdown from '../../../Supervisor/IconDropdown'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import { HiOutlineLogout } from 'react-icons/hi'
import usePdfExporter from '../../../customhooks/usePdfExporter'
import useExcelExporter from '../../../customhooks/useExcelExporter'
import { ToastContainer } from 'react-toastify'

const FuelRecords = ({ records = [] }) => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const columns = [
    { label: 'Date', key: 'date', sortable: true },
    { label: 'Consumption (L)', key: 'consumption', sortable: true },
    { label: 'Distance (km)', key: 'distance', sortable: true },
    { label: 'Driver By Fuel Cost (₹)', key: 'cost', sortable: true },
  ]

  // Transform raw API records to match table format
  const transformedRecords = records.map((r) => ({
    date: r.date,
    consumption: r.dailyFuelConsumption || 0,
    efficiency: r.efficiency || 0,
    distance: r.distance || 0,
    cost: r.fuelExpenses?.reduce((sum, e) => sum + e.amount, 0) || 0,
  }))

  const [filteredData, setFilteredData] = useState(records)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  useEffect(() => {
    setFilteredData(transformedRecords)
  }, [records])

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
            title: 'Vehicle Fuels Report',
            columns,
            data: transformedRecords,
            fileName: 'Vehicle_Fuels_Report',
          }),
      },
      {
        icon: PiMicrosoftExcelLogo,
        label: 'Download Excel',
        onClick: () => {
          exportToExcel({
            title: 'Vehicle Fuels Report',
            columns,
            data: transformedRecords,
            fileName: 'Vehicle_Fuels_Report',
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

      <div className="mt-4">
        <Table
          title="Fuel Records"
          columns={columns}
          filteredData={filteredData}
          setFilteredData={setFilteredData}
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
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

        <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
          <IconDropdown items={dropdownItems} />
        </div>
      </div>
    </>
  )
}

export default FuelRecords
