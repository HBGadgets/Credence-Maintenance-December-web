/* eslint-disable prettier/prettier */
import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const TokenContext = createContext(null)
export const SetTokenContext = createContext(() => {})

const TOKEN_KEY = 'crdnsMaintToken'

// Get initial token synchronously from sessionStorage or URL hash
const getInitialToken = () => {
  const hash = window.location.hash
  const hashParams = new URLSearchParams(hash.split('?')[1])
  const extractedToken = hashParams.get('token')

  if (extractedToken) {
    sessionStorage.setItem(TOKEN_KEY, extractedToken)
    return extractedToken
  }

  return sessionStorage.getItem(TOKEN_KEY)
}

export const TokenProvider = ({ children }) => {
  const [token, setTokenState] = useState(getInitialToken)

  const setToken = (newToken) => {
    if (newToken) {
      sessionStorage.setItem(TOKEN_KEY, newToken)
    } else {
      sessionStorage.removeItem(TOKEN_KEY)
    }
    setTokenState(newToken)
  }

  useEffect(() => {
    // Handle token from URL (login redirect) — clean URL after extracting
    const hash = window.location.hash
    const hashParams = new URLSearchParams(hash.split('?')[1])
    const extractedToken = hashParams.get('token')

    if (extractedToken) {
      sessionStorage.setItem(TOKEN_KEY, extractedToken)
      setTokenState(extractedToken)
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
