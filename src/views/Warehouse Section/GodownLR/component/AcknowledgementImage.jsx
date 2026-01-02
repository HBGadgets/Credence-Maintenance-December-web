import React from 'react'
import { Modal, Button, Spinner } from 'react-bootstrap'
import { FaDownload, FaExternalLinkAlt, FaTimes } from 'react-icons/fa'

const AcknowledgementImage = ({ show, onHide, imageUrl }) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [imageError, setImageError] = React.useState(false)

  if (!imageUrl) return null

  // Construct full URL with API base URL
  const fullImageUrl = `${import.meta.env.VITE_API_URL}${imageUrl}`

  // Extract filename from URL for download
  const getFileName = () => {
    const parts = imageUrl.split('/')
    return parts[parts.length - 1] || 'acknowledgement-image.jpg'
  }

  const handleDownload = () => {
    fetch(fullImageUrl)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.download = getFileName()
        document.body.appendChild(link)
        link.click()
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)
      })
      .catch((error) => {
        console.error('Download failed:', error)
        // Fallback to opening in new tab if download fails
        window.open(fullImageUrl, '_blank')
      })
  }

  const handleImageLoad = () => {
    setIsLoading(false)
    setImageError(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setImageError(true)
  }

  // Modal styles
  const modalStyles = {
    content: {
      borderRadius: '16px',
      border: 'none',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
    },
    header: {
      padding: '1.5rem 1.5rem 0.5rem',
      borderBottom: 'none',
    },
    body: {
      padding: '0 1.5rem',
    },
    footer: {
      padding: '0.5rem 1.5rem 1.5rem',
      borderTop: 'none',
    },
  }

  // Container styles
  const containerStyles = {
    position: 'relative',
    minHeight: '300px',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  }

  // Loading overlay styles
  const loadingOverlayStyles = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.9)',
    zIndex: 10,
    borderRadius: '12px',
  }

  // Error placeholder styles
  const errorPlaceholderStyles = {
    textAlign: 'center',
    padding: '40px 20px',
  }

  // Image container styles
  const imageContainerStyles = {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'auto',
    cursor: 'move',
  }

  // Error icon styles
  const errorIconStyles = {
    color: '#6c757d',
    opacity: 0.5,
  }

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header style={modalStyles.header}>
        <Modal.Title className="d-flex align-items-center justify-content-between w-100">
          <div>
            <h5 className="mb-0" style={{ fontWeight: '600' }}>
              Acknowledgement Image
            </h5>
            <small className="text-muted" style={{ fontSize: '0.85rem' }}>
              {getFileName()}
            </small>
          </div>
          <Button
            variant="link"
            onClick={onHide}
            className="text-dark p-0"
            style={{ fontSize: '1.5rem', opacity: 0.7 }}
          >
            <FaTimes />
          </Button>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={modalStyles.body}>
        <div style={containerStyles}>
          {isLoading && (
            <div style={loadingOverlayStyles}>
              <Spinner animation="border" role="status" variant="primary">
                <span className="visually-hidden">Loading image...</span>
              </Spinner>
              <p className="mt-2 mb-0" style={{ color: '#6c757d' }}>
                Loading image...
              </p>
            </div>
          )}

          {imageError ? (
            <div style={errorPlaceholderStyles}>
              <div style={errorIconStyles}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h5 className="mt-3" style={{ fontWeight: '500' }}>
                Image Not Available
              </h5>
              <p className="text-muted">The acknowledgement image could not be loaded.</p>
              <Button
                variant="outline-secondary"
                onClick={() => window.open(fullImageUrl, '_blank')}
                className="mt-2"
                style={{ borderRadius: '8px' }}
              >
                Try Opening in New Tab
              </Button>
            </div>
          ) : (
            <div style={imageContainerStyles}>
              <img
                src={fullImageUrl}
                alt="Acknowledgement"
                className={`img-fluid ${isLoading ? 'd-none' : 'd-block'}`}
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{
                  maxHeight: '65vh',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  margin: '0 auto',
                  display: 'block',
                }}
              />
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer style={modalStyles.footer}>
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div>
            {' '}
            <Button
              variant="outline-primary"
              onClick={() => window.open(fullImageUrl, '_blank')}
              className="d-flex align-items-center gap-2"
              style={{ borderRadius: '8px', padding: '8px 16px' }}
            >
              <FaExternalLinkAlt /> Open
            </Button>
          </div>
          <div className="d-flex gap-2">
            <Button
              variant="primary"
              onClick={handleDownload}
              className="d-flex align-items-center gap-2"
              style={{
                borderRadius: '8px',
                padding: '8px 16px',
                background: '#0d6efd',
                borderColor: '#0d6efd',
              }}
              disabled={imageError}
            >
              <FaDownload /> Download
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default AcknowledgementImage
