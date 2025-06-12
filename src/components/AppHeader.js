// src/AppHeader.js
import React, { useRef, useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react'
import { CIcon } from '@coreui/icons-react'
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons'
import { AppBreadcrumb } from './index'
import { User, Headset, LogOut } from 'lucide-react'
import '../index.css'
import './header.css'
import routes from '../routes'

const AppHeader = () => {
  const headerRef = useRef()
  const { colorMode, setColorMode } = useColorModes()
  const [view, setView] = useState(false)

  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  const handleView = () => {
    setView(!view)
  }

  // Display Route name

  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname)
    return currentRoute ? currentRoute.name : 'Profile Logs'
  }

  // const getRouteName = (pathname) => {
  //   const segments = pathname.split('/').filter(Boolean)
  //   return segments.length ? segments[segments.length - 1] : 'Dashboard'
  // }

  const currentPathname = useLocation().pathname
  const currentRouteName = getRouteName(currentPathname, routes)

  const handleBackToCredence = () => {
    window.history.replaceState(null, '', '/')
    // window.location.href = 'http://localhost:3000'
    window.location.href = import.meta.env.VITE_API_CREDENCE_URL
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0 darkBackground" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>


        <div style={{ display: 'flex' }}>
          <CHeaderToggler
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
            style={{ marginInlineStart: '-14px', background: 'transparent', border: 'none' }}
          >
            <CIcon icon={cilMenu} size="lg" style={{ color: 'white' }} />
          </CHeaderToggler>

          <span style={{ fontWeight: '700', fontSize: '1.3rem', color: 'white' }}>
            {currentRouteName}
          </span>
        </div>


        {/* NOTIFICATION */}
        <CHeaderNav>
          <CDropdown>
            <CDropdownToggle className="btn p-0 bg-transparent border-0" caret={false}>
              <CIcon icon={cilBell} size="lg" style={{ color: 'white' }} />
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem>Notification 1</CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
          <div className="vr mx-3 bg-white"></div>


          {/* USER PROFILE */}
          <CDropdown>
            <CDropdownToggle className="btn p-0 bg-transparent border-0" caret={false}>
              <img
                src="https://api.dicebear.com/9.x/initials/svg?seed=User Name"
                alt="avatar"
                className="rounded-circle"
                style={{ width: '30px', height: '30px' }}
              />
            </CDropdownToggle>
            <CDropdownMenu>
              <CNavItem>
                <CDropdownItem
                  className="d-flex align-items-center gap-4"
                  type="button"
                  to="/ProfileSection"
                  as={NavLink}
                >
                  {' '}
                  <User /> User Name
                </CDropdownItem>
              </CNavItem>
              {/* <CDropdownItem
                className="d-flex align-items-center gap-4"
                type="button"
                to="/HelpAndSupport"
                as={NavLink}
              >
                {' '}
                <Headset /> Help & Support
              </CDropdownItem> */}
              <CNavItem>
                <CDropdownItem
                  className="d-flex align-items-center gap-4"
                  type="button"
                  onClick={handleBackToCredence}
                >
                  {' '}
                  <LogOut /> Credence
                </CDropdownItem>
              </CNavItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default AppHeader
