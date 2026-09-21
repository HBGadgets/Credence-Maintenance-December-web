// BACKUP CODE

// import { createContext, useState } from 'react'

// export const NotificationContext = createContext()

// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([])
//   const [unreadCounts, setUnreadCounts] = useState({}) // <-- add this globally

//   return (
//     <NotificationContext.Provider
//       value={{
//         notifications,
//         setNotifications,
//         unreadCounts,
//         setUnreadCounts, // make updater available
//       }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   )
// }

// -------------------------------------------------------

// Costum code

import { createContext, useState, useCallback, useMemo } from 'react'

export const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCounts, setUnreadCounts] = useState({})

  // helper to add notifications consistently
  const addNotification = useCallback((msg) => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    })

    setNotifications((prev) => [
      ...prev,
      {
        message: `New message from ${msg.senderName || 'Driver'} ${msg.text} at ${time}`,
      },
    ])
  }, [])

  const value = useMemo(
    () => ({
      notifications,
      setNotifications,
      addNotification, // expose clean method
      unreadCounts,
      setUnreadCounts,
    }),
    [notifications, addNotification, unreadCounts],
  )

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}
