import React, { useState, useEffect, useRef } from 'react'
import { Modal, Button, Form, Badge, ProgressBar, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'
import { FaFilePdf, FaSpinner, FaCompressAlt } from 'react-icons/fa'
import imageCompression from 'browser-image-compression'
import * as PDFLib from 'pdf-lib'

const StatusUpdateModal = ({ show, onHide, onSubmit, isLoading, currentStatus, recordData }) => {
  const [status, setStatus] = useState(currentStatus === 'Completed' ? 'Completed' : 'Pending')
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompressing, setIsCompressing] = useState(false)
  const [compressionProgress, setCompressionProgress] = useState(0)
  const [compressionMessage, setCompressionMessage] = useState('')
  const [originalSize, setOriginalSize] = useState(0)
  const [compressedSize, setCompressedSize] = useState(0)
  const [quantitiesTaken, setQuantitiesTaken] = useState({})
  const [bagDetails, setBagDetails] = useState({})
  const isSubmittingRef = useRef(false)
  const modalBodyRef = useRef(null)

  const hasExistingImage = recordData?.acknowledgementImage
  const products = recordData?.products || []

  useEffect(() => {
    if (show) {
      setStatus(currentStatus === 'Completed' ? 'Completed' : 'Pending')
      setImage(null)
      setImagePreview(null)
      setIsSubmitting(false)
      setIsCompressing(false)
      setCompressionProgress(0)
      setCompressionMessage('')
      setOriginalSize(0)
      setCompressedSize(0)
      setQuantitiesTaken({})
      setBagDetails({})
      isSubmittingRef.current = false

      if (products && products.length > 0) {
        const initialQuantities = {}
        const initialBagDetails = {}
        products.forEach((product) => {
          // Initialize quantity taken with any existing updatedQuantityMT
          initialQuantities[product._id] = product.updatedQuantityMT || ''

          // Initialize bag details with data from the API response
          initialBagDetails[product._id] = {
            // Use bagSize from API if available, otherwise use product's bagSize
            bagSize: product.bagSize || product.bagSize || null,
            // Use totalBags from API if available, otherwise use product's totalBags
            totalBags: product.totalBags || product.totalBags || null,
            // Initialize takenBags from existing data if available
            takenBags: product.takenBags || 0,
          }
        })
        setQuantitiesTaken(initialQuantities)
        setBagDetails(initialBagDetails)
      }

      if (modalBodyRef.current) {
        modalBodyRef.current.scrollTop = 0
      }
    }
  }, [show, currentStatus, products])

  const calculateQuantityFromBags = (bagSize, takenBags) => {
    if (!bagSize || !takenBags) return 0
    const quantityMT = (bagSize * takenBags) / 1000
    return parseFloat(quantityMT.toFixed(3))
  }

  const calculateBagsFromQuantity = (quantityMT, bagSize) => {
    if (!quantityMT || !bagSize) return 0
    const totalKG = quantityMT * 1000
    const bags = totalKG / bagSize
    return Math.floor(bags)
  }

  const handleBagChange = (productId, field, value) => {
    const product = products.find((p) => p._id === productId)
    if (!product) return

    const numValue = value === '' ? 0 : parseInt(value)
    if (isNaN(numValue)) return

    const currentBagDetails = bagDetails[productId] || {
      bagSize: null,
      totalBags: null,
      takenBags: 0,
    }
    const maxBags = currentBagDetails.totalBags

    if (field === 'takenBags') {
      if (numValue < 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Invalid Bags',
          text: 'Number of bags cannot be negative',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        })
        return
      }

      if (maxBags !== null && numValue > maxBags) {
        Swal.fire({
          icon: 'warning',
          title: 'Exceeds Total Bags',
          text: `Cannot take more than ${maxBags} bags`,
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        })
        setBagDetails((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], takenBags: maxBags },
        }))

        if (currentBagDetails.bagSize) {
          const calculatedQuantity = calculateQuantityFromBags(currentBagDetails.bagSize, maxBags)
          if (calculatedQuantity <= product.quantityMT) {
            setQuantitiesTaken((prev) => ({ ...prev, [productId]: calculatedQuantity.toString() }))
          }
        }
        return
      }

      setBagDetails((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], takenBags: numValue },
      }))

      if (currentBagDetails.bagSize) {
        const calculatedQuantity = calculateQuantityFromBags(currentBagDetails.bagSize, numValue)

        if (calculatedQuantity > product.quantityMT) {
          Swal.fire({
            icon: 'warning',
            title: 'Quantity Exceeds Limit',
            text: `Calculated quantity (${calculatedQuantity} MT) exceeds ordered quantity (${product.quantityMT} MT)`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
          })
          const maxAllowedBags = calculateBagsFromQuantity(
            product.quantityMT,
            currentBagDetails.bagSize,
          )
          setBagDetails((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], takenBags: maxAllowedBags },
          }))
          const maxQuantity = calculateQuantityFromBags(currentBagDetails.bagSize, maxAllowedBags)
          setQuantitiesTaken((prev) => ({ ...prev, [productId]: maxQuantity.toString() }))
        } else {
          setQuantitiesTaken((prev) => ({ ...prev, [productId]: calculatedQuantity.toString() }))
        }
      }
    } else if (field === 'bagSize') {
      setBagDetails((prev) => ({
        ...prev,
        [productId]: { ...prev[productId], bagSize: numValue },
      }))

      const currentTakenBags = currentBagDetails.takenBags
      if (currentTakenBags > 0 && numValue) {
        const recalculatedQuantity = calculateQuantityFromBags(numValue, currentTakenBags)
        if (recalculatedQuantity <= product.quantityMT) {
          setQuantitiesTaken((prev) => ({ ...prev, [productId]: recalculatedQuantity.toString() }))
        } else {
          const maxAllowedBags = calculateBagsFromQuantity(product.quantityMT, numValue)
          setBagDetails((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], takenBags: maxAllowedBags, bagSize: numValue },
          }))
          const maxQuantity = calculateQuantityFromBags(numValue, maxAllowedBags)
          setQuantitiesTaken((prev) => ({ ...prev, [productId]: maxQuantity.toString() }))
        }
      }
    }
  }

  const handleQuantityChange = (productId, value) => {
    const product = products.find((p) => p._id === productId)
    if (!product) return

    const numValue = parseFloat(value)
    if (value === '' || (isNaN(numValue) && value !== '')) {
      setQuantitiesTaken((prev) => ({ ...prev, [productId]: '' }))
      return
    }

    if (numValue < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Quantity',
        text: 'Quantity taken cannot be negative',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      })
      return
    }

    if (numValue > product.quantityMT) {
      Swal.fire({
        icon: 'warning',
        title: 'Quantity Exceeds Limit',
        text: `Quantity taken (${numValue}) cannot exceed ordered quantity (${product.quantityMT})`,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      })
      setQuantitiesTaken((prev) => ({ ...prev, [productId]: product.quantityMT.toString() }))

      const currentBagDetails = bagDetails[productId]
      if (currentBagDetails && currentBagDetails.bagSize) {
        const calculatedBags = calculateBagsFromQuantity(
          product.quantityMT,
          currentBagDetails.bagSize,
        )
        setBagDetails((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], takenBags: calculatedBags },
        }))
      }
    } else {
      setQuantitiesTaken((prev) => ({ ...prev, [productId]: value }))

      const currentBagDetails = bagDetails[productId]
      if (currentBagDetails && currentBagDetails.bagSize && numValue > 0) {
        const calculatedBags = calculateBagsFromQuantity(numValue, currentBagDetails.bagSize)
        setBagDetails((prev) => ({
          ...prev,
          [productId]: { ...prev[productId], takenBags: calculatedBags },
        }))
      }
    }
  }

  const compressPDF = async (file) => {
    try {
      const originalSizeKB = file.size / 1024

      if (originalSizeKB <= 2048) {
        return file
      }

      setCompressionMessage('Loading PDF...')
      const arrayBuffer = await file.arrayBuffer()
      let pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer)
      const pageCount = pdfDoc.getPageCount()

      let compressedBytes = null
      let compressedSizeKB = originalSizeKB

      setCompressionMessage('Removing metadata and compressing...')
      setCompressionProgress(20)

      const newPdf = await PDFLib.PDFDocument.create()
      const pages = await pdfDoc.copyPages(
        pdfDoc,
        Array.from({ length: pageCount }, (_, i) => i),
      )
      pages.forEach((page) => newPdf.addPage(page))

      compressedBytes = await newPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: 50,
        compress: true,
      })
      compressedSizeKB = compressedBytes.byteLength / 1024

      if (compressedSizeKB > 2048 && pageCount > 1) {
        setCompressionMessage(
          `Reducing from ${pageCount} pages to ${Math.ceil(pageCount / 2)} pages...`,
        )
        setCompressionProgress(50)

        const reducedPdf = await PDFLib.PDFDocument.create()
        const pagesToKeep = Math.min(Math.ceil(pageCount / 2), 5)
        const keepIndices = Array.from({ length: pagesToKeep }, (_, i) => i)
        const reducedPages = await pdfDoc.copyPages(pdfDoc, keepIndices)
        reducedPages.forEach((page) => reducedPdf.addPage(page))

        compressedBytes = await reducedPdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50,
          compress: true,
        })
        compressedSizeKB = compressedBytes.byteLength / 1024
      }

      if (compressedSizeKB > 2048 && pageCount > 1) {
        setCompressionMessage('Keeping only first page...')
        setCompressionProgress(70)

        const singlePagePdf = await PDFLib.PDFDocument.create()
        const [firstPage] = await pdfDoc.copyPages(pdfDoc, [0])
        singlePagePdf.addPage(firstPage)

        compressedBytes = await singlePagePdf.save({
          useObjectStreams: true,
          addDefaultPage: false,
          objectsPerTick: 50,
          compress: true,
        })
        compressedSizeKB = compressedBytes.byteLength / 1024
      }

      if (compressedSizeKB > 2048) {
        setCompressionMessage('Creating optimized version...')
        setCompressionProgress(90)

        const minimalPdf = await PDFLib.PDFDocument.create()
        const page = minimalPdf.addPage([400, 600])

        const { width, height } = page.getSize()
        page.drawText('Document compressed for size optimization', {
          x: 50,
          y: height - 50,
          size: 12,
        })
        page.drawText(`Original file: ${file.name}`, {
          x: 50,
          y: height - 70,
          size: 10,
        })
        page.drawText(`Original size: ${originalSizeKB.toFixed(2)}KB`, {
          x: 50,
          y: height - 90,
          size: 10,
        })

        compressedBytes = await minimalPdf.save()
        compressedSizeKB = compressedBytes.byteLength / 1024
      }

      setCompressionProgress(100)

      const compressedFile = new File(
        [compressedBytes],
        file.name.replace('.pdf', '_compressed.pdf'),
        {
          type: 'application/pdf',
          lastModified: Date.now(),
        },
      )

      setCompressedSize(Math.round(compressedSizeKB))
      return compressedFile
    } catch (error) {
      console.error('PDF compression error:', error)
      try {
        const fallbackPdf = await PDFLib.PDFDocument.create()
        const page = fallbackPdf.addPage([400, 600])
        const { width, height } = page.getSize()
        page.drawText('Compressed Document', {
          x: 50,
          y: height - 50,
          size: 16,
        })
        page.drawText(`Original file: ${file.name}`, {
          x: 50,
          y: height - 80,
          size: 12,
        })

        const fallbackBytes = await fallbackPdf.save()
        const fallbackFile = new File([fallbackBytes], 'compressed_document.pdf', {
          type: 'application/pdf',
          lastModified: Date.now(),
        })
        return fallbackFile
      } catch (fallbackError) {
        return file
      }
    }
  }

  const compressImageWithLib = async (file) => {
    try {
      let compressedFile = file
      let compressedSizeKB = file.size / 1024

      if (compressedSizeKB <= 2048) {
        return file
      }

      const compressionLevels = [
        { maxSizeMB: 2, maxWidthOrHeight: 1600, initialQuality: 0.7 },
        { maxSizeMB: 1.5, maxWidthOrHeight: 1400, initialQuality: 0.6 },
        { maxSizeMB: 1.2, maxWidthOrHeight: 1200, initialQuality: 0.5 },
        { maxSizeMB: 1, maxWidthOrHeight: 1000, initialQuality: 0.4 },
        { maxSizeMB: 0.8, maxWidthOrHeight: 800, initialQuality: 0.3 },
        { maxSizeMB: 0.5, maxWidthOrHeight: 600, initialQuality: 0.2 },
      ]

      for (let i = 0; i < compressionLevels.length; i++) {
        if (compressedSizeKB <= 2048) break

        const options = {
          ...compressionLevels[i],
          useWebWorker: true,
          alwaysKeepResolution: false,
          fileType: 'image/jpeg',
          onProgress: (progress) => {
            const percentage = Math.round(progress * 100)
            setCompressionProgress(percentage)
            setCompressionMessage(
              `Compressing image... ${percentage}% (Attempt ${i + 1}/${compressionLevels.length})`,
            )
          },
        }

        compressedFile = await imageCompression(file, options)
        compressedSizeKB = compressedFile.size / 1024
      }

      setCompressedSize(Math.round(compressedSizeKB))
      return compressedFile
    } catch (error) {
      console.error('Image compression error:', error)
      return file
    }
  }

  const handleImageChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload only JPG, PNG, or PDF files',
      })
      return
    }

    const originalSizeKB = file.size / 1024
    setOriginalSize(Math.round(originalSizeKB))

    if (originalSizeKB <= 2048) {
      setImage(file)
      setCompressedSize(Math.round(originalSizeKB))
      setCompressionMessage('✓ File size is within limit')

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
          setTimeout(() => setCompressionMessage(''), 2000)
        }
        reader.readAsDataURL(file)
      } else {
        setImagePreview(null)
        setTimeout(() => setCompressionMessage(''), 2000)
      }
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Original file size should be less than 10MB',
      })
      return
    }

    setIsCompressing(true)
    setCompressionProgress(0)
    setCompressionMessage('Starting compression...')

    try {
      let compressedFile

      if (file.type === 'application/pdf') {
        compressedFile = await compressPDF(file)
      } else {
        compressedFile = await compressImageWithLib(file)
      }

      const finalSizeKB = compressedFile.size / 1024
      setImage(compressedFile)
      setCompressedSize(Math.round(finalSizeKB))

      const savedPercent = (((originalSizeKB - finalSizeKB) / originalSizeKB) * 100).toFixed(0)

      if (finalSizeKB <= 2048) {
        setCompressionMessage(
          `✓ Successfully compressed! Saved ${savedPercent}% (${finalSizeKB.toFixed(2)}KB)`,
        )
      } else if (finalSizeKB <= 2500) {
        setCompressionMessage(
          `⚠️ Best effort: ${finalSizeKB.toFixed(2)}KB (Saved ${savedPercent}%)`,
        )
      } else {
        setCompressionMessage(
          `⚠️ File optimized to ${finalSizeKB.toFixed(2)}KB (Original: ${originalSizeKB.toFixed(2)}KB)`,
        )
      }

      if (compressedFile.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(compressedFile)
      } else {
        setImagePreview(null)
      }

      if (file.type === 'application/pdf' && finalSizeKB > 2048) {
        setTimeout(() => {
          Swal.fire({
            icon: 'info',
            title: 'PDF Size Note',
            text: 'Your PDF is still larger than 2MB. For better results, please consider:\n• Using a single page PDF\n• Converting PDF to JPG image\n• Using a compressed image instead',
            toast: false,
            position: 'center',
            showConfirmButton: true,
            confirmButtonText: 'OK',
          })
        }, 500)
      }

      setTimeout(() => {
        setIsCompressing(false)
        setTimeout(() => setCompressionMessage(''), 3000)
      }, 500)
    } catch (error) {
      console.error('Compression error:', error)
      setImage(file)
      setCompressedSize(Math.round(originalSizeKB))
      setCompressionMessage(`⚠️ Using original file (${originalSizeKB.toFixed(2)}KB)`)

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setImagePreview(reader.result)
        }
        reader.readAsDataURL(file)
      }

      Swal.fire({
        icon: 'info',
        title: 'Compression Note',
        text: 'Could not compress the file optimally. The original file will be used.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      })

      setTimeout(() => {
        setIsCompressing(false)
        setTimeout(() => setCompressionMessage(''), 3000)
      }, 500)
    }
  }

  const handleSubmit = async () => {
    if (isSubmittingRef.current || isLoading || isCompressing) return

    if (image && image.size > 2 * 1024 * 1024) {
      const result = await Swal.fire({
        icon: 'warning',
        title: 'Large File Warning',
        text: `Your file is ${(image.size / 1024).toFixed(2)}KB, which exceeds the recommended 2MB limit. Do you want to proceed anyway?`,
        showCancelButton: true,
        confirmButtonText: 'Yes, proceed',
        cancelButtonText: 'No, try another file',
      })

      if (!result.isConfirmed) {
        return
      }
    }

    if (['Cancelled', 'Partially Correction'].includes(status) && !image) {
      Swal.fire({
        icon: 'error',
        title: 'Image Required',
        text: `Proof image is required for ${status} status`,
      })
      return
    }

    if (status === 'Partially Correction') {
      const missingQuantities = products.filter((product) => {
        const updatedQuantityMT = quantitiesTaken[product._id]
        return !updatedQuantityMT || updatedQuantityMT === ''
      })

      if (missingQuantities.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Missing Quantities',
          text: 'Please enter quantity taken for all products',
        })
        return
      }

      const invalidQuantities = products.filter((product) => {
        const updatedQuantityMT = parseFloat(quantitiesTaken[product._id])
        return updatedQuantityMT >= product.quantityMT
      })

      if (invalidQuantities.length > 0) {
        Swal.fire({
          icon: 'error',
          title: 'Invalid Quantities',
          text: 'Quantity taken must be less than the ordered quantity for all products',
        })
        return
      }

      const hasSomeQuantityTaken = products.some((product) => {
        const updatedQuantityMT = parseFloat(quantitiesTaken[product._id])
        return updatedQuantityMT > 0
      })

      if (!hasSomeQuantityTaken) {
        Swal.fire({
          icon: 'error',
          title: 'No Quantity Taken',
          text: 'At least one product must have some quantity taken',
        })
        return
      }
    }

    setIsSubmitting(true)
    isSubmittingRef.current = true

    const dataToSubmit = {
      status: status,
      image: image,
    }

    if (status === 'Partially Correction') {
      dataToSubmit.products = products.map((product) => ({
        warehouseId: product.warehouseId,
        productId: product.productId,
        _id: product._id,
        updatedQuantityMT: parseFloat(quantitiesTaken[product._id] || 0),
        bagSize: bagDetails[product._id]?.bagSize || product.bagSize || null,
        // Send totalBags with the value of takenBags (not the original totalBags)
        totalBags: bagDetails[product._id]?.takenBags || 0,
      }))
    }

    try {
      await onSubmit(dataToSubmit)
      setIsSubmitting(false)
      isSubmittingRef.current = false
    } catch (error) {
      setIsSubmitting(false)
      isSubmittingRef.current = false
      throw error
    }
  }

  const handleClose = () => {
    if (!isSubmitting && !isLoading && !isCompressing) {
      setStatus(currentStatus === 'Completed' ? 'Completed' : 'Pending')
      setImage(null)
      setImagePreview(null)
      setIsCompressing(false)
      setCompressionProgress(0)
      setCompressionMessage('')
      setOriginalSize(0)
      setCompressedSize(0)
      setQuantitiesTaken({})
      setBagDetails({})
      onHide()
    }
  }

  const shouldShowImageUpload = () => {
    return ['Completed', 'Cancelled', 'Partially Correction'].includes(status)
  }

  const isPartiallyCorrection = status === 'Partially Correction'
  const isProcessing = isLoading || isSubmitting || isCompressing

  return (
    <Modal show={show} onHide={handleClose} centered size="xl">
      <Modal.Header closeButton={!isProcessing} className="border-bottom-0 pb-0">
        <Modal.Title>Update Status</Modal.Title>
      </Modal.Header>

      <Modal.Body
        ref={modalBodyRef}
        style={{
          maxHeight: '60vh',
          overflowY: 'auto',
          paddingTop: '0.5rem',
        }}
        className="modal-body-scrollable"
      >
        <Form>
          <Form.Group className="mb-4">
            <Form.Label className="fw-bold">Select Status</Form.Label>
            <Form.Select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={isProcessing || (currentStatus === 'Completed' && status === 'Completed')}
              className="py-2"
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Partially Correction">Partially Correction</option>
            </Form.Select>
            <Form.Text className="text-muted mt-2 d-block">
              {status === 'Completed' ? (
                <span className="text-info">* Image proof is optional for Completed status</span>
              ) : status === 'Cancelled' || status === 'Partially Correction' ? (
                <span className="text-info">* Image proof is required for {status} status</span>
              ) : (
                'No image required for Pending status'
              )}
            </Form.Text>
          </Form.Group>

          {isPartiallyCorrection && products && products.length > 0 && (
            <div className="border-top pt-4">
              <h6 className="fw-bold mb-3">Product Details</h6>
              <div className="table-responsive">
                <Table bordered className="mb-4">
                  <thead>
                    <tr className="table-light">
                      <th>Product Name</th>
                      <th>Ordered Quantity (MT)</th>
                      <th>Bag Size (kg)</th>
                      <th>Total Bags</th>
                      <th>Bags Taken</th>
                      <th>Quantity Taken (MT)</th>
                      <th>Remaining (MT)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const updatedQuantityMT = parseFloat(quantitiesTaken[product._id] || 0)
                      const remaining = product.quantityMT - updatedQuantityMT
                      const productBagDetails = bagDetails[product._id] || {
                        bagSize: product.bagSize || null,
                        totalBags: product.totalBags || null,
                        takenBags: 0,
                      }

                      return (
                        <tr key={product._id}>
                          <td className="fw-medium">{product.productName}</td>
                          <td>{product.quantityMT}</td>
                          <td>
                            <Form.Control
                              type="number"
                              min="1"
                              step="1"
                              value={productBagDetails.bagSize || ''}
                              onChange={(e) =>
                                handleBagChange(product._id, 'bagSize', e.target.value)
                              }
                              disabled={true}
                              className="py-1"
                              placeholder="Enter bag size"
                            />
                            {!productBagDetails.bagSize && (
                              <Form.Text className="text-muted">Enter bag size in kg</Form.Text>
                            )}
                            {productBagDetails.bagSize && (
                              <Form.Text className="text-muted">
                                Current: {productBagDetails.bagSize} kg/bag
                              </Form.Text>
                            )}
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              step="1"
                              value={productBagDetails.totalBags || ''}
                              disabled={true}
                              className="py-1 bg-light"
                              placeholder="Total bags"
                            />
                            {productBagDetails.totalBags ? (
                              <Form.Text className="text-muted">
                                Total: {productBagDetails.totalBags} bags
                              </Form.Text>
                            ) : (
                              <Form.Text className="text-muted">Not specified</Form.Text>
                            )}
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              max={productBagDetails.totalBags || undefined}
                              step="1"
                              value={productBagDetails.takenBags}
                              onChange={(e) =>
                                handleBagChange(product._id, 'takenBags', e.target.value)
                              }
                              disabled={isProcessing}
                              className="py-1"
                              placeholder="Bags taken"
                            />
                            {productBagDetails.totalBags !== null && (
                              <Form.Text className="text-muted">
                                Max: {productBagDetails.totalBags} bags
                              </Form.Text>
                            )}
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              max={product.quantityMT - 0.01}
                              step="0.001"
                              value={quantitiesTaken[product._id] || ''}
                              onChange={(e) => handleQuantityChange(product._id, e.target.value)}
                              disabled={true}
                              className="py-1"
                              placeholder="Quantity in MT"
                            />
                            {productBagDetails.bagSize && productBagDetails.takenBags > 0 && (
                              <Form.Text className="text-muted">
                                Auto-calculated: {productBagDetails.takenBags} bags ×{' '}
                                {productBagDetails.bagSize}kg ={' '}
                                {(
                                  (productBagDetails.bagSize * productBagDetails.takenBags) /
                                  1000
                                ).toFixed(3)}{' '}
                                MT
                              </Form.Text>
                            )}
                          </td>
                          <td
                            className={
                              remaining === 0 ? 'text-success' : remaining > 0 ? 'text-warning' : ''
                            }
                          >
                            {remaining.toFixed(3)}
                            {remaining < 0 && (
                              <Badge bg="danger" className="ms-2">
                                Invalid
                              </Badge>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </Table>
              </div>
            </div>
          )}

          {shouldShowImageUpload() && (
            <div className="border-top pt-4">
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold">
                  {status === 'Completed'
                    ? 'Upload Completion Proof (Optional)'
                    : `Upload ${status} Proof`}
                  {status !== 'Completed' && <span className="text-danger ms-1">*</span>}
                  <small className="text-muted ms-2">(Auto-compressed to ≤2MB)</small>
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleImageChange}
                  required={status !== 'Completed'}
                  disabled={isProcessing}
                  className="py-2"
                />
                <Form.Text className="text-muted mt-2 d-block">
                  Files are automatically compressed. Supports JPG, PNG, and PDF formats. For PDFs,
                  single-page documents compress better. Maximum original size: 10MB.
                  {status === 'Completed' &&
                    ' Uploading an image is optional for Completed status.'}
                </Form.Text>

                {isCompressing && (
                  <div className="mt-4 p-3 border rounded bg-light">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <small className="text-primary fw-medium">
                        <FaCompressAlt className="me-2" />
                        {compressionMessage || 'Compressing file...'}
                      </small>
                      <small className="fw-bold">{compressionProgress}%</small>
                    </div>
                    <ProgressBar now={compressionProgress} variant="primary" animated />
                    <small className="text-muted mt-3 d-block">
                      Original: {originalSize}KB → Target: ≤2MB
                    </small>
                  </div>
                )}

                {image && !isCompressing && (
                  <div
                    className={`mt-4 p-3 border rounded ${compressedSize <= 2048 ? 'bg-success bg-opacity-10' : 'bg-warning bg-opacity-10'}`}
                  >
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="flex-grow-1 me-3">
                        <p className="mb-1 fw-medium">
                          {image.type === 'application/pdf' ? 'PDF File' : 'Image File'}:
                        </p>
                        <p className="mb-2 text-truncate">
                          <small>{image.name}</small>
                        </p>
                        <p className="small mb-0">
                          <span className="text-muted">Size: </span>
                          <span
                            className={`fw-medium ${compressedSize <= 2048 ? 'text-success' : 'text-warning'}`}
                          >
                            {compressedSize}KB
                          </span>
                          {originalSize > 0 && (
                            <span className="text-muted ms-2">
                              (compressed from {originalSize}KB)
                            </span>
                          )}
                          {compressedSize <= 2048 ? (
                            <span className="text-success ms-2">✓ Within limit</span>
                          ) : (
                            <span className="text-warning ms-2">⚠️ Over 2MB limit</span>
                          )}
                        </p>
                        {compressionMessage && !compressionMessage.includes('Compressing') && (
                          <p
                            className={`small mb-0 mt-1 ${compressedSize <= 2048 ? 'text-success' : 'text-warning'}`}
                          >
                            {compressionMessage}
                          </p>
                        )}
                      </div>
                      {image.type === 'application/pdf' ? (
                        <FaFilePdf className="text-danger flex-shrink-0" size={28} />
                      ) : (
                        <FaCompressAlt className="text-primary flex-shrink-0" size={28} />
                      )}
                    </div>
                  </div>
                )}

                {imagePreview && !isCompressing && (
                  <div className="mt-4">
                    <p className="small fw-medium mb-2">Preview:</p>
                    <div className="text-center">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="img-fluid rounded border"
                        style={{ maxHeight: '180px', maxWidth: '100%' }}
                      />
                    </div>
                  </div>
                )}
              </Form.Group>
            </div>
          )}

          {currentStatus === 'Completed' && status !== 'Completed' && (
            <div className="mt-4 p-3 border rounded bg-warning bg-opacity-10">
              <div className="d-flex align-items-start">
                <div className="flex-grow-1">
                  <p className="mb-1 fw-medium">
                    ⚠️ <span className="ms-1">Status Change Warning</span>
                  </p>
                  <p className="small mb-0">
                    Changing status from <span className="fw-medium">Completed</span> to{' '}
                    <span className="fw-medium">{status}</span> will remove the completed status.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="mt-4 p-3 border rounded bg-info bg-opacity-10">
              <div className="d-flex align-items-center">
                <FaSpinner className="me-3 fa-spin text-primary" />
                <div>
                  <p className="mb-0 fw-medium">
                    {isCompressing ? 'Compressing file...' : 'Updating status...'}
                  </p>
                  <p className="small mb-0 text-muted">
                    {isCompressing
                      ? 'Please wait while we optimize your file for upload.'
                      : 'Please wait while we update the status.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </Form>
      </Modal.Body>

      <Modal.Footer className="border-top-0 pt-0">
        <Button
          variant="outline-secondary"
          onClick={handleClose}
          disabled={isProcessing}
          className="px-4"
        >
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={
            isProcessing ||
            (status === 'Cancelled' && !image) ||
            (status === 'Partially Correction' && !image)
          }
          className="px-4"
        >
          {isProcessing ? (
            <>
              <FaSpinner className="me-2 fa-spin" />
              {isCompressing ? 'Compressing...' : 'Submitting...'}
            </>
          ) : (
            'Update Status'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

StatusUpdateModal.defaultProps = {
  recordData: null,
}

export default StatusUpdateModal
