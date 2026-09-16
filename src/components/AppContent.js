import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer } from '@coreui/react'
import LoaderBus from './Loader3/LoaderBus'

// routes config
import routes from '../routes'

const AppContent = () => {
  return (
    <CContainer className="px-4" fluid>
      <Suspense
        fallback={
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <LoaderBus />
          </div>
        }
      >
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
