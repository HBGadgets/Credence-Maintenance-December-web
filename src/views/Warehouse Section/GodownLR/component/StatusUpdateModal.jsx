// StatusUpdateModal.jsx
import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Form, Badge, ProgressBar } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { FaEye, FaFilePdf, FaSpinner, FaCompressAlt } from 'react-icons/fa'

const StatusUpdateModal = ({ show, onHide, onSubmit, isLoading, currentStatus, recordData }) => {
  const [status, setStatus] = useState(currentStatus === 'Completed' ? 'Completed' : 'Pending')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const isSubmittingRef = useRef(false)
  const modalBodyRef = useRef(null)

  // Check if record already has an acknowledgement image
  const hasExistingImage = recordData?.acknowledgementImage

  useEffect(() => {
    if (show) {
      setStatus(currentStatus === 'Completed' ? 'Completed' : 'Pending')
      setImage(null)
      setImagePreview(null)
      setIsSubmitting(false)
      setIsCompressing(false)
      setCompressionProgress(0)
      setOriginalSize(0)
      setCompressedSize(0)
      isSubmittingRef.current = false

      // Scroll to top when modal opens
      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTop = 0
      }
    }
  }, [show, currentStatus])

  // Function to compress image
  const compressImage = async (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)

      reader.onload = (event) => {
        const img = new Image()
        img.src = event.target.result

        img.onload = () => {
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          const maxDimension = 1024 // Max width/height

          // Calculate new dimensions while maintaining aspect ratio
          if (width > height) {
            if (width > maxDimension) {
              height = Math.round((height * maxDimension) / width)
              width = maxDimension
            }
          } else {
            if (height > maxDimension) {
              width = Math.round((width * maxDimension) / height)
              height = maxDimension
            }
          }

          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          ctx.drawImage(img, 0, 0, width, height)

          // Compress with quality
          let quality = 0.9
          let compressedDataUrl
          let blob

          // Try multiple quality levels to get under 50KB
          const compressAttempt = (currentQuality) => {
            compressedDataUrl = canvas.toDataURL('image/jpeg', currentQuality)

            // Convert base64 to blob to check size
            const byteString = atob(compressedDataUrl.split(',')[1])
            const mimeString = compressedDataUrl.split(',')[0].split(':')[1].split(';')[0]
            const ab = new ArrayBuffer(byteString.length)
            const ia = new Uint8Array(ab)

            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i)
            }

            blob = new Blob([ab], { type: mimeString })
            const sizeInKB = blob.size / 1024

            setCompressedSize(Math.round(sizeInKB))
            setCompressionProgress(Math.round((currentQuality / 0.9) * 100))

            if (sizeInKB > 50 && currentQuality > 0.1) {
              // Reduce quality and try again
              setTimeout(() => compressAttempt(currentQuality - 0.1), 50)
            } else {
              // Create file from blob
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })

              resolve(compressedFile)
            }
          }

          // Start compression
          compressAttempt(quality)
        }

        img.onerror = reject
      }

      reader.onerror = reject
    })
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload only JPG, PNG, or PDF files',
      })
      return
    }

    // Validate file size (original file should not be too large)
    if (file.size > 10 * 1024 * 1024) {
      // 10MB max original size
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Original file size should be less than 10MB',
      })
      return
    }

    // Set original size
    const originalSizeKB = file.size / 1024
    setOriginalSize(Math.round(originalSizeKB))

    // Handle PDF files (no compression needed, just validation)
    if (file.type === 'application/pdf') {
      if (file.size > 50 * 1024) {
        // PDFs also need to be under 50KB
        Swal.fire({
          icon: 'error',
          title: 'PDF Too Large',
          text: 'PDF file must be under 50KB',
        })
        return
      }
      setImage(file)
      setImagePreview(null)
      setCompressedSize(Math.round(originalSizeKB))
      return
    }

    // For images, start compression
    setIsCompressing(true)
    setCompressionProgress(0)

    try {
      // Compress image
      const compressedFile = await compressImage(file)

      // Verify compressed size
      const finalSizeKB = compressedFile.size / 1024

      if (finalSizeKB > 50) {
        Swal.fire({
          icon: 'error',
          title: 'Compression Failed',
          text: 'Unable to compress image to under 50KB. Please try a smaller image.',
        })
        setIsCompressing(false)
        return
      }

      setImage(compressedFile)

      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
        setIsCompressing(false)
      }
      reader.readAsDataURL(compressedFile)
    } catch (error) {
      console.error('Compression error:', error)
      Swal.fire({
        icon: 'error',
        title: 'Compression Error',
        text: 'Failed to compress image. Please try again.',
      })
      setIsCompressing(false)
    }
  }

  const handleSubmit = async () => {
    // Prevent multiple submissions
    if (isSubmittingRef.current || isLoading || isCompressing) return

    // Validate image size (should already be compressed, but double-check)
    if (image && image.type.startsWith('image/') && image.size > 50 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Image Too Large',
        text: 'Compressed image is still over 50KB. Please try again.',
      })
      return
    }

    // Set submitting state
    setIsSubmitting(true)
    isSubmittingRef.current = true

    const formData = new FormData()
    formData.append('status', status)
    if (image) {
      formData.append('acknowledgementImage', image)
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      // Reset submitting state on error
      setIsSubmitting(false)
      isSubmittingRef.current = false
    }
  }

  const handleClose = () => {
    // Only allow closing if not submitting or compressing
    if (!isSubmitting && !isLoading && !isCompressing) {
      setStatus(currentStatus === 'Completed' ? 'Completed' : 'Pending')
      setImage(null)
      setImagePreview(null)
      setIsCompressing(false)
      setCompressionProgress(0)
      setOriginalSize(0)
      setCompressedSize(0)
      onHide()
    }
  }

  // Function to view existing image
  const viewExistingImage = () => {
    if (hasExistingImage) {
      if (hasExistingImage.startsWith('data:') || hasExistingImage.startsWith('http')) {
        window.open(hasExistingImage, '_blank')
      } else {
        const imageUrl = `${import.meta.env.VITE_API_URL || ''}/uploads/${hasExistingImage}`
        window.open(imageUrl, '_blank')
      }
    }
  }

  // Determine if image upload field should be shown
  // Now shows for both Completed and Cancelled status
  const shouldShowImageUpload = () => {
    return status === 'Completed' || status === 'Cancelled'
  }

  // Combined processing state
  const isProcessing = isLoading || isSubmitting || isCompressing

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop={isProcessing ? 'static' : true}
      size="lg"
    >
      <Modal.Header closeButton={!isProcessing} className="border-bottom-0 pb-0">
        <Modal.Title>Update Status</Modal.Title>
      </Modal.Header>

      <Modal.Body
        ref={modalBodyRef}
        style={{
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingTop: '0.5rem',
        }}
        className="modal-body-scrollable"
      >
        <Form>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Select Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isProcessing || (currentStatus === 'Completed' && status === 'Completed')}
              className="py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
            <Form.Text className="text-muted mt-2 d-block">
              {status === 'Completed' ? (
                <span className="text-info">* Image proof is optional for Completed status</span>
              ) : status === 'Cancelled' ? (
                <span className="text-info">* Image proof is required for Cancelled status</span>
              ) : (
                'No image required for Pending status'
              )}
            </Form.Text>
          </Form.Group>

          {/* Show upload field for both Completed and Cancelled status */}
          {shouldShowImageUpload() && (
            <div className="border-top pt-4">
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  {status === 'Completed'
                    ? 'Upload Completion Proof (Optional)'
                    : 'Upload Cancellation Proof'}
                  {status === 'Cancelled' && <span className="text-danger ms-1">*</span>}
                  <small className="text-muted ms-2">(Max: 50KB)</small>
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleImageChange}
                  required={status === 'Cancelled'} // Only required for Cancelled status
                  disabled={isProcessing}
                  className="py-2"
                />
                <Form.Text className="text-muted mt-2 d-block">
                  Images will be automatically compressed to under 50KB. PDFs must already be under
                  50KB.
                  {status === 'Completed' &&
                    ' Uploading an image is optional for Completed status.'}
                </Form.Text>

                {/* Compression progress */}
                {isCompressing && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-primary fw-medium">
                        <FaCompressAlt className="me-2" />
                        Compressing image...
                      </small>
                      <small className="fw-bold">{compressionProgress}%</small>
                    </div>
                    <ProgressBar now={compressionProgress} variant="primary" animated />
                    <small className="text-muted mt-3 d-block">
                      Original: {originalSize}KB → Target: ≤50KB
                    </small>
                  </div>
                )}

                {/* Size info */}
                {image && !isCompressing && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1 me-3">
                        <p className="mb-1 fw-medium">
                          {image.type === 'application/pdf' ? 'PDF File' : 'Compressed Image'}:
                        </p>
                        <p className="mb-2 text-truncate">
                          <small>{image.name}</small>
                        </p>
                        <p className="small mb-0">
                          <span className="text-muted">Size: </span>
                          <span className="fw-medium">{compressedSize}KB</span>
                          {originalSize > 0 && (
                            <span className="text-muted ms-2">(from {originalSize}KB)</span>
                          )}
                          {compressedSize <= 50 && (
                            <span className="text-success ms-2">✓ Under 50KB limit</span>
                          )}
                        </p>
                      </div>
                      {image.type === 'application/pdf' ? (
                        <FaFilePdf className="text-danger flex-shrink-0" size={28} />
                      ) : (
                        <FaCompressAlt className="text-primary flex-shrink-0" size={28} />
                      )}
                    </div>
                  </div>
                )}

                {/* Image preview */}
                {imagePreview && !isCompressing && (
                  <div className="mt-4">
                    <p className="small fw-medium mb-2">Preview:</p>
                    <div className="text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: '180px', maxWidth: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </Form.Group>
            </div>
          )}

          {/* Warning if changing from Completed to something else */}
          {currentStatus === 'Completed' && status !== 'Completed' && (
            <div className="mt-4 p-3 border rounded bg-warning bg-opacity-10">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <p className="mb-1 fw-medium">
                    ⚠️ <span className="ms-1">Status Change Warning</span>
                  </p>
                  <p className="small mb-0">
                    Changing status from <span className="fw-medium">Completed</span> to{' '}
                    <span className="fw-medium">{status}</span> will remove the completed status.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="mt-4 p-3 border rounded bg-info bg-opacity-10">
              <div className="d-flex align-items-center">
                <FaSpinner className="me-3 fa-spin text-primary" />
                <div>
                  <p className="mb-0 fw-medium">
                    {isCompressing ? 'Compressing image...' : 'Updating status...'}
                  </p>
                  <p className="small mb-0 text-muted">
                    {isCompressing
                      ? 'This may take a few moments depending on image size.'
                      : 'Please wait while we update the status.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-top-0 pt-0">
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={isProcessing}
          className="px-4"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isProcessing || (status === 'Cancelled' && !image)}
          className="px-4"
        >
          {isProcessing ? (
            <>
              <FaSpinner className="me-2 fa-spin" />
              {isCompressing ? 'Compressing...' : 'Submitting...'}
            </>
          ) : (
            'Update Status'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

StatusUpdateModal.defaultProps = {
  recordData: null,
}

export default StatusUpdateModal
