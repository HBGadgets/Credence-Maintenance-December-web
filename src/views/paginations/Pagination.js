/* eslint-disable prettier/prettier */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

const PaginatedList = ({ totalPages, currentPage, handlePageChange, handleItemsPerPageChange }) => {
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page
  const pageNumbers = [];
  const maxVisiblePages = 5;

  // Define the range of pages to show
  const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  // Create the list of pages to display
  if (startPage > 1) {
    pageNumbers.push(1); // Show first page
    if (startPage > 2) pageNumbers.push('...'); // Show ellipsis before the range
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) pageNumbers.push('...'); // Show ellipsis after the range
    pageNumbers.push(totalPages); // Show last page
  }

  // Handle the change in items per page
  const handleItemsPerPageSelect = (e) => {
    const newItemsPerPage = parseInt(e.target.value, 10);
    setItemsPerPage(newItemsPerPage);
    handleItemsPerPageChange(newItemsPerPage);  // Pass the change up to the parent component
  };

  return (

    
    
    <div className='d-flex'>
      

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
              <button className="page-link" style={{background: '#fg67893'}} onClick={() => handlePageChange(page)}>
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
      <select
          id="items-per-page"
          value={itemsPerPage}
          onChange={handleItemsPerPageSelect}
          style={{paddingLeft:'0.5rem', paddingRight: '0.5rem', border: '1px solid #80808036', borderRadius: '0.4rem', marginBottom: '1rem', marginLeft: '1rem'}}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
    </div>
  );
};

export default PaginatedList;
