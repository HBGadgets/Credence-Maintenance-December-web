// import React, { useState, useMemo } from 'react'
// import { useQuery } from '@tanstack/react-query'
// import { fetchDrivers } from '../../../DriverExpert/data/drivers'

// const ChatSidebar = ({ selectedContact, onSelectContact, unread }) => {
//   const { data: drivers = [], isFetching } = useQuery({
//     queryKey: ['drivers'],
//     queryFn: fetchDrivers,
//     staleTime: 1000 * 60 * 30,
//   })

//   const [search, setSearch] = useState('')
//   const filteredDrivers = useMemo(() => {
//     return drivers.filter((d) => d.name?.toLowerCase().includes(search.toLowerCase()))
//   }, [drivers, search])

//   return (
//     <div className="chat-sidebar border-end" style={{ width: '250px' }}>
//       {/* Search */}
//       <div className="p-2">
//         <input
//           className="form-control"
//           placeholder="Search Conversations"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>

//       {isFetching && <div className="p-2 text-muted">Loading...</div>}
//       {!isFetching && filteredDrivers.length === 0 && (
//         <div className="p-2 text-muted">No contacts found</div>
//       )}

//       <ul className="list-unstyled m-0">
//         {filteredDrivers.map((driver) => {
//           const isSelected = selectedContact?.id === driver.id
//           const unreadCount = unread?.[driver.id] || 0

//           return (
//             <li
//               key={driver.id}
//               role="button"
//               className={`d-flex align-items-center p-2 ${
//                 isSelected ? 'bg-light fw-semibold' : ''
//               }`}
//               style={{ cursor: 'pointer' }}
//               onClick={() => onSelectContact(driver)}
//             >
//               {/* Avatar */}
//               <div
//                 className="rounded-circle d-flex justify-content-center align-items-center me-2"
//                 style={{
//                   width: 35,
//                   height: 35,
//                   background: '#6c63ff',
//                   color: '#fff',
//                   flexShrink: 0,
//                 }}
//               >
//                 {driver.name?.slice(0, 2).toUpperCase()}
//               </div>

//               {/* Name & status */}
//               <div className="flex-grow-1">
//                 <div className={unreadCount > 0 ? 'fw-bold' : ''}>
//                   {driver.name}
//                   {unreadCount > 0 && <span className="badge bg-danger ms-2">{unreadCount}</span>}
//                 </div>
//                 <small className={driver.isOnline ? 'text-success' : 'text-muted'}>
//                   {driver.isOnline ? 'Online' : 'Offline'}
//                 </small>
//               </div>
//             </li>
//           )
//         })}
//       </ul>
//     </div>
//   )
// }

// export default ChatSidebar

// -----------------------------------------------
// custome code

import React, { useState, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { fetchDrivers } from '../../../DriverExpert/data/drivers'

const ChatSidebar = ({ selectedContact, onSelectContact, unreadCounts, messages }) => {
  const { data: drivers = [], isFetching } = useQuery({
    queryKey: ['drivers'],
    queryFn: fetchDrivers,
    staleTime: 1000 * 60 * 30,
  })

  const [search, setSearch] = useState('')

  const filteredDrivers = useMemo(() => {
    return drivers
      .filter((d) => d.name?.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        const lastMsgA = messages[a.id]?.[messages[a.id].length - 1]
        const lastMsgB = messages[b.id]?.[messages[b.id].length - 1]

        const timeA = lastMsgA ? new Date(lastMsgA.createdAt).getTime() : 0
        const timeB = lastMsgB ? new Date(lastMsgB.createdAt).getTime() : 0

        return timeB - timeA
      })
  }, [drivers, search, messages])

  const formatTime = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div
      className="chat-sidebar border-end d-flex flex-column"
      style={{
        width: '250px', // keep width
        backgroundColor: '#fff',
        fontFamily: 'Segoe UI, Helvetica Neue, Helvetica, Arial, sans-serif',
      }}
    >
      {/* Search */}
      {/* Search */}
      <div className="p-2 border-bottom">
        <input
          className="form-control form-control-sm rounded-pill px-3"
          placeholder="Search or start new chat"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            backgroundColor: '#f0f2f5',
            border: 'none',
            fontSize: '0.85rem',
          }}
        />
      </div>

      {/* Section Heading */}
      <div
        className="px-3 py-1 text-uppercase"
        style={{
          fontSize: '0.7rem',
          fontWeight: '600',
          color: '#667781',
          backgroundColor: '#f0f2f5',
          letterSpacing: '0.5px',
        }}
      >
        Recent chats
      </div>

      {isFetching && <div className="p-2 text-muted">Loading...</div>}
      {!isFetching && filteredDrivers.length === 0 && (
        <div className="p-2 text-muted">No contacts found</div>
      )}
      <ul className="list-unstyled m-0 flex-grow-1 overflow-auto">
        {filteredDrivers.map((driver) => {
          const lastMsg = messages[driver.id]?.[messages[driver.id].length - 1]
          return (
            <li
              key={driver.id}
              role="button"
              className={`d-flex align-items-center px-3 py-2 chat-item ${
                selectedContact?.id === driver.id ? 'active-chat' : ''
              }`}
              onClick={() => onSelectContact(driver)}
            >
              {/* Avatar */}
              <div
                className="rounded-circle d-flex justify-content-center align-items-center me-3"
                style={{
                  width: 40,
                  height: 40,
                  background: '#dfe6e9',
                  color: '#555',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  flexShrink: 0,
                }}
              >
                {driver.name?.slice(0, 2).toUpperCase()}
              </div>

              {/* Chat Info */}
              <div className="flex-grow-1 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <div
                    style={{
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      color: '#111b21',
                    }}
                  >
                    {driver.name}
                  </div>
                  <small
                    style={{
                      fontSize: '0.7rem',
                      color: '#667781',
                    }}
                  >
                    {lastMsg ? formatTime(lastMsg.createdAt) : ''}
                  </small>
                </div>
                <div
                  className="d-flex align-items-center justify-content-between"
                  style={{
                    fontSize: '0.8rem',
                    color: '#667781',
                  }}
                >
                  <span className="text-truncate" style={{ maxWidth: '140px' }}>
                    {lastMsg ? lastMsg.text : 'No messages yet'}
                  </span>

                  {unreadCounts[driver.id] > 0 && (
                    <span
                      className="badge rounded-pill ms-2"
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#25D366',
                        color: '#fff',
                        minWidth: '18px',
                      }}
                    >
                      {unreadCounts[driver.id]}
                    </span>
                  )}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      {/* WhatsApp-like styles */}
      <style jsx>{`
        .chat-item {
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .chat-item:hover {
          background-color: #f5f6f6;
        }
        .active-chat {
          background-color: #ebebeb !important;
        }
      `}</style>
    </div>
  )
}

export default ChatSidebar
