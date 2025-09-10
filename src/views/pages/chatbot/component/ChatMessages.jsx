// import React, { useEffect, useRef } from 'react'

// const ChatMessages = ({ messages, myUserId }) => {
//   const messagesEndRef = useRef(null)

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }, [messages])

//   // Render tick status for sent messages
//   const renderStatus = (msg) => {
//     if (msg.senderId !== myUserId) return null

//     if (msg.status === 'read') return <span style={{ color: '#34B7F1' }}>✓✓</span>
//     if (msg.status === 'delivered') return <span style={{ color: 'gray' }}>✓✓</span>
//     if (msg.status === 'sent') return <span style={{ color: 'gray' }}>✓</span>

//     return null
//   }

//   // Format time: both sent and received messages in 12-hour AM/PM
//   const formatTime = (msg) => {
//     const isSelf = msg.senderId === myUserId
//     let date = new Date(isSelf ? msg.createdAt : msg.updatedAt)

//     if (!isSelf) {
//       // Only convert received messages from UTC to local
//       date = new Date(date.getTime() + date.getTimezoneOffset() * 60000)
//     }

//     return date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true,
//     })
//   }

//   return (
//     <div className="chat-messages flex-grow-1 p-3 overflow-auto" style={{ background: '#ECE5DD' }}>
//       {messages.map((msg) => {
//         const isSelf = msg.senderId === myUserId

//         return (
//           <div
//             key={msg._id || msg.tempId}
//             className={`d-flex mb-2 ${isSelf ? 'justify-content-end' : 'justify-content-start'}`}
//           >
//             <div
//               className="p-2 rounded-3 shadow-sm position-relative"
//               style={{
//                 maxWidth: '70%',
//                 background: isSelf ? '#DCF8C6' : '#fff',
//                 border: isSelf ? '1px solid #cde6b5' : '1px solid #ddd',
//               }}
//             >
//               {/* Message Text */}
//               <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>

//               {/* Time + ticks */}
//               <small className="d-block text-end" style={{ fontSize: '0.75rem', color: '#999' }}>
//                 {formatTime(msg)} {renderStatus(msg)}
//               </small>
//             </div>
//           </div>
//         )
//       })}
//       <div ref={messagesEndRef} />
//     </div>
//   )
// }

// export default ChatMessages

import React, { useEffect, useRef } from 'react'

const ChatMessages = ({ messages, myUserId, loading }) => {
  const messagesEndRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    if (!loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, loading])

  // Render tick status for sent messages
  const renderStatus = (msg) => {
    if (msg.senderId !== myUserId) return null

    if (msg.status === 'read') return <span style={{ color: '#34B7F1' }}>✓✓</span>
    if (msg.status === 'delivered') return <span style={{ color: 'gray' }}>✓✓</span>
    if (msg.status === 'sent') return <span style={{ color: 'gray' }}>✓</span>

    return null
  }

  // Format time: both sent and received messages in 12-hour AM/PM
  const formatTime = (msg) => {
    let date = new Date(msg.createdAt)

    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  return (
    <div className="chat-messages flex-grow-1 p-3 overflow-auto" style={{ background: '#ECE5DD' }}>
      {/* Loading state */}
      {loading && (
        <div className="d-flex justify-content-center align-items-center my-3">
          <div
            className="spinner-border text-success me-2"
            role="status"
            style={{ width: '1.5rem', height: '1.5rem' }}
          ></div>
          <span>Loading messages...</span>
        </div>
      )}

      {/* No messages */}
      {!loading && messages.length === 0 && (
        <div className="text-center text-muted my-3">No messages yet</div>
      )}

      {/* Messages */}
      {!loading &&
        messages.map((msg) => {
          const isSelf = msg.senderId === myUserId

          return (
            <div
              key={msg._id || msg.tempId}
              className={`d-flex mb-2 ${isSelf ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className="p-2 rounded-3 shadow-sm position-relative"
                style={{
                  maxWidth: '70%',
                  background: isSelf ? '#DCF8C6' : '#fff',
                  border: isSelf ? '1px solid #cde6b5' : '1px solid #ddd',
                }}
              >
                {/* Message Text */}
                <div style={{ fontSize: '0.95rem' }}>{msg.text}</div>

                {/* Time + ticks */}
                <small className="d-block text-end" style={{ fontSize: '0.75rem', color: '#999' }}>
                  {formatTime(msg)} {renderStatus(msg)}
                </small>
              </div>
            </div>
          )
        })}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatMessages
