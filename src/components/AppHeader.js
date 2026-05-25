import React, { useRef, useEffect, useState, useContext } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
import Swal from 'sweetalert2'; // Make sure to install sweetalert2 if not already

const AppHeader = () => {
  const headerRef = useRef();
  const navigate = useNavigate();
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

  // Function to clear all storage
  const clearAllStorage = () => {
    // Clear session storage
    sessionStorage.clear();
    
    // Clear local storage
    localStorage.clear();
    
    // Clear all cookies
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      
      // Delete cookie for current path
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
      
      // Delete cookie for root domain
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname}`;
      
      // Delete cookie for all subdomains
      const domainParts = window.location.hostname.split('.');
      if (domainParts.length >= 2) {
        const baseDomain = domainParts.slice(-2).join('.');
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${baseDomain}`;
      }
    }
    
    // Clear using js-cookie (if needed for specific cookies)
    const allCookies = Cookies.get();
    Object.keys(allCookies).forEach(cookieName => {
      Cookies.remove(cookieName);
      Cookies.remove(cookieName, { path: '/' });
      Cookies.remove(cookieName, { path: '/', domain: window.location.hostname });
    });
  };

  // Function to handle logout with confirmation
  const handleLogout = async () => {
    // Show confirmation dialog
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You are about to logout. All unsaved data will be lost.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // Show loading state
        Swal.fire({
          title: 'Logging out...',
          text: 'Please wait while we log you out',
          icon: 'info',
          showConfirmButton: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        // Clear all storage
        clearAllStorage();

        // Disconnect socket if connected
        if (socket && socket.connected) {
          socket.disconnect();
        }

        // Dispatch logout action if you have Redux state for auth
        // dispatch({ type: 'LOGOUT' });

        // Small delay to ensure all storage is cleared
        setTimeout(() => {
          Swal.fire({
            title: 'Logged Out!',
            text: 'You have been successfully logged out.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
          }).then(() => {
            // Navigate to login page
            navigate('/login', { replace: true });
            // Force reload to reset all app state
            window.location.reload();
          });
        }, 500);
      } catch (error) {
        console.error('Logout error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'An error occurred during logout. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  // Alternative: Simple logout without Swal (if you don't want to add sweetalert2)
  const handleSimpleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      clearAllStorage();
      
      if (socket && socket.connected) {
        socket.disconnect();
      }
      
      navigate('/login', { replace: true });
      window.location.reload();
    }
  };

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
                  as={NavLink}
                  to="/ProfileSection"
                >
                  <User size={18} />
                  <span>{username}</span>
                </CDropdownItem>
              </CNavItem>
              <CNavItem>
                <CDropdownItem
                  className="d-flex align-items-center gap-4"
                  type="button"
                  onClick={handleLogout}
                >
                  <LogOut size={18} />
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