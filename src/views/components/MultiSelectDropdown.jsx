import React from 'react'
import { CCol, CFormLabel, CFormFeedback } from '@coreui/react'
import Select from 'react-select'

const MultiSelectDropdown = ({
  id,
  label,
  options,
  value,
  onChange,
  placeholder = 'Select options...',
  isClearable = true,
  isInvalid = false,
}) => {
  return (
    <CCol md={3}>
      {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
      <Select
        id={id}
        isMulti
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isClearable={isClearable}
      />
      {isInvalid && <CFormFeedback invalid>Please select valid options.</CFormFeedback>}
    </CCol>
  )
}

export default MultiSelectDropdown
