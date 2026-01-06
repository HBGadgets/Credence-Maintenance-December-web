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
  width = '20rem', // Default width, can be overridden
  containerStyle = {}, // Additional container styles
  selectStyle = {}, // Additional select styles
  md = 3, // Bootstrap grid column size (default: 3)
}) => {
  return (
    <CCol
      md={md}
      style={{
        width: width,
        minWidth: '160px', // Minimum width for multi-select (needs more space)
        maxWidth: '100%', // Responsive max width
        ...containerStyle,
      }}
    >
      {label && <CFormLabel htmlFor={id}>{label}</CFormLabel>}
      <Select
        id={id}
        isMulti
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isClearable={isClearable}
        isSearchable={true}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            minHeight: '38px',
            width: '100%',
            ...selectStyle,
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            width: '100%',
            minWidth: '160px', // Minimum width for dropdown menu
          }),
          multiValue: (baseStyles) => ({
            ...baseStyles,
            maxWidth: '100%',
          }),
          multiValueLabel: (baseStyles) => ({
            ...baseStyles,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }),
        }}
      />
      {isInvalid && <CFormFeedback invalid>Please select valid options.</CFormFeedback>}
    </CCol>
  )
}

export default MultiSelectDropdown
