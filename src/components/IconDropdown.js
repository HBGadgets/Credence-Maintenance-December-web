/* eslint-disable prettier/prettier */
import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronUp } from 'lucide-react'

export default function IconDropdown({ items }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState(null)
  const dropdownRef = useRef(null)

  const toggleDropdown = () => setIsOpen(!isOpen)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div
      className="position-relative"
      style={{ marginRight: '30px', marginBottom: '30px' }}
      ref={dropdownRef}
    >
      <motion.button
        onClick={toggleDropdown}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className="btn p-2 d-flex align-items-center justify-content-center"
        style={{
          width: '40px',
          height: '40px',
          transition: 'all 0.2s ease',
          background: '#0a2d63',
          borderRadius: '50%',
          border: 'none',
          padding: '0',
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={false}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <ChevronUp style={{ width: '20px', height: '20px', color: 'white' }} />
        </motion.div>
      </motion.button>
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -20 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{
              duration: 0.2,
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="position-absolute start-50 translate-middle-x mb-2 d-flex flex-column gap-2"
            style={{
              bottom: '100%',
              zIndex: 1000,
            }}
          >
            {items.map((item, index) => (
              <motion.div
                key={index}
                className="position-relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { delay: index * 0.05 },
                }}
                exit={{
                  opacity: 0,
                  y: 20,
                  transition: { delay: (items.length - index - 1) * 0.05 },
                }}
              >
                <motion.button
                  onClick={() => {
                    item.onClick()
                    setIsOpen(false)
                  }}
                  className="btn p-2 d-flex align-items-center justify-content-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease',
                    background: '#0a2d63',
                    borderRadius: '50%',
                    border: 'none',
                    padding: '0',
                  }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {React.createElement(item.icon, {
                    style: { width: '20px', height: '20px', color: 'white' },
                  })}
                </motion.button>

                <AnimatePresence>
                  {hoveredIndex === index && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="position-absolute rounded px-2 py-1"
                      style={{
                        right: '100%',
                        top: '8px',
                        transform: 'translateY(-50%)',
                        background: '#0a2d63',
                        color: 'white',
                        fontSize: '0.875rem',
                        whiteSpace: 'nowrap',
                        marginRight: '8px',
                        pointerEvents: 'none',
                      }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
          
    </div>
  )
}
