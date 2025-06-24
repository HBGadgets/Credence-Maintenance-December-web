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

// Add Trip
export const handleAddHelper = async (formData, fetchTripData, refetch) => {
    try {
        const payload = {
            driverId: formData.driverId,
            vehicleId: formData.vehicleId,
            vehicleName: formData.vehicleName,
            startLocation: formData.startLocation,
            endLocation: formData.endLocation,
            materialType: formData.materialType,
            budgetAllocated: Number(formData.budgetAllocated),
            date: formData.date,
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
    }
}


// Edit Trip
export const handleEditHelper = async (formData, fetchTripData, refetch) => {
    try {
        const updatePayload = {
            id: formData._id,
            driverId: formData.driverId,
            vehicleId: formData.vehicleId,
            vehicleName: formData.vehicleName,
            startLocation: formData.startLocation,
            endLocation: formData.endLocation,
            materialType: formData.materialType,
            budgetAllocated: formData.budgetAllocated,
            date: formData.date,
            status: formData.status,
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
        if (err.response && err.response.status === 400) {
            toast.error(err.response.data.message || 'Request failed.')
        } else {
            console.error('Trip update failed.')
        }
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
