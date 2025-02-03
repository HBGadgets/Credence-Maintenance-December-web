import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FileText } from 'lucide-react'
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react'

const DocumentLocker = ({ documents }) => {
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [drivers, setDrivers] = useState([]) // Use state for the driver list

  const handleViewClick = (driver) => {
    setSelectedDriver(driver)
    setOpen(true)
  }

  const refreshDrivers = () => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/drivers`) // Replace with your API URL
      .then((response) => {
        console.log('response', response.data)

        setDrivers(response.data) // Set drivers data from API
      })
      .catch((error) => {
        console.error('Error fetching drivers:', error)
      })
  }
  // Initial fetch of drivers
  useEffect(() => {
    refreshDrivers()
  }, [])

  const documentCards = [
    {
      title: 'Aadhar Card',
      image: documents.aadharImage,
      description: 'Government issued identification card',
    },
    {
      title: 'Driving License',
      image: documents.licenseImage,
      description: 'Commercial driving license',
    },
    {
      title: 'TP Pass',
      image: documents.tpPass,
      description: 'Transport permit pass',
    },
  ]

  return (
    <div className="mt-4">
      <h2 className="fs-4 fw-bold mb-4 text-primary">Document Locker</h2>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        {documentCards.map((doc) => (
          <div
            key={doc.title}
            className="col"
            onClick={() => setSelectedDoc(doc.image)}
            style={{ cursor: 'pointer' }}
          >
            <div
              className="card h-100 border-0 shadow-sm hover-shadow transition-transform"
              style={{
                transform: 'scale(1)',
                transition: 'transform 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <div className="card-body text-center">
                <div
                  className="d-flex align-items-center justify-content-center bg-light rounded-circle mb-3 mx-auto"
                  style={{
                    width: '60px',
                    height: '60px',
                  }}
                >
                  {console.log(drivers[0])}
                  {/* <img src={drivers.aadharImage} className="img-fluid" /> */}

                  <FileText className="text-primary fs-4" />
                </div>
                <h5 className="card-title fw-semibold">{doc.title}</h5>
                <p className="card-text text-muted small">{doc.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Document Preview */}
      <CModal visible={!!selectedDoc} onClose={() => setSelectedDoc(null)} alignment="center">
        <CModalHeader closeButton>
          <CModalTitle>Document View</CModalTitle>
        </CModalHeader>
        <CModalBody className="d-flex align-items-center justify-content-center">
          {selectedDoc && (
            <img
              src={selectedDoc}
              alt="Document"
              className="img-fluid rounded shadow"
              style={{ maxHeight: '80vh', maxWidth: '100%' }}
            />
          )}
          {selectedDriver && (
            <CImage
              src={selectedDriver.profileImage || '/default-avatar.png'} // Default image fallback
              alt={selectedDriver.name}
              className="img-thumbnail rounded-circle me-3"
              width="120" //Set the desired width
              height="120" //Set the desired height
            />
          )}
        </CModalBody>
      </CModal>
    </div>
  )
}

export default DocumentLocker
