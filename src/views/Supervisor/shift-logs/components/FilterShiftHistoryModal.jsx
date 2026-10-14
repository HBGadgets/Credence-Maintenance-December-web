import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CButton,
  CRow,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import { FaFilter, FaListAlt } from 'react-icons/fa'

const MONTH_OPTIONS = [
  { value: '', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
]

// Minimum limit for past historical records (cannot select before 2020)
const MIN_PAST_YEAR = 2020
const MIN_DATE = '2020-01-01'

const YEAR_OPTIONS = [
  { value: '', label: 'All Years' },
  ...Array.from(
    { length: Math.max(1, new Date().getFullYear() - MIN_PAST_YEAR + 1) },
    (_, i) => {
      const y = String(new Date().getFullYear() - i)
      return { value: y, label: y }
    },
  ),
]

function FilterShiftHistoryModal({ visible, setVisible, selectedRow, onConfirm, mode = 'vehicle' }) {
  const [status, setStatus] = useState('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [month, setMonth] = useState('')
  const [year, setYear] = useState('')

  const todayDate = useMemo(() => {
    const d = new Date()
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }, [])

  const currentYear = useMemo(() => new Date().getFullYear(), [])
  const currentMonth = useMemo(() => new Date().getMonth() + 1, [])

  // Month options with future months disabled for current/future year
  const availableMonthOptions = useMemo(() => {
    const isCurrentOrFutureYear = !year || Number(year) >= currentYear
    return MONTH_OPTIONS.map((m) => {
      const isFutureMonth = isCurrentOrFutureYear && m.value !== '' && Number(m.value) > currentMonth
      return {
        ...m,
        disabled: isFutureMonth,
      }
    })
  }, [year, currentYear, currentMonth])

  // Reset form fields whenever modal opens
  useEffect(() => {
    if (visible) {
      setStatus('all')
      setStartDate('')
      setEndDate('')
      setMonth('')
      setYear('')
    }
  }, [visible])

  // Reset month if user changes year to current year and the selected month is in the future
  useEffect(() => {
    const isCurrentOrFutureYear = !year || Number(year) >= currentYear
    if (isCurrentOrFutureYear && month && Number(month) > currentMonth) {
      setMonth('')
    }
  }, [year, month, currentYear, currentMonth])

  const isDriverMode = mode === 'driver'
  const targetTitle = isDriverMode
    ? selectedRow?.driverName || 'Driver'
    : selectedRow?.vehicleName || 'Vehicle'

  const handleApply = () => {
    const hasDateRange = Boolean(startDate || endDate)
    onConfirm({
      vehicleId: selectedRow?.vehicleId || '',
      vehicleName: selectedRow?.vehicleName || '',
      driverId: selectedRow?.driverId || selectedRow?.id || selectedRow?._id || '',
      driverName: selectedRow?.driverName || '',
      status: status || 'all',
      startDate: hasDateRange ? (startDate || '') : '',
      endDate: hasDateRange ? (endDate || '') : '',
      month: hasDateRange ? '' : (month || ''),
      year: hasDateRange ? '' : (year || ''),
    })
    setVisible(false)
  }

  const handleViewAll = () => {
    onConfirm({
      vehicleId: selectedRow?.vehicleId || '',
      vehicleName: selectedRow?.vehicleName || '',
      driverId: selectedRow?.driverId || selectedRow?.id || selectedRow?._id || '',
      driverName: selectedRow?.driverName || '',
      status: 'all',
      startDate: '',
      endDate: '',
      month: '',
      year: '',
    })
    setVisible(false)
  }

  const handleClose = () => {
    setVisible(false)
  }

  return (
    <CModal visible={visible} onClose={handleClose} alignment="center" size="lg">
      <CModalHeader className="bg-primary text-white">
        <CModalTitle className="d-flex align-items-center gap-2 fs-6">
          <FaListAlt />
          <span>
            {isDriverMode ? 'Driver' : 'Vehicle'} Shift History Parameters: {targetTitle}
          </span>
        </CModalTitle>
      </CModalHeader>

      <CModalBody className="p-4">
        <p className="text-muted small mb-3">
          {isDriverMode ? (
            <>
              Select parameters to filter the shift history logs for driver{' '}
              <strong>{selectedRow?.driverName}</strong>
              {selectedRow?.vehicleName && selectedRow?.vehicleName !== 'N/A' ? (
                <> (Vehicle: <strong>{selectedRow.vehicleName}</strong>)</>
              ) : ''}
              . You can also adjust these filters anytime on the logs page.
            </>
          ) : (
            <>
              Select parameters to filter the shift history logs for vehicle{' '}
              <strong>{selectedRow?.vehicleName}</strong> (Driver:{' '}
              <strong>{selectedRow?.driverName || 'N/A'}</strong>). You can also adjust these filters anytime on the logs page.
            </>
          )}
        </p>

        <CRow className="g-3">
          {/* Status Filter */}
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Shift Status</CFormLabel>
            <CFormSelect value={status} onChange={(e) => setStatus(e.target.value)}>
              <option value="all">All Statuses (Ongoing & Completed)</option>
              <option value="active">Ongoing Shifts Only</option>
              <option value="completed">Completed Shifts Only</option>
            </CFormSelect>
          </CCol>

          {/* Month Filter */}
          <CCol md={3}>
            <CFormLabel className="fw-semibold small">Month (Optional)</CFormLabel>
            <CFormSelect
              value={month}
              onChange={(e) => {
                const val = e.target.value
                setMonth(val)
                if (val) {
                  setStartDate('')
                  setEndDate('')
                }
              }}
            >
              {availableMonthOptions.map((m) => (
                <option key={m.value} value={m.value} disabled={m.disabled}>
                  {m.label} {m.disabled ? '(Future)' : ''}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* Year Filter */}
          <CCol md={3}>
            <CFormLabel className="fw-semibold small">Year (Optional)</CFormLabel>
            <CFormSelect
              value={year}
              onChange={(e) => {
                const val = e.target.value
                setYear(val)
                if (val) {
                  setStartDate('')
                  setEndDate('')
                }
              }}
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y.value} value={y.value}>
                  {y.label}
                </option>
              ))}
            </CFormSelect>
          </CCol>

          {/* Start Date */}
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">Start Date (From)</CFormLabel>
            <CFormInput
              type="date"
              value={startDate}
              min={MIN_DATE}
              max={endDate && endDate < todayDate ? endDate : todayDate}
              onChange={(e) => {
                const val = e.target.value
                if (val) {
                  setMonth('')
                  setYear('')
                }
                if (!val) {
                  setStartDate('')
                  return
                }
                let finalStart = val
                if (val < MIN_DATE) {
                  finalStart = MIN_DATE
                } else if (val > todayDate) {
                  finalStart = todayDate
                }
                setStartDate(finalStart)

                // Automatically ensure To Date is not less than From Date
                if (endDate && finalStart > endDate) {
                  setEndDate(finalStart)
                }
              }}
            />
          </CCol>

          {/* End Date */}
          <CCol md={6}>
            <CFormLabel className="fw-semibold small">End Date (To)</CFormLabel>
            <CFormInput
              type="date"
              value={endDate}
              min={startDate || MIN_DATE}
              max={todayDate}
              onChange={(e) => {
                const val = e.target.value
                if (val) {
                  setMonth('')
                  setYear('')
                }
                if (!val) {
                  setEndDate('')
                  return
                }
                const effectiveMin = startDate || MIN_DATE
                if (val < effectiveMin) {
                  setEndDate(effectiveMin)
                } else if (val > todayDate) {
                  setEndDate(todayDate)
                } else {
                  setEndDate(val)
                }
              }}
            />
          </CCol>
        </CRow>
      </CModalBody>

      <CModalFooter className="d-flex justify-content-between">
        <CButton color="secondary" variant="ghost" size="sm" onClick={handleClose}>
          Cancel
        </CButton>
        <div className="d-flex gap-2">
          <CButton color="outline-primary" size="sm" onClick={handleViewAll}>
            View All (No Filter)
          </CButton>
          <CButton color="primary" size="sm" onClick={handleApply} className="d-flex align-items-center gap-1">
            <FaFilter size={12} />
            <span>Apply & View Detail Logs</span>
          </CButton>
        </div>
      </CModalFooter>
    </CModal>
  )
}

FilterShiftHistoryModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  setVisible: PropTypes.func.isRequired,
  selectedRow: PropTypes.object,
  onConfirm: PropTypes.func.isRequired,
  mode: PropTypes.string,
}

export default FilterShiftHistoryModal
