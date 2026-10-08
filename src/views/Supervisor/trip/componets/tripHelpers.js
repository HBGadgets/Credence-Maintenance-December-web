import Swal from 'sweetalert2'
import { deleteTripApi, getTripListApi, patchTripApi, postTripApi } from '../../data/data'
import { toast } from 'react-toastify'

// Fetch Trips
export const fetchTripDataHelper = async (id, setAllData, setFilteredData, setLoading, setError) => {
    try {
        setLoading(true)
        const data = await getTripListApi(id)
        setAllData(data)
        setFilteredData(data)
    } catch (err) {
        if (typeof setError === 'function') {
            if (!err.response) setError('Network Error')
            else if (err.response.status === 500) setError(err.message)
        }
    } finally {
        if (typeof setLoading === 'function') setLoading(false)
    }
}

const sanitizeValue = (val) => {
    if (val === undefined || val === null) return null
    if (typeof val === 'string' && val.trim() === '') return null
    return val
}

const sanitizeNumber = (val) => {
    if (val === undefined || val === null || val === '') return null
    if (typeof val === 'string' && val.trim() === '') return null
    const num = Number(val)
    return isNaN(num) ? null : num
}

// Add Trip
export const handleAddHelper = async (tripData, fetchTripData, refetch) => {
    try {
        const payload = {
            transportMode: sanitizeValue(tripData.transportMode),
            clientName: sanitizeValue(tripData.clientName),
            clientNumber: sanitizeValue(tripData.clientNumber),
            companyId: sanitizeValue(tripData.companyId),
            companyName: sanitizeValue(tripData.companyName),
            date: sanitizeValue(tripData.date),
            driverId: sanitizeValue(tripData.driverId),
            driverName: sanitizeValue(tripData.driverName),
            vehicleId: sanitizeValue(tripData.vehicleId),
            vehicleName: sanitizeValue(tripData.vehicleName),
            startLocation: sanitizeValue(tripData.startLocation),
            endLocation: sanitizeValue(tripData.endLocation),
            budgetAllocated: sanitizeNumber(tripData.budgetAllocated),
            materialType: sanitizeValue(tripData.materialType),
            clientAdvance: sanitizeNumber(tripData.clientAdvance),
            coastPerKm: sanitizeNumber(tripData.coastPerKm),
        }

        await postTripApi(payload)

        if (typeof fetchTripData === 'function') await fetchTripData()
        if (typeof refetch === 'function') await refetch()

        Swal.fire({
            icon: 'success',
            title: 'Trip Added!',
            text: 'Trip added successfully!',
            confirmButtonText: 'OK',
        })
    } catch (err) {
        console.error('Add Trip Failed:', err.message)
        const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Failed to add trip.'
        toast.error(errorMessage)
        throw err
    }
}


// Edit Trip
export const handleEditHelper = async (formData, fetchTripData, refetch) => {
    try {
        const updatePayload = {
            id: formData._id,
            driverId: sanitizeValue(formData.driverId),
            vehicleId: sanitizeValue(formData.vehicleId),
            vehicleName: sanitizeValue(formData.vehicleName),
            startLocation: sanitizeValue(formData.startLocation),
            endLocation: sanitizeValue(formData.endLocation),
            materialType: sanitizeValue(formData.materialType),
            budgetAllocated: sanitizeNumber(formData.budgetAllocated),
            date: sanitizeValue(formData.date),
            status: sanitizeValue(formData.status),
            transportMode: sanitizeValue(formData.transportMode),
            clientName: sanitizeValue(formData.clientName),
            clientNumber: sanitizeValue(formData.clientNumber),
            companyId: sanitizeValue(formData.companyId),
            companyName: sanitizeValue(formData.companyName),
            coastPerKm: sanitizeNumber(formData.coastPerKm),
            clientAdvance: sanitizeNumber(formData.clientAdvance),
        }

        await patchTripApi(formData._id, updatePayload)

        if (typeof fetchTripData === 'function') {
            await fetchTripData()
        }

        if (typeof refetch === 'function') {
            await refetch()
        }

        Swal.fire({
            icon: 'success',
            title: 'Trip Updated!',
            text: 'Trip updated successfully!',
            confirmButtonText: 'OK',
        })
    } catch (err) {
        const errorMessage =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            'Trip update failed.'
        console.error('Trip update failed:', errorMessage)
        toast.error(errorMessage)
        throw err
    }
}


// Delete Trip
export const handleDeleteHelper = async (tripId, fetchTripData, fieldName = 'Trip', refetch) => {
    const result = await Swal.fire({
        title: `Delete ${fieldName}?`,
        text: 'Are you sure you want to delete this trip? This action cannot be undone!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
    })

    if (result.isConfirmed) {
        try {
            await deleteTripApi(tripId)
            await fetchTripData()
            if (typeof refetch === 'function') await refetch()
            Swal.fire('Deleted!', `${fieldName} has been deleted.`, 'success')
        } catch (err) {
            console.error('Delete failed:', err.message)
        }
    }
}

// Status Badge
export const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
        case 'in-progress': return 'badge bg-warning text-dark'
        case 'cancelled': return 'badge bg-danger'
        case 'completed': return 'badge bg-success'
        default: return 'badge bg-secondary'
    }
}
