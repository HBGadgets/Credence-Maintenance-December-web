import React, { useContext, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { NavLink } from 'react-router-dom'
import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'
import { PanelLeftClose } from 'lucide-react'

import navigation from '../_nav'
import { TokenContext } from '../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

// Helper: Recursively filter items by role
const filterNavByRole = (items, role) => {
  return items
    .map((item) => {
      if (item.items) {
        const filteredItems = filterNavByRole(item.items, role)
        return filteredItems.length ? { ...item, items: filteredItems } : null
      }
      if (!item.role || item.role === role) return item
      return null
    })
    .filter(Boolean)
}

const AppSidebar = () => {
  const dispatch = useDispatch()
  const activeSection = useSelector((state) => state.activeSection || 'Dashboard')
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const token = Cookies.get('crdnsMaintToken') || useContext(TokenContext)

  const userRole = useMemo(() => {
    if (!token || typeof token !== 'string') return null
    try {
      const decoded = jwtDecode(token)
      return decoded?.role || null
    } catch {
      return null
    }
  }, [token])

  const filteredNav = useMemo(() => filterNavByRole(navigation, userRole), [userRole])

  const currentSection = useMemo(() => {
    return filteredNav.find(
      (item) => item.name && item.name.trim().toLowerCase() === activeSection.trim().toLowerCase()
    )
  }, [filteredNav, activeSection])

  const subItems = currentSection?.items || []

  // If sidebarShow is false or this section has no sub-options (like Dashboard), hide sidebar
  if (!sidebarShow || subItems.length === 0) {
    return null
  }

  return (
    <aside className="section-sidebar d-flex flex-column">
      {/* Section Header */}
      <div className="section-sidebar-header d-flex align-items-center justify-content-between px-3 py-3">
        <div className="d-flex align-items-center gap-2 overflow-hidden">
          {currentSection.icon && (
            <span className="section-icon">{currentSection.icon}</span>
          )}
          <span className="section-title text-uppercase fw-bold text-truncate">
            {currentSection.name.trim()}
          </span>
        </div>
        <button
          type="button"
          className="sidebar-collapse-btn d-flex align-items-center justify-content-center"
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
          title="Collapse sidebar"
          aria-label="Collapse sidebar"
        >
          <PanelLeftClose size={18} />
        </button>
      </div>

      {/* Suboptions List */}
      <SimpleBar className="flex-grow-1" style={{ maxHeight: 'calc(100vh - 110px)' }}>
        <ul className="sidebar-sub-list list-unstyled p-2 m-0">
          {subItems.map((sub, idx) => (
            <li key={idx} className="mb-1">
              <NavLink
                to={sub.to}
                className={({ isActive }) =>
                  `sidebar-sub-link d-flex align-items-center px-3 py-2 text-decoration-none ${
                    isActive ? 'active' : ''
                  }`
                }
              >
                <span className="sub-bullet me-2">•</span>
                <span className="sub-text text-truncate">{sub.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </SimpleBar>
    </aside>
  )
}

export default React.memo(AppSidebar)
