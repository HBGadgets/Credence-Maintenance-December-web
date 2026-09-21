import React, { useEffect } from 'react'
import { AppContent, AppHeader, AppSidebar } from '../components/index'
import usePermissionStore from '../store/permission'
import { jwtDecode } from 'jwt-decode'
import Cookies from 'js-cookie'
import { getMySupervisorPermissions } from '../views/Supervisor/data/supervisorRoleService'

const DefaultLayout = () => {
  useEffect(() => {
    const token = Cookies.get('crdnsMaintToken')
    if (token) {
      let role = ''
      try {
        const decoded = jwtDecode(token)
        role = (decoded?.role || '').toString().toLowerCase().trim()
        if (role === 'superadmin' || role.includes('superadmin') || role === 'admin') {
          usePermissionStore.getState().clearPermissions()
          return
        }
      } catch {}

      const isWorker = Boolean(
        Cookies.get('workerInfo') ||
        role === 'worker' ||
        role === 'employee'
      )
      if (isWorker) {
        return
      }

      // If permissions were already fetched during login, skip duplicate call on initial dashboard mount
      if (sessionStorage.getItem('skipNextPermissionFetch') === 'true') {
        sessionStorage.removeItem('skipNextPermissionFetch')
        return
      }

      // Trigger supervisor permissions API on refresh
      getMySupervisorPermissions()
        .then((res) => {
          if (res && res.permissions) {
            usePermissionStore.getState().setPermissions(res.permissions)
          }
        })
        .catch((err) => {
          // Gracefully catch for accounts without supervisor permissions
          console.error('Failed to fetch supervisor permissions on refresh:', err)
        })
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
