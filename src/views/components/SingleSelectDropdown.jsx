import React from 'react'
import { CCol, CFormFeedback, CFormLabel } from '@coreui/react'
import Select from 'react-select'

const SingleSelectDropdown = ({
  label,
  options,
  value,
  onChange,
  placeholder = 'Select an option...',
  isClearable = true,
  isInvalid = false,
  width = '20rem', // Default width, can be overridden
  containerStyle = {}, // Additional container styles
  selectStyle = {}, // Additional select styles
}) => {
  return (
    <CCol
      style={{
        width: width,
        minWidth: '140px', // Minimum width to prevent shrinking
        maxWidth: '100%', // Responsive max width
        paddingRight: '0rem',
        ...containerStyle,
      }}
    >
      {label && <CFormLabel>{label}</CFormLabel>}
      <Select
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        isClearable={isClearable}
        isSearchable={true} // Enables typing & search
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            minHeight: '38px',
            width: '100%', // Takes full width of container
            ...selectStyle,
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            width: '100%',
            minWidth: '140px', // Minimum width for dropdown menu
          }),
        }}
      />
      {isInvalid && <CFormFeedback invalid>Please select a valid option.</CFormFeedback>}
    </CCol>
  )
}

export default SingleSelectDropdown
