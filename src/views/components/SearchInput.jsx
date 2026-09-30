import React, { useEffect, useState } from 'react'
import { CInputGroup, CInputGroupText, CFormInput, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilX } from '@coreui/icons'

const SearchInput = ({
  searchQuery = '',
  setSearchQuery,
  placeholder = 'Search Here...',
  debounceDelay = 700,
  width = '300px', // default width
}) => {
  const [inputValue, setInputValue] = useState(searchQuery || '')
  const setSearchQueryRef = React.useRef(setSearchQuery)

  React.useEffect(() => {
    setSearchQueryRef.current = setSearchQuery
  }, [setSearchQuery])

  // Sync internal inputValue if external searchQuery changes
  React.useEffect(() => {
    setInputValue(searchQuery || '')
  }, [searchQuery])

  // Only trigger debounce if inputValue actually differs from searchQuery
  React.useEffect(() => {
    if (inputValue === (searchQuery || '')) return

    const handler = setTimeout(() => {
      setSearchQueryRef.current?.(inputValue)
    }, debounceDelay)

    return () => clearTimeout(handler)
  }, [inputValue, debounceDelay, searchQuery])

  const handleClear = () => {
    setInputValue('')
    if (searchQuery !== '') {
      setSearchQueryRef.current?.('')
    }
  }

  return (
    <CInputGroup style={{ width }}>
      {/* Search Icon */}
      <CInputGroupText>
        <CIcon icon={cilSearch} />
      </CInputGroupText>

      {/* Input Field */}
      <CFormInput
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{
          boxShadow: inputValue ? '0 0 1px rgba(0, 123, 255, 0.75)' : 'none',
          borderColor: inputValue ? '#007bff' : undefined,
        }}
      />

      {/* Clear Button (only when input has text) */}
      {inputValue && (
        <CButton color="light" onClick={handleClear} style={{ border: 'none' }}>
          <CIcon icon={cilX} />
        </CButton>
      )}
    </CInputGroup>
  )
}

export default SearchInput
