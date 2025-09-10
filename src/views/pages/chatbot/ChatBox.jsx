// PERFECT CODE BACKUP

// import React, { useState, useEffect, useContext } from 'react'
// import { socket } from '../../customhooks/useSocket'
// import ChatSidebar from './component/ChatSidebar'
// import ChatHeader from './component/ChatHeader'
// import ChatMessages from './component/ChatMessages'
// import ChatInput from './component/ChatInput'
// import notificationSound from '../../../../mario_coin.mp3'
// import { NotificationContext } from '../../../context/NotificationContext'
// import { times } from 'lodash'

// const ChatBox = () => {
//   const [selectedContact, setSelectedContact] = useState(null)
//   const [messages, setMessages] = useState({})
//   const { notifications, setNotifications, unreadCounts, setUnreadCounts } =
//     useContext(NotificationContext)

//   // safe decode JWT token
//   let myUserId = null
//   try {
//     const token = sessionStorage.getItem('crdnsMaintToken')
//     if (token) {
//       myUserId = JSON.parse(atob(token.split('.')[1]))?.id
//     }
//   } catch (err) {
//     console.error('Failed to parse userId from token', err)
//   }

//   // subscribe once to socket
//   useEffect(() => {
//     if (!socket) return

//     const handleReceive = (msg) => {
//       // Add message to state
//       setMessages((prev) => {
//         const prevMsgs = prev[msg.senderId] || []
//         return { ...prev, [msg.senderId]: [...prevMsgs, msg] }
//       })

//       // Add to global notifications
//       setNotifications((prev) => [
//         ...prev,
//         {
//           message: `New message from ${msg.senderName || 'Driver'} ${
//             msg.text
//           } at ${new Date().toLocaleTimeString('en-US', {
//             hour: 'numeric',
//             minute: 'numeric',
//             hour12: true,
//           })}`,
//         },
//       ])

//       // Play notification sound (safe for browser autoplay rules)
//       const audio = new Audio(notificationSound)
//       audio.play().catch(() => {})

//       // Increase unread count if not chatting with sender
//       setUnreadCounts((prev) => ({
//         ...prev,
//         [msg.senderId]: selectedContact?.id === msg.senderId ? 0 : (prev[msg.senderId] || 0) + 1,
//       }))
//     }

//     socket.on('receiveMessage', handleReceive)
//     return () => socket.off('receiveMessage', handleReceive)
//   }, [selectedContact, setNotifications, setUnreadCounts])

//   //  handle contact selection
//   const handleSelectContact = (driver) => {
//     setSelectedContact(driver)
//     setUnreadCounts((prev) => ({
//       ...prev,
//       [driver.id]: 0, // reset unread count
//     }))
//   }

//   // send message
//   const handleSendMessage = (text) => {
//     if (!selectedContact || !myUserId) return

//     const msg = {
//       receiverId: selectedContact.id,
//       senderId: myUserId,
//       text,
//       status: 'sent',
//       createdAt: new Date().toISOString(),
//       tempId: Date.now().toString(),
//     }

//     setMessages((prev) => {
//       const prevMsgs = prev[selectedContact.id] || []
//       return { ...prev, [selectedContact.id]: [...prevMsgs, msg] }
//     })

//     socket?.emit('sendMessage', msg)
//   }

//   return (
//     <div className="chatbox-container d-flex border rounded" style={{ height: '80vh' }}>
//       {/* Sidebar with unread counts */}
//       <ChatSidebar
//         selectedContact={selectedContact}
//         onSelectContact={handleSelectContact}
//         unreadCounts={unreadCounts}
//       />

//       {/* Chat Area */}
//       <div className="chat-area flex-grow-1 d-flex flex-column">
//         {selectedContact ? (
//           <>
//             <ChatHeader contact={selectedContact} isConnected={socket?.connected} />
//             <ChatMessages messages={messages[selectedContact?.id] || []} myUserId={myUserId} />
//             <ChatInput onSend={handleSendMessage} />
//           </>
//         ) : (
//           <div className="d-flex justify-content-center align-items-center flex-grow-1 bg-light">
//             <p className="text-muted">Select a driver to start chatting</p>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default ChatBox

