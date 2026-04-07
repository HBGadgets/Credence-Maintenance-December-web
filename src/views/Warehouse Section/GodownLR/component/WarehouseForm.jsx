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
import AddConsignorConsigneeModal from './AddConsignorConsigneeModal'
import { getMartialOwnerDropDownApi } from '../../../Material_Owner/data/data'

// Clean default product object - removed temporary fields
const defaultProduct = {
  productId: '',
  inventoryId: '',
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

// Clean default form data - removed extra fields
const defaultFormData = {
  issuedBy: 'Railhead',
  receivedBy: '',
  supervisorId: '',
  companyId: '',
  companyName: '',
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
  status: 'Pending',
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
  const [receivedByType, setReceivedByType] = useState('warehouse')
  const [receivedByWarehouseId, setReceivedByWarehouseId] = useState('')
  const [receivedByWarehouseName, setReceivedByWarehouseName] = useState('')
  const [calculationSource, setCalculationSource] = useState({})

  const [receivedByOptions] = useState([
    { value: 'warehouse', label: 'Warehouse', icon: <FaWarehouse className="me-2" /> },
    { value: 'party', label: 'Party', icon: <FaUserFriends className="me-2" /> },
  ])

  // Search and pagination states for consignor/consignee/material owner
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

  const { data: consigneeData = { data: [], total: 0 }, isFetching: isFetchingConsignee } =
    useQuery({
      queryKey: [
        'Consignee',
        {
          search: debouncedConsigneeSearch,
          // page: consigneePage,
          // limit: itemsPerPage,
        },
      ],
      queryFn: getConsigneeApi,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    })

  // Fetch material owners dropdown
  const { data: martialOwnerData = { data: [], total: 0 }, isFetching: isFetchingMartialOwner } =
    useQuery({
      queryKey: [
        'MartialOwner',
        {
          search: debouncedMartialOwnerSearch,
          page: martialOwnerPage,
          limit: itemsPerPage,
        },
      ],
      queryFn: getMartialOwnerDropDownApi,
      keepPreviousData: true,
      staleTime: 1000 * 60 * 5,
    })

  const warehouseList = warehouseResponse?.data || []
  const inventoryList = railHeadData?.data || []
  const consignorList = consignorData?.data || []
  const consigneeList = consigneeData?.data || []
  const martialOwnerList = martialOwnerData?.data || []

  const handleNumberInputScroll = (e) => {
    e.preventDefault()
    e.target.blur()
    return false
  }

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

  useEffect(() => {
    if (inventoryList.length > 0) {
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

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      const parseDate = (dateString) => {
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

      let receivedByTypeValue = 'warehouse'
      if (initialData.receivedBy === 'Party') {
        receivedByTypeValue = 'party'
      }

      let warehouseId = initialData.receivedByWarehouseId || ''
      let warehouseName = initialData.receivedByWarehouseName || ''

      if (!warehouseId && initialData.products && initialData.products.length > 0) {
        const productWithWarehouse = initialData.products.find((p) => p.warehouseId)
        if (productWithWarehouse) {
          warehouseId = productWithWarehouse.warehouseId
          warehouseName = productWithWarehouse.warehouseName || ''
        }
      }

      setReceivedByType(receivedByTypeValue)
      setReceivedByWarehouseId(warehouseId)
      setReceivedByWarehouseName(warehouseName)

      const editedFormData = {
        ...defaultFormData,
        ...initialData,
        date: parseDate(initialData.date),
        vehicleName:
          vehicles.find((vehicle) => vehicle.id === initialData.vehicleId)?.name ||
          initialData.vehicleName ||
          '',
        driverName:
          drivers.find((driver) => driver.id === initialData.driverId)?.name ||
          initialData.driverName ||
          '',
        companyId: initialData.companyId || '',
        consignorId: initialData.consignorId || '',
        consignorName: initialData.consignorName || '',
        consignorAddress: initialData.consignorAddress || '',
        consigneeId: initialData.consigneeId || '',
        consigneeName: initialData.consigneeName || '',
        consigneeAddress: initialData.consigneeAddress || '',
        materialOwnerId: initialData.materialOwnerId || '',
        martialOwnerName: initialData.martialOwnerName || '',
        martialOwnerAddress: initialData.martialOwnerAddress || '',
        products: initialData.products?.map((product) => ({
          productId: product.productId || '',
          productName: product.productName || '',
          quantityMT: product.quantityMT?.toString() || '',
          bagSize: product.bagSize?.toString() || '',
          totalBags: product.totalBags?.toString() || '',
        })) || [{ ...defaultProduct }],
      }

      setFormData(editedFormData)
    } else {
      setFormData(defaultFormData)
      setReceivedByType('warehouse')
      setReceivedByWarehouseId('')
      setReceivedByWarehouseName('')
      setFormData((prev) => ({
        ...prev,
        receivedBy: 'Warehouse',
      }))
    }
  }, [initialData, mode, vehicles, drivers])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReceivedByTypeChange = (type) => {
    setReceivedByType(type)
    if (type === 'warehouse') {
      setFormData((prev) => ({
        ...prev,
        receivedBy: 'Warehouse',
      }))
    } else if (type === 'party') {
      setFormData((prev) => ({
        ...prev,
        receivedBy: 'Party',
      }))
      setReceivedByWarehouseId('')
      setReceivedByWarehouseName('')
    }
  }

  const handleWarehouseSelect = (selected) => {
    if (selected) {
      const selectedWarehouse = warehouseList.find(
        (w) => w.id === selected.value || w._id === selected.value,
      )
      setReceivedByWarehouseId(selected.value)
      setReceivedByWarehouseName(
        selectedWarehouse?.wareHouseName || selectedWarehouse?.name || selected.label,
      )
    } else {
      setReceivedByWarehouseId('')
      setReceivedByWarehouseName('')
    }
  }

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

    if (field === 'productId') {
      const selectedProduct = inventoryList.find((p) => {
        const inventoryId = p._id || p.id
        return inventoryId === value
      })

      if (selectedProduct) {
        const actualProductId = selectedProduct.productId || selectedProduct._id
        const inventoryId = selectedProduct._id || selectedProduct.id
        const productName = selectedProduct.productName || selectedProduct.name || 'Unknown Product'
        const bagSize = selectedProduct.bagSize || selectedProduct.bagWeight || 0
        const totalBags = selectedProduct.totalBags || 0
        const quantityMT = selectedProduct.quantityMT || selectedProduct.quantity || 0

        updatedProducts[index] = {
          ...updatedProducts[index],
          productId: actualProductId,
          inventoryId: inventoryId,
          productName: productName,
          quantityMT: quantityMT.toString(),
          bagSize: bagSize.toString(),
          totalBags: totalBags.toString(),
        }
      } else {
        updatedProducts[index] = {
          ...updatedProducts[index],
          productId: '',
          inventoryId: '',
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

    const currentProduct = updatedProducts[index]
    const bagSize = parseFloat(currentProduct.bagSize)
    const totalBags = parseInt(currentProduct.totalBags)
    const quantityMT = parseFloat(currentProduct.quantityMT)

    if (field !== 'productId') {
      setCalculationSource((prev) => ({ ...prev, [index]: field }))

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
    }

    setFormData((prev) => ({ ...prev, products: updatedProducts }))
  }

  const addProduct = () => {
    const newProduct = { ...defaultProduct }
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

    if (!formData.consignorId || !formData.consignorName) {
      toast.error('Please select or create a consignor')
      return
    }

    if (!formData.consigneeId || !formData.consigneeName) {
      toast.error('Please select or create a consignee')
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

      if (!isValid) {
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

    const vehicleExistsInDb = vehicleOptions.some((vehicle) => vehicle.value === formData.vehicleId)
    const driverExistsInDb = driverOptions.some((driver) => driver.value === formData.driverId)

    const processNumberField = (value) => {
      if (value === '' || value === null || value === undefined) {
        return 0
      }
      const num = parseFloat(value)
      return isNaN(num) ? 0 : num
    }

    const preparedProducts = formData.products.map((product) => {
      const productFromInventory = inventoryList.find((p) => {
        if (product.inventoryId) {
          return p._id === product.inventoryId || p.id === product.inventoryId
        }
        return p.productId === product.productId || p._id === product.productId
      })

      let productId = ''
      let productName = ''

      if (productFromInventory) {
        productId = productFromInventory.productId || productFromInventory._id
        productName =
          productFromInventory.productName || productFromInventory.name || product.productName
      } else {
        productId = product.productId
        productName = product.productName
      }

      const cleanProduct = {
        productId: productId,
        productName: productName,
        quantityMT: parseFloat(product.quantityMT) || 0,
        bagSize: parseFloat(product.bagSize) || 0,
        totalBags: parseFloat(product.totalBags) || 0,
      }

      if (formData.issuedBy === 'Railhead' && receivedByType === 'warehouse') {
        cleanProduct.warehouseId = receivedByWarehouseId
        cleanProduct.warehouseName = receivedByWarehouseName
      }

      return cleanProduct
    })

    const payload = {
      date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
      issuedBy: formData.issuedBy,
      receivedBy: formData.receivedBy,
      consignorName: formData.consignorName,
      consignorAddress: formData.consignorAddress,
      consigneeName: formData.consigneeName,
      consigneeAddress: formData.consigneeAddress,
      materialOwnerId: formData.materialOwnerId || '',
      martialOwnerName: formData.martialOwnerName || '',
      martialOwnerAddress: formData.martialOwnerAddress || '',
      startLocation: formData.startLocation,
      endLocation: formData.endLocation,
      vehicleName: formData.vehicleName,
      driverName: formData.driverName,
      companyId: formData.companyId,
      consignorId: formData.consignorId || '',
      consigneeId: formData.consigneeId || '',
      products: preparedProducts,
      customerRate: processNumberField(formData.customerRate),
      totalAmount: processNumberField(formData.totalAmount),
      transporterRate: processNumberField(formData.transporterRate),
      totalTransporterAmount: processNumberField(formData.totalTransporterAmount),
      transporterRateOn: processNumberField(formData.transporterRateOn),
      customerRateOn: processNumberField(formData.customerRateOn),
      customerFreight: processNumberField(formData.customerFreight),
      transporterFreight: processNumberField(formData.transporterFreight),
      status: 'Pending',
    }

    if (vehicleExistsInDb && formData.vehicleId) {
      payload.vehicleId = formData.vehicleId
    }

    if (driverExistsInDb && formData.driverId) {
      payload.driverId = formData.driverId
    }

    if (userRole === 'superadmin' && formData.supervisorId) {
      payload.supervisorId = formData.supervisorId
    }

    Object.keys(payload).forEach((key) => {
      if (payload[key] === undefined || payload[key] === null) {
        delete payload[key]
      }
    })

    console.log('=== FINAL CLEANED PAYLOAD ===', JSON.stringify(payload, null, 2))
    handleSubmit(payload)
  }

  const receivedByWarehouseOptions = warehouseList.map((w) => ({
    value: w.id || w._id,
    label: w.wareHouseName || w.name || 'Unnamed Warehouse',
  }))

  const warehouseOptions = warehouseList.map((w) => ({
    value: w.id || w._id,
    label: w.wareHouseName || w.name || 'Unnamed Warehouse',
  }))

  const productOptions = inventoryList.map((p) => {
    const inventoryId = p._id || p.id
    const actualProductId = p.productId
    const productName = p.productName || p.name || 'Unnamed Product'
    const quantityMT = p.quantityMT || p.quantity || 0
    const bagSize = p.bagSize || p.bagWeight || 0
    const totalBags = p.totalBags || p.bags || 0

    return {
      value: inventoryId,
      label: `${productName} (Available: ${quantityMT} MT, Bag Size: ${bagSize} kg, Total Bags: ${totalBags})`,
      data: {
        ...p,
        inventoryId: inventoryId,
        actualProductId: actualProductId,
      },
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

  const consignorOptions = [
    ...consignorList.map((consignor) => ({
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
    ...consigneeList.map((consignee) => ({
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

  const martialOwnerOptions = martialOwnerList.map((owner) => ({
    value: owner.id,
    label: owner.name,
    name: owner.name,
    address: owner.address || '',
  }))

  const getProductValue = (product) => {
    if (product.inventoryId || product.productId) {
      const searchId = product.inventoryId || product.productId
      const found = productOptions.find((opt) => {
        return (
          opt.value === searchId ||
          (opt.data && (opt.data._id === searchId || opt.data.id === searchId))
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
    if (!receivedByWarehouseId) return null
    return receivedByWarehouseOptions.find((opt) => opt.value === receivedByWarehouseId) || null
  }

  const getConsignorValue = () => {
    if (!formData.consignorId) return null
    return consignorOptions.find((opt) => opt.value === formData.consignorId) || null
  }

  const getConsigneeValue = () => {
    if (!formData.consigneeId) return null
    return consigneeOptions.find((opt) => opt.value === formData.consigneeId) || null
  }

  const getMartialOwnerValue = () => {
    if (!formData.materialOwnerId) return null
    return martialOwnerOptions.find((opt) => opt.value === formData.materialOwnerId) || null
  }

  const getProductDetailForDisplay = (product) => {
    let productFromList = null

    if (product.inventoryId) {
      productFromList = inventoryList.find(
        (p) => p._id === product.inventoryId || p.id === product.inventoryId,
      )
    }

    if (!productFromList && product.productId) {
      productFromList = inventoryList.find(
        (p) => p.productId === product.productId || p._id === product.productId,
      )
    }

    if (productFromList) {
      return {
        productId: productFromList.productId,
        inventoryId: productFromList._id || productFromList.id,
        productName: productFromList.productName || productFromList.name || 'Unknown Product',
        quantityMT: productFromList.quantityMT || productFromList.quantity || 0,
        bagSize: productFromList.bagSize || productFromList.bagWeight || 0,
        totalBags: productFromList.totalBags || productFromList.bags || 0,
      }
    }
    return null
  }

  const shouldShowWarehouseInProducts = () => {
    if (formData.issuedBy === 'Railhead') {
      if (receivedByType === 'warehouse') {
        return 'auto-filled'
      } else if (receivedByType === 'party') {
        return 'hidden'
      }
    }
    return 'editable'
  }

  const warehouseDisplayMode = shouldShowWarehouseInProducts()
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
                <strong>TP Pass Type:</strong> Railhead to{' '}
                {formData.receivedBy || (receivedByType === 'warehouse' ? 'Warehouse' : 'Party')}
                <div className="small mt-1">
                  <strong>Issued by:</strong> Railhead • <strong>Received by:</strong>{' '}
                  <span className="fw-semibold">
                    {formData.receivedBy ||
                      (receivedByType === 'warehouse' ? 'Warehouse' : 'Party')}
                  </span>
                  {receivedByType === 'warehouse' && receivedByWarehouseName && (
                    <>
                      {' '}
                      • <span className="text-success">{receivedByWarehouseName}</span>
                    </>
                  )}
                </div>
                {receivedByType === 'warehouse' && (
                  <div className="small text-success mt-1">
                    <FaWarehouse className="me-1" />
                    Warehouse will be included in the payload
                  </div>
                )}
                {receivedByType === 'party' && (
                  <div className="small text-warning mt-1">
                    <FaUserFriends className="me-1" />
                    Party will be sent in receivedBy field
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
                          variant={receivedByType === option.value ? 'primary' : 'outline-primary'}
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

                  {receivedByType === 'warehouse' && (
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
                      {receivedByWarehouseName && (
                        <Form.Text className="text-success">
                          Selected: {receivedByWarehouseName}
                        </Form.Text>
                      )}
                    </div>
                  )}

                  {receivedByType === 'party' && (
                    <div className="mt-3">
                      <Form.Label>Party</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.receivedBy}
                        readOnly
                        disabled={isLoading}
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
                      }))
                    } else {
                      setFormData((prev) => ({
                        ...prev,
                        companyId: '',
                        companyName: '',
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
                  isLoading={isLoading || isFetchingConsignor}
                  onInputChange={handleConsignorInputChange}
                  onMenuScrollToBottom={handleConsignorMenuScrollToBottom}
                  filterOption={null}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No consignor found for "${inputValue}"`
                      : 'Type to search consignor'
                  }
                  required
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
                  isLoading={isLoading || isFetchingConsignee}
                  onInputChange={handleConsigneeInputChange}
                  onMenuScrollToBottom={handleConsigneeMenuScrollToBottom}
                  filterOption={null}
                  noOptionsMessage={({ inputValue }) =>
                    inputValue
                      ? `No consignee found for "${inputValue}"`
                      : 'Type to search consignee'
                  }
                  required
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
              {formData.products.map((product, index) => {
                const productDetail = getProductDetailForDisplay(product)
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
                      {warehouseDisplayMode === 'auto-filled' ? (
                        <div className="col-md-6">
                          <Form.Label>
                            Warehouse <span style={{ color: 'red' }}>*</span>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            value={receivedByWarehouseName || 'Select warehouse above'}
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
                      ) : null}

                      <div
                        className={
                          warehouseDisplayMode === 'auto-filled' ? 'col-md-6' : 'col-md-12'
                        }
                      >
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
                      </div>

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
                        {totalBagsHint && (
                          <Form.Text className="text-info">
                            <FaInfoCircle className="me-1" size={12} />
                            {totalBagsHint}
                          </Form.Text>
                        )}
                      </div>

                      <div className="col-md-4">
                        <Form.Label>Bag Size (kg per bag)</Form.Label>
                        <Form.Control
                          type="number"
                          value={product.bagSize}
                          onChange={(e) => handleProductChange(index, 'bagSize', e.target.value)}
                          onWheel={handleNumberInputScroll}
                          disabled={isLoading}
                          placeholder="Enter bag size"
                          readOnly
                          className="bg-light"
                        />
                        {bagSizeHint && (
                          <Form.Text className="text-info">
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
                          onWheel={handleNumberInputScroll}
                          disabled={isLoading}
                          placeholder="Enter quantity MT"
                          required
                          min="0"
                          step="0.01"
                        />
                        {quantityHint && (
                          <Form.Text className="text-info">
                            <FaInfoCircle className="me-1" size={12} />
                            {quantityHint}
                          </Form.Text>
                        )}
                        <Form.Text className="text-muted d-block">
                          Enter quantity in Metric Ton
                        </Form.Text>
                      </div>
                    </div>

                    {/* Show calculation formula example */}
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
                disabled={isLoading || isRailHeadFetching}
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
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
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
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
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
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
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
                  onWheel={handleNumberInputScroll}
                  disabled={isLoading}
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
                <Form.Label>Customer Freight (₹)</Form.Label>
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
                <Form.Label>Transporter Freight (₹)</Form.Label>
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
