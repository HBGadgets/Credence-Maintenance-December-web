/* eslint-disable prettier/prettier */
import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import Cookies from 'js-cookie'

export const TokenContext = createContext(null)
export const SetTokenContext = createContext(() => {})

const TOKEN_KEY = 'crdnsMaintToken'

// Get initial token synchronously from Cookies or URL hash
const getInitialToken = () => {
  const hash = window.location.hash
  const hashParams = new URLSearchParams(hash.split('?')[1])
  const extractedToken = hashParams.get('token')

  if (extractedToken) {
    Cookies.set(TOKEN_KEY, extractedToken, { path: '/' })
    return extractedToken
  }

  return Cookies.get(TOKEN_KEY)
}

export const TokenProvider = ({ children }) => {
  const [token, setTokenState] = useState(getInitialToken)

  const setToken = (newToken) => {
    if (newToken) {
      Cookies.set(TOKEN_KEY, newToken, { path: '/' })
    } else {
      Cookies.remove(TOKEN_KEY, { path: '/' })
    }
    setTokenState(newToken)
  }

  useEffect(() => {
    // Handle token from URL (login redirect) — clean URL after extracting
    const hash = window.location.hash
    const hashParams = new URLSearchParams(hash.split('?')[1])
    const extractedToken = hashParams.get('token')

    if (extractedToken) {
      Cookies.set(TOKEN_KEY, extractedToken, { path: '/' })
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
