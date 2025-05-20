import axios from 'axios'
import { formatDateToDDMMYYYY } from '../../customhooks/useFormattedDate'
import Cookies from 'js-cookie'


const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXlzaHUiLCJpZCI6IjY3MTM2NTNiNjEzY2YyZDJjNTMyZWQwZSIsInVzZXJzIjpmYWxzZSwic3VwZXJhZG1pbiI6dHJ1ZSwidXNlciI6bnVsbCwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NDEzMzQ2NzN9.CWrHCFTim0n6wyw8ynx1B3eXL0jNpzGrCNEUVSwhpxs'
// const token = sessionStorage.getItem('crdnsMaintToken') // Get token from cookie

export const addDriver = async (data) => {
  try {


    if (!token) throw new Error('Authentication token not found')

    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/drivers/create`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )
    return response
  } catch (error) {
    throw error
  }
}

export const fetchDrivers = async () => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers/all`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    return data.map((driver) => ({
      name: driver.name,
      contactNumber: driver.contactNumber,
      email: driver.email,
      password: driver.password,
      id: driver._id,
    }))
  } catch (error) {
    alert(error.message)
    throw error
  }
}

export const deleteDriver = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.delete(
      `${import.meta.env.VITE_API_URL}/api/drivers/delete/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return alert(data.message)
  } catch (error) {
    throw error
  }
}

export const updateDriver = async (id, data) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data: response } = await axios.patch(
      `${import.meta.env.VITE_API_URL}/api/drivers/update/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      },
    )

    return response
  } catch (error) {
    console.error('Update driver failed:', error)
    alert(error.response?.data?.message || error.message)
    throw error
  }
}

export const driverProfile = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return data
  } catch (error) {
    alert(error.message)
    throw error
  }
}

export const driverAttendance = async (id, selectedMonth) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/attendance/get-attendence-month-wise?driverId=${id}&month=${selectedMonth}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data
  } catch (error) {
    alert(error.message)
    throw error
  }
}

export const driverExpenses = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/driverExpense/get-driver-expense-by-driver-id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data.map((expenses) => ({
      id: expenses._id,
      originalDate: expenses.date,
      date: formatDateToDDMMYYYY(expenses.date),
      description: expenses.description,
      location: expenses.location,
      shopName: expenses.shopName,
      amount: expenses.amount,
      payment: expenses.paymentMode,
      billImg: expenses.billImg,
    }))
  } catch (error) {
    alert(error.message)
    throw error
  }
}

export const getDriverBillApi = async (billImg) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const res = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/driverExpense/bill-img/${billImg}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    return res.data
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

export const driverLogbook = async (id, month) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/dailylogs/get-daily-logs-month-wise?driverId=${id}&month=${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data.map((logbook) => ({
      id: logbook._id,
      originalDate: logbook.startDate,
      startDate: formatDateToDDMMYYYY(logbook.startDate),
      vehicleName: logbook.vehicleName,
      logKM: logbook.logKM,
      gpsKM: logbook.gpsKM,
      amount: logbook.amount,
      signatureId: logbook.signatureId,
    }))
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

export const driverSalary = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/salary/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    // console.log("all data salaray", response.data)

    return data.map((salary) => ({
      id: salary._id,
      driverId: salary.driverId,
      basicPay: salary.basicPay,
      overtime: salary.overtime,
      incentives: salary.incentives,
      deductions: salary.deductions,
      netPay: salary.netPay,
      createdAt: formatDateToDDMMYYYY(salary.createdAt),
      originalDate: salary.createdAt,
    }))
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}

export const driverTripDetails = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/trips/get-trip-by-driver-id/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data.map((trip) => ({
      id: trip._id,
      vehicleName: trip.vehicleName,
      date: new Date(trip.date).toLocaleDateString('en-GB'),
      startLocation: trip.startLocation,
      endLocation: trip.endLocation,
      budgetAllocated: trip.budgetAllocated,
      spentAmount: trip.spentAmount,
      materialType: trip.materialType,
      status: trip.status,
    }))
  } catch (error) {
    console.error('Error:', error.response?.data || error.message)
    throw error
  }
}
