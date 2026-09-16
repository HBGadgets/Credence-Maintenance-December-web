import React, { useContext, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppContent, AppHeader, AppSidebar } from '../components/index'
import { PanelLeftOpen } from 'lucide-react'
import navigation from '../_nav'
import { TokenContext } from '../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

const filterNavByRole = (items, role) => {
  return items
    .map(item => {
      if (item.items) {
        const filteredItems = filterNavByRole(item.items, role)
        return filteredItems.length ? { ...item, items: filteredItems } : null
      }
      if (!item.role || item.role === role) return item
      return null
    })
    .filter(Boolean)
}

const DefaultLayout = () => {
  const dispatch = useDispatch()
  const activeSection = useSelector((state) => state.activeSection || 'Dashboard')
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const token = Cookies.get('crdnsMaintToken') || useContext(TokenContext)
  const userRole = useMemo(() => {
    if (!token || typeof token !== 'string') return null
    try {
      return jwtDecode(token)?.role || null
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

  const hasSubItems = Boolean(currentSection?.items && currentSection.items.length > 0)

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <AppHeader />
      <div className="d-flex flex-grow-1 position-relative">
        <AppSidebar />
        <div className="body flex-grow-1 px-3 py-3 position-relative" style={{ minWidth: 0 }}>
          {!sidebarShow && hasSubItems && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'set', sidebarShow: true })}
              className="sidebar-expand-pill d-none d-lg-inline-flex align-items-center gap-1 mb-2"
              title={`Open ${currentSection.name.trim()} menu`}
              aria-label="Open sidebar"
            >
              <PanelLeftOpen size={16} />
              <span>{currentSection.name.trim()} Menu</span>
            </button>
          )}
          <AppContent />
        </div>
      </div>
      {/* <AppFooter /> */}
    </div>
  )
}

export default React.memo(DefaultLayout)
