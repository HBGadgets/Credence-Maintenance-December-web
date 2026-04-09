import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Spinner, Alert, ProgressBar, Tabs, Tab } from 'react-bootstrap'
import {
  FaDownload,
  FaExternalLinkAlt,
  FaTimes,
  FaImage,
  FaExclamationTriangle,
  FaFilePdf,
  FaCompressAlt,
  FaExpandAlt,
  FaRegFileAlt,
} from 'react-icons/fa'

const AcknowledgementImage = ({ show, onHide, imageUrl }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [fileError, setFileError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [fileInfo, setFileInfo] = useState(null)
  const [fileType, setFileType] = useState(null)
  const [activeTab, setActiveTab] = useState('preview')
  const [isZoomed, setIsZoomed] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [fileSize, setFileSize] = useState(null)
  const [useIframe, setUseIframe] = useState(false)

  const imageRef = useRef(null)
  const modalBodyRef = useRef(null)
  const iframeRef = useRef(null)

  useEffect(() => {
    if (imageUrl && show) {
      loadFileInfo()
    }
  }, [imageUrl, show])

  useEffect(() => {
    if (!show) {
      resetStates()
    }
  }, [show])

  const resetStates = () => {
    setIsLoading(true)
    setFileError(false)
    setErrorMessage('')
    setFileInfo(null)
    setFileType(null)
    setActiveTab('preview')
    setIsZoomed(false)
    setDownloadProgress(0)
    setUseIframe(false)
  }

  const getFullFileUrl = () => {
    if (!imageUrl) return ''

    if (
      imageUrl.startsWith('http://') ||
      imageUrl.startsWith('https://') ||
      imageUrl.startsWith('data:')
    ) {
      return imageUrl
    }

    if (imageUrl.startsWith('/uploads')) {
      return `${import.meta.env.VITE_API_URL || ''}${imageUrl}`
    }

    return `${import.meta.env.VITE_API_URL || ''}/uploads/${imageUrl}`
  }

  const loadFileInfo = async () => {
    setIsLoading(true)
    setFileError(false)
    setErrorMessage('')
    const fullUrl = getFullFileUrl()

    try {
      const fileName = getFileName()
      const extension = fileName.split('.').pop().toLowerCase()

      if (['pdf'].includes(extension)) {
        setFileType('pdf')
        // Just set loading to false, don't try to load PDF.js
        setIsLoading(false)
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'].includes(extension)) {
        setFileType('image')
        setIsLoading(false)
      } else {
        setFileType('unknown')
        setIsLoading(false)
      }

      // Get file size
      try {
        const response = await fetch(fullUrl, { method: 'HEAD' })
        if (response.headers.get('content-length')) {
          const size = parseInt(response.headers.get('content-length'))
          setFileSize(formatFileSize(size))
        }
      } catch (error) {
        console.log('Could not fetch file size:', error)
      }

      setFileInfo({
        url: fullUrl,
        name: fileName,
        extension: extension,
      })
    } catch (error) {
      console.error('Error loading file info:', error)
      setFileError(true)
      setErrorMessage(error.message || 'Failed to load file')
      setIsLoading(false)
    }
  }

  const getFileName = () => {
    if (!imageUrl) return 'acknowledgement-file'

    let cleanUrl = imageUrl
    if (cleanUrl.includes('chrome-extension://')) {
      const match = cleanUrl.match(/chrome-extension:\/\/[^/]+\/(.+)/)
      if (match && match[1]) {
        cleanUrl = match[1]
      }
    }

    try {
      const url = new URL(cleanUrl)
      const pathParts = url.pathname.split('/')
      const fileName = pathParts[pathParts.length - 1]
      return decodeURIComponent(fileName) || `acknowledgement.${fileType || 'jpg'}`
    } catch (error) {
      const parts = cleanUrl.split('/')
      const fileName = parts[parts.length - 1]
      return decodeURIComponent(fileName) || `acknowledgement.${fileType || 'jpg'}`
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async () => {
    const fullUrl = getFullFileUrl()
    const fileName = getFileName()

    try {
      const response = await fetch(fullUrl)

      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.status}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
      window.open(fullUrl, '_blank')
    }
  }

  const toggleZoom = () => {
    setIsZoomed(!isZoomed)
    if (imageRef.current && fileType === 'image') {
      if (!isZoomed) {
        imageRef.current.style.maxHeight = 'none'
        imageRef.current.style.cursor = 'zoom-out'
        if (modalBodyRef.current) {
          modalBodyRef.current.scrollTop = 0
        }
      } else {
        imageRef.current.style.maxHeight = '65vh'
        imageRef.current.style.cursor = 'zoom-in'
      }
    }
  }

  const openInBrowser = () => {
    const fullUrl = getFullFileUrl()
    window.open(fullUrl, '_blank', 'noopener,noreferrer')
  }

  const renderImage = () => (
    <div className="image-container" style={{ textAlign: 'center' }}>
      <img
        ref={imageRef}
        src={getFullFileUrl()}
        alt="Acknowledgement"
        className="img-fluid"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setFileError(true)
          setErrorMessage('Failed to load image')
          setIsLoading(false)
        }}
        style={{
          maxHeight: '65vh',
          maxWidth: '100%',
          objectFit: 'contain',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          cursor: 'zoom-in',
          transition: 'all 0.3s ease',
        }}
        onClick={toggleZoom}
      />
    </div>
  )

  const renderPDFWithIframe = () => (
    <div className="pdf-container" style={{ textAlign: 'center' }}>
      <div className="alert alert-info mb-3">
        <FaRegFileAlt className="me-2" />
        <strong>PDF Viewer:</strong> Use the controls below to navigate or open in a new tab for
        better viewing.
      </div>

      <div className="pdf-controls mb-3">
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
          <Button variant="outline-primary" size="sm" onClick={openInBrowser}>
            <FaExternalLinkAlt className="me-2" />
            Open in New Tab
          </Button>

          <Button variant="outline-success" size="sm" onClick={handleDownload}>
            <FaDownload className="me-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div
        className="pdf-viewer"
        style={{
          position: 'relative',
          paddingBottom: '75%',
          height: 0,
          overflow: 'hidden',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa',
        }}
      >
        <iframe
          ref={iframeRef}
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(getFullFileUrl())}&embedded=true`}
          title="PDF Viewer"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
          }}
          onError={() => {
            console.log('Google Docs viewer failed, falling back to direct link')
            if (iframeRef.current) {
              iframeRef.current.src = getFullFileUrl()
            }
          }}
        />
      </div>

      <div className="mt-3 text-muted small">
        <Alert variant="secondary" className="mb-0">
          <small>
            <strong>Note:</strong> If the PDF doesn't display above, click "Open in New Tab" to view
            directly in your browser.
          </small>
        </Alert>
      </div>
    </div>
  )

  const renderPDFDirect = () => (
    <div className="pdf-container" style={{ textAlign: 'center' }}>
      <div className="pdf-controls mb-3">
        <div className="d-flex justify-content-center align-items-center gap-2 flex-wrap">
          <Button variant="primary" onClick={openInBrowser}>
            <FaExternalLinkAlt className="me-2" />
            Open PDF in Browser
          </Button>

          <Button variant="outline-success" onClick={handleDownload}>
            <FaDownload className="me-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <div
        className="pdf-preview-placeholder"
        style={{
          minHeight: '400px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '2px dashed #dee2e6',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa',
          padding: '40px',
        }}
      >
        <div className="text-center">
          <FaFilePdf size={80} className="text-danger mb-3" />
          <h5>PDF Document Ready</h5>
          <p className="text-muted">
            Click the button above to view the PDF in your browser's native PDF viewer.
          </p>
          <Button variant="danger" onClick={openInBrowser}>
            <FaExternalLinkAlt className="me-2" />
            View PDF Document
          </Button>
        </div>
      </div>
    </div>
  )

  const renderPDF = () => {
    // Use iframe with Google Docs viewer as fallback
    return renderPDFWithIframe()
  }

  const renderFileInfo = () => {
    const fileName = getFileName()
    const extension = fileName.split('.').pop().toUpperCase()

    return (
      <div className="file-info p-3 border rounded bg-light">
        <div className="row">
          <div className="col-md-6">
            <p className="mb-1">
              <strong>File Name:</strong>
            </p>
            <p className="text-truncate">{fileName}</p>
          </div>
          <div className="col-md-3">
            <p className="mb-1">
              <strong>Type:</strong>
            </p>
            <p className="text-uppercase">{extension}</p>
          </div>
          <div className="col-md-3">
            <p className="mb-1">
              <strong>Size:</strong>
            </p>
            <p>{fileSize || 'Unknown'}</p>
          </div>
        </div>
        {fileInfo?.url && (
          <div className="mt-2">
            <p className="mb-1">
              <strong>URL:</strong>
            </p>
            <small className="text-muted text-break">{fileInfo.url}</small>
          </div>
        )}
        <div className="mt-3">
          <Button variant="primary" onClick={openInBrowser} className="me-2">
            <FaExternalLinkAlt className="me-1" />
            Open in Browser
          </Button>
          <Button variant="outline-primary" onClick={handleDownload}>
            <FaDownload className="me-1" />
            Download
          </Button>
        </div>
      </div>
    )
  }

  const renderContent = () => {
    if (isLoading) {
      return (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ minHeight: '400px' }}
        >
          <div className="text-center">
            <Spinner animation="border" role="status" variant="primary" size="lg" />
            <p className="mt-3">Loading file...</p>
          </div>
        </div>
      )
    }

    if (fileError) {
      return (
        <div className="text-center py-5">
          <FaExclamationTriangle size={64} className="text-warning mb-3" />
          <h5>File Not Available</h5>
          <p className="text-muted">
            {errorMessage || 'The acknowledgement file could not be loaded.'}
          </p>
          <div className="mt-4">
            <Button variant="primary" onClick={openInBrowser} className="me-2">
              <FaExternalLinkAlt className="me-2" />
              Open in Browser
            </Button>
            <Button variant="outline-secondary" onClick={loadFileInfo}>
              Retry
            </Button>
          </div>
        </div>
      )
    }

    if (fileType === 'pdf') {
      return renderPDF()
    } else if (fileType === 'image') {
      return renderImage()
    } else {
      return (
        <div className="text-center py-5">
          <FaFilePdf size={64} className="text-primary mb-3" />
          <h5>Unsupported File Type</h5>
          <p className="text-muted">This file type cannot be previewed.</p>
          <div className="mt-4">
            <Button variant="primary" onClick={handleDownload}>
              <FaDownload className="me-2" />
              Download File
            </Button>
          </div>
        </div>
      )
    }
  }

  if (!imageUrl || !show) return null

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      keyboard={false}
      fullscreen={isZoomed && fileType === 'image'}
    >
      <Modal.Header closeButton={!isZoomed}>
        <Modal.Title className="d-flex align-items-center">
          {fileType === 'pdf' ? (
            <FaFilePdf className="me-2 text-danger" />
          ) : (
            <FaImage className="me-2 text-primary" />
          )}
          <div>
            <h5 className="mb-0">Acknowledgement File</h5>
            <small className="text-muted">{getFileName()}</small>
          </div>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body ref={modalBodyRef} style={{ maxHeight: '70vh', overflow: 'auto' }}>
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="preview" title="Preview">
            {renderContent()}
          </Tab>
          <Tab eventKey="info" title="File Info">
            {renderFileInfo()}
          </Tab>
        </Tabs>
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100 align-items-center">
          <div>
            <Button variant="outline-secondary" onClick={onHide}>
              <FaTimes className="me-2" />
              Close
            </Button>
          </div>

          <div className="d-flex gap-2">
            {fileType === 'image' && !isLoading && !fileError && (
              <Button variant="outline-primary" onClick={toggleZoom}>
                {isZoomed ? <FaCompressAlt className="me-2" /> : <FaExpandAlt className="me-2" />}
                {isZoomed ? 'Zoom Out' : 'Zoom In'}
              </Button>
            )}

            <Button variant="primary" onClick={openInBrowser} disabled={isLoading}>
              <FaExternalLinkAlt className="me-2" />
              Open in Browser
            </Button>

            <Button variant="primary" onClick={handleDownload} disabled={isLoading || fileError}>
              <FaDownload className="me-2" />
              Download
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

export default AcknowledgementImage
