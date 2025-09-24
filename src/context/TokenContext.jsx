/* eslint-disable prettier/prettier */
import React, { createContext, useEffect, useState } from 'react'
import PropTypes from 'prop-types'

export const TokenContext = createContext(null)

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
      window.history.replaceState(null, '', window.location.pathname + window.location.search)
    } else {
      const storedToken = sessionStorage.getItem(TOKEN_KEY)
      setToken(storedToken || null)
    }
  }, [])

  return <TokenContext.Provider value={token}>{children}</TokenContext.Provider>
}

TokenProvider.propTypes = {
  children: PropTypes.node,
}
