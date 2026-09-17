import React from 'react'
import { AppContent, AppHeader, AppSidebar } from '../components/index'

const DefaultLayout = () => {
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
