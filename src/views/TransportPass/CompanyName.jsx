import React, { useEffect, useState, useContext } from 'react'
import {
  deleteCompanyNameApi,
  getCompanyNameApi,
  getDigitalSignatureApi,
  patchCompanyNameApi,
  postCompanyNameApi,
} from './data/data'
import Table from '../components/Table'
import SmartPagination from '../components/SmartPagination'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast, ToastContainer } from 'react-toastify'
import SearchInput from '../components/SearchInput'
import AddButton from '../components/AddButton'
import ReusableModal from '../components/ReusableModal'
import Swal from 'sweetalert2'
import { TokenContext } from '../../context/TokenContext'
import { jwtDecode } from 'jwt-decode'
import SingleSelectDropdown from '../components/SingleSelectDropdown'
import { fetchSupervisor } from '../DriverExpert/data/drivers'
import BillShow from '../components/BillModal/BillShow'
import IconDropdown from '../Supervisor/IconDropdown'
import { FaArrowUp, FaPrint, FaRegFilePdf } from 'react-icons/fa'
import { PiMicrosoftExcelLogo } from 'react-icons/pi'
import usePdfExporter from '../customhooks/usePdfExporter'
import useExcelExporter from '../customhooks/useExcelExporter'

const CompanyName = () => {
  const { exportToPDF } = usePdfExporter()
  const { exportToExcel } = useExcelExporter()
  const [filteredData, setFilteredData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [searchQuery, setSearchQuery] = useState('')
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)

  // for supervisor select
  const [selectedName, setSelectedName] = useState(null)
  // superadmin role
  const token = useContext(TokenContext)
  const decodedToken = token ? jwtDecode(token) : null
  const userRole = decodedToken?.role

  // form state
  const [showModalForm, setShowModalForm] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [editingCompany, setEditingCompany] = useState(null)

  const queryClient = useQueryClient()

  // Use state for modal img
  const [pdfBase64, setPdfBase64] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState('')

  // Fetch companies
  const { data: companyList, isFetching } = useQuery({
    queryKey: ['companyList'],
    queryFn: getCompanyNameApi,
    staleTime: 1000 * 60 * 30,
  })

  // supervisor fetch
  const { data: supervisorOptions = [] } = useQuery({
    queryKey: ['supervisors'],
    queryFn: fetchSupervisor,
    staleTime: 1000 * 60 * 10,
  })

  // Create company
  const { mutate: addCompany, isLoading: isSubmitting } = useMutation({
    mutationFn: postCompanyNameApi,
    onSuccess: () => {
      toast.success('Company added successfully!')
      setShowModalForm(false)
      queryClient.invalidateQueries(['companyList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add company')
    },
  })

  // Update company
  const { mutate: updateCompany, isLoading: isUpdating } = useMutation({
    mutationFn: ({ id, formData }) => patchCompanyNameApi(id, formData),
    onSuccess: () => {
      toast.success('Company updated successfully!')
      setShowModalForm(false)
      setEditMode(false)
      setEditingCompany(null)
      queryClient.invalidateQueries(['companyList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to update company')
    },
  })

  // Delete company
  const { mutate: deleteCompany } = useMutation({
    mutationFn: deleteCompanyNameApi,
    onSuccess: () => {
      toast.success('Company deleted successfully!')
      queryClient.invalidateQueries(['companyList'])
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to delete company')
    },
  })

  // Apply filters when API data changes
  useEffect(() => {
    if (companyList) {
      let updatedData = [...companyList]

      // search filter
      if (searchQuery) {
        const lowercasedQuery = searchQuery.toLowerCase()
        updatedData = updatedData.filter((item) =>
          Object.values(item).some(
            (value) => typeof value === 'string' && value.toLowerCase().includes(lowercasedQuery),
          ),
        )
      }

      // supervisor filter
      if (selectedName?.value) {
        updatedData = updatedData.filter((company) => company.supervisorId === selectedName.value)
      }

      setFilteredData(updatedData)
    }
  }, [companyList, searchQuery, selectedName])

  // Table columns
  const columns = [
    { label: 'Company Name', key: 'companyName', sortable: true },
    { label: 'Email', key: 'email', sortable: true },
    { label: 'Mobile', key: 'mobileNumber', sortable: true },
    { label: 'Office No', key: 'officeNumber', sortable: true },
    { label: 'Address', key: 'address', sortable: false },
    { label: 'GST No', key: 'gstNumber', sortable: true },
  ]

  // Form fields
  const fields = [
    {
      name: 'signatureImage',
      label: 'Digital Signature',
      type: 'file',
      accept: 'image/*',
    },
    { name: 'companyName', label: 'Company Name', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'text', required: true },
    { name: 'mobileNumber', label: 'Mobile', type: 'text', required: true },
    { name: 'officeNumber', label: 'Office No', type: 'text', required: true },
    { name: 'address', label: 'Address', type: 'text', required: true },
    { name: 'gstNumber', label: 'GST No', type: 'text', required: true },
  ]

  // handle edit
  const handleEditButton = (id) => {
    const record = filteredData.find((item) => item.id === id || item._id === id)
    if (record) {
      setEditMode(true)
      setEditingCompany(record)
      setShowModalForm(true)
    }
  }

  // handle delete
  const handleDeleteButton = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteCompany(id)
      }
    })
  }

  // handle submit
  const handleFormSubmit = (formData) => {
    if (editMode && editingCompany?.id) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to update this company?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, Update it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          updateCompany({ id: editingCompany.id, formData })
        }
      })
    } else {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you want to add this company?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Add it',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          addCompany(formData)
        }
      })
    }
  }

  // handler view

  const handleViewButton = async (id) => {
    try {
      const selectedRow = filteredData.find((item) => item.id === id)

      if (!selectedRow) {
        toast.error('Data not found for this ID.')
        return
      }

      if (!selectedRow.digitalSignatureId) {
        toast.warn('No digital signature available for this entry.')
        return
      }

      const response = await getDigitalSignatureApi(selectedRow.digitalSignatureId)

      //  Handle response safely
      const { signatureImage, base64Data, contentType } = response || {}

      // Some APIs return different field names — handle both
      const rawBase64 = base64Data || signatureImage
      const mimeType = contentType || 'image/jpeg' // default fallback

      if (!rawBase64) {
        toast.error('No signature image data found.')
        return
      }

      // Prepend MIME type for correct display
      const fileSrc = `data:${mimeType};base64,${rawBase64}`
      console.log('Digital Signature:', fileSrc)

      setPdfBase64(fileSrc)

      //  Set modal title dynamically
      if (mimeType.startsWith('application/pdf')) {
        setModalTitle('Digital Signature (PDF)')
      } else if (mimeType.startsWith('image')) {
        setModalTitle('Digital Signature (Image)')
      } else {
        setModalTitle('Digital Signature (File)')
      }

      setShowModal(true)
    } catch (error) {
      console.error('Failed to fetch digital signature:', error)
      toast.error('Error fetching digital signature. Please try again.')
    }
  }

  // Dropdown items for export
  const dropdownItems = [
    {
      icon: FaRegFilePdf,
      label: 'Download PDF',
      onClick: () =>
        exportToPDF({
          title: 'All Company List Report',
          columns,
          data: filteredData,
          fileName: 'Company_List_Report',
        }),
    },
    {
      icon: PiMicrosoftExcelLogo,
      label: 'Download Excel',
      onClick: () => {
        exportToExcel({
          title: 'All Company List Report',
          columns,
          data: filteredData,
          fileName: 'Company_List_Report',
        })
      },
    },

    {
      icon: FaPrint,
      label: 'Print Page',
      onClick: () => window.print(),
    },

    {
      icon: FaArrowUp,
      label: 'Scroll To Top',
      onClick: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    },
  ]

  return (
    <>
      <ToastContainer />

      <div className="mb-3 d-flex justify-content-between align-items-center">
        <div className="d-flex flex-wrap align-items-center gap-2">
          {userRole === 'superadmin' && (
            <div style={{ width: '150px' }}>
              <SingleSelectDropdown
                options={supervisorOptions}
                value={selectedName}
                onChange={setSelectedName}
                isClearable
                placeholder="Filter by Supervisor Name..."
              />
            </div>
          )}
        </div>

        <div className="d-flex justify-content-end align-items-center gap-2 w-100 mb-3">
          <SearchInput searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <AddButton
            label="Add Company"
            onClick={() => {
              setEditMode(false)
              setEditingCompany(null)
              setShowModalForm(true)
            }}
          />
        </div>
      </div>

      <ReusableModal
        show={showModalForm}
        initialData={editMode ? editingCompany : null}
        onClose={() => {
          setShowModalForm(false)
          setEditMode(false)
          setEditingCompany(null)
        }}
        onSubmit={handleFormSubmit}
        title={editMode ? 'Edit Company' : 'Add New Company'}
        size="xl"
        fields={fields}
        isSubmitting={isSubmitting || isUpdating}
      />

      <Table
        title="Company List"
        columns={columns}
        filteredData={filteredData}
        setFilteredData={setFilteredData}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        isFetching={isFetching}
        editButton={true}
        handleEditButton={handleEditButton}
        deleteButton={true}
        handleDeleteButton={handleDeleteButton}
        viewButton={true}
        handleViewButton={handleViewButton}
        viewButtonLabel="Signature"
      />

      <SmartPagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={(value) => {
          setItemsPerPage(value === -1 ? -1 : value)
          setCurrentPage(1)
        }}
      />

      {/* Modal Component */}
      <BillShow
        showModal={showModal}
        setShowModal={setShowModal}
        pdfBase64={pdfBase64}
        modalTitle={modalTitle}
      />

      <div className="position-fixed bottom-0 end-0 mb-1 m-3 z-5">
        <IconDropdown items={dropdownItems} />
      </div>
    </>
  )
}

export default CompanyName
