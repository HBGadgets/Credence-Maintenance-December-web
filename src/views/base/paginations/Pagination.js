/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from 'react'

const PaginatedList = ({ totalPages, currentPage, handlePageChange }) => {
  const pageNumbers = []
  const maxVisiblePages = 5

  // Define the range of pages to show
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

  // Create the list of pages to display
  if (startPage > 1) {
    pageNumbers.push(1) // Show first page
    if (startPage > 2) pageNumbers.push('...') // Show ellipsis before the range
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pageNumbers.push('...') // Show ellipsis after the range
    pageNumbers.push(totalPages) // Show last page
  }

  return (
    <ul className="pagination">
      <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
      </li>
      {pageNumbers.map((page, index) => (
        <li key={index} className={`page-item ${currentPage === page ? 'active' : ''}`}>
          {page === '...' ? (
            <span className="page-link">...</span>
          ) : (
            <button className="page-link" onClick={() => handlePageChange(page)}>
              {page}
            </button>
          )}
        </li>
      ))}
      <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
        <button
          className="page-link"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </li>
    </ul>
  )
}

export default PaginatedList
