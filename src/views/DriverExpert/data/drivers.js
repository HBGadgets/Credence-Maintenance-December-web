import axios from 'axios'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXlzaHUiLCJpZCI6IjY3MTM2NTNiNjEzY2YyZDJjNTMyZWQwZSIsInVzZXJzIjpmYWxzZSwic3VwZXJhZG1pbiI6dHJ1ZSwidXNlciI6bnVsbCwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NDEzMzQ2NzN9.CWrHCFTim0n6wyw8ynx1B3eXL0jNpzGrCNEUVSwhpxs'

export const fetchDrivers = async () => {
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
    console.log(error)
    throw error
  }
}

export const driverAttendance = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const { data } = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/attendance/get-attendence-month-wise?driverId=${id}&month=2025-03`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return data
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
