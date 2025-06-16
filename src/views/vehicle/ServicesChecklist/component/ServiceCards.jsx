import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import PropTypes from 'prop-types'

// Easing for smooth acceleration and deceleration
const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

const ServiceCards = ({ title, value, unit, range, icon: Icon, iconColor }) => {
  const [animatedValue, setAnimatedValue] = useState(0)

  useEffect(() => {
    const end = parseFloat(value)
    if (isNaN(end)) return

    const duration = 1500 // animation time in ms
    const startTime = performance.now()

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime
      const progress = Math.min(elapsed / duration, 1)
      const easedProgress = easeOutCubic(progress)

      const currentVal = easedProgress * end
      setAnimatedValue(currentVal)

      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setAnimatedValue(end) // snap to final value
      }
    }

    requestAnimationFrame(animate)
  }, [value])

  const formattedValue = Number(animatedValue).toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })

  return (
    <Card className="p-3 shadow-sm rounded border">
      <div className="d-flex justify-content-between align-items-start">
        <span className="text-muted">
          <b>{title}</b>
        </span>
        {Icon && <Icon size={18} style={{ color: iconColor }} />}
      </div>
      <h4 className="my-2">
        {formattedValue} {unit}
      </h4>
      {range && (
        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
          Range: {range}
        </div>
      )}
    </Card>
  )
}

ServiceCards.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  unit: PropTypes.string,
  range: PropTypes.string,
  icon: PropTypes.elementType,
  iconColor: PropTypes.string,
}

ServiceCards.defaultProps = {
  unit: '',
  range: null,
  icon: null,
  iconColor: '#198754',
}

export default ServiceCards
