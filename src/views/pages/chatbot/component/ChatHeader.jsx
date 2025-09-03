import React from 'react'

const ChatHeader = ({ contact, isConnected }) => {
  if (!contact) {
    return (
      <div className="chat-header border-bottom p-2 d-flex align-items-center bg-white">
        <div>Select a driver to start chatting</div>
      </div>
    )
  }

  const initials = contact?.name ? contact.name.slice(0, 2).toUpperCase() : 'NA'

  return (
    <div className="chat-header border-bottom p-2 d-flex align-items-center bg-white">
      <div
        className="rounded-circle d-flex justify-content-center align-items-center me-2"
        style={{ width: 35, height: 35, background: '#ff9800', color: '#fff' }}
      >
        {initials}
      </div>
      <div className="d-flex flex-column">
        <div className="fw-bold text-truncate" style={{ maxWidth: 150 }}>
          {contact?.name || 'Unknown'}
        </div>
        <small className={isConnected ? 'text-success' : 'text-muted'}>
          {isConnected ? 'Online' : 'Offline'}
        </small>
      </div>
    </div>
  )
}

export default ChatHeader
