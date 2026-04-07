import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'
import { fetchDrivers, fetchSupervisor } from '../../../DriverExpert/data/drivers'
import { fetchVehicles } from '../../../vehicle/data/VehicleListData'
import { TokenContext } from '../../../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWorkerApi } from '../../../TransportPass/data/data'
import Select from 'react-select'
import { getCompanyNameApi } from '../../../TransportPass/data/data'
import CreatableSelect from 'react-select/creatable'
import { getWarehouseListApi, getWarehouseProfileApi } from '../../data/data'
import {
  FaExchangeAlt,
  FaWarehouse,
  FaWeight,
  FaRupeeSign,
  FaUserPlus,
  FaInfoCircle,
} from 'react-icons/fa'
import {
  getConsigneeApi,
  getConsignorApi,
  postConsignorApi,
  postConsigneeApi,
} from '../../../Consignee_Consignor/data/data'
import { toast } from 'react-toastify'
import AddConsignorConsigneeModal from './AddConsignorConsigneeModal'
import { getMartialOwnerDropDownApi } from '../../../Material_Owner/data/data'

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
  tpPassType: 'warehouseToParty',
  issuedBy: 'Warehouse',
  issuedByWarehouseId: '',
  issuedByWarehouseName: '',
  warehouseId: '',
  receivedBy: 'Party',
  receivedByType: 'party',
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
  materialOwnerId: '',
  martialOwnerName: '',
  martialOwnerAddress: '',
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

// Date parsing utility
const parseDateForForm = (dateString) => {
  if (!dateString) return getTodayDate()

  try {
    if (dateString.includes('/')) {
      const parts = dateString.split('/')
      if (parts.length === 3) {
        const day = parts[0].padStart(2, '0')
        const month = parts[1].padStart(2, '0')
        const year = parts[2]
        return `${year}-${month}-${day}`
      }
    }

    if (dateString.includes('T')) {
      const date = new Date(dateString)
      if (!isNaN(date.getTime())) {
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, '0')
        const day = String(date.getDate()).padStart(2, '0')
        return `${year}-${month}-${day}`
      }
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString
    }
  } catch (error) {
    console.error('Error parsing date:', error)
  }

  return getTodayDate()
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

// Prevent wheel event on number inputs
const handleNumberInputWheel = (e) => {
  e.target.blur()
}

// Calculate quantity in MT from bag size and total bags
const calculateQuantityFromBags = (bagSize, totalBags) => {
  if (!bagSize || !totalBags || bagSize <= 0 || totalBags <= 0) return ''
  const quantityInMT = (bagSize * totalBags) / 1000
  return quantityInMT.toFixed(3)
}

// Calculate total bags from bag size and quantity in MT
const calculateBagsFromQuantity = (bagSize, quantityMT) => {
  if (!bagSize || !quantityMT || bagSize <= 0 || quantityMT <= 0) return ''
  const totalBags = (quantityMT * 1000) / bagSize
  return Math.round(totalBags)
}

// Calculate bag size from total bags and quantity in MT
const calculateBagSizeFromQuantityAndBags = (quantityMT, totalBags) => {
  if (!quantityMT || !totalBags || quantityMT <= 0 || totalBags <= 0) return ''
  const bagSize = (quantityMT * 1000) / totalBags
  return bagSize.toFixed(2)
}

