/* eslint-disable prettier/prettier */
import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const TokenContext = createContext(null)

const TOKEN_KEY = 'crdnsMaintToken'

// Helper function to get cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(null)

  useEffect(() => {
    const hash = window.location.hash // e.g. "#/login?token=abc123"
    const hashParams = new URLSearchParams(hash.split('?')[1])
    const extractedToken = hashParams.get('token')

    if (extractedToken) {
      sessionStorage.setItem(TOKEN_KEY, extractedToken)
      setToken(extractedToken)
      // Remove token from URL without reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    } else {
      // First check sessionStorage
      const storedToken = sessionStorage.getItem(TOKEN_KEY)

      if (storedToken) {
        setToken(storedToken)
      } else {
        // If not in sessionStorage, check cookies
        const cookieToken = getCookie(TOKEN_KEY)
        if (cookieToken) {
          // Save cookie token to sessionStorage
          sessionStorage.setItem(TOKEN_KEY, cookieToken)
          setToken(cookieToken)
        } else {
          setToken(null)
        }
      }
    }
  }, [])

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}

TokenProvider.propTypes = {
  children: PropTypes.node,
}
