import React from 'react'
import { CInputGroup, CInputGroupText, CFormInput } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

const SearchInput = ({ searchQuery, setSearchQuery, placeholder = 'Search Here...' }) => {
  return (
    <CInputGroup className="w-25">
      <CInputGroupText>
        <CIcon icon={cilSearch} />
      </CInputGroupText>
      <CFormInput
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-25"
        style={{
          boxShadow: searchQuery ? '0 0 1px rgba(0, 123, 255, 0.75)' : 'none',
          borderColor: searchQuery ? '#007bff' : undefined,
        }}
      />
    </CInputGroup>
  )
}

export default SearchInput
