import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CForm,
  CFormInput,
  CFormCheck,
  CInputGroup,
  CInputGroupText,
} from '@coreui/react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import BackImg from '../../../assets/brand/FMSGroup.svg'
import logo from '../../../assets/brand/fmslogo.svg'
import { LoginUser } from './data'
import PermissionService from '../../Services/Service'
import usePermissionStore from '../../../store/permission'
import { SetTokenContext } from '../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'

const Login = () => {
  const navigate = useNavigate()
  const setToken = useContext(SetTokenContext)
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false) // new state

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await LoginUser(credentials)
      const token = response?.token

      if (token) {
        // Update TokenContext reactively so sidebar role filter works without refresh
        setToken(token)

        // Store exclusively in sessionStorage
        sessionStorage.setItem('crdnsMaintToken', token)
        if (response?.worker) {
          sessionStorage.setItem('workerInfo', JSON.stringify(response.worker))
        }

        // Clean up legacy cookies and localStorage
        document.cookie = 'crdnsMaintToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        document.cookie = `crdnsMaintToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`
        const parts = window.location.hostname.split('.')
        if (parts.length >= 2) {
          const baseDomain = parts.slice(-2).join('.')
          document.cookie = `crdnsMaintToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${baseDomain};`
        }
        localStorage.removeItem('crdnsMaintToken')

        // Check user role from decoded token
        let userRole = ''
        try {
          const decoded = jwtDecode(token)
          userRole = (decoded?.role || '').toString().toLowerCase().trim()
        } catch {}

        const isSuperAdmin =
          userRole === 'superadmin' ||
          userRole.includes('superadmin') ||
          userRole === 'admin'

        // Superadmin has full unrestricted access — do not check permissions
        if (isSuperAdmin) {
          usePermissionStore.getState().clearPermissions()
        } else if (response?.worker) {
          // If worker logged in, fetch and store permissions
          try {
            const permissionRes = await PermissionService.getAll()
            if (permissionRes && permissionRes.permissions) {
              usePermissionStore.getState().setPermissions(permissionRes.permissions)
            }
          } catch (permErr) {
            console.error('Failed to fetch worker permissions during login:', permErr)
          }
        } else {
          // If supervisor / user logged in, fetch their own permissions
          try {
            const permissionRes = await PermissionService.getMySupervisorPermissions()
            if (permissionRes && permissionRes.permissions) {
              usePermissionStore.getState().setPermissions(permissionRes.permissions)
              sessionStorage.setItem('skipNextPermissionFetch', 'true')
            }
          } catch (supErr) {
            // Non-supervisor users without assigned restrictions will skip
          }
        }

        // Use replace instead of navigate to prevent back navigation to login
        navigate('/', { replace: true })
      } else {
        setError('Invalid login response')
      }
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        height: '100vh',
        backgroundImage: `url(${BackImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {/* Glass Effect Card */}
      <CCard
        className="shadow-lg d-flex flex-column justify-content-center"
        style={{
          width: '400px',
          minHeight: '450px',
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: '20px',
          backdropFilter: 'blur(8px)',
          padding: '40px 30px',
        }}
      >
        <CCardBody className="d-flex flex-column justify-content-center">
          {/* Logo */}
          <div className="text-center mb-5">
            <img src={logo} alt="FMS Logo" style={{ height: '60px' }} />
          </div>

          {/* Inline style for placeholder color */}
          <style>
            {`
              .white-placeholder::placeholder {
                color: white !important;
                opacity: 1;
              }
            `}
          </style>

          <CForm onSubmit={handleSubmit} className="d-flex flex-column justify-content-center">
            {/* Username Input */}
            <div className="mb-4">
              <CInputGroup>
                <CInputGroupText
                  style={{ background: 'transparent', border: 'none', color: 'white' }}
                >
                  <Mail size={18} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  name="username"
                  placeholder="Enter your Username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  className="white-placeholder"
                  style={{
                    background: 'transparent',
                    color: 'white',
                    border: 'none',
                    borderBottom: '1px solid gray',
                  }}
                />
              </CInputGroup>
            </div>

            {/* Password Input with show/hide icon */}
            <div className="mb-4">
              <CInputGroup>
                <CInputGroupText
                  style={{ background: 'transparent', border: 'none', color: 'white' }}
                >
                  <Lock size={18} />
                </CInputGroupText>
                <CFormInput
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Enter your Password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="white-placeholder"
                  style={{
                    background: 'transparent',
                    color: 'white',
                    border: 'none',
                    borderBottom: '1px solid gray',
                  }}
                />
                <CInputGroupText
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                  }}
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </CInputGroupText>
              </CInputGroup>
            </div>

            {/* Remember Me */}
            <div className="align-items-center mb-4 text-white">
              <CFormCheck
                id="rememberMe"
                label="Remember me"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
            </div>

            {/* Error */}
            {error && <div className="text-danger mb-3">{error}</div>}

            {/* Login Button */}
            <CButton
              type="submit"
              color="dark"
              className="w-100 fw-bold"
              style={{ backgroundColor: '#f39c12', border: 'none', padding: '10px 0' }}
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  )
}

export default Login
