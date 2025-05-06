import axios from 'axios'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXlzaHUiLCJpZCI6IjY3MTM2NTNiNjEzY2YyZDJjNTMyZWQwZSIsInVzZXJzIjpmYWxzZSwic3VwZXJhZG1pbiI6dHJ1ZSwidXNlciI6bnVsbCwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NDEzMzQ2NzN9.CWrHCFTim0n6wyw8ynx1B3eXL0jNpzGrCNEUVSwhpxs'

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

    // const form = new FormData()
    // for (const key in data) {
    //   if (data[key]) form.append(key, data[key])
    // }

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
