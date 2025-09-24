import React, { useState } from 'react'
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
import Cookies from 'js-cookie'

const Login = () => {
  const navigate = useNavigate()
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
        // Store in localStorage/sessionStorage based on "remember me"
        if (remember) {
          localStorage.setItem('crdnsMaintToken', token)
        } else {
          sessionStorage.setItem('crdnsMaintToken', token)
        }

        // Set cookie for 7 days if remember is checked, else session cookie
        Cookies.set('crdnsMaintToken', token, {
          expires: remember ? 1 : undefined, // 1 day for remember
          sameSite: 'Strict', // optional but recommended
        })

        navigate('/')
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
