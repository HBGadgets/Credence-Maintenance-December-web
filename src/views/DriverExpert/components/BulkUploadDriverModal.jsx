import React, { useState, useRef } from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CSpinner,
  CAlert,
} from '@coreui/react'
import { FaCloudUploadAlt, FaFileExcel, FaDownload, FaTrash, FaCheckCircle, FaInfoCircle } from 'react-icons/fa'
import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'
import { bulkUploadDrivers } from '../data/drivers'

const BulkUploadDriverModal = ({ visible, setVisible, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const handleClose = () => {
    if (isUploading) return
    setSelectedFile(null)
    setErrorMessage('')
    setIsDragOver(false)
    setVisible(false)
  }

  // Generate and download sample template based on acceptable format
  const handleDownloadTemplate = async () => {
    try {
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Drivers Template')

      // Define columns
      worksheet.columns = [
        { header: 'name', key: 'name', width: 20 },
        { header: 'contactNumber', key: 'contactNumber', width: 18 },
        { header: 'email', key: 'email', width: 25 },
        { header: 'password', key: 'password', width: 18 },
        { header: 'licenseNumber', key: 'licenseNumber', width: 22 },
        { header: 'licenseExpiryDate', key: 'licenseExpiryDate', width: 20 },
        { header: 'aadharNumber', key: 'aadharNumber', width: 20 },
      ]

      // Format header row
      const headerRow = worksheet.getRow(1)
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 11 }
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF204060' },
      }
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' }
      headerRow.height = 26

      // Sample data
      const sampleRows = [
        {
          name: 'John Doe',
          contactNumber: '9876543210',
          email: 'john@example.com',
          password: 'password123',
          licenseNumber: 'DL1420110012345',
          licenseExpiryDate: '2030-12-31',
          aadharNumber: '123456789012',
        },
        {
          name: 'Jane Smith',
          contactNumber: '9876543211',
          email: 'jane@example.com',
          password: 'password123',
          licenseNumber: 'DL1420110012346',
          licenseExpiryDate: '2031-12-31',
          aadharNumber: '123456789013',
        },
      ]

      sampleRows.forEach((row) => {
        const addedRow = worksheet.addRow(row)
        addedRow.alignment = { vertical: 'middle' }
        addedRow.height = 20
      })

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })
      saveAs(blob, 'driver_bulk_upload_template.xlsx')
      toast.success('Sample template downloaded successfully!')
    } catch (error) {
      console.error('Error generating template:', error)
      toast.error('Failed to download sample template')
    }
  }

  // Validate and set file
  const processFile = (file) => {
    if (!file) return

    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ]
    const validExtensions = ['.xlsx', '.xls', '.csv']
    const hasValidExt = validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))

    if (!validTypes.includes(file.type) && !hasValidExt) {
      setErrorMessage('Please select a valid Excel file (.xlsx, .xls) or CSV file (.csv).')
      setSelectedFile(null)
      return
    }

    // Limit to 15MB
    if (file.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds the 15MB limit.')
      setSelectedFile(null)
      return
    }

    setErrorMessage('')
    setSelectedFile(file)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    processFile(file)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files?.[0]
    processFile(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  }

  // Submit bulk upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setErrorMessage('Please select an Excel or CSV file to upload.')
      return
    }

    try {
      setIsUploading(true)
      setErrorMessage('')

      const response = await bulkUploadDrivers(selectedFile)

      const successMsg =
        response?.data?.message ||
        response?.message ||
        'Drivers bulk upload completed successfully!'

      Swal.fire({
        title: 'Uploaded!',
        text: successMsg,
        icon: 'success',
        confirmButtonColor: '#3085d6',
      })

      handleClose()
      if (typeof onUploadSuccess === 'function') {
        onUploadSuccess(response)
      }
    } catch (error) {
      console.error('Bulk upload error:', error)
      const errorMsg =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Failed to bulk upload drivers.'
      setErrorMessage(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <CModal
      visible={visible}
      onClose={handleClose}
      alignment="center"
      size="lg"
      backdrop="static"
    >
      <CModalHeader>
        <CModalTitle className="d-flex align-items-center gap-2">
          <FaFileExcel className="text-success" />
          <span>Bulk Upload Drivers</span>
        </CModalTitle>
      </CModalHeader>

      <CModalBody>
        {/* Template Download & Format Guidance Banner */}
        <div className="card mb-3 border-0 bg-light-subtle shadow-sm">
          <div className="card-body p-3">
            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-2">
              <div className="d-flex align-items-center gap-2">
                <FaInfoCircle className="text-primary fs-5" />
                <span className="fw-semibold">Acceptable Template Format</span>
              </div>
              <button
                type="button"
                className="btn btn-sm btn-outline-primary d-flex align-items-center gap-1"
                onClick={handleDownloadTemplate}
              >
                <FaDownload size={13} />
                <span>Download Sample Template</span>
              </button>
            </div>

            <p className="text-muted small mb-2">
              Upload an Excel file (.xlsx, .xls) or CSV (.csv) with the following column headers in Row 1:
            </p>

            <div className="table-responsive">
              <table className="table table-bordered table-sm text-center small mb-0 bg-white">
                <thead className="table-light">
                  <tr>
                    <th>name</th>
                    <th>contactNumber</th>
                    <th>email</th>
                    <th>password</th>
                    <th>licenseNumber</th>
                    <th>licenseExpiryDate</th>
                    <th>aadharNumber</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-muted">
                    <td>John Doe</td>
                    <td>9876543210</td>
                    <td>john@example.com</td>
                    <td>password123</td>
                    <td>DL1420110012345</td>
                    <td>2030-12-31</td>
                    <td>123456789012</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <CAlert color="danger" dismissible onClose={() => setErrorMessage('')} className="py-2">
            {errorMessage}
          </CAlert>
        )}

        {/* Drag & Drop File Zone */}
        {!selectedFile ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              border: `2px dashed ${isDragOver ? '#0d6efd' : '#ced4da'}`,
              backgroundColor: isDragOver ? '#eef4ff' : '#f8f9fa',
              borderRadius: '8px',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
              onChange={handleFileChange}
            />
            <FaCloudUploadAlt size={48} className={isDragOver ? 'text-primary' : 'text-secondary'} />
            <h6 className="mt-3 mb-1">
              Drag and drop your Excel file here, or{' '}
              <span className="text-primary text-decoration-underline">browse</span>
            </h6>
            <span className="text-muted small">Supports .xlsx, .xls, and .csv files up to 15MB</span>
          </div>
        ) : (
          /* Selected File Preview Box */
          <div className="border rounded p-3 bg-white shadow-sm d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div
                className="p-2 rounded d-flex align-items-center justify-content-center"
                style={{ backgroundColor: '#e8f5e9' }}
              >
                <FaFileExcel className="text-success fs-3" />
              </div>
              <div>
                <div className="fw-semibold text-dark text-break">{selectedFile.name}</div>
                <div className="text-muted small">
                  {formatFileSize(selectedFile.size)} &bull; Ready to upload
                </div>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
              onClick={handleRemoveFile}
              disabled={isUploading}
              title="Remove file"
            >
              <FaTrash size={12} />
              <span>Remove</span>
            </button>
          </div>
        )}
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" variant="ghost" onClick={handleClose} disabled={isUploading}>
          Cancel
        </CButton>
        <CButton
          color="primary"
          onClick={handleUpload}
          disabled={!selectedFile || isUploading}
          className="d-flex align-items-center gap-2"
        >
          {isUploading ? (
            <>
              <CSpinner size="sm" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <FaCheckCircle />
              <span>Upload Drivers</span>
            </>
          )}
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

BulkUploadDriverModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  onUploadSuccess: PropTypes.func,
}

export default BulkUploadDriverModal
