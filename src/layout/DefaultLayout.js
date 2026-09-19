import React, { useEffect } from 'react'
import { AppContent, AppHeader, AppSidebar } from '../components/index'
import usePermissionStore from '../store/permission'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'

const DefaultLayout = () => {
  useEffect(() => {
    const token =
      sessionStorage.getItem('crdnsMaintToken') ||
      localStorage.getItem('crdnsMaintToken') ||
      Cookies.get('crdnsMaintToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const role = (decoded?.role || '').toString().toLowerCase().trim()
        if (role === 'superadmin' || role.includes('superadmin') || role === 'admin') {
          usePermissionStore.getState().clearPermissions()
        }
      } catch {}
    }
  }, [])

  return (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <AppHeader />
      <div className="d-flex flex-grow-1 position-relative">
        <AppSidebar />
        <div className="body flex-grow-1 px-3 py-3 position-relative" style={{ minWidth: 0 }}>
          <AppContent />
        </div>
      </div>
      {/* <AppFooter /> */}
    </div>
  )
}

export default React.memo(DefaultLayout)
