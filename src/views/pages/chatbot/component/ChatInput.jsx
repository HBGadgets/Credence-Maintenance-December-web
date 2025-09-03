import React, { useState, useRef } from 'react'
import { FaPaperPlane, FaSmile } from 'react-icons/fa'
import Picker from 'emoji-picker-react'

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  const inputRef = useRef(null)

  const handleSend = async () => {
    if (!text.trim()) return
    setIsSending(true)
    await onSend(text)
    setIsSending(false)
    setText('')
    setShowEmojiPicker(false)

    // ✅ refocus after React clears the input
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const handleEmojiClick = (emojiData) => {
    const { emoji } = emojiData
    const cursorPos = inputRef.current.selectionStart
    const newText = text.slice(0, cursorPos) + emoji + text.slice(cursorPos)

    setText(newText)

    // restore cursor after emoji
    setTimeout(() => {
      inputRef.current.focus()
      inputRef.current.selectionStart = cursorPos + emoji.length
      inputRef.current.selectionEnd = cursorPos + emoji.length
    }, 0)
  }

  return (
    <div className="chat-input border-top p-2 d-flex align-items-center">
      {/* Emoji button */}
      <div className="me-2 position-relative">
        <button
          type="button"
          className="btn btn-light"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        >
          <FaSmile />
        </button>
        {showEmojiPicker && (
          <div className="position-absolute bottom-100 mb-2">
            <Picker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>

      {/* Text Input */}
      <input
        ref={inputRef}
        className="form-control me-2"
        placeholder="Type your message here..."
        value={text}
        disabled={isSending}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
      />

      {/* Send Button */}
      <button className="btn btn-primary" onClick={handleSend} disabled={isSending || !text.trim()}>
        {isSending ? <span className="spinner-border spinner-border-sm" /> : <FaPaperPlane />}
      </button>
    </div>
  )
}

export default ChatInput
