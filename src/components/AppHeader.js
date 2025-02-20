// src/AppHeader.js
import React, { useRef, useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
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

  return (
    <CHeader position="sticky" className="mb-4 p-0 darkBackground" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
        // onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        // style={{ marginInlineStart: '-14px' }}
        >
          {/* <CIcon icon={cilMenu} size="lg" style={{ color: 'white' }} /> */}
        </CHeaderToggler>
        {/* <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}

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

          {/* THEME */}
          {/* <CDropdown variant="nav-item" placement="bottom-end">
            <CDropdownToggle caret={false}>
              {colorMode === 'dark' ? (
                <CIcon icon={cilMoon} size="lg" style={{ color: 'white' }} />
              ) : colorMode === 'auto' ? (
                <CIcon icon={cilContrast} size="lg" style={{ color: 'white' }} />
              ) : (
                <CIcon icon={cilSun} size="lg" className="rotate-on-hover" style={{ color: 'white' }} />
              )}
            </CDropdownToggle>
            <CDropdownMenu>
              <CDropdownItem
                active={colorMode === 'light'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('light')}
              >
                <CIcon className="me-2 rotate-on-hover" icon={cilSun} size="lg" /> Light
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'dark'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('dark')}
              >
                <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
              </CDropdownItem>
              <CDropdownItem
                active={colorMode === 'auto'}
                className="d-flex align-items-center"
                as="button"
                type="button"
                onClick={() => setColorMode('auto')}
              >
                <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown> */}

          {/* <li className="nav-item py-1">
            <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
          </li> */}
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
                <CDropdownItem className="d-flex align-items-center gap-4 disable">
                  {' '}
                  <User /> User Name
                </CDropdownItem>
              </CNavItem>
              <CDropdownItem
                className="d-flex align-items-center gap-4"
                type="button"
                to="/HelpAndSupport"
                as={NavLink}
              >
                {' '}
                <Headset /> Help & Support
              </CDropdownItem>
              <CNavItem>
                <CDropdownItem className="d-flex align-items-center gap-4" type="button">
                  {' '}
                  <LogOut /> Logout
                </CDropdownItem>
              </CNavItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>
      {/* <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer> */}
    </CHeader>
  )
}

export default AppHeader
