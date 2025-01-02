import React, { useState } from 'react'
import {
  TableContainer,
  Paper,
  IconButton,
  Typography,
  Button,
  InputBase,
  Modal,
  Box,
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import {
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import signature from './Signature/signature.svg'

const data = [
  {
    Date: '10-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '76 km',
    GpsKm: '76km',
  },
  {
    Date: '10-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '86 km',
    GpsKm: '96km',
  },
  {
    Date: '11-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '46 km',
    GpsKm: '76km',
  },
  {
    Date: '12-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '36 km',
    GpsKm: '70km',
  },
  {
    Date: '13-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '86 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
  {
    Date: '14-12-24',
    Tripstart: '11-09-24 5:00 am',
    TripEnd: '12-09-2024 8:00 pm',
    LogKm: '98 km',
    GpsKm: '100km',
  },
]

const LogBook = () => {
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [openModal, setOpenModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const recordsPerPage = 10

  const handleSearchIconClick = () => {
    setShowSearch(!showSearch)
    if (!showSearch) setSearchQuery('')
  }

  // Filter data based on search query
  const filteredData = data.filter((item) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      item.Date.toLowerCase().includes(searchLower) ||
      item.Tripstart.toLowerCase().includes(searchLower) ||
      item.TripEnd.toLowerCase().includes(searchLower)
    )
  })

  const npage = Math.ceil(filteredData.length / recordsPerPage)
  const lastIndex = currentPage * recordsPerPage
  const firstIndex = lastIndex - recordsPerPage
  const records = filteredData.slice(firstIndex, lastIndex)
  const numbers = [...Array(npage + 1).keys()].slice(1)

  const handleOpenModal = (image) => {
    setSelectedImage(image)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
    setSelectedImage('')
  }

  const prePage = () => {
    setCurrentPage((prevPage) => (prevPage > 1 ? prevPage - 1 : prevPage))
  }

  const nextPage = () => {
    setCurrentPage((prevPage) => (prevPage < npage ? prevPage + 1 : prevPage))
  }

  const changeCPage = (e, id) => {
    e.preventDefault()
    setCurrentPage(id)
  }

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingBottom: '10px',
        }}
      >
        <Typography variant="h4" gutterBottom>
          Log Book
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {showSearch && (
            <InputBase
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                marginRight: '5px',
                backgroundColor: '#f0f0f0',
                borderRadius: '3px',
                padding: '5px 10px',
              }}
            />
          )}
          <IconButton onClick={handleSearchIconClick} style={{ color: 'grey' }}>
            <SearchIcon />
          </IconButton>
        </div>
      </div>

      <div
        style={{
          overflowX: 'auto',
          backgroundColor: '#212631',
          borderRadius: '10px',
        }}
      >
        <TableContainer component={Paper} style={{ width: '100%' }}>
          <CTable align="middle" className="mb-0 border" hover responsive>
            <CTableHead className="text-nowrap">
              <CTableRow>
                <CTableHeaderCell className="bg-body-tertiary text-center">Date</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  Trip Start
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">
                  Trip End
                </CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Log Km</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">GPS Km</CTableHeaderCell>
                <CTableHeaderCell className="bg-body-tertiary text-center">Sign</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {records.map((item, index) => (
                <CTableRow key={index}>
                  <CTableDataCell className="text-center">{item.Date}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.Tripstart}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.TripEnd}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.LogKm}</CTableDataCell>
                  <CTableDataCell className="text-center">{item.GpsKm}</CTableDataCell>
                  <CTableDataCell className="text-center">
                    <Button variant="text" onClick={() => handleOpenModal(signature)}>
                      View Sign
                    </Button>
                  </CTableDataCell>
                </CTableRow>
              ))}
            </CTableBody>
          </CTable>
        </TableContainer>
        <nav>
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={prePage} disabled={currentPage === 1}>
                Prev
              </button>
            </li>
            {numbers.map((n) => (
              <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
                <button className="page-link" onClick={(e) => changeCPage(e, n)}>
                  {n}
                </button>
              </li>
            ))}
            <li className={`page-item ${currentPage === npage ? 'disabled' : ''}`}>
              <button className="page-link" onClick={nextPage} disabled={currentPage === npage}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Modal for Image */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: '10px',
          }}
        >
          <img
            src={selectedImage}
            alt="Signature"
            style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
        </Box>
      </Modal>
    </div>
  )
}

export default LogBook
