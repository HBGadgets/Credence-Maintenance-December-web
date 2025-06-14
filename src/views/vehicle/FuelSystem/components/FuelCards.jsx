import React from 'react'
import { Card } from 'react-bootstrap'
import PropTypes from 'prop-types'

const FuelCards = ({ title, value, unit, range, icon: Icon, iconColor }) => {
  return (
    <Card className="p-3 shadow-sm rounded border">
      <div className="d-flex justify-content-between align-items-start">
        <span className="text-muted">{title}</span>
        {Icon && <Icon size={18} style={{ color: iconColor }} />} {/* Customized color */}
      </div>
      <h4 className="my-2">
        {value} {unit}
      </h4>
      {range && (
        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
          Range: {range}
        </div>
      )}
    </Card>
  )
}

FuelCards.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  range: PropTypes.string,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
}

FuelCards.defaultProps = {
  unit: '',
  range: null,
  icon: null,
  iconColor: '#198754', // Bootstrap green (text-success)
}

export default FuelCards
