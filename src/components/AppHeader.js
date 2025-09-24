import React, { useRef, useEffect, useState, useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavItem,
  useColorModes,
  CBadge,
} from '@coreui/react';
import { CIcon } from '@coreui/icons-react';
import {
  cilBell,
  cilContrast,
  cilEnvelopeOpen,
  cilList,
  cilMenu,
  cilMoon,
  cilSun,
} from '@coreui/icons';
import { AppBreadcrumb } from './index';
import { User, Headset, LogOut, Volume2, VolumeX } from 'lucide-react';
import '../index.css';
import './header.css';
import routes from '../routes';
import { TokenContext } from '../context/TokenContext';
import { jwtDecode } from 'jwt-decode';
import NotificationDropdown from '../views/components/NotificationDropdown';
import { NotificationContext } from '../context/NotificationContext';
import { socket } from '../views/customhooks/useSocket';
import Cookies from 'js-cookie';


const AppHeader = () => {
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes();
  const [view, setView] = useState(false);
  const { notifications, setNotifications, unreadCounts, setUnreadCounts } = useContext(NotificationContext);
  const totalUnread = Object.values(unreadCounts).reduce((a, b) => a + b, 0);

  // Function to clear notifications
  const handleClearNotifications = () => {
    setUnreadCounts({}); //clear unread counts
  };

  const token = Cookies.get('crdnsMaintToken') || useContext(TokenContext);

  // Helper to get a cookie by name
  const getCookie = (name) => {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };

  const [username, setUsername] = useState(() => {
    const savedToken = sessionStorage.getItem('crdnsMaintToken');
    if (!savedToken) return 'User';
    try {
      const decoded = jwtDecode(savedToken);
      return decoded?.username || decoded.name || 'User';
    } catch {
      return 'User';
    }
  });

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);

  useEffect(() => {
    const handleScroll = () => {
      headerRef.current && headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    };

    document.addEventListener('scroll', handleScroll);
    return () => document.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded?.username || decoded.name || 'User'); // Adjust based on your token structure
      } catch (error) {
        console.error('Failed to decode token:', error);
      }
    }
  }, [token]);

  const handleView = () => {
    setView(!view);
  };

  // Display Route name
  const getRouteName = (pathname, routes) => {
    const currentRoute = routes.find((route) => route.path === pathname);
    return currentRoute ? currentRoute.name : 'Profile Logs';
  };

  const currentPathname = useLocation().pathname;
  const currentRouteName = getRouteName(currentPathname, routes);

  const handleBackToCredence = () => {
    // 1️⃣ Clear session and local storage
    sessionStorage.clear()
    localStorage.clear()

    // 2️⃣ Remove all JS-accessible cookies
    document.cookie.split(';').forEach((c) => {
      const eqPos = c.indexOf('=')
      const name = eqPos > -1 ? c.substr(0, eqPos).trim() : c.trim()

      // Remove for current path
      document.cookie = `${name}=; Max-Age=0; path=/`

      // Remove for root domain
      document.cookie = `${name}=; Max-Age=0; path=/; domain=${window.location.hostname}`

      // Remove for wildcard subdomain (if hostname has subdomain)
      const parts = window.location.hostname.split('.')
      if (parts.length > 2) {
        const rootDomain = parts.slice(-2).join('.')
        document.cookie = `${name}=; Max-Age=0; path=/; domain=.${rootDomain}`
      }
    })

    // 3️⃣ Disconnect socket if any
    if (socket?.connected) socket.disconnect()

    // 4️⃣ Reload / redirect to login
    window.location.replace('#/login')
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
        <CHeaderNav className="ms-auto d-flex align-items-center">
          <div className="position-relative">
            <NotificationDropdown
              notifications={notifications}
              unreadCounts={unreadCounts}
              onClear={handleClearNotifications}
            />
            {totalUnread > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: '0.7rem' }}
              >
                {totalUnread}
              </span>
            )}
          </div>
          <div className="vr mx-3 bg-white"></div>
          {/* USER PROFILE */}
          <CDropdown>
            <CDropdownToggle className="btn p-0 bg-transparent border-0" caret={false}>
              <img
                src={`https://api.dicebear.com/9.x/initials/svg?seed=${username}`}
                alt="avatar"
                className="rounded-circle"
                style={{ width: '30px', height: '30px' }}
              />
            </CDropdownToggle>
            <CDropdownMenu>
              <CNavItem>
                <CDropdownItem
                  className="d-flex align-items-center gap-4"
                  // type="button"
                  // to="/ProfileSection"
                  as={NavLink}
                >
                  {' '}
                  <User />
                  <span>{username}</span>
                </CDropdownItem>
              </CNavItem>
              <CNavItem>
                <CDropdownItem
                  className="d-flex align-items-center gap-4"
                  type="button"
                  onClick={handleBackToCredence}
                >
                  {' '}
                  <LogOut />
                  Logout
                </CDropdownItem>
              </CNavItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  );
};

export default AppHeader;