// ------------------------------------------------------------------------------

// Custom code

import React, { useState, useEffect, useContext } from 'react'
import { socket } from '../../customhooks/useSocket'
import ChatSidebar from './component/ChatSidebar'
import ChatHeader from './component/ChatHeader'
import ChatMessages from './component/ChatMessages'
import ChatInput from './component/ChatInput'
import notificationSound from '../../../../mario_up.mp3'
import { NotificationContext } from '../../../context/NotificationContext'
import { fetchChatApi } from './data'

const ChatBox = () => {
  const [selectedContact, setSelectedContact] = useState(null)
  const [messages, setMessages] = useState({})
  const [loading, setLoading] = useState(false)

  const { addNotification, unreadCounts, setUnreadCounts } = useContext(NotificationContext)

  // decode userId from token
  let myUserId = null
  try {
    const token = sessionStorage.getItem('crdnsMaintToken')
    if (token) {
      myUserId = JSON.parse(atob(token.split('.')[1]))?.id
    }
  } catch (err) {
    console.error('Failed to parse userId from token', err)
  }

  // socket subscription
  useEffect(() => {
    if (!socket) return

    const handleReceive = (msg) => {
      setMessages((prev) => {
        const prevMsgs = prev[msg.senderId] || []
        return { ...prev, [msg.senderId]: [...prevMsgs, msg] }
      })

      addNotification(msg)

      const audio = new Audio(notificationSound)
      audio.play().catch(() => {})

      setUnreadCounts((prev) => ({
        ...prev,
        [msg.senderId]: selectedContact?.id === msg.senderId ? 0 : (prev[msg.senderId] || 0) + 1,
      }))
    }

    socket.on('receiveMessage', handleReceive)
    return () => socket.off('receiveMessage', handleReceive)
  }, [selectedContact, addNotification, setUnreadCounts])

  // handle contact selection
  const handleSelectContact = async (driver) => {
    setSelectedContact(driver)

    setUnreadCounts((prev) => ({
      ...prev,
      [driver.id]: 0, // reset unread count
    }))

    if (!messages[driver.id]) {
      setLoading(true)
      try {
        const history = await fetchChatApi(driver.id)
        setMessages((prev) => ({
          ...prev,
          [driver.id]: Array.isArray(history) ? history : [],
        }))
      } catch (err) {
        console.error('Failed to load chat history', err)
      } finally {
        setLoading(false) // ✅ stop loading
      }
    }
  }

  // send message
  const handleSendMessage = (text) => {
    if (!selectedContact || !myUserId) return

    const msg = {
      receiverId: selectedContact.id,
      senderId: myUserId,
      text,
      status: 'sent',
      createdAt: new Date().toISOString(),
      tempId: Date.now().toString(),
    }

    setMessages((prev) => {
      const prevMsgs = prev[selectedContact.id] || []
      return { ...prev, [selectedContact.id]: [...prevMsgs, msg] }
    })

    socket?.emit('sendMessage', msg)
  }

  return (
    <div className="chatbox-container d-flex border rounded" style={{ height: '80vh' }}>
      <ChatSidebar
        selectedContact={selectedContact}
        onSelectContact={handleSelectContact}
        unreadCounts={unreadCounts}
        messages={messages}
      />

      <div className="chat-area flex-grow-1 d-flex flex-column">
        {selectedContact ? (
          <>
            <ChatHeader contact={selectedContact} isConnected={socket?.connected} />
            <ChatMessages
              messages={messages[selectedContact?.id] || []}
              myUserId={myUserId}
              loading={loading}
            />
            <ChatInput onSend={handleSendMessage} />
          </>
        ) : (
          <div className="d-flex justify-content-center align-items-center flex-grow-1 bg-light">
            <p className="text-muted">Select a driver to start chatting</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatBox
