import React, { useRef, useEffect, useState, useContext, useMemo } from 'react';
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
  useColorModes,
  CBadge,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasBody,
  CCloseButton,
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
import { User, Headset, LogOut, Volume2, VolumeX, PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react';
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

import navigation from '../_nav';
import logo from '../assets/brand/fmslogo.svg';
import { AppSidebarNav } from './AppSidebarNav';
import PermissionService from '../views/Services/Service';
import usePermissionStore from '../store/permission';

// Helper: Recursively filter items by role and permission
const filterNavByRole = (items, role) => {
  const roleLower = (role || '').toString().toLowerCase().trim();
  const isSuperAdmin =
    roleLower === 'superadmin' ||
    roleLower.includes('superadmin') ||
    roleLower === 'admin';

  // If superadmin, completely bypass all permission and role restrictions
  if (isSuperAdmin) {
    return items;
  }

  const isEmployee = Boolean(
    Cookies.get('workerInfo') ||
    roleLower === 'worker' ||
    roleLower === 'employee'
  );

  return items
    .map((item) => {
      // 0. Do not show employee section or module to employee
      if (
        isEmployee &&
        (item.permission === 'masters.employee' ||
          item.to === '/Worker' ||
          (item.name && item.name.trim().toLowerCase() === 'employees'))
      ) {
        return null;
      }

      // 1. Check role if specified
      if (item.role && item.role.toString().toLowerCase() !== roleLower) return null;

      // 2. Check permission if specified
      if (item.permission && !PermissionService.hasPermission(item.permission, 'read')) {
        return null;
      }

      if (item.items) {
        const filteredItems = filterNavByRole(item.items, role);
        return filteredItems.length ? { ...item, items: filteredItems } : null;
      }
      return item;
    })
    .filter(Boolean);
};

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

  const token = Cookies.get('crdnsMaintToken');

  const [username, setUsername] = useState(() => {
    const storedWorker = Cookies.get('workerInfo');
    if (storedWorker) {
      try {
        const worker = JSON.parse(storedWorker);
        if (worker?.name) return worker.name;
      } catch (e) {
        console.error('Failed to parse workerInfo:', e);
      }
    }
    const savedToken = Cookies.get('crdnsMaintToken');
    if (!savedToken) return 'User';
    try {
      const decoded = jwtDecode(savedToken);
      return decoded?.worker?.name || decoded?.username || decoded.name || 'User';
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
    const storedWorker = Cookies.get('workerInfo');
    if (storedWorker) {
      try {
        const worker = JSON.parse(storedWorker);
        if (worker?.name) {
          setUsername(worker.name);
          return;
        }
      } catch (e) {
        console.error('Failed to parse workerInfo in useEffect:', e);
      }
    }
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded?.worker?.name || decoded?.username || decoded.name || 'User');
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

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Superadmin / Role filter
  const userRole = useMemo(() => {
    if (!token || typeof token !== 'string') return null;
    try {
      const decoded = jwtDecode(token);
      return (decoded?.role || '').toString().toLowerCase().trim();
    } catch {
      return null;
    }
  }, [token]);

  const permissions = usePermissionStore((state) => state.permissions);
  const filteredNav = useMemo(() => filterNavByRole(navigation, userRole), [userRole, permissions]);

  useEffect(() => {
    if (mobileNavOpen) {
      setMobileNavOpen(false);
    }
  }, [currentPathname, mobileNavOpen]);

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

  const isDirectActive = (to) => {
    if (!to) return false;
    return (
      currentPathname.toLowerCase() === to.toLowerCase() ||
      currentPathname.toLowerCase().startsWith(to.toLowerCase() + '/')
    );
  };

  const getInitials = (name) => {
    if (!name || name === 'User') return 'PA';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const activeSection = useSelector((state) => state.activeSection || 'Dashboard');

  const currentSection = useMemo(() => {
    return filteredNav.find(
      (item) => item.name && item.name.trim().toLowerCase() === activeSection.trim().toLowerCase()
    );
  }, [filteredNav, activeSection]);

  const hasSubItems = Boolean(currentSection?.items && currentSection.items.length > 0);

  const prevPathnameRef = useRef(null);

  useEffect(() => {
    // Only synchronize activeSection when the actual route/pathname changes
    if (prevPathnameRef.current === currentPathname) return;
    prevPathnameRef.current = currentPathname;

    for (const item of filteredNav) {
      if (item.items) {
        const match = item.items.some(
          (sub) => sub.to && (
            currentPathname.toLowerCase() === sub.to.toLowerCase() ||
            currentPathname.toLowerCase().startsWith(sub.to.toLowerCase() + '/')
          )
        );
        if (match) {
          dispatch({ type: 'set', activeSection: item.name, sidebarShow: true });
          return;
        }
      } else if (item.to) {
        if (
          currentPathname.toLowerCase() === item.to.toLowerCase() ||
          currentPathname.toLowerCase().startsWith(item.to.toLowerCase() + '/')
        ) {
          dispatch({ type: 'set', activeSection: item.name, sidebarShow: false });
          return;
        }
      }
    }
  }, [currentPathname, dispatch, filteredNav]);

  const handleNavbarOptionClick = (item) => {
    if (item.items && item.items.length > 0) {
      if (activeSection.trim().toLowerCase() === item.name.trim().toLowerCase()) {
        // Toggle sidebar if clicking the already active section
        dispatch({ type: 'set', sidebarShow: !sidebarShow });
      } else {
        // Switch section and open its sidebar without redirecting to the first sub-page
        dispatch({ type: 'set', activeSection: item.name, sidebarShow: true });
      }
    } else if (item.to) {
      dispatch({ type: 'set', activeSection: item.name, sidebarShow: false });
      navigate(item.to);
    }
  };

  return (
    <CHeader position="sticky" className="mb-0 p-0 navy-navbar border-0" ref={headerRef}>
      <CContainer className="px-3 px-md-4 h-100 d-flex align-items-center justify-content-between position-relative" fluid>
        {/* Left: Mobile Toggler, Desktop Sidebar Toggle, Logo & Vertical Divider */}
        <div className="d-flex align-items-center z-1">
          {/* Mobile Drawer Toggler */}
          <button
            type="button"
            onClick={() => setMobileNavOpen(true)}
            className="d-lg-none border-0 bg-transparent p-0 me-2 text-white"
            aria-label="Toggle navigation drawer"
            title="Navigation Menu"
          >
            <Menu size={22} />
          </button>

          {/* Desktop Sidebar Toggle Button (when section has sub-options) */}
          {hasSubItems && (
            <button
              type="button"
              onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
              className="d-none d-lg-inline-flex align-items-center justify-content-center sidebar-header-toggle-btn me-2"
              aria-label={sidebarShow ? "Collapse sidebar" : "Open sidebar"}
              title={sidebarShow ? "Collapse sidebar" : "Open sidebar"}
            >
              {sidebarShow ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
            </button>
          )}

          <NavLink to="/dashboard" className="d-flex align-items-center text-decoration-none me-2">
            <img src={logo} alt="Credence FMS" height={34} style={{ objectFit: 'contain' }} />
          </NavLink>

          <span
            className="text-white opacity-25 fw-light fs-5 user-select-none d-none d-sm-inline"
          >
            |
          </span>
        </div>

        {/* Center: Desktop Navigation Links (centered horizontally & vertically) */}
        <div className="d-none d-lg-flex align-items-center justify-content-center position-absolute start-50 top-50 translate-middle">
          <ul className="nav-links-center">
            {filteredNav.map((item, index) => {
              // Skip section titles
              if (item.component?.name === 'CNavTitle' || item.name === 'Maintenance') {
                return null;
              }

              const isSectionActive =
                activeSection &&
                item.name &&
                activeSection.trim().toLowerCase() === item.name.trim().toLowerCase();

              return (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleNavbarOptionClick(item)}
                    className={`pill-nav-item ${isSectionActive ? 'active' : ''}`}
                  >
                    {item.name.trim()}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Right: Notification Bell & User Avatar */}
        <CHeaderNav as="div" className="ms-auto d-flex align-items-center z-1">
          {/* Notifications Bell */}
          <div className="position-relative me-2">
            <NotificationDropdown
              notifications={notifications}
              unreadCounts={unreadCounts}
              onClear={handleClearNotifications}
              bellColor="white"
            />
          </div>

          {/* User Profile Avatar Pill (Orange circle with initials 'PA') */}
          <CDropdown>
            <CDropdownToggle className="btn p-0 bg-transparent border-0 d-flex align-items-center" caret={false}>
              <div className="user-avatar-pill">
                {getInitials(username)}
              </div>
            </CDropdownToggle>
            <CDropdownMenu className="navy-dropdown-menu shadow" placement="bottom-end">
              {/* <CDropdownItem
                className="navy-dropdown-item d-flex align-items-center gap-3"
                as={NavLink}
                to="/ProfileSection"
              >
                <User size={16} />
                <span>Profile ({username})</span>
              </CDropdownItem> */}
              <CDropdownItem
                className="navy-dropdown-item d-flex align-items-center gap-3 text-danger"
                type="button"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>

      {/* Mobile Offcanvas Navigation Drawer */}
      <COffcanvas
        placement="start"
        visible={mobileNavOpen}
        onHide={() => setMobileNavOpen(false)}
        style={{ backgroundColor: '#0a2d63', color: 'white', maxWidth: '300px' }}
      >
        <COffcanvasHeader className="border-bottom border-secondary d-flex justify-content-between align-items-center py-3 px-3">
          <NavLink to="/dashboard" onClick={() => setMobileNavOpen(false)}>
            <img src={logo} alt="Logo" height={42} />
          </NavLink>
          <CCloseButton dark onClick={() => setMobileNavOpen(false)} />
        </COffcanvasHeader>
        <COffcanvasBody className="p-0">
          <AppSidebarNav items={filteredNav} />
        </COffcanvasBody>
      </COffcanvas>
    </CHeader>
  );
};

export default React.memo(AppHeader);