import React from 'react'
import { Link } from 'react-router-dom'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span>&copy; {new Date().getFullYear()} Credence FMS.</span>
        <span className="ms-3">
          <Link to="/privacy-policy" className="text-decoration-none text-muted">
            Privacy Policy
          </Link>
        </span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Fleet Management &amp; Maintenance</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
