/* eslint-disable prettier/prettier */
import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const TokenContext = createContext(null)
export const SetTokenContext = createContext(() => {})

const TOKEN_KEY = 'crdnsMaintToken'

// Helper function to get cookie value by name
const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(';').shift()
  return null
}

// Get initial token synchronously so role is available on first render (no flicker on refresh)
const getInitialToken = () => {
  const hash = window.location.hash
  const hashParams = new URLSearchParams(hash.split('?')[1])
  const extractedToken = hashParams.get('token')

  if (extractedToken) {
    sessionStorage.setItem(TOKEN_KEY, extractedToken)
    return extractedToken
  }

  const storedToken =
    sessionStorage.getItem(TOKEN_KEY) ||
    localStorage.getItem(TOKEN_KEY) ||
    getCookie(TOKEN_KEY)

  if (storedToken) {
    sessionStorage.setItem(TOKEN_KEY, storedToken)
    return storedToken
  }

  return null
}

export const TokenProvider = ({ children }) => {
  const [token, setToken] = useState(getInitialToken)

  useEffect(() => {
    // Handle token from URL (login redirect) — clean URL after extracting
    const hash = window.location.hash
    const hashParams = new URLSearchParams(hash.split('?')[1])
    const extractedToken = hashParams.get('token')

    if (extractedToken) {
      sessionStorage.setItem(TOKEN_KEY, extractedToken)
      setToken(extractedToken)
      // Remove token from URL without reload
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    }
  }, [])

  return (
    <TokenContext.Provider value={token}>
      <SetTokenContext.Provider value={setToken}>
        {children}
      </SetTokenContext.Provider>
    </TokenContext.Provider>
  )
}

TokenProvider.propTypes = {
  children: PropTypes.node,
}
