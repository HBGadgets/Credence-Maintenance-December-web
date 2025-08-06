import React from 'react'

const statusColors = {
  Valid: '#28a745',
  'Expiring Soon': '#ffc107',
  Expired: '#dc3545',
}

const DocumentStatusCard = ({ label, count, status, isSelected, onClick }) => {
  const bgColor = status ? statusColors[status] : '#f8f9fa' // light gray for ALL
  const textColor = status ? '#fff' : '#000'
  const border = isSelected ? '2px solid #000' : '1px solid #ccc'
  const boxShadow = isSelected ? '0 0 5px rgba(0,0,0,0.2)' : 'none'

  return (
    <button
      onClick={() => onClick(status)}
      className="status-pill-button"
      style={{
        backgroundColor: bgColor,
        color: textColor,
        border,
        boxShadow,
        borderRadius: '20px',
        padding: '10px 15px',
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1,
        whiteSpace: 'nowrap',
        cursor: 'pointer',
        transition: 'all 0.2s ease-in-out',
      }}
    >
      {label.toUpperCase()}: {count}
    </button>
  )
}

export default DocumentStatusCard
