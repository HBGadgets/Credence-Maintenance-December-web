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
import { HashRouter, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { CSpinner, useColorModes } from '@coreui/react'

import './scss/style.scss'
import { TokenProvider } from './context/TokenContext'
import LoaderBus from './components/Loader3/LoaderBus'

// Lazy-loaded containers and pages
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)

  useEffect(() => {
    // Use search instead of parsing href
    const urlParams = new URLSearchParams(window.location.search)
    const theme = urlParams.get('theme')?.match(/^[A-Za-z0-9\s]+/)?.[0]

    if (theme) {
      setColorMode(theme)
    } else if (!isColorModeSet()) {
      setColorMode(storedTheme)
    }
  }, [isColorModeSet, setColorMode, storedTheme])

  return (
    <HashRouter>
      <Suspense
        fallback={
          <div className="pt-5 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
            <LoaderBus />
          </div>
        }
      >
        <TokenProvider>
          <Routes>
            <Route path="*" element={<DefaultLayout />} />
          </Routes>
        </TokenProvider>
      </Suspense>
    </HashRouter>
  )
}

export default React.memo(App)



