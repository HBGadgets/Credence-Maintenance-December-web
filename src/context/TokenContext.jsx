/* eslint-disable prettier/prettier */

import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const TokenContext = createContext(null)

const FALLBACK_URL = 'http://104.251.218.94/'
const TOKEN_KEY = 'crdnsMaintToken'

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
      window.history.replaceState(null, '', window.location.pathname)
    } else {
      const storedToken = sessionStorage.getItem(TOKEN_KEY)
      if (storedToken) {
        setToken(storedToken)
      } else {
        window.location.href = FALLBACK_URL
      }
    }
  }, [])
  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}

TokenProvider.propTypes = {
  children: PropTypes.node,
}
