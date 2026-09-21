// import React, { Suspense, useEffect } from 'react'
// import { HashRouter, Route, Routes } from 'react-router-dom'
// import { useSelector } from 'react-redux'

// import { CSpinner, useColorModes } from '@coreui/react'
// import './scss/style.scss'
// import { TokenProvider } from './context/TokenContext'
// import LoaderBus from './components/Loader3/LoaderBus'

// // Containers
// const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// // Pages
// const Login = React.lazy(() => import('./views/pages/login/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

// const App = () => {
//   const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
//   const storedTheme = useSelector((state) => state.theme)

//   useEffect(() => {
//     const urlParams = new URLSearchParams(window.location.href.split('?')[1])
//     const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
//     if (theme) {
//       setColorMode(theme)
//     }

//     if (isColorModeSet()) {
//       return
//     }

//     setColorMode(storedTheme)
//   }, [])

//   return (
//     <HashRouter>
//       <Suspense
//         fallback={
//           <div className="pt-3 text-center">
//             {/* <CSpinner color="primary" variant="grow" /> */}
//             <LoaderBus />
//           </div>
//         }
//       >
//         <TokenProvider>
//           <Routes>
//             <Route path="*" name="Home" element={<DefaultLayout />} />
//           </Routes>
//         </TokenProvider>
//       </Suspense>
//     </HashRouter>
//   )
// }

// export default App


// -------------------------------------------------------------------------------------------------------- 

// New code

import React, { Suspense, useEffect } from 'react'
import { HashRouter, Route, Routes, Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useColorModes } from '@coreui/react'

import './scss/style.scss'
import { TokenProvider } from './context/TokenContext'
import LoaderBus from './components/Loader3/LoaderBus'
import { socket } from './views/customhooks/useSocket'
import Cookies from 'js-cookie'


// Lazy-loaded containers and pages
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))

//Token check for dashboard
const RequireAuth = ({ children }) => {
  const token = Cookies.get('crdnsMaintToken')

  if (!token) {
    // Redirect to login if token is missing
    return <Navigate to="/login" replace />
  }

  return children
}

// Redirect authenticated users away from login page
const RedirectIfAuth = ({ children }) => {
  const token = Cookies.get('crdnsMaintToken')

  if (token) {
    return <Navigate to="/" replace />
  }

  return children
}


const AppContent = React.memo(() => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    // Clean up legacy storage so token is exclusively in cookie storage
    sessionStorage.removeItem('crdnsMaintToken')
    sessionStorage.removeItem('workerInfo')
    localStorage.removeItem('crdnsMaintToken')
    localStorage.removeItem('workerInfo')

    if (!socket.connected) socket.connect()
  }, [])

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]

    if (theme) {
      setColorMode(theme)
    } else if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <Routes>
      {/* Public login page */}
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <Login />
          </RedirectIfAuth>
        }
      />

      {/* Protected dashboard */}
      <Route
        path="*"
        element={
          <RequireAuth>
            <DefaultLayout />
          </RequireAuth>
        }
      />
    </Routes>
  )
})

const App = () => (
  <HashRouter>
    <Suspense
      fallback={
        <div className="pt-5 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <LoaderBus />
        </div>
      }
    >
      <TokenProvider>
        <AppContent />
      </TokenProvider>
    </Suspense>
  </HashRouter>
)

export default React.memo(App)
