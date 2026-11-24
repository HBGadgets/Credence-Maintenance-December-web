import React, { useRef, useState, useEffect, useCallback } from 'react'
import { Button, Form, ButtonGroup } from 'react-bootstrap'
import { FaPen, FaUpload, FaEraser, FaCheck } from 'react-icons/fa'

const SignaturePadInput = ({ value, onChange, disabled = false }) => {
  const [signMode, setSignMode] = useState('draw') // 'draw' or 'upload'
  const [hasDrawn, setHasDrawn] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)

  // Initialize and size canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = window.devicePixelRatio || 1

    canvas.width = rect.width * dpr
    canvas.height = 160 * dpr
    canvas.style.height = '160px'

    const ctx = canvas.getContext('2d')
    ctx.scale(dpr, dpr)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2.5
    ctx.strokeStyle = '#0f172a'
  }, [])

  useEffect(() => {
    if (signMode === 'draw') {
      // Delay slightly to ensure modal is rendered and dimensions are available
      const timer = setTimeout(() => {
        initCanvas()
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [signMode, initCanvas])

  const getPos = (e) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const startDrawing = (e) => {
    if (disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
    setIsDrawing(true)
  }

  const draw = (e) => {
    if (!isDrawing || disabled) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const { x, y } = getPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    if (!hasDrawn) {
      setHasDrawn(true)
    }
  }

  const exportCanvasBlob = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.toBlob((blob) => {
      if (blob && onChange) {
        const file = new File([blob], `signature_${Date.now()}.png`, { type: 'image/png' })
        onChange(file)
      }
    }, 'image/png')
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    exportCanvasBlob()
  }

  const handleClear = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      const dpr = window.devicePixelRatio || 1
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    }
    setHasDrawn(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    if (onChange) {
      onChange(null)
    }
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file && onChange) {
      onChange(file)
    }
  }

  return (
    <div className="signature-pad-container border rounded p-3 bg-light">
      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <ButtonGroup size="sm">
          <Button
            variant={signMode === 'draw' ? 'primary' : 'outline-secondary'}
            onClick={() => {
              setSignMode('draw')
              handleClear()
            }}
            disabled={disabled}
            className="d-flex align-items-center gap-1"
          >
            <FaPen size={12} /> Sign Directly
          </Button>
          <Button
            variant={signMode === 'upload' ? 'primary' : 'outline-secondary'}
            onClick={() => {
              setSignMode('upload')
              handleClear()
            }}
            disabled={disabled}
            className="d-flex align-items-center gap-1"
          >
            <FaUpload size={12} /> Upload File
          </Button>
        </ButtonGroup>

        {((signMode === 'draw' && hasDrawn) || (signMode === 'upload' && value)) && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={handleClear}
            disabled={disabled}
            className="d-flex align-items-center gap-1"
          >
            <FaEraser size={12} /> Clear
          </Button>
        )}
      </div>

      {signMode === 'draw' ? (
        <div>
          <div
            className="position-relative bg-white rounded border"
            style={{ overflow: 'hidden' }}
          >
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '160px',
                display: 'block',
                cursor: disabled ? 'not-allowed' : 'crosshair',
                touchAction: 'none',
              }}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={(e) => {
                e.preventDefault()
                startDrawing(e)
              }}
              onTouchMove={(e) => {
                e.preventDefault()
                draw(e)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                stopDrawing()
              }}
            />
            <div
              className="position-absolute bottom-0 start-0 end-0 px-3 pb-1 d-flex justify-content-between align-items-center pointer-events-none"
              style={{
                borderTop: '1px dashed #cbd5e1',
                color: '#94a3b8',
                fontSize: '11px',
                pointerEvents: 'none',
              }}
            >
              <span>Sign above the line</span>
              {hasDrawn && (
                <span className="text-success fw-medium d-flex align-items-center gap-1">
                  <FaCheck size={10} /> Captured
                </span>
              )}
            </div>
          </div>
          <small className="text-muted d-block mt-1" style={{ fontSize: '11px' }}>
            Use mouse, finger, or stylus to draw signature directly on the box above.
          </small>
        </div>
      ) : (
        <div>
          <Form.Control
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={disabled}
          />
          {value && typeof value === 'object' && (
            <div className="mt-2 small text-success d-flex align-items-center gap-1">
              <FaCheck size={12} /> Selected file: <strong>{value.name}</strong>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SignaturePadInput
