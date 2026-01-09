import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap'
import { fetchDrivers, fetchSupervisor } from '../../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../../vehicle/data/VehicleListData'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWorkerApi } from '../../../TransportPass/data/data'
import Select from 'react-select'
import { getCompanyNameApi } from '../../../TransportPass/data/data'
import CreatableSelect from 'react-select/creatable'
import { getRailHeadApi, getWarehouseListApi } from '../../data/data'
import {
  FaWarehouse,
  FaUserFriends,
  FaCalculator,
  FaBox,
  FaWeight,
  FaInfoCircle,
  FaRupeeSign,
  FaUserPlus,
} from 'react-icons/fa'
import {
  getConsigneeApi,
  getConsignorApi,
  postConsignorApi,
  postConsigneeApi,
} from '../../../Consignee_Consignor/data/data'
import { toast } from 'react-toastify'
import AddConsignorConsigneeModal from './AddConsignorConsigneeModal' // Adjust the path as needed

const defaultProduct = {
  warehouseId: '',
  warehouseName: '',
  productId: '',
  productName: '',
  quantityMT: '',
  bagSize: '',
  totalBags: '',
}

const getTodayDate = () => {
  const d = new Date()
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const defaultFormData = {
  tpPassType: 'warehouse',
  issuedBy: 'Railhead',
  receivedBy: 'Warehouse/Party',
  receivedByType: '', // 'warehouse' or 'party'
  receivedByWarehouseId: '',
  receivedByWarehouseName: '',
  supervisorId: '',
  companyId: '',
  companyName: '',
  companyEmail: '',
  companyMobileNumber: '',
  companyOfficeNumber: '',
  companyAddress: '',
  gstIn: '',
  date: getTodayDate(),
  vehicleId: '',
  vehicleName: '',
  driverId: '',
  driverName: '',
  consignorId: '',
  consignorName: '',
  consignorAddress: '',
  consigneeId: '',
  consigneeName: '',
  consigneeAddress: '',
  customerName: '',
  customerAddress: '',
  startLocation: '',
  endLocation: '',
  customerRate: '',
  totalAmount: '',
  transporterRate: '',
  totalTransporterAmount: '',
  transporterRateOn: '',
  customerRateOn: '',
  customerFreight: '',
  transporterFreight: '',
  products: [{ ...defaultProduct }],
}

// Debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

const WarehouseForm = ({
  show,
  handleClose,
  handleSubmit,
  initialData = {},
  mode = 'add',
  isLoading = false,
  onFormTypeChange,
}) => {
  const [formData, setFormData] = useState(defaultFormData)
  const [drivers, setDrivers] = useState([])
  const [vehicles, setVehicles] = useState([])
  const [productDetails, setProductDetails] = useState({})
  const [receivedByOptions] = useState([
    { value: 'warehouse', label: 'Warehouse', icon: <FaWarehouse className="me-2" /> },
    { value: 'party', label: 'Party', icon: <FaUserFriends className="me-2" /> },
  ])

  // Search and pagination states for consignor/consignee
  const [consignorSearchInput, setConsignorSearchInput] = useState('')
  const [consigneeSearchInput, setConsigneeSearchInput] = useState('')

  // Debounced search values (300ms delay)
  const debouncedConsignorSearch = useDebounce(consignorSearchInput, 300)
  const debouncedConsigneeSearch = useDebounce(consigneeSearchInput, 300)

  const [consignorPage, setConsignorPage] = useState(1)
  const [consigneePage, setConsigneePage] = useState(1)
  const itemsPerPage = 20

  // State for create new modals
  const [showConsignorModal, setShowConsignorModal] = useState(false)
  const [showConsigneeModal, setShowConsigneeModal] = useState(false)
  const [isCreatingConsignor, setIsCreatingConsignor] = useState(false)
  const [isCreatingConsignee, setIsCreatingConsignee] = useState(false)

  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role
  const queryClient = useQueryClient()

  // API Mutations for creating consignor/consignee
  const { mutate: postConsignor } = useMutation({
    mutationFn: postConsignorApi,
    onSuccess: (response) => {
      setIsCreatingConsignor(false)
      setShowConsignorModal(false)
      queryClient.invalidateQueries({ queryKey: ['Consignor'] })
      // Set the newly created consignor in the form with the ID
      setFormData((prev) => ({
        ...prev,
        consignorId: response.data?.id || response.data?._id || '',
        consignorName: response.data?.name || '',
        consignorAddress: response.data?.address || '',
      }))
      toast.success('Consignor added successfully!')
    },
    onError: (error) => {
      setIsCreatingConsignor(false)
      toast.error(error.message || 'Failed to create consignor')
    },
  })

  const { mutate: postConsignee } = useMutation({
    mutationFn: postConsigneeApi,
    onSuccess: (response) => {
      setIsCreatingConsignee(false)
      setShowConsigneeModal(false)
      queryClient.invalidateQueries({ queryKey: ['Consignee'] })
      // Set the newly created consignee in the form with the ID
      setFormData((prev) => ({
        ...prev,
        consigneeId: response.data?.id || response.data?._id || '',
        consigneeName: response.data?.name || '',
        consigneeAddress: response.data?.address || '',
      }))
      toast.success('Consignee added successfully!')
    },
    onError: (error) => {
      setIsCreatingConsignee(false)
      toast.error(error.message || 'Failed to create consignee')
    },
  })

  // Handler for creating new consignor
  const handleCreateConsignor = (payload) => {
    setIsCreatingConsignor(true)
    postConsignor(payload)
  }

  // Handler for creating new consignee
  const handleCreateConsignee = (payload) => {
    setIsCreatingConsignee(true)
    postConsignee(payload)
  }

  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
  })

  const { data: companyList = [] } = useQuery({
    queryKey: ['companyList'],
    queryFn: getCompanyNameApi,
  })

  const { data: warehouseResponse = {} } = useQuery({
    queryKey: ['getWarehouseList', { page: 1, limit: 100 }],
    queryFn: ({ queryKey }) => getWarehouseListApi(queryKey[1]),
  })

  const { data: railHeadData = {}, isFetching: isRailHeadFetching } = useQuery({
    queryKey: ['RailHead', { search: '', page: 1, limit: 100 }],
    queryFn: getRailHeadApi,
  })

  // Fetch Consignor data with debounced search
  const { data: consignorData = { data: [], total: 0 }, isFetching: isFetchingConsignor } =
    useQuery({
      queryKey: [
        'Consignor',
        {
          search: debouncedConsignorSearch,
          page: consignorPage,
          limit: itemsPerPage,
        },
      ],
      queryFn: getConsignorApi,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    })

  // Fetch Consignee data with debounced search
  const { data: consigneeData = { data: [], total: 0 }, isFetching: isFetchingConsignee } =
    useQuery({
      queryKey: [
        'Consignee',
        {
          search: debouncedConsigneeSearch,
          page: consigneePage,
          limit: itemsPerPage,
        },
      ],
      queryFn: getConsigneeApi,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    })

  const warehouseList = warehouseResponse?.data || []
  const inventoryList = railHeadData?.data || []
  const consignorList = consignorData?.data || []
  const consigneeList = consigneeData?.data || []

  // Add this function to prevent scroll on number inputs
  const handleNumberInputScroll = (e) => {
    e.preventDefault()
    e.target.blur()
    return false
  }

  // Vehicle and Driver handlers with CreatableSelect support
  const handleVehicleChange = (selected, action) => {
    if (selected) {
      if (action.action === 'create-option') {
        setFormData((prev) => ({
          ...prev,
          vehicleId: selected.value,
          vehicleName: selected.label,
        }))
      } else {
        const selectedVehicle = vehicles.find(
          (v) => v.id === selected.value || v._id === selected.value,
        )
        setFormData((prev) => ({
          ...prev,
          vehicleId: selected.value,
          vehicleName: selectedVehicle?.name || selectedVehicle?.vehicleNumber || selected.label,
        }))
      }
    } else {
      setFormData((prev) => ({ ...prev, vehicleId: '', vehicleName: '' }))
    }
  }

  const handleDriverChange = (selected, action) => {
    if (selected) {
      if (action.action === 'create-option') {
        setFormData((prev) => ({
          ...prev,
          driverId: selected.value,
          driverName: selected.label,
        }))
      } else {
        const selectedDriver = drivers.find((d) => d.id === selected.value)
        setFormData((prev) => ({
          ...prev,
          driverId: selected.value,
          driverName: selectedDriver?.name || selected.label,
        }))
      }
    } else {
      setFormData((prev) => ({ ...prev, driverId: '', driverName: '' }))
    }
  }

  // Handle Consignor selection - FIXED: Now sets consignorId too
  const handleConsignorChange = (selected) => {
    if (selected && selected.value !== 'create-new') {
      setFormData((prev) => ({
        ...prev,
        consignorId: selected.value, // Set the ID
        consignorName: selected.name,
        consignorAddress: selected.address,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        consignorId: '',
        consignorName: '',
        consignorAddress: '',
      }))
    }
  }

  // Handle Consignee selection - FIXED: Now sets consigneeId too
  const handleConsigneeChange = (selected) => {
    if (selected && selected.value !== 'create-new') {
      setFormData((prev) => ({
        ...prev,
        consigneeId: selected.value, // Set the ID
        consigneeName: selected.name,
        consigneeAddress: selected.address,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        consigneeId: '',
        consigneeName: '',
        consigneeAddress: '',
      }))
    }
  }

  // Handle consignor search input change with debouncing
  const handleConsignorInputChange = useCallback((value) => {
    setConsignorSearchInput(value)
    setConsignorPage(1) // Reset to first page on new search
  }, [])

  // Handle consignee search input change with debouncing
  const handleConsigneeInputChange = useCallback((value) => {
    setConsigneeSearchInput(value)
    setConsigneePage(1) // Reset to first page on new search
  }, [])

  // Handle infinite scroll for consignor
  const handleConsignorMenuScrollToBottom = useCallback(() => {
    const totalPages = Math.ceil(consignorData.total / itemsPerPage)
    if (consignorPage < totalPages) {
      setConsignorPage((prev) => prev + 1)
    }
  }, [consignorData.total, consignorPage])

  // Handle infinite scroll for consignee
  const handleConsigneeMenuScrollToBottom = useCallback(() => {
    const totalPages = Math.ceil(consigneeData.total / itemsPerPage)
    if (consigneePage < totalPages) {
      setConsigneePage((prev) => prev + 1)
    }
  }, [consigneeData.total, consigneePage])

  // Extract product details from rail head response
  useEffect(() => {
    if (inventoryList.length > 0) {
      console.log('=== RAIL HEAD DATA ===', inventoryList)

      const details = {}
      inventoryList.forEach((item) => {
        const productId = item._id || item.id || item.productId

        if (productId) {
          details[productId] = {
            _id: item._id,
            id: item.id,
            productId: item.productId || item._id,
            productName: item.productName || item.name || 'Unknown Product',
            quantityMT: item.quantityMT || item.quantity || item.totalQuantity || 0,
            bagSize: item.bagSize || item.bagWeight || 0,
            totalBags: item.totalBags || item.bags || item.totalBagsCount || 0,
            __v: item.__v,
          }
        }
      })

      setProductDetails(details)
    }
  }, [inventoryList])

  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const data = await fetchDrivers()
        setDrivers(data || [])
      } catch (error) {
        console.error('Error fetching drivers:', error)
      }
    }

    const loadVehicles = async () => {
      try {
        const data = await fetchVehicles()
        setVehicles(data || [])
      } catch (error) {
        console.error('Error fetching vehicles:', error)
      }
    }

    loadDrivers()
    loadVehicles()
  }, [])

  // In the useEffect that sets initial data, update it:
  useEffect(() => {
    if (mode === 'edit' && initialData) {
      console.log('WarehouseForm initialData:', initialData)

      // Helper function to parse date from various formats
      const parseDate = (dateString) => {
        if (!dateString) return getTodayDate()

        try {
          // Try to parse from DD/MM/YYYY format
          if (dateString.includes('/')) {
            const parts = dateString.split('/')
            if (parts.length === 3) {
              const day = parts[0].padStart(2, '0')
              const month = parts[1].padStart(2, '0')
              const year = parts[2]
              return `${year}-${month}-${day}`
            }
          }

          // Try to parse from ISO string
          if (dateString.includes('T')) {
            const date = new Date(dateString)
            if (!isNaN(date.getTime())) {
              const year = date.getFullYear()
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')
              return `${year}-${month}-${day}`
            }
          }

          // Return as-is if it already looks like YYYY-MM-DD
          if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
            return dateString
          }
        } catch (error) {
          console.error('Error parsing date:', error)
        }

        return getTodayDate()
      }

      // Determine receivedByType from initialData
      let receivedByType = 'warehouse' // default
      if (initialData.receivedBy === 'Party') {
        receivedByType = 'party'
      }

      const editedFormData = {
        ...defaultFormData,
        ...initialData,
        date: parseDate(initialData.date), // Use the parseDate function
        vehicleName: vehicles.find((vehicle) => vehicle.id === initialData.vehicleId)?.name || '',
        driverName: drivers.find((driver) => driver.id === initialData.driverId)?.name || '',
        companyId: initialData.companyId || '',
        consignorId: initialData.consignorId || '',
        consignorName: initialData.consignorName || '',
        consignorAddress: initialData.consignorAddress || '',
        consigneeId: initialData.consigneeId || '',
        consigneeName: initialData.consigneeName || '',
        consigneeAddress: initialData.consigneeAddress || '',
        receivedByType: receivedByType,
        products: initialData.products?.map((product) => ({
          ...defaultProduct,
          ...product,
          quantityMT: product.quantityMT?.toString() || '',
          bagSize: product.bagSize?.toString() || '',
          totalBags: product.totalBags?.toString() || '',
          ...(initialData.receivedBy === 'Party'
            ? {
                warehouseId: '',
                warehouseName: '',
              }
            : {}),
        })) || [{ ...defaultProduct }],
      }

      console.log('WarehouseForm editedFormData - Date:', editedFormData.date)
      console.log('WarehouseForm editedFormData:', editedFormData)
      setFormData(editedFormData)
    } else {
      setFormData(defaultFormData)
    }
  }, [initialData, mode, vehicles, drivers])

  // Auto-fill warehouse in products when receivedByType is 'warehouse'
  useEffect(() => {
    if (
      formData.receivedByType === 'warehouse' &&
      formData.receivedByWarehouseId &&
      formData.issuedBy === 'Railhead'
    ) {
      const updatedProducts = formData.products.map((product) => ({
        ...product,
        warehouseId: formData.receivedByWarehouseId,
        warehouseName: formData.receivedByWarehouseName,
      }))

      if (JSON.stringify(updatedProducts) !== JSON.stringify(formData.products)) {
        setFormData((prev) => ({
          ...prev,
          products: updatedProducts,
        }))
      }
    }

    // Clear warehouse in products when receivedByType is 'party'
    if (formData.receivedByType === 'party' && formData.issuedBy === 'Railhead') {
      const hasWarehouseInProducts = formData.products.some(
        (product) => product.warehouseId || product.warehouseName,
      )
      if (hasWarehouseInProducts) {
        const updatedProducts = formData.products.map((product) => ({
          ...product,
          warehouseId: '',
          warehouseName: '',
        }))

        setFormData((prev) => ({
          ...prev,
          products: updatedProducts,
        }))
      }
    }
  }, [
    formData.receivedByType,
    formData.receivedByWarehouseId,
    formData.receivedByWarehouseName,
    formData.issuedBy,
  ])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReceivedByTypeChange = (type) => {
    if (type === 'warehouse') {
      setFormData((prev) => ({
        ...prev,
        receivedByType: 'warehouse',
        receivedBy: 'Warehouse',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
        products: prev.products.map((product) => ({
          ...product,
          warehouseId: '',
          warehouseName: '',
        })),
      }))
    } else if (type === 'party') {
      setFormData((prev) => ({
        ...prev,
        receivedByType: 'party',
        receivedBy: 'Party',
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
        products: prev.products.map((product) => ({
          ...product,
          warehouseId: '',
          warehouseName: '',
        })),
      }))
    }
  }

  const handleWarehouseSelect = (selected) => {
    if (selected) {
      const selectedWarehouse = warehouseList.find(
        (w) => w.id === selected.value || w._id === selected.value,
      )
      setFormData((prev) => ({
        ...prev,
        receivedByWarehouseId: selected.value,
        receivedByWarehouseName:
          selectedWarehouse?.wareHouseName || selectedWarehouse?.name || selected.label,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        receivedByWarehouseId: '',
        receivedByWarehouseName: '',
      }))
    }
  }

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products]

    if (field === 'warehouseId') {
      const selectedWarehouse = warehouseList.find((w) => w.id === value || w._id === value)
      updatedProducts[index] = {
        ...updatedProducts[index],
        warehouseId: value,
        warehouseName: selectedWarehouse?.wareHouseName || selectedWarehouse?.name || '',
      }
    } else if (field === 'productId') {
      const selectedProduct = inventoryList.find((p) => p._id === value || p.id === value)

      if (selectedProduct) {
        const productName = selectedProduct.productName || selectedProduct.name || 'Unknown Product'
        const productId = selectedProduct.productId
        const inventoryId = selectedProduct._id || selectedProduct.id

        const bagSize = selectedProduct.bagSize || selectedProduct.bagWeight || 0
        const totalBags = selectedProduct.totalBags || selectedProduct.totalags || 0
        const quantityMT = selectedProduct.quantityMT || selectedProduct.quantity || 0

        updatedProducts[index] = {
          ...updatedProducts[index],
          inventoryId: inventoryId,
          productId: productId,
          productName: productName,
          quantityMT: quantityMT.toString(), // FIXED: Pre-fill with available quantity
          bagSize: bagSize.toString(),
          totalBags: totalBags.toString(), // FIXED: Pre-fill with total bags
        }
      } else {
        updatedProducts[index] = {
          ...updatedProducts[index],
          inventoryId: '',
          productId: value,
          productName: '',
          quantityMT: '',
          bagSize: '',
          totalBags: '',
        }
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      }
    }

    if (
      field !== 'warehouseId' &&
      formData.receivedByType === 'warehouse' &&
      formData.receivedByWarehouseId &&
      formData.issuedBy === 'Railhead'
    ) {
      updatedProducts[index] = {
        ...updatedProducts[index],
        warehouseId: formData.receivedByWarehouseId,
        warehouseName: formData.receivedByWarehouseName,
      }
    }

    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProduct = () => {
    const newProduct = {
      ...defaultProduct,
    }

    if (
      formData.receivedByType === 'warehouse' &&
      formData.receivedByWarehouseId &&
      formData.issuedBy === 'Railhead'
    ) {
      newProduct.warehouseId = formData.receivedByWarehouseId
      newProduct.warehouseName = formData.receivedByWarehouseName
    }

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newProduct],
    }))
  }

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = [...formData.products]
      updatedProducts.splice(index, 1)
      setFormData((prev) => ({ ...prev, products: updatedProducts }))
    }
  }

  const onSubmit = (e) => {
    e.preventDefault()

    console.log('=== PRODUCTS BEFORE VALIDATION ===')
    formData.products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`, {
        productId: product.productId,
        productName: product.productName,
        quantityMT: product.quantityMT,
        bagSize: product.bagSize,
        totalBags: product.totalBags,
      })
    })

    // Basic validation
    if (!formData.companyId) {
      alert('Please select a company')
      return
    }

    if (!formData.startLocation || !formData.endLocation) {
      alert('Please enter both start and end locations')
      return
    }

    const invalidProducts = formData.products.reduce((acc, product, index) => {
      let isValid = true
      const errorMessages = []

      if (!product.productId) {
        errorMessages.push('Missing product selection')
        isValid = false
      }

      const quantityMT = parseFloat(product.quantityMT)
      if (isNaN(quantityMT) || quantityMT <= 0) {
        errorMessages.push('Invalid quantity (must be greater than 0)')
        isValid = false
      }

      // REMOVED: Bag size validation
      // const bagSize = parseFloat(product.bagSize)
      // if (isNaN(bagSize) || bagSize <= 0) {
      //   errorMessages.push('Invalid bag size (must be greater than 0)')
      //   isValid = false
      // }

      // REMOVED: Total bags validation
      // const totalBags = parseFloat(product.totalBags)
      // if (isNaN(totalBags) || totalBags <= 0) {
      //   errorMessages.push('Invalid total bags (must be greater than 0)')
      //   isValid = false
      // }

      if (warehouseDisplayMode !== 'hidden' && !product.warehouseId) {
        errorMessages.push('Warehouse selection required')
        isValid = false
      }

      if (!isValid) {
        console.log(`Product ${index + 1} validation failed:`, errorMessages)
        acc.push({ index, errors: errorMessages })
      }

      return acc
    }, [])

    if (invalidProducts.length > 0) {
      const firstError = invalidProducts[0]
      const productNumber = firstError.index + 1
      const errorDetails = firstError.errors.join(', ')

      alert(`Product ${productNumber} has validation errors: ${errorDetails}`)
      return
    }

    // Check if vehicle exists in database (has a valid ID from vehicleOptions)
    const vehicleExistsInDb = vehicleOptions.some((vehicle) => vehicle.value === formData.vehicleId)

    // Check if driver exists in database (has a valid ID from driverOptions)
    const driverExistsInDb = driverOptions.some((driver) => driver.value === formData.driverId)

    // Process number fields - convert empty strings to 0
    const processNumberField = (value) => {
      if (value === '' || value === null || value === undefined) {
        return 0
      }
      const num = parseFloat(value)
      return isNaN(num) ? 0 : num
    }

    const preparedProducts = formData.products.map((product) => {
      const productFromInventory = inventoryList.find(
        (p) => p._id === product.productId || p.id === product.productId,
      )

      const actualProductId = productFromInventory?.productId || product.productId
      const actualProductName =
        productFromInventory?.productName || productFromInventory?.name || product.productName

      const baseProduct = {
        ...product,
        productId: actualProductId,
        productName: actualProductName,
        quantityMT: parseFloat(product.quantityMT) || 0,
        bagSize: parseFloat(product.bagSize) || 0,
        totalBags: parseFloat(product.totalBags) || 0,
      }

      if (formData.issuedBy === 'Railhead' && formData.receivedByType === 'party') {
        const { warehouseId, warehouseName, ...rest } = baseProduct
        return rest
      }

      return baseProduct
    })

    // Build the payload
    const payload = {
      ...formData,
      tpPassType: 'warehouse',
      companyId: formData.companyId || '',
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      products: preparedProducts,
      // Process all number fields in the main form data
      customerRate: processNumberField(formData.customerRate),
      totalAmount: processNumberField(formData.totalAmount),
      transporterRate: processNumberField(formData.transporterRate),
      totalTransporterAmount: processNumberField(formData.totalTransporterAmount),
      transporterRateOn: processNumberField(formData.transporterRateOn),
      customerRateOn: processNumberField(formData.customerRateOn),
      customerFreight: processNumberField(formData.customerFreight),
      transporterFreight: processNumberField(formData.transporterFreight),
    }

    // Remove vehicleId if vehicle doesn't exist in database
    if (!vehicleExistsInDb && payload.vehicleId) {
      console.log('Vehicle not found in DB, removing vehicleId from payload')
      payload.vehicleName = payload.vehicleId // Keep the name as what user entered
      delete payload.vehicleId
    }

    // Remove driverId if driver doesn't exist in database
    if (!driverExistsInDb && payload.driverId) {
      console.log('Driver not found in DB, removing driverId from payload')
      payload.driverName = payload.driverId // Keep the name as what user entered
      delete payload.driverId
    }

    if (formData.issuedBy === 'Railhead' && formData.receivedByType === 'party') {
      payload.products = payload.products.map((product) => {
        const { warehouseId, warehouseName, ...rest } = product
        return rest
      })
    }

    if (formData.issuedBy === 'Railhead' && formData.receivedByType === 'warehouse') {
      payload.products = payload.products.map((product) => ({
        ...product,
        warehouseId: product.warehouseId || formData.receivedByWarehouseId,
      }))
    }

    if (userRole !== 'superadmin') {
      delete payload.supervisorId
      delete payload.supervisorName
    }

    console.log('=== FINAL PAYLOAD ===', payload)
    console.log('=== VEHICLE EXISTS IN DB? ===', vehicleExistsInDb)
    console.log('=== DRIVER EXISTS IN DB? ===', driverExistsInDb)
    console.log('=== PRODUCTS DETAIL ===', payload.products)

    handleSubmit(payload)
  }

  // Add this helper function near the top of your component
  const formatNumberValue = (value) => {
    if (value === '' || value === null || value === undefined) {
      return ''
    }
    return value.toString()
  }

  const receivedByWarehouseOptions = warehouseList.map((w) => ({
    value: w.id || w._id,
    label: w.wareHouseName || w.name || 'Unnamed Warehouse',
  }))

  const warehouseOptions = warehouseList.map((w) => ({
    value: w.id || w._id,
    label: w.wareHouseName || w.name || 'Unnamed Warehouse',
  }))

  // REMOVED: Filtering for bagSize > 0
  const productOptions = inventoryList.map((p) => {
    const inventoryId = p._id || p.id
    const productId = p.productId || inventoryId
    const productName = p.productName || p.name || 'Unnamed Product'
    const quantityMT = p.quantityMT || p.quantity || 0
    const bagSize = p.bagSize || p.bagWeight || 0
    const totalBags = p.totalBags || p.bags || 0

    return {
      value: inventoryId,
      label: `${productName} ( Available: ${quantityMT} MT, Bag Size: ${bagSize} kg, Total Bags: ${totalBags} )`, // CHANGED: kg to MT
      data: p,
    }
  })

  const companyOptions = companyList.map((c) => ({
    value: c.id || c._id,
    label: c.companyName || c.name || 'Unnamed Company',
  }))

  const vehicleOptions = Array.isArray(vehicles)
    ? vehicles.map((v) => ({
        value: v.id || v._id,
        label: v.name || v.vehicleNumber || 'Unnamed Vehicle',
      }))
    : []

  const driverOptions = Array.isArray(drivers)
    ? drivers.map((d) => ({
        value: d.id || d._id,
        label: d.name || 'Unnamed Driver',
      }))
    : []

  // Consignor Options with create new option - FIXED: Include ID in the option
  const consignorOptions = [
    ...consignorList.map((consignor) => ({
      value: consignor.id, // This is the ID
      label: consignor.name,
      name: consignor.name,
      address: consignor.address,
    })),
    {
      value: 'create-new',
      label: (
        <div className="text-primary d-flex align-items-center">
          <FaUserPlus className="me-2" />
          Create New Consignor
        </div>
      ),
      name: '',
      address: '',
    },
  ]

  // Consignee Options with create new option - FIXED: Include ID in the option
  const consigneeOptions = [
    ...consigneeList.map((consignee) => ({
      value: consignee.id, // This is the ID
      label: consignee.name,
      name: consignee.name,
      address: consignee.address,
    })),
    {
      value: 'create-new',
      label: (
        <div className="text-primary d-flex align-items-center">
          <FaUserPlus className="me-2" />
          Create New Consignee
        </div>
      ),
      name: '',
      address: '',
    },
  ]

  const getWarehouseValue = (product) => {
    if (!product.warehouseId) return null
    return warehouseOptions.find((opt) => opt.value === product.warehouseId) || null
  }

  const getProductValue = (product) => {
    // Try to find by inventoryId first
    if (product.inventoryId) {
      const found = productOptions.find((opt) => opt.value === product.inventoryId)
      if (found) return found
    }

    // Try to find by productId
    if (product.productId) {
      const found = productOptions.find((opt) => {
        const productData = opt.data || {}
        return (
          productData.productId === product.productId ||
          productData.id === product.productId ||
          productData._id === product.productId
        )
      })
      if (found) return found
    }

    // Try to find by productName
    if (product.productName) {
      const found = productOptions.find((opt) => {
        const productData = opt.data || {}
        return (
          productData.productName === product.productName ||
          productData.name === product.productName
        )
      })
      if (found) return found
    }

    return null
  }

  const getCompanyValue = () => {
    if (!formData.companyId) return null
    return companyOptions.find((opt) => opt.value === formData.companyId) || null
  }

  const getVehicleValue = () => {
    if (formData.vehicleId) {
      const existingVehicle = vehicleOptions.find((opt) => opt.value === formData.vehicleId)
      if (existingVehicle) {
        return existingVehicle
      }
      return {
        value: formData.vehicleId,
        label: formData.vehicleName || formData.vehicleId,
      }
    }
    return null
  }

  const getDriverValue = () => {
    if (formData.driverId) {
      const existingDriver = driverOptions.find((opt) => opt.value === formData.driverId)
      if (existingDriver) {
        return existingDriver
      }
      return {
        value: formData.driverId,
        label: formData.driverName || formData.driverId,
      }
    }
    return null
  }

  const getReceivedByWarehouseValue = () => {
    if (!formData.receivedByWarehouseId) return null
    return (
      receivedByWarehouseOptions.find((opt) => opt.value === formData.receivedByWarehouseId) || null
    )
  }

  // Get consignor value for Select component - FIXED: Find by ID instead of name
  const getConsignorValue = () => {
    if (!formData.consignorId) return null
    return consignorOptions.find((opt) => opt.value === formData.consignorId) || null
  }

  // Get consignee value for Select component - FIXED: Find by ID instead of name
  const getConsigneeValue = () => {
    if (!formData.consigneeId) return null
    return consigneeOptions.find((opt) => opt.value === formData.consigneeId) || null
  }

  // In the product rendering section, update to handle party case:
  const shouldShowWarehouseInProducts = () => {
    if (formData.issuedBy === 'Railhead') {
      if (formData.receivedByType === 'warehouse' || formData.receivedBy === 'Warehouse') {
        return 'auto-filled'
      } else if (formData.receivedByType === 'party' || formData.receivedBy === 'Party') {
        return 'hidden'
      }
    }
    return 'editable'
  }

  const warehouseDisplayMode = shouldShowWarehouseInProducts()

  // Get product details for display
  const getProductDetailForDisplay = (product) => {
    let productDetail
    if (product.inventoryId) {
      productDetail = productDetails[product.inventoryId]
    }

    if (!productDetail && (product.productId || product.inventoryId)) {
      const productFromList = inventoryList.find(
        (p) =>
          p._id === product.inventoryId ||
          p.id === product.inventoryId ||
          p.productId === product.productId,
      )
      if (productFromList) {
        productDetail = {
          productId: productFromList.productId,
          inventoryId: productFromList._id || productFromList.id,
          productName: productFromList.productName || productFromList.name || 'Unknown Product',
          quantityMT: productFromList.quantityMT || productFromList.quantity || 0,
          bagSize: productFromList.bagSize || productFromList.bagWeight || 0,
          totalBags: productFromList.totalBags || productFromList.bags || 0,
          bags: productFromList.bags || 0,
        }
      }
    }

    return productDetail
  }

  // Calculate derived values for a product
  const calculateProductDetails = (product, index) => {
    const productDetail = getProductDetailForDisplay(product)
    if (!productDetail) return null

    const bags = parseFloat(product.bags) || 0
    const bagSize = parseFloat(product.bagSize) || 0
    const totalBags = parseFloat(product.totalBags) || 0
    const quantityMT = parseFloat(product.quantityMT) || 0

    return {
      productDetail,
      bags,
      bagSize,
      totalBags,
      quantityMT,
    }
  }

  return (
    <>
      <Modal
        show={show}
        onHide={handleClose}
        size="xl"
        centered
        scrollable
        dialogClassName="modal-dialog-scrollable"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="w-100">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="d-flex align-items-center">
                <FaWarehouse className="me-2 text-success" />
                <h4 className="mb-0">
                  {mode === 'edit' ? 'Edit' : 'Add'} Railhead to Warehouse/Party TP Pass
                </h4>
              </div>
              {mode === 'add' && (
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => onFormTypeChange(null)}
                  disabled={isLoading}
                >
                  Change Type
                </Button>
              )}
            </div>
          </Modal.Title>
        </Modal.Header>

        <Modal.Body
          className="p-4 pt-0"
          style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}
        >
          <div className="alert alert-info mb-4">
            <div className="d-flex align-items-center">
              <FaWarehouse className="me-2" />
              <div>
                <strong>TP Pass Type:</strong> Railhead to Warehouse/Party
                <div className="small mt-1">
                  <strong>Issued by:</strong> {formData.issuedBy} • <strong>Received by:</strong>{' '}
                  {formData.receivedBy}
                  {formData.receivedByType && ` (${formData.receivedByType})`}
                  {formData.receivedByType === 'warehouse' &&
                    formData.receivedByWarehouseName &&
                    ` • ${formData.receivedByWarehouseName}`}
                </div>
                {warehouseDisplayMode === 'auto-filled' && (
                  <div className="small text-success mt-1">
                    <FaWarehouse className="me-1" />
                    Warehouse in products section will be auto-filled from selected warehouse above
                  </div>
                )}
                {warehouseDisplayMode === 'hidden' && (
                  <div className="small text-warning mt-1">
                    <FaUserFriends className="me-1" />
                    Warehouse field is hidden in products section when received by party
                  </div>
                )}
              </div>
            </div>
          </div>

          <Form onSubmit={onSubmit}>
            {/* Issued/Received Section */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Issued & Received Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Label>Issued By</Form.Label>
                <Form.Control
                  type="text"
                  value="Railhead"
                  readOnly
                  disabled={isLoading}
                  placeholder="Issued by"
                  className="bg-light"
                />
              </div>
              <div className="col-md-6">
                <Form.Label>Received By</Form.Label>
                <div>
                  <div className="mb-3">
                    <div className="d-flex gap-2">
                      {receivedByOptions.map((option) => (
                        <Button
                          key={option.value}
                          variant={
                            formData.receivedByType === option.value ||
                            (option.value === 'party' && formData.receivedBy === 'Party') ||
                            (option.value === 'warehouse' && formData.receivedBy === 'Warehouse')
                              ? 'primary'
                              : 'outline-primary'
                          }
                          onClick={() => handleReceivedByTypeChange(option.value)}
                          className="d-flex align-items-center"
                          disabled={isLoading}
                        >
                          {option.icon}
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {formData.receivedByType === 'warehouse' && (
                    <div className="mt-3">
                      <Form.Label>Select Warehouse</Form.Label>
                      <Select
                        value={getReceivedByWarehouseValue()}
                        onChange={handleWarehouseSelect}
                        options={receivedByWarehouseOptions}
                        placeholder="Select Warehouse"
                        isClearable
                        isLoading={isLoading || isRailHeadFetching}
                      />
                      {formData.receivedByWarehouseName && (
                        <Form.Text className="text-success">
                          Selected: {formData.receivedByWarehouseName}
                        </Form.Text>
                      )}
                    </div>
                  )}

                  {formData.receivedByType === 'party' && (
                    <div className="mt-3">
                      <Form.Label>Party</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.receivedBy}
                        onChange={(e) =>
                          setFormData((prev) => ({ ...prev, receivedBy: e.target.value }))
                        }
                        placeholder="Enter party name"
                        disabled={isLoading}
                        readOnly
                        className="bg-light"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Company Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Company Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Label>
                  Company Name <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Select
                  value={getCompanyValue()}
                  onChange={(selected) => {
                    if (selected) {
                      const selectedCompany = companyList.find((c) => c.id === selected.value)
                      setFormData((prev) => ({
                        ...prev,
                        companyId: selectedCompany?.id || '',
                        companyName: selectedCompany?.companyName || '',
                        companyEmail: selectedCompany?.email || '',
                        companyMobileNumber: selectedCompany?.mobileNumber || '',
                        companyOfficeNumber: selectedCompany?.officeNumber || '',
                        companyAddress: selectedCompany?.address || '',
                        gstIn: selectedCompany?.gstNumber || '',
                      }))
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        companyId: '',
                        companyName: '',
                        companyEmail: '',
                        companyMobileNumber: '',
                        companyOfficeNumber: '',
                        companyAddress: '',
                        gstIn: '',
                      }))
                    }
                  }}
                  options={companyOptions}
                  placeholder="Select Company"
                  isClearable
                  isLoading={isLoading || isRailHeadFetching}
                  required
                />
              </div>
            </div>

            {/* Basic Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Basic Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <Form.Label>
                  Date <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  type="date"
                  name="date"
                  value={formData.date || getTodayDate()}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  max={getTodayDate()}
                />
              </div>

              <div className="col-md-4">
                <Form.Label>
                  Vehicle Name (Lorry Number) <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <CreatableSelect
                  value={getVehicleValue()}
                  onChange={handleVehicleChange}
                  options={vehicleOptions}
                  placeholder="Select or type new vehicle"
                  isClearable
                  isLoading={isLoading || isRailHeadFetching}
                  required
                />
              </div>

              <div className="col-md-4">
                <Form.Label>
                  Driver Name <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <CreatableSelect
                  value={getDriverValue()}
                  onChange={handleDriverChange}
                  options={driverOptions}
                  placeholder="Select or type new driver"
                  isClearable
                  isLoading={isLoading || isRailHeadFetching}
                  required
                />
              </div>
            </div>

            {/* Consignor Details with Create New Option and Debouncing */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Consignor Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <Form.Label>Consignor Name</Form.Label>
                <Select
                  value={getConsignorValue()}
                  onChange={(selected) => {
                    if (selected && selected.value === 'create-new') {
                      // Show the create consignor modal
                      setShowConsignorModal(true)
                      // Clear the selection
                      handleConsignorChange(null)
                    } else {
                      handleConsignorChange(selected)
                    }
                  }}
                  options={consignorOptions}
                  placeholder="Select Consignor or Create New"
                  isClearable
                  isLoading={isLoading || isFetchingConsignor}
                  onInputChange={handleConsignorInputChange}
                  onMenuScrollToBottom={handleConsignorMenuScrollToBottom}
                  filterOption={null}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No consignor found for "${inputValue}"`
                      : 'Type to search consignor'
                  }
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor:
                        state.data.value === 'create-new' ? '#f8f9fa' : provided.backgroundColor,
                      '&:hover': {
                        backgroundColor: state.data.value === 'create-new' ? '#e9ecef' : '#f8f9fa',
                      },
                    }),
                  }}
                />
                {isFetchingConsignor && <Form.Text className="text-info">Searching...</Form.Text>}
              </div>
              {formData.consignorAddress && (
                <div className="col-md-12">
                  <Form.Label>Consignor Address</Form.Label>
                  <Form.Control value={formData.consignorAddress} readOnly className="bg-light" />
                </div>
              )}
            </div>

            {/* Consignee Details with Create New Option and Debouncing */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Consignee Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <Form.Label>Consignee Name</Form.Label>
                <Select
                  value={getConsigneeValue()}
                  onChange={(selected) => {
                    if (selected && selected.value === 'create-new') {
                      // Show the create consignee modal
                      setShowConsigneeModal(true)
                      // Clear the selection
                      handleConsigneeChange(null)
                    } else {
                      handleConsigneeChange(selected)
                    }
                  }}
                  options={consigneeOptions}
                  placeholder="Select Consignee or Create New"
                  isClearable
                  isLoading={isLoading || isFetchingConsignee}
                  onInputChange={handleConsigneeInputChange}
                  onMenuScrollToBottom={handleConsigneeMenuScrollToBottom}
                  filterOption={null}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No consignee found for "${inputValue}"`
                      : 'Type to search consignee'
                  }
                  styles={{
                    option: (provided, state) => ({
                      ...provided,
                      backgroundColor:
                        state.data.value === 'create-new' ? '#f8f9fa' : provided.backgroundColor,
                      '&:hover': {
                        backgroundColor: state.data.value === 'create-new' ? '#e9ecef' : '#f8f9fa',
                      },
                    }),
                  }}
                />
                {isFetchingConsignee && <Form.Text className="text-info">Searching...</Form.Text>}
              </div>
              {formData.consigneeAddress && (
                <div className="col-md-12">
                  <Form.Label>Consignee Address</Form.Label>
                  <Form.Control value={formData.consigneeAddress} readOnly className="bg-light" />
                </div>
              )}
            </div>

            {/* Customer Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Customer Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Label>Customer Name</Form.Label>
                <Form.Control
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
              <div className="col-md-6">
                <Form.Label>Customer Address</Form.Label>
                <Form.Control
                  name="customerAddress"
                  value={formData.customerAddress}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Route Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Route Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Label>
                  Start Location <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  name="startLocation"
                  value={formData.startLocation}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div className="col-md-6">
                <Form.Label>
                  End Location <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Form.Control
                  name="endLocation"
                  value={formData.endLocation}
                  onChange={handleChange}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            {/* Product Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Product Details</h5>
            <div className="mb-4">
              {formData.products.map((product, index) => {
                const calculations = calculateProductDetails(product, index)
                const productDetail = getProductDetailForDisplay(product)

                return (
                  <div key={index} className="border rounded p-3 mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="mb-0">Product {index + 1}</h6>
                      {formData.products.length > 1 && (
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => removeProduct(index)}
                          disabled={isLoading}
                        >
                          Remove
                        </Button>
                      )}
                    </div>

                    {/* Product Details Display from API */}
                    {productDetail && (
                      <div className="alert alert-info mb-3 p-3">
                        <div className="d-flex align-items-center mb-2">
                          <FaInfoCircle className="me-2" />
                          <strong>Product Details from RailHead Inventory:</strong>
                        </div>
                        <div className="row small">
                          <div className="col-md-3 mb-1">
                            <span className="text-muted">Product:</span>{' '}
                            <strong>{productDetail.productName}</strong>
                          </div>
                          <div className="col-md-3 mb-1">
                            <span className="text-muted">Available Quantity (MT):</span>{' '}
                            <strong
                              className={
                                productDetail.quantityMT === 0 ? 'text-danger' : 'text-success'
                              }
                            >
                              {productDetail.quantityMT}
                            </strong>
                          </div>
                          <div className="col-md-3 mb-1">
                            <span className="text-muted">Bag Size (kg):</span>{' '}
                            <strong
                              className={
                                productDetail.bagSize === 0 ? 'text-danger' : 'text-success'
                              }
                            >
                              {productDetail.bagSize}
                            </strong>
                          </div>
                          <div className="col-md-3 mb-1">
                            <span className="text-muted">Total Bags:</span>{' '}
                            <strong
                              className={
                                productDetail.totalBags === 0 ? 'text-danger' : 'text-success'
                              }
                            >
                              {productDetail.totalBags}
                            </strong>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row g-3">
                      {/* Warehouse field - conditionally displayed */}
                      {warehouseDisplayMode === 'auto-filled' ? (
                        <div className="col-md-6">
                          <Form.Label>
                            Warehouse <span style={{ color: 'red' }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={
                              product.warehouseName ||
                              formData.receivedByWarehouseName ||
                              'Select warehouse above'
                            }
                            disabled
                            readOnly
                            required
                          />
                          <Form.Text className="text-success">
                            <FaWarehouse className="me-1" />
                            Auto-filled from selected warehouse
                          </Form.Text>
                        </div>
                      ) : warehouseDisplayMode === 'hidden' ? (
                        <div className="col-md-6">
                          <div className="alert alert-warning p-2 mb-0">
                            <FaUserFriends className="me-2" />
                            <small>Warehouse not required when received by party</small>
                          </div>
                        </div>
                      ) : (
                        <div className="col-md-6">
                          <Form.Label>
                            Warehouse <span style={{ color: 'red' }}>*</span>
                          </Form.Label>
                          <Select
                            value={getWarehouseValue(product)}
                            onChange={(selected) =>
                              handleProductChange(
                                index,
                                'warehouseId',
                                selected ? selected.value : '',
                              )
                            }
                            options={warehouseOptions}
                            placeholder="Select Warehouse"
                            isClearable
                            isLoading={isLoading || isRailHeadFetching}
                            required
                          />
                        </div>
                      )}

                      <div className="col-md-6">
                        <Form.Label>
                          Product <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Select
                          value={getProductValue(product)}
                          onChange={(selected) =>
                            handleProductChange(index, 'productId', selected ? selected.value : '')
                          }
                          options={productOptions}
                          placeholder="Select Product"
                          isClearable
                          isLoading={isLoading || isRailHeadFetching}
                          required
                        />
                        {productDetail && (
                          <Form.Text className="text-info">
                            <FaBox className="me-1" />
                            {productDetail.productName} • Available: {productDetail.quantityMT} MT •
                            Bag Size: {productDetail.bagSize} kg • Total Bags:{' '}
                            {productDetail.totalBags}
                          </Form.Text>
                        )}
                      </div>

                      {/* Total Bags */}
                      <div className="col-md-4">
                        <Form.Label>Total Bags</Form.Label>
                        <Form.Control
                          type="number"
                          value={product.totalBags}
                          onChange={(e) => handleProductChange(index, 'totalBags', e.target.value)}
                          onWheel={handleNumberInputScroll}
                          disabled={isLoading}
                          placeholder="Enter total bags"
                        />
                      </div>

                      {/* Bag Size */}
                      <div className="col-md-4">
                        <Form.Label>Bag Size (kg per bag)</Form.Label>
                        <Form.Control
                          type="number"
                          value={product.bagSize}
                          onChange={(e) => handleProductChange(index, 'bagSize', e.target.value)}
                          onWheel={handleNumberInputScroll}
                          disabled={isLoading}
                          placeholder="Enter bag size"
                        />
                        <Form.Text className="text-muted">Weight per bag in kilograms</Form.Text>
                      </div>

                      {/* Quantity (MT) - Editable field (removed auto-calculated logic) */}
                      <div className="col-md-4">
                        <Form.Label>
                          Quantity (MT) <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={product.quantityMT}
                          onChange={(e) => handleProductChange(index, 'quantityMT', e.target.value)}
                          onWheel={handleNumberInputScroll}
                          disabled={isLoading}
                          placeholder="Enter quantity MT"
                          required
                          min="0"
                          step="0.01"
                        />
                        <Form.Text className="text-muted">Enter quantity in Metric Ton</Form.Text>
                      </div>
                    </div>
                  </div>
                )
              })}

              <Button
                variant="outline-primary"
                onClick={addProduct}
                className="mb-3"
                disabled={isLoading || isRailHeadFetching}
              >
                Add Another Product
              </Button>
            </div>

            {/* Freight Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Freight Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <Form.Label>Customer Rate</Form.Label>
                <Form.Control
                  type="number"
                  name="customerRate"
                  value={formData.customerRate}
                  onChange={handleChange}
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Total Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Transporter Rate</Form.Label>
                <Form.Control
                  type="number"
                  name="transporterRate"
                  value={formData.transporterRate}
                  onChange={handleChange}
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Total Transporter Amount</Form.Label>
                <Form.Control
                  type="number"
                  name="totalTransporterAmount"
                  value={formData.totalTransporterAmount}
                  onChange={handleChange}
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Transporter Rate On</Form.Label>
                <Form.Control
                  type="number"
                  name="transporterRateOn"
                  value={formData.transporterRateOn}
                  onChange={handleChange}
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Customer Rate On</Form.Label>
                <Form.Control
                  type="number"
                  name="customerRateOn"
                  value={formData.customerRateOn}
                  onChange={handleChange}
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Customer Freight</Form.Label>
                <Form.Control
                  type="number"
                  name="customerFreight"
                  value={formData.customerFreight}
                  onChange={handleChange}
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Transporter Freight</Form.Label>
                <Form.Control
                  type="number"
                  name="transporterFreight"
                  value={formData.transporterFreight}
                  onChange={handleChange}
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <Button type="submit" disabled={isLoading || isRailHeadFetching}>
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    {mode === 'edit' ? 'Updating...' : 'Creating...'}
                  </>
                ) : mode === 'edit' ? (
                  'Update Receipt'
                ) : (
                  'Create Receipt'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Create New Consignor Modal */}
      <AddConsignorConsigneeModal
        show={showConsignorModal}
        onHide={() => setShowConsignorModal(false)}
        type="consignor"
        onSubmit={handleCreateConsignor}
        isLoading={isCreatingConsignor}
      />

      {/* Create New Consignee Modal */}
      <AddConsignorConsigneeModal
        show={showConsigneeModal}
        onHide={() => setShowConsigneeModal(false)}
        type="consignee"
        onSubmit={handleCreateConsignee}
        isLoading={isCreatingConsignee}
      />
    </>
  )
}

export default WarehouseForm
