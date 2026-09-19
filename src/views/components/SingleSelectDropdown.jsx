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
  disabled = false,
  isDisabled = false,
  width = '100%', // Default width fits container
  containerStyle = {}, // Additional container styles
  selectStyle = {}, // Additional select styles
}) => {
  const disabledState = isDisabled || disabled

  return (
    <CCol
      style={{
        width: width,
        minWidth: '140px',
        maxWidth: '100%',
        paddingLeft: '0rem',
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
        isClearable={isClearable && !disabledState}
        isDisabled={disabledState}
        isSearchable={!disabledState}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            minHeight: '38px',
            height: '38px',
            maxHeight: '38px',
            width: '100%',
            backgroundColor: disabledState ? '#e9ecef' : baseStyles.backgroundColor,
            borderColor: disabledState ? '#dee2e6' : baseStyles.borderColor,
            cursor: disabledState ? 'not-allowed' : 'default',
            opacity: disabledState ? 0.85 : 1,
            boxShadow: 'none',
            ...selectStyle,
          }),
          valueContainer: (baseStyles) => ({
            ...baseStyles,
            height: '38px',
            padding: '0 8px',
            flexWrap: 'nowrap',
            overflow: 'hidden',
          }),
          placeholder: (baseStyles) => ({
            ...baseStyles,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: disabledState ? '#6c757d' : baseStyles.color,
            margin: 0,
          }),
          singleValue: (baseStyles) => ({
            ...baseStyles,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }),
          input: (baseStyles) => ({
            ...baseStyles,
            margin: 0,
            padding: 0,
          }),
          indicatorsContainer: (baseStyles) => ({
            ...baseStyles,
            height: '38px',
          }),
          menu: (baseStyles) => ({
            ...baseStyles,
            minWidth: '100%',
            width: 'max-content',
            maxWidth: '360px',
            zIndex: 9999,
          }),
          menuList: (baseStyles) => ({
            ...baseStyles,
            overflowX: 'hidden',
            maxHeight: '220px',
          }),
          option: (baseStyles) => ({
            ...baseStyles,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }),
        }}
      />
      {isInvalid && <CFormFeedback invalid>Please select a valid option.</CFormFeedback>}
    </CCol>
  )
}

export default SingleSelectDropdown
