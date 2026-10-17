import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'
import { FaEdit } from 'react-icons/fa'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CForm,
  CFormInput,
  CFormSelect,
  CFormTextarea,
  CFormLabel,
  CRow,
  CCol,
  CSpinner,
} from '@coreui/react'
import { editAttendanceBySupervisorApi } from '../data/data'

// Helper to format 24-hour time "09:30" or "18:30" to 12-hour "09:30 AM" or "06:30 PM"
export const formatTimeTo12Hour = (time24) => {
  if (!time24) return ''
  const parts = time24.split(':')
  if (parts.length < 2) return time24
  let hours = parseInt(parts[0], 10)
  const minutes = parts[1].slice(0, 2)
  if (isNaN(hours)) return time24
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12
  hours = hours ? hours : 12
  return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`
}

// Helper to convert 12-hour time "09:30 AM" or "06:30 PM" to "09:30" / "18:30"
export const formatTimeTo24Hour = (timeStr) => {
  if (!timeStr) return ''
  if (/^\d{2}:\d{2}$/.test(timeStr)) return timeStr
  const match = timeStr.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i)
  if (match) {
    let hours = parseInt(match[1], 10)
    const m = match[2]
    const ampm = match[3]
    if (ampm) {
      if (ampm.toUpperCase() === 'PM' && hours < 12) hours += 12
      if (ampm.toUpperCase() === 'AM' && hours === 12) hours = 0
    }
    return `${String(hours).padStart(2, '0')}:${String(m).padStart(2, '0')}`
  }
  return ''
}

// Helper to get local date in YYYY-MM-DD
export const getTodayLocalDate = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Dedicated Modal Component for Editing/Marking Attendance
const EditAttendanceModal = ({
  visible,
  onClose,
  initialData,
  onSuccess,
  title = 'Edit Attendance by Supervisor',
}) => {
  const [formData, setFormData] = useState({
    driverId: '',
    driverName: '',
    attendanceId: null,
    date: '',
    status: 'Present',
    punchInTime: '09:30',
    punchOutTime: '18:30',
    supervisorComment: '',
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData && visible) {
      setFormData(initialData)
    }
  }, [initialData, visible])

  const handleSubmit = async (e) => {
    if (e) e.preventDefault()

    if (!formData.driverId) {
      toast.error('Driver ID is missing.')
      return
    }
    if (!formData.date) {
      toast.error('Please select a valid date.')
      return
    }

    const maxDate = getTodayLocalDate()
    if (formData.date > maxDate) {
      toast.error('Future dates cannot be selected for attendance.')
      return
    }

    const payload = {
      driverId: formData.driverId,
      date: formData.date,
      status: formData.status,
    }

    if (formData.supervisorComment?.trim()) {
      payload.supervisorComment = formData.supervisorComment.trim()
    }

    if (formData.status === 'Present') {
      if (!formData.punchInTime) {
        toast.error('Please provide a punch-in time for Present status.')
        return
      }
      if (!formData.punchOutTime) {
        toast.error('Please provide a punch-out time for Present status.')
        return
      }
      payload.punchInTime = formatTimeTo12Hour(formData.punchInTime)
      payload.punchOutTime = formatTimeTo12Hour(formData.punchOutTime)
    }

    try {
      setLoading(true)
      await editAttendanceBySupervisorApi(formData.attendanceId, payload)
      toast.success('Attendance updated successfully!')
      onSuccess?.()
      onClose?.()
    } catch (err) {
      console.error('Failed to update attendance:', err)
      const errorMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Failed to update attendance.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <CModal
      visible={visible}
      onClose={() => !loading && onClose?.()}
      alignment="center"
      size="lg"
      backdrop="static"
    >
      <CModalHeader closeButton={!loading}>
        <CModalTitle className="d-flex align-items-center gap-2 fs-5">
          <FaEdit className="text-primary" />
          <span>{title}</span>
        </CModalTitle>
      </CModalHeader>

      <CForm onSubmit={handleSubmit}>
        <CModalBody className="p-4">
          {/* Driver Info Banner */}
          <div className="bg-light p-3 rounded border mb-3">
            <div
              className="text-muted text-uppercase fw-semibold"
              style={{ fontSize: '11px', letterSpacing: '0.5px' }}
            >
              Driver Name
            </div>
            <div className="fw-bold fs-6 text-dark">{formData.driverName || 'N/A'}</div>
          </div>

          <CRow className="g-3">
            {/* Date Input */}
            <CCol md={6}>
              <CFormLabel className="fw-semibold small">
                Attendance Date <span className="text-danger">*</span>
              </CFormLabel>
              <div>
                <DatePicker
                  value={formData.date ? dayjs(formData.date, 'YYYY-MM-DD') : null}
                  onChange={(date) => {
                    if (!date) {
                      setFormData({ ...formData, date: '' })
                      return
                    }
                    const formatted = dayjs(date).format('YYYY-MM-DD')
                    const today = getTodayLocalDate()
                    if (formatted > today) {
                      toast.warning('Future dates cannot be selected for attendance.')
                      return
                    }
                    setFormData({ ...formData, date: formatted })
                  }}
                  disabledDate={(current) => {
                    // Strictly disable any date after today
                    return current && current > dayjs().endOf('day')
                  }}
                  format="DD/MM/YYYY"
                  allowClear={false}
                  placeholder="Select attendance date"
                  className="w-100"
                  style={{
                    height: '38px',
                    borderRadius: '0.375rem',
                    borderColor: '#ced4da',
                    fontSize: '14px',
                  }}
                  popupStyle={{ zIndex: 9999 }}
                  disabled={loading}
                />
              </div>
            </CCol>

            {/* Status Select */}
            <CCol md={6}>
              <CFormLabel className="fw-semibold small">
                Attendance Status <span className="text-danger">*</span>
              </CFormLabel>
              <CFormSelect
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                required
                disabled={loading}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Leave">On Leave</option>
              </CFormSelect>
            </CCol>

            {/* Punch In / Punch Out Times (Visible when Present) */}
            {formData.status === 'Present' && (
              <>
                <CCol md={6}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <CFormLabel className="fw-semibold small mb-0">
                      Punch-In Time <span className="text-danger">*</span>
                    </CFormLabel>
                    {formData.punchInTime && (
                      <span
                        className="badge bg-primary bg-opacity-10 text-primary border border-primary"
                        style={{ fontSize: '11px' }}
                      >
                        {formatTimeTo12Hour(formData.punchInTime)}
                      </span>
                    )}
                  </div>
                  <CFormInput
                    type="time"
                    value={formData.punchInTime}
                    onChange={(e) => setFormData({ ...formData, punchInTime: e.target.value })}
                    required
                    disabled={loading}
                  />
                </CCol>

                <CCol md={6}>
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <CFormLabel className="fw-semibold small mb-0">
                      Punch-Out Time <span className="text-danger">*</span>
                    </CFormLabel>
                    {formData.punchOutTime && (
                      <span
                        className="badge bg-primary bg-opacity-10 text-primary border border-primary"
                        style={{ fontSize: '11px' }}
                      >
                        {formatTimeTo12Hour(formData.punchOutTime)}
                      </span>
                    )}
                  </div>
                  <CFormInput
                    type="time"
                    value={formData.punchOutTime}
                    onChange={(e) => setFormData({ ...formData, punchOutTime: e.target.value })}
                    required
                    disabled={loading}
                  />
                </CCol>
              </>
            )}

            {/* Supervisor Comment */}
            <CCol xs={12}>
              <CFormLabel className="fw-semibold small">
                Supervisor Comment / Remark
              </CFormLabel>
              <CFormTextarea
                rows={3}
                value={formData.supervisorComment}
                onChange={(e) => setFormData({ ...formData, supervisorComment: e.target.value })}
                placeholder="Enter supervisor comment or remark..."
                disabled={loading}
              />
              <div className="form-text small text-muted">
                Supervisor comment or remark for this attendance record.
              </div>
            </CCol>
          </CRow>
        </CModalBody>

        <CModalFooter className="bg-light">
          <CButton
            color="secondary"
            variant="ghost"
            onClick={() => onClose?.()}
            disabled={loading}
          >
            Cancel
          </CButton>
          <CButton color="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <CSpinner size="sm" className="me-2" />
                Saving...
              </>
            ) : (
              'Save Attendance'
            )}
          </CButton>
        </CModalFooter>
      </CForm>
    </CModal>
  )
}

EditAttendanceModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  initialData: PropTypes.object,
  onSuccess: PropTypes.func,
  title: PropTypes.string,
}

export default EditAttendanceModal
