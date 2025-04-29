// lorryReceiptHandlers.js
import { deleteLorryReciptApi, getLorryReciptApi, patchLorryReciptApi, postLorryReciptApi } from '../../data/data'
import Swal from 'sweetalert2'

// Fetch Lorry Receipt List
export const fetchLorryReceiptList = async () => {
    try {
        return await getLorryReciptApi()
    } catch (error) {
        console.error('Error fetching Lorry Receipt List:', error)
        throw error
    }
}

// Delete Lorry Receipt
export const handleDelete = async (id, filteredData, setFilteredData, refetch) => {
    try {
        const confirmed = await Swal.fire({
            title: 'Are you sure?',
            text: 'This action cannot be undone!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
        })
        if (confirmed.isConfirmed) {
            await deleteLorryReciptApi(id, { status: 'deleted' })
            Swal.fire('Deleted!', 'The record has been deleted.', 'success')
            setFilteredData(filteredData.filter((item) => item._id !== id))
            await refetch() // Refetch the data after deletion
        }
    } catch (error) {
        Swal.fire('Error!', 'Failed to delete Lorry Receipt.', 'error')
    }
}

// Add or Edit Lorry Receipt
export const handleFormSubmit = async (formData, formMode, selectedData, setFilteredData, setShowForm, refetch) => {
    try {
        let result;
        if (formMode === 'edit') {
            // Edit existing data
            result = await patchLorryReciptApi(selectedData.id, formData)
            Swal.fire('Success!', 'Lorry Receipt updated successfully.', 'success')

            await refetch() // Refetch data

            // Update the filteredData list
            setFilteredData((prevData) =>
                prevData.map((data) => (data._id === selectedData.id ? { ...data, ...formData } : data)),
            )
        } else {
            // Add new data
            result = await postLorryReciptApi(formData)
            Swal.fire('Success!', 'Lorry Receipt added successfully.', 'success')

            await refetch() // Refetch data

            // Update the filteredData list
            setFilteredData((prevData) => [
                ...prevData,
                { ...formData, _id: result.id, date: formData.date },
            ])
        }

        // Close the form modal after successful submission
        setShowForm(false)
    } catch (error) {
        Swal.fire('Error!', 'Failed to submit Lorry Receipt.', 'error')
    }
}



