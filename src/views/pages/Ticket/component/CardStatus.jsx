import React from 'react'
import PropTypes from 'prop-types'

const CardStatus = ({ label, count, color }) => {
  return (
    <div
      className={`border border-${color} text-${color} rounded px-3 py-1 me-2 small fw-semibold`}
    >
      {label}: {count}
    </div>
  )
}

CardStatus.propTypes = {
  label: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  color: PropTypes.oneOf(['primary', 'danger', 'warning', 'success']).isRequired,
}

export default CardStatus
