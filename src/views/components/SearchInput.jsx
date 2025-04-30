import React from 'react'
import { CInputGroup, CInputGroupText, CFormInput, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilX } from '@coreui/icons'

const SearchInput = ({ searchQuery, setSearchQuery, placeholder = 'Search Here...' }) => {
  return (
    <CInputGroup className="w-25">
      {/* Search Icon */}
      <CInputGroupText>
        <CIcon icon={cilSearch} />
      </CInputGroupText>

      {/* Input Field */}
      <CFormInput
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{
          boxShadow: searchQuery ? '0 0 1px rgba(0, 123, 255, 0.75)' : 'none',
          borderColor: searchQuery ? '#007bff' : undefined,
        }}
      />

      {/* Clear Button (only when input has text) */}
      {searchQuery && (
        <CButton
          color="light"
          variant="ghost"
          onClick={() => setSearchQuery('')}
          style={{ border: 'none' }}
        >
          <CIcon icon={cilX} />
        </CButton>
      )}
    </CInputGroup>
  )
}

export default SearchInput