const WarehouseToPartyForm = ({
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
  const [isCustomVehicle, setIsCustomVehicle] = useState(false)
  const [isCustomDriver, setIsCustomDriver] = useState(false)
  const [isInitialDataLoaded, setIsInitialDataLoaded] = useState(false)
  const [calculationSource, setCalculationSource] = useState({})

  // Search states
  const [consignorSearchInput, setConsignorSearchInput] = useState('')
  const [consigneeSearchInput, setConsigneeSearchInput] = useState('')
  const [martialOwnerSearchInput, setMartialOwnerSearchInput] = useState('')

  // Debounced search values
  const debouncedConsignorSearch = useDebounce(consignorSearchInput, 300)
  const debouncedConsigneeSearch = useDebounce(consigneeSearchInput, 300)
  const debouncedMartialOwnerSearch = useDebounce(martialOwnerSearchInput, 300)

  const [consignorPage, setConsignorPage] = useState(1)
  const [consigneePage, setConsigneePage] = useState(1)
  const [martialOwnerPage, setMartialOwnerPage] = useState(1)
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

  // Calculate total quantity in MT across all products
  const calculateTotalQuantityMT = useCallback(() => {
    return formData.products.reduce((total, product) => {
      const quantity = parseFloat(product.quantityMT) || 0
      return total + quantity
    }, 0)
  }, [formData.products])

  // Auto-calculate total amount when customer rate or total quantity changes
  useEffect(() => {
    const totalQuantity = calculateTotalQuantityMT()
    const customerRate = parseFloat(formData.customerRate) || 0
    const calculatedTotalAmount = totalQuantity * customerRate

    setFormData((prev) => ({
      ...prev,
      totalAmount: calculatedTotalAmount.toFixed(2),
    }))
  }, [formData.customerRate, formData.products, calculateTotalQuantityMT])

  // Auto-calculate total transporter amount when transporter rate or total quantity changes
  useEffect(() => {
    const totalQuantity = calculateTotalQuantityMT()
    const transporterRate = parseFloat(formData.transporterRate) || 0
    const calculatedTotalTransporterAmount = totalQuantity * transporterRate

    setFormData((prev) => ({
      ...prev,
      totalTransporterAmount: calculatedTotalTransporterAmount.toFixed(2),
    }))
  }, [formData.transporterRate, formData.products, calculateTotalQuantityMT])

  // API Mutations for creating consignor/consignee
  const { mutate: postConsignor } = useMutation({
    mutationFn: postConsignorApi,
    onSuccess: (response) => {
      setIsCreatingConsignor(false)
      setShowConsignorModal(false)
      queryClient.invalidateQueries({ queryKey: ['Consignor'] })
      setFormData((prev) => ({
        ...prev,
        consignorId: response.data?.id || '',
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
      setFormData((prev) => ({
        ...prev,
        consigneeId: response.data?.id || '',
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

  const handleCreateConsignor = (payload) => {
    setIsCreatingConsignor(true)
    postConsignor(payload)
  }

  const handleCreateConsignee = (payload) => {
    setIsCreatingConsignee(true)
    postConsignee(payload)
  }

  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  const { data: companyList = [] } = useQuery({
    queryKey: ['companyList'],
    queryFn: getCompanyNameApi,
    staleTime: 1000 * 60 * 30,
  })

  const { data: warehouseResponse = {} } = useQuery({
    queryKey: ['getWarehouseList', { page: 1, limit: 100 }],
    queryFn: ({ queryKey }) => getWarehouseListApi(queryKey[1]),
    staleTime: 1000 * 60 * 30,
  })

  // Fetch consignor data with debounced search
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
      enabled: true,
    })

  // Fetch consignee data with debounced search
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
      enabled: true,
    })

  // Fetch material owners dropdown
  const { data: martialOwnerData = { data: [], total: 0 }, isFetching: isFetchingMartialOwner } =
    useQuery({
      queryKey: [
        'MartialOwner',
        {
          search: debouncedMartialOwnerSearch,
          // page: martialOwnerPage,
          // limit: itemsPerPage,
        },
      ],
      queryFn: getMartialOwnerDropDownApi,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    })

  // Fetch warehouse products when a warehouse is selected
  const {
    data: warehouseProductsResponse = {},
    isLoading: isLoadingWarehouseProducts,
    isError,
    error,
    refetch: refetchWarehouseProducts,
  } = useQuery({
    queryKey: [
      'warehouseProfile',
      {
        id: formData.issuedByWarehouseId,
        search: '',
        page: 1,
        limit: 100,
      },
    ],
    queryFn: getWarehouseProfileApi,
    enabled: !!formData.issuedByWarehouseId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  })

  const warehouseList = warehouseResponse?.data || []

  // Extract products from warehouse response
  const inventoryList = useMemo(() => {
    if (
      !warehouseProductsResponse ||
      !warehouseProductsResponse.data ||
      !Array.isArray(warehouseProductsResponse.data)
    ) {
      return []
    }
    return warehouseProductsResponse.data || []
  }, [warehouseProductsResponse])

  // Create product options - Show ALL products regardless of totalBags value
  const productOptions = useMemo(() => {
    if (!inventoryList || inventoryList.length === 0) {
      return []
    }

    const options = []
    const seenCombinations = new Set()

    inventoryList.forEach((product) => {
      const productId = product.productId
      const productName = product.productName || 'Unknown Product'
      const bagSize = product.bagSize || 0
      const quantityMT = product.quantityMT || 0
      const totalBags = product.totalBags || 0

      if (!productId) {
        return
      }

      const uniqueKey = `${productId}_${bagSize}`

      if (!seenCombinations.has(uniqueKey)) {
        seenCombinations.add(uniqueKey)

        const label = `${productName} (Bag Size: ${bagSize || '0'} kg, Available: ${quantityMT} kg, Total Bags: ${totalBags})`

        options.push({
          value: uniqueKey,
          label: label,
          productId: productId,
          productName: productName,
          bagSize: bagSize,
          quantityMT: quantityMT,
          totalBags: totalBags,
          originalProductData: product,
        })
      }
    })

    console.log('Product options:', options.length, 'of', inventoryList.length)
    return options
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

  // Load initial data for edit mode
  useEffect(() => {
    if (mode === 'edit' && initialData && !isInitialDataLoaded) {
      console.log('Loading initial data for edit:', initialData)

      const firstProduct = initialData.products?.[0]
      const warehouseId = firstProduct?.warehouseId || ''
      const warehouseName = firstProduct?.warehouseName || ''

      let vehicleName = ''
      if (initialData.vehicleName) {
        vehicleName = initialData.vehicleName
      } else if (initialData.vehicleId && vehicles.length > 0) {
        const vehicle = vehicles.find((v) => v.id === initialData.vehicleId)
        vehicleName = vehicle?.name || vehicle?.vehicleNumber || ''
      }

      let driverName = ''
      if (initialData.driverName) {
        driverName = initialData.driverName
      } else if (initialData.driverId && drivers.length > 0) {
        const driver = drivers.find((d) => d.id === initialData.driverId)
        driverName = driver?.name || ''
      }

      const updatedFormData = {
        ...defaultFormData,
        ...initialData,
        date: parseDateForForm(initialData.date),
        vehicleName: vehicleName,
        driverName: driverName,
        companyId: initialData.companyId || '',
        consignorId: initialData.consignorId || '',
        consigneeId: initialData.consigneeId || '',
        materialOwnerId: initialData.materialOwnerId || '',
        martialOwnerName: initialData.martialOwnerName || '',
        martialOwnerAddress: initialData.martialOwnerAddress || '',
        issuedByWarehouseId: warehouseId,
        issuedByWarehouseName: warehouseName,
        products: initialData.products?.map((product) => {
          const formProduct = {
            ...defaultProduct,
            ...product,
            quantityMT: product.quantityMT?.toString() || '',
            bagSize: product.bagSize?.toString() || '',
            totalBags: product.totalBags?.toString() || '',
            warehouseId: product.warehouseId || '',
            warehouseName: product.warehouseName || '',
          }

          if (formProduct.bagSize) {
            delete formProduct.bagSize
          }

          return formProduct
        }) || [{ ...defaultProduct }],
      }

      console.log('Updated form data:', updatedFormData)
      setFormData(updatedFormData)
      setIsInitialDataLoaded(true)
    } else if (mode === 'add') {
      setFormData(defaultFormData)
      setIsInitialDataLoaded(false)
    }
  }, [initialData, mode, vehicles, drivers, isInitialDataLoaded])

  // Refetch warehouse products when warehouse ID changes in edit mode
  useEffect(() => {
    if (mode === 'edit' && formData.issuedByWarehouseId && isInitialDataLoaded) {
      console.log('Refetching warehouse products for ID:', formData.issuedByWarehouseId)
      refetchWarehouseProducts()
    }
  }, [formData.issuedByWarehouseId, mode, isInitialDataLoaded, refetchWarehouseProducts])

  // Update product warehouse info when warehouse changes
  useEffect(() => {
    if (formData.issuedByWarehouseId && formData.products.length > 0) {
      const selectedWarehouse = warehouseList.find(
        (w) => w.id === formData.issuedByWarehouseId || w._id === formData.issuedByWarehouseId,
      )

      const updatedProducts = formData.products.map((product) => ({
        ...product,
        warehouseId: formData.issuedByWarehouseId,
        warehouseName:
          selectedWarehouse?.wareHouseName ||
          selectedWarehouse?.name ||
          formData.issuedByWarehouseName ||
          '',
      }))

      setFormData((prev) => ({ ...prev, products: updatedProducts }))
    }
  }, [formData.issuedByWarehouseId, formData.issuedByWarehouseName, warehouseList])

  // Update vehicle and driver names when vehicles/drivers arrays are loaded
  useEffect(() => {
    if (mode === 'edit' && formData.vehicleId && vehicles.length > 0 && !formData.vehicleName) {
      const vehicle = vehicles.find((v) => v.id === formData.vehicleId)
      if (vehicle) {
        setFormData((prev) => ({
          ...prev,
          vehicleName: vehicle.name || vehicle.vehicleNumber || '',
        }))
      }
    }
  }, [vehicles, formData.vehicleId, mode])

  useEffect(() => {
    if (mode === 'edit' && formData.driverId && drivers.length > 0 && !formData.driverName) {
      const driver = drivers.find((d) => d.id === formData.driverId)
      if (driver) {
        setFormData((prev) => ({
          ...prev,
          driverName: driver.name || '',
        }))
      }
    }
  }, [drivers, formData.driverId, mode])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Vehicle handler
  const handleVehicleChange = (selected, action) => {
    if (selected) {
      if (action.action === 'create-option') {
        setFormData((prev) => ({
          ...prev,
          vehicleId: '',
          vehicleName: selected.label,
        }))
        setIsCustomVehicle(true)
      } else {
        const selectedVehicle = vehicles.find(
          (v) => v.id === selected.value || v._id === selected.value,
        )
        setFormData((prev) => ({
          ...prev,
          vehicleId: selected.value,
          vehicleName: selectedVehicle?.name || selectedVehicle?.vehicleNumber || selected.label,
        }))
        setIsCustomVehicle(false)
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        vehicleId: '',
        vehicleName: '',
      }))
      setIsCustomVehicle(false)
    }
  }

  // Driver handler
  const handleDriverChange = (selected, action) => {
    if (selected) {
      if (action.action === 'create-option') {
        setFormData((prev) => ({
          ...prev,
          driverId: '',
          driverName: selected.label,
        }))
        setIsCustomDriver(true)
      } else {
        const selectedDriver = drivers.find((d) => d.id === selected.value)
        setFormData((prev) => ({
          ...prev,
          driverId: selected.value,
          driverName: selectedDriver?.name || selected.label,
        }))
        setIsCustomDriver(false)
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        driverId: '',
        driverName: '',
      }))
      setIsCustomDriver(false)
    }
  }

  // Handle consignor selection
  const handleConsignorChange = (selected) => {
    if (selected && selected.value !== 'create-new') {
      setFormData((prev) => ({
        ...prev,
        consignorId: selected.value,
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

  // Handle consignee selection
  const handleConsigneeChange = (selected) => {
    if (selected && selected.value !== 'create-new') {
      setFormData((prev) => ({
        ...prev,
        consigneeId: selected.value,
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

  // Handle material owner selection
  const handleMartialOwnerChange = (selected) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        materialOwnerId: selected.value,
        martialOwnerName: selected.name,
        martialOwnerAddress: selected.address || '',
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        materialOwnerId: '',
        martialOwnerName: '',
        martialOwnerAddress: '',
      }))
    }
  }

  // Helper function to show calculation hint
  const getCalculationHint = (index, field) => {
    const source = calculationSource[index]
    if (!source) return null

    const product = formData.products[index]
    const bagSize = parseFloat(product.bagSize)
    const totalBags = parseInt(product.totalBags)
    const quantityMT = parseFloat(product.quantityMT)

    if (field === 'bagSize' && source !== 'bagSize' && bagSize > 0) {
      return `Auto-calculated from ${quantityMT > 0 ? `${quantityMT} MT and ${totalBags} bags` : `${totalBags} bags and ${quantityMT} MT`}`
    }
    if (field === 'totalBags' && source !== 'totalBags' && totalBags > 0) {
      return `Auto-calculated from ${bagSize > 0 ? `${bagSize} kg bags and ${quantityMT} MT` : `${bagSize} kg bags and ${quantityMT} MT`}`
    }
    if (field === 'quantityMT' && source !== 'quantityMT' && quantityMT > 0) {
      return `Auto-calculated from ${bagSize > 0 ? `${bagSize} kg bags and ${totalBags} bags` : `${totalBags} bags and ${bagSize} kg bags`}`
    }
    return null
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
      const selectedOption = productOptions.find((opt) => opt.value === value)

      if (selectedOption) {
        updatedProducts[index] = {
          ...updatedProducts[index],
          productId: selectedOption.productId,
          productName: selectedOption.productName || 'Unknown Product',
          quantityMT: selectedOption.quantityMT?.toString() || '',
          bagSize: selectedOption.bagSize?.toString() || '',
          totalBags: selectedOption.totalBags?.toString() || '',
        }
      } else {
        updatedProducts[index] = {
          ...updatedProducts[index],
          [field]: value,
        }
      }
    } else {
      updatedProducts[index] = {
        ...updatedProducts[index],
        [field]: value,
      }
    }

    const currentProduct = updatedProducts[index]
    const bagSize = parseFloat(currentProduct.bagSize)
    const totalBags = parseInt(currentProduct.totalBags)
    const quantityMT = parseFloat(currentProduct.quantityMT)

    if (field === 'bagSize' || field === 'totalBags' || field === 'quantityMT') {
      setCalculationSource((prev) => ({ ...prev, [index]: field }))
    }

    if (field === 'bagSize' && value && !isNaN(bagSize) && bagSize > 0) {
      if (totalBags && !isNaN(totalBags) && totalBags > 0) {
        const calculatedQuantity = calculateQuantityFromBags(bagSize, totalBags)
        if (calculatedQuantity) {
          updatedProducts[index].quantityMT = calculatedQuantity
        }
      } else if (quantityMT && !isNaN(quantityMT) && quantityMT > 0) {
        const calculatedBags = calculateBagsFromQuantity(bagSize, quantityMT)
        if (calculatedBags) {
          updatedProducts[index].totalBags = calculatedBags
        }
      }
    } else if (field === 'totalBags' && value && !isNaN(totalBags) && totalBags > 0) {
      if (bagSize && !isNaN(bagSize) && bagSize > 0) {
        const calculatedQuantity = calculateQuantityFromBags(bagSize, totalBags)
        if (calculatedQuantity) {
          updatedProducts[index].quantityMT = calculatedQuantity
        }
      } else if (quantityMT && !isNaN(quantityMT) && quantityMT > 0) {
        const calculatedBagSize = calculateBagSizeFromQuantityAndBags(quantityMT, totalBags)
        if (calculatedBagSize) {
          updatedProducts[index].bagSize = calculatedBagSize
        }
      }
    } else if (field === 'quantityMT' && value && !isNaN(quantityMT) && quantityMT > 0) {
      if (bagSize && !isNaN(bagSize) && bagSize > 0) {
        const calculatedBags = calculateBagsFromQuantity(bagSize, quantityMT)
        if (calculatedBags) {
          updatedProducts[index].totalBags = calculatedBags
        }
      } else if (totalBags && !isNaN(totalBags) && totalBags > 0) {
        const calculatedBagSize = calculateBagSizeFromQuantityAndBags(quantityMT, totalBags)
        if (calculatedBagSize) {
          updatedProducts[index].bagSize = calculatedBagSize
        }
      }
    }

    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProduct = () => {
    const newProduct = {
      ...defaultProduct,
      warehouseId: formData.issuedByWarehouseId || '',
      warehouseName: formData.issuedByWarehouseName || '',
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

    if (!formData.companyId) {
      alert('Please select a company')
      return
    }

    if (!formData.startLocation || !formData.endLocation) {
      alert('Please enter both start and end locations')
      return
    }

    const payload = {
      ...formData,
      tpPassType: 'warehouseToParty',
      companyId: formData.companyId || '',
      warehouseId: formData.issuedByWarehouseId || '',
      consignorId: formData.consignorId || '',
      consigneeId: formData.consigneeId || '',
      materialOwnerId: formData.materialOwnerId || '',
      martialOwnerName: formData.martialOwnerName || '',
      martialOwnerAddress: formData.martialOwnerAddress || '',
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      customerRate: parseFloat(formData.customerRate) || 0,
      totalAmount: parseFloat(formData.totalAmount) || 0,
      transporterRate: parseFloat(formData.transporterRate) || 0,
      totalTransporterAmount: parseFloat(formData.totalTransporterAmount) || 0,
      transporterRateOn: parseFloat(formData.transporterRateOn) || 0,
      customerRateOn: parseFloat(formData.customerRateOn) || 0,
      customerFreight: parseFloat(formData.customerFreight) || 0,
      transporterFreight: parseFloat(formData.transporterFreight) || 0,
      products: formData.products.map((product) => {
        const transformedProduct = {
          productId: product.productId,
          productName: product.productName,
          warehouseId: product.warehouseId || formData.issuedByWarehouseId,
          warehouseName: product.warehouseName || formData.issuedByWarehouseName,
          quantityMT: parseFloat(product.quantityMT) || 0,
          bagSize: parseFloat(product.bagSize) || 0,
          totalBags: parseFloat(product.totalBags) || 0,
        }
        return transformedProduct
      }),
    }

    // Remove unnecessary fields from the main payload
    delete payload.bagSize
    delete payload.workerId
    delete payload.workerName
    delete payload.costPerBag
    delete payload.itemCost

    // Handle vehicle
    if (isCustomVehicle) {
      delete payload.vehicleId
      payload.vehicleName = formData.vehicleName
    } else if (formData.vehicleId) {
      payload.vehicleId = formData.vehicleId
      payload.vehicleName = formData.vehicleName
    } else {
      delete payload.vehicleId
      delete payload.vehicleName
    }

    // Handle driver
    if (isCustomDriver) {
      delete payload.driverId
      payload.driverName = formData.driverName
    } else if (formData.driverId) {
      payload.driverId = formData.driverId
      payload.driverName = formData.driverName
    } else {
      delete payload.driverId
      delete payload.driverName
    }

    // Remove supervisor for non-superadmin
    if (userRole !== 'superadmin') {
      delete payload.supervisorId
      delete payload.supervisorName
    }

    console.log('Submitting payload:', payload)
    handleSubmit(payload)
  }

  const warehouseOptions = warehouseList.map((w) => ({
    value: w.id || w._id,
    label: w.wareHouseName || w.name || 'Unnamed Warehouse',
  }))

  const companyOptions = companyList.map((c) => ({
    value: c.id || c._id,
    label: c.companyName || c.name || 'Unnamed Company',
  }))

  const consignorOptions = [
    ...consignorData.data.map((consignor) => ({
      value: consignor.id,
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

  const consigneeOptions = [
    ...consigneeData.data.map((consignee) => ({
      value: consignee.id,
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

  const martialOwnerOptions =
    martialOwnerData?.data?.map((owner) => ({
      value: owner.id,
      label: owner.name,
      name: owner.name,
      address: owner.address || '',
    })) || []

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

  const getVehicleValue = () => {
    if (formData.vehicleName) {
      if (formData.vehicleId && !isCustomVehicle) {
        const existingVehicle = vehicleOptions.find((opt) => opt.value === formData.vehicleId)
        if (existingVehicle) {
          return existingVehicle
        }
      }
      return {
        value: formData.vehicleName,
        label: formData.vehicleName,
      }
    }
    if (formData.vehicleId && vehicleOptions.length > 0) {
      const existingVehicle = vehicleOptions.find((opt) => opt.value === formData.vehicleId)
      if (existingVehicle) {
        return existingVehicle
      }
    }
    return null
  }

  const getDriverValue = () => {
    if (formData.driverName) {
      if (formData.driverId && !isCustomDriver) {
        const existingDriver = driverOptions.find((opt) => opt.value === formData.driverId)
        if (existingDriver) {
          return existingDriver
        }
      }
      return {
        value: formData.driverName,
        label: formData.driverName,
      }
    }
    if (formData.driverId && driverOptions.length > 0) {
      const existingDriver = driverOptions.find((opt) => opt.value === formData.driverId)
      if (existingDriver) {
        return existingDriver
      }
    }
    return null
  }

  const getProductValue = (product) => {
    if (!product.productId) return null

    if (product.bagSize) {
      const uniqueKey = `${product.productId}_${product.bagSize}`
      const foundOption = productOptions.find((opt) => opt.value === uniqueKey)
      if (foundOption) return foundOption
    }

    const foundOption = productOptions.find((opt) => opt.productId === product.productId)
    if (foundOption) return foundOption

    if (product.productId && product.productName && product.bagSize) {
      return {
        value: `${product.productId}_${product.bagSize || '0'}`,
        label: `${product.productName} (Bag Size: ${product.bagSize || '0'} kg)`,
        productId: product.productId,
        productName: product.productName,
        bagSize: product.bagSize || '0',
        quantityMT: product.quantityMT || '',
        totalBags: product.totalBags || '',
      }
    }

    return null
  }

  const getCompanyValue = () => {
    if (!formData.companyId) return null
    return companyOptions.find((opt) => opt.value === formData.companyId) || null
  }

  const getIssuedByWarehouseValue = () => {
    if (!formData.issuedByWarehouseId) return null
    return warehouseOptions.find((opt) => opt.value === formData.issuedByWarehouseId) || null
  }

  const getConsignorValue = () => {
    if (!formData.consignorName) return null
    return consignorOptions.find((opt) => opt.name === formData.consignorName) || null
  }

  const getConsigneeValue = () => {
    if (!formData.consigneeName) return null
    return consigneeOptions.find((opt) => opt.name === formData.consigneeName) || null
  }

  const getMartialOwnerValue = () => {
    if (!formData.materialOwnerId) return null
    return martialOwnerOptions.find((opt) => opt.value === formData.materialOwnerId) || null
  }

  const handleConsignorInputChange = useCallback((value) => {
    setConsignorSearchInput(value)
    setConsignorPage(1)
  }, [])

  const handleConsigneeInputChange = useCallback((value) => {
    setConsigneeSearchInput(value)
    setConsigneePage(1)
  }, [])

  const handleMartialOwnerInputChange = useCallback((value) => {
    setMartialOwnerSearchInput(value)
    setMartialOwnerPage(1)
  }, [])

  const handleConsignorMenuScrollToBottom = useCallback(() => {
    const totalPages = Math.ceil(consignorData.total / itemsPerPage)
    if (consignorPage < totalPages) {
      setConsignorPage((prev) => prev + 1)
    }
  }, [consignorData.total, consignorPage])

  const handleConsigneeMenuScrollToBottom = useCallback(() => {
    const totalPages = Math.ceil(consigneeData.total / itemsPerPage)
    if (consigneePage < totalPages) {
      setConsigneePage((prev) => prev + 1)
    }
  }, [consigneeData.total, consigneePage])

  const handleMartialOwnerMenuScrollToBottom = useCallback(() => {
    const totalPages = Math.ceil((martialOwnerData?.total || 0) / itemsPerPage)
    if (martialOwnerPage < totalPages) {
      setMartialOwnerPage((prev) => prev + 1)
    }
  }, [martialOwnerData?.total, martialOwnerPage])

  const totalQuantity = calculateTotalQuantityMT()

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
                <FaExchangeAlt className="me-2 text-warning" />
                <h4 className="mb-0">
                  {mode === 'edit' ? 'Edit' : 'Add'} Warehouse to Party TP Pass
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
              <FaExchangeAlt className="me-2" />
              <div>
                <strong>TP Pass Type:</strong> Warehouse to Party
                <div className="small mt-1">
                  <strong>Issued by:</strong> {formData.issuedBy}
                  {formData.issuedByWarehouseName && ` (${formData.issuedByWarehouseName})`} •{' '}
                  <strong>Received by:</strong> {formData.receivedBy}
                </div>
              </div>
            </div>
          </div>

          <Form onSubmit={onSubmit}>
            {/* Issued/Received Section */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Issued & Received Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-6">
                <Form.Label>
                  Issued By (Warehouse) <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Select
                  value={getIssuedByWarehouseValue()}
                  onChange={(selected) => {
                    if (selected) {
                      const selectedWarehouse = warehouseList.find(
                        (w) => w.id === selected.value || w._id === selected.value,
                      )
                      const warehouseName =
                        selectedWarehouse?.wareHouseName ||
                        selectedWarehouse?.name ||
                        selected.label

                      setFormData((prevState) => {
                        const updatedState = {
                          ...prevState,
                          issuedBy: 'Warehouse',
                          issuedByWarehouseId: selected.value,
                          issuedByWarehouseName: warehouseName,
                        }

                        if (prevState.products.length > 0) {
                          updatedState.products = prevState.products.map((product) => ({
                            ...product,
                            warehouseId: selected.value,
                            warehouseName: warehouseName,
                            productId: product.productId || '',
                            productName: product.productName || '',
                          }))
                        }

                        return updatedState
                      })
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        issuedBy: '',
                        issuedByWarehouseId: '',
                        issuedByWarehouseName: '',
                        products: prev.products.map((product) => ({
                          ...product,
                          warehouseId: '',
                          warehouseName: '',
                        })),
                      }))
                    }
                  }}
                  options={warehouseOptions}
                  placeholder="Select Warehouse"
                  isClearable
                  isLoading={isLoading}
                  required
                />
                {formData.issuedByWarehouseName && (
                  <Form.Text className="text-success">
                    Selected: {formData.issuedByWarehouseName}
                    {isLoadingWarehouseProducts && (
                      <span className="ms-2">
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Loading products...
                      </span>
                    )}
                    {isError && (
                      <span className="ms-2 text-danger">
                        Error: {error?.message || 'Failed to load products'}
                      </span>
                    )}
                  </Form.Text>
                )}
              </div>
              <div className="col-md-6">
                <Form.Label>Received By</Form.Label>
                <Form.Control
                  type="text"
                  value="Party"
                  readOnly
                  disabled={isLoading}
                  className="bg-light"
                />
                <Form.Text className="text-muted">
                  This is always "Party" for Warehouse to Party TP Pass
                </Form.Text>
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
                  isLoading={isLoading}
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
                  isLoading={isLoading}
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
                  isLoading={isLoading}
                  required
                />
              </div>
            </div>

            {/* Consignor Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Consignor Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <Form.Label>
                  Consignor Name <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Select
                  value={getConsignorValue()}
                  onChange={(selected) => {
                    if (selected && selected.value === 'create-new') {
                      setShowConsignorModal(true)
                      handleConsignorChange(null)
                    } else {
                      handleConsignorChange(selected)
                    }
                  }}
                  options={consignorOptions}
                  placeholder="Select Consignor or Create New"
                  isClearable
                  isLoading={isFetchingConsignor}
                  onInputChange={handleConsignorInputChange}
                  onMenuScrollToBottom={handleConsignorMenuScrollToBottom}
                  filterOption={null}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No consignor found for "${inputValue}"`
                      : 'Type to search consignor'
                  }
                  required
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

            {/* Consignee Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Consignee Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <Form.Label>
                  Consignee Name <span style={{ color: 'red' }}>*</span>
                </Form.Label>
                <Select
                  value={getConsigneeValue()}
                  onChange={(selected) => {
                    if (selected && selected.value === 'create-new') {
                      setShowConsigneeModal(true)
                      handleConsigneeChange(null)
                    } else {
                      handleConsigneeChange(selected)
                    }
                  }}
                  options={consigneeOptions}
                  placeholder="Select Consignee or Create New"
                  isClearable
                  isLoading={isFetchingConsignee}
                  onInputChange={handleConsigneeInputChange}
                  onMenuScrollToBottom={handleConsigneeMenuScrollToBottom}
                  filterOption={null}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No consignee found for "${inputValue}"`
                      : 'Type to search consignee'
                  }
                  required
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

            {/* Material Owner Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Material Owner Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-12">
                <Form.Label>Material Owner Name</Form.Label>
                <Select
                  value={getMartialOwnerValue()}
                  onChange={handleMartialOwnerChange}
                  options={martialOwnerOptions}
                  placeholder="Select Material Owner"
                  isClearable
                  isLoading={isFetchingMartialOwner}
                  onInputChange={handleMartialOwnerInputChange}
                  onMenuScrollToBottom={handleMartialOwnerMenuScrollToBottom}
                  filterOption={null}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No material owner found for "${inputValue}"`
                      : 'Type to search material owner'
                  }
                />
                {isFetchingMartialOwner && (
                  <Form.Text className="text-info">Searching...</Form.Text>
                )}
              </div>
              {formData.martialOwnerAddress && (
                <div className="col-md-12">
                  <Form.Label>Material Owner Address</Form.Label>
                  <Form.Control
                    value={formData.martialOwnerAddress}
                    readOnly
                    className="bg-light"
                  />
                </div>
              )}
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
              <div className="alert alert-warning mb-3">
                <div className="d-flex align-items-center">
                  <FaWarehouse className="me-2" />
                  <div>
                    <strong>Note:</strong> Products will be loaded from the selected warehouse in
                    the "Issued By" section.
                    {formData.issuedByWarehouseName && (
                      <span className="ms-1">
                        Current warehouse: <strong>{formData.issuedByWarehouseName}</strong>
                      </span>
                    )}
                    {!formData.issuedByWarehouseId && (
                      <span className="text-danger ms-1">Please select a warehouse first.</span>
                    )}
                    {isError && (
                      <span className="text-danger ms-1">
                        Error loading products. Please try again.
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {formData.products.map((product, index) => {
                const quantityHint = getCalculationHint(index, 'quantityMT')
                const bagSizeHint = getCalculationHint(index, 'bagSize')
                const totalBagsHint = getCalculationHint(index, 'totalBags')

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
                    <div className="row g-3">
                      <div className="col-md-6">
                        <Form.Label>Warehouse</Form.Label>
                        <Form.Control
                          type="text"
                          value={product.warehouseName || formData.issuedByWarehouseName || ''}
                          disabled
                          readOnly
                          className="bg-light"
                        />
                        <Form.Text className="text-muted">
                          Auto-selected from "Issued By" warehouse
                        </Form.Text>
                      </div>

                      <div className="col-md-6">
                        <Form.Label>
                          Product <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Select
                          key={`product-select-${index}-${product.productId || 'empty'}`}
                          value={getProductValue(product)}
                          onChange={(selected) => {
                            if (selected) {
                              const updatedProduct = {
                                ...product,
                                productId: selected.productId,
                                productName: selected.productName || 'Unknown Product',
                                quantityMT: selected.quantityMT?.toString() || '',
                                bagSize: selected.bagSize?.toString() || '0',
                                totalBags: selected.totalBags?.toString() || '',
                              }

                              const updatedProducts = [...formData.products]
                              updatedProducts[index] = updatedProduct

                              setFormData((prev) => ({
                                ...prev,
                                products: updatedProducts,
                              }))
                            } else {
                              const updatedProducts = [...formData.products]
                              updatedProducts[index] = {
                                ...product,
                                productId: '',
                                productName: '',
                                quantityMT: '',
                                bagSize: '',
                                totalBags: '',
                              }

                              setFormData((prev) => ({
                                ...prev,
                                products: updatedProducts,
                              }))
                            }
                          }}
                          options={productOptions}
                          placeholder={
                            isLoadingWarehouseProducts
                              ? 'Loading products...'
                              : !formData.issuedByWarehouseId
                                ? 'Select a warehouse first'
                                : isError
                                  ? 'Error loading products'
                                  : productOptions.length === 0
                                    ? 'No available products in this warehouse'
                                    : `Select Product`
                          }
                          isClearable
                          isLoading={isLoadingWarehouseProducts || isLoading}
                          isDisabled={
                            !formData.issuedByWarehouseId ||
                            isLoadingWarehouseProducts ||
                            isLoading ||
                            isError
                          }
                          required
                        />

                        {formData.issuedByWarehouseId &&
                          productOptions.length === 0 &&
                          !isLoadingWarehouseProducts &&
                          inventoryList.length === 0 && (
                            <Form.Text className="text-danger">
                              No products found in this warehouse
                            </Form.Text>
                          )}

                        {!formData.issuedByWarehouseId && (
                          <Form.Text className="text-danger">
                            Please select a warehouse in the "Issued By" section first
                          </Form.Text>
                        )}
                        {mode === 'edit' &&
                          product.productId &&
                          product.productName &&
                          !getProductValue(product) && (
                            <Form.Text className="text-warning">
                              Product "{product.productName}" loaded from original data
                            </Form.Text>
                          )}
                      </div>

                      <div className="col-md-4">
                        <Form.Label>Total Bags</Form.Label>
                        <Form.Control
                          type="number"
                          value={product.totalBags}
                          onChange={(e) => handleProductChange(index, 'totalBags', e.target.value)}
                          disabled={isLoading}
                          placeholder="Enter total bags"
                          min="0"
                          onWheel={handleNumberInputWheel}
                        />
                        {totalBagsHint && (
                          <Form.Text className="text-info d-block">
                            <FaInfoCircle className="me-1" size={12} />
                            {totalBagsHint}
                          </Form.Text>
                        )}
                        <Form.Text className="text-muted d-block">Total number of bags</Form.Text>
                      </div>

                      <div className="col-md-4">
                        <Form.Label>Bag Size (Kg per bag)</Form.Label>
                        <Form.Control
                          type="number"
                          value={product.bagSize}
                          onChange={(e) => handleProductChange(index, 'bagSize', e.target.value)}
                          disabled={isLoading}
                          placeholder="Enter bag size"
                          min="0"
                          step="0.01"
                          onWheel={handleNumberInputWheel}
                          readOnly
                          className="bg-light"
                        />
                        {bagSizeHint && (
                          <Form.Text className="text-info d-block">
                            <FaInfoCircle className="me-1" size={12} />
                            {bagSizeHint}
                          </Form.Text>
                        )}
                        <Form.Text className="text-muted d-block">
                          Weight per bag in kilograms
                        </Form.Text>
                      </div>

                      <div className="col-md-4">
                        <Form.Label>
                          Quantity (MT) <span style={{ color: 'red' }}>*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          value={product.quantityMT}
                          onChange={(e) => handleProductChange(index, 'quantityMT', e.target.value)}
                          disabled={isLoading}
                          placeholder="Enter quantity in MT"
                          min="0.001"
                          step="0.001"
                          required
                          onWheel={handleNumberInputWheel}
                        />
                        {quantityHint && (
                          <Form.Text className="text-info d-block">
                            <FaInfoCircle className="me-1" size={12} />
                            {quantityHint}
                          </Form.Text>
                        )}
                        <Form.Text className="text-muted d-block">
                          Quantity in metric tons (1 MT = 1000 kg)
                        </Form.Text>
                      </div>
                    </div>

                    {(product.bagSize || product.totalBags || product.quantityMT) && (
                      <div className="mt-3 p-2 bg-light rounded small">
                        <strong>Formula:</strong>
                        {product.bagSize && product.totalBags && !product.quantityMT && (
                          <span>
                            {' '}
                            {product.bagSize} kg × {product.totalBags} bags ={' '}
                            {((product.bagSize * product.totalBags) / 1000).toFixed(3)} MT
                          </span>
                        )}
                        {product.bagSize && product.quantityMT && !product.totalBags && (
                          <span>
                            {' '}
                            {product.quantityMT} MT × 1000 / {product.bagSize} kg ={' '}
                            {Math.round((product.quantityMT * 1000) / product.bagSize)} bags
                          </span>
                        )}
                        {product.totalBags && product.quantityMT && !product.bagSize && (
                          <span>
                            {' '}
                            {product.quantityMT} MT × 1000 / {product.totalBags} bags ={' '}
                            {((product.quantityMT * 1000) / product.totalBags).toFixed(2)} kg/bag
                          </span>
                        )}
                        {product.bagSize && product.totalBags && product.quantityMT && (
                          <span>
                            {' '}
                            {product.bagSize} kg × {product.totalBags} bags ={' '}
                            {((product.bagSize * product.totalBags) / 1000).toFixed(3)} MT
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}

              <Button
                variant="outline-primary"
                onClick={addProduct}
                className="mb-3"
                disabled={isLoading || !formData.issuedByWarehouseId}
              >
                Add Another Product
              </Button>
            </div>

            {/* Freight Details */}
            <h5 className="fw-semibold border-bottom pb-2 mb-3">Freight Details</h5>
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <Form.Label>Customer Rate (per MT) (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="customerRate"
                  value={formData.customerRate}
                  onChange={handleChange}
                  disabled={isLoading}
                  onWheel={handleNumberInputWheel}
                  placeholder="Enter rate per MT"
                  min="0"
                  step="0.01"
                />
                <Form.Text className="text-muted">Rate per metric ton</Form.Text>
              </div>
              <div className="col-md-4">
                <Form.Label>Total Amount (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount}
                  onChange={handleChange}
                  disabled={isLoading}
                  onWheel={handleNumberInputWheel}
                  readOnly
                  className="bg-light"
                />
                {/* <Form.Text className="text-info">
                  <FaInfoCircle className="me-1" size={12} />
                  Auto-calculated: {totalQuantity.toFixed(3)} MT × {formData.customerRate || 0} ={' '}
                  {formData.totalAmount || 0}
                </Form.Text> */}
              </div>
              <div className="col-md-4">
                <Form.Label>Transporter Rate (per MT) (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="transporterRate"
                  value={formData.transporterRate}
                  onChange={handleChange}
                  disabled={isLoading}
                  onWheel={handleNumberInputWheel}
                  placeholder="Enter rate per MT"
                  min="0"
                  step="0.01"
                />
                <Form.Text className="text-muted">Rate per metric ton</Form.Text>
              </div>
              <div className="col-md-4">
                <Form.Label>Total Transporter Amount (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="totalTransporterAmount"
                  value={formData.totalTransporterAmount}
                  onChange={handleChange}
                  disabled={isLoading}
                  onWheel={handleNumberInputWheel}
                  readOnly
                  className="bg-light"
                />
                {/* <Form.Text className="text-info">
                  <FaInfoCircle className="me-1" size={12} />
                  Auto-calculated: {totalQuantity.toFixed(3)} MT × {formData.transporterRate || 0} ={' '}
                  {formData.totalTransporterAmount || 0}
                </Form.Text> */}
              </div>
              <div className="col-md-4">
                <Form.Label>Transporter Rate On</Form.Label>
                <Form.Control
                  type="number"
                  name="transporterRateOn"
                  value={formData.transporterRateOn}
                  onChange={handleChange}
                  disabled={isLoading}
                  onWheel={handleNumberInputWheel}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Customer Rate On</Form.Label>
                <Form.Control
                  type="number"
                  name="customerRateOn"
                  value={formData.customerRateOn}
                  onChange={handleChange}
                  disabled={isLoading}
                  onWheel={handleNumberInputWheel}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Customer Freight (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="customerFreight"
                  value={formData.customerFreight}
                  onChange={handleChange}
                  disabled={isLoading}
                  onWheel={handleNumberInputWheel}
                />
              </div>
              <div className="col-md-4">
                <Form.Label>Transporter Freight (₹)</Form.Label>
                <Form.Control
                  type="number"
                  name="transporterFreight"
                  value={formData.transporterFreight}
                  onChange={handleChange}
                  disabled={isLoading}
                  onWheel={handleNumberInputWheel}
                />
              </div>
            </div>

            <div className="text-end mt-4">
              <Button
                type="submit"
                disabled={isLoading || !formData.issuedByWarehouseId}
                className="px-4"
              >
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

export default WarehouseToPartyForm
