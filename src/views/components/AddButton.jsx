import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { useLocation } from 'react-router-dom'
import navigation from '../../_nav'
import PermissionService from '../Services/Service'

const AddButton = ({
  label = 'Add',
  onClick,
  icon,
  variant = 'primary',
  size = '', // 'sm', 'lg', or ''
  className = '', // additional custom classes
  type = 'button',
  disabled = false,
  permission = null,
}) => {
  const location = useLocation()
  const resolvedPermission = useMemo(() => {
    if (permission) return permission
    const currentPath = location?.pathname
    if (!currentPath) return null
    const findPermission = (navItems) => {
      for (const item of navItems) {
        if (item.to && item.to.toLowerCase() === currentPath.toLowerCase()) {
          return item.permission
        }
        if (item.items) {
          const found = findPermission(item.items)
          if (found) return found
        }
      }
      return null
    }
    return findPermission(navigation)
  }, [permission, location?.pathname])

  if (resolvedPermission && !PermissionService.hasPermission(resolvedPermission, 'create')) {
    return null
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={`btn btn-${variant} ${size ? `btn-${size}` : ''} d-flex align-items-center ${className}`}
      disabled={disabled}
      style={{ gap: '0.3rem' }}
    >
      {icon && <span className="d-flex align-items-center">{icon}</span>}
      <span className="d-flex align-items-center">{label}</span>
    </button>
  )
}

AddButton.propTypes = {
  label: PropTypes.string,
  onClick: PropTypes.func,
  icon: PropTypes.node,
  variant: PropTypes.string,
  size: PropTypes.string,
  className: PropTypes.string,
  type: PropTypes.string,
  disabled: PropTypes.bool,
  permission: PropTypes.string,
}

export default AddButton
