import axios from 'axios'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNoYXlzaHUiLCJpZCI6IjY3MTM2NTNiNjEzY2YyZDJjNTMyZWQwZSIsInVzZXJzIjpmYWxzZSwic3VwZXJhZG1pbiI6dHJ1ZSwidXNlciI6bnVsbCwicm9sZSI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NDEzMzQ2NzN9.CWrHCFTim0n6wyw8ynx1B3eXL0jNpzGrCNEUVSwhpxs'

export const drivers = async () => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data.map((data) => ({
      name: data.name,
      contactNumber: data.contactNumber,
      email: data.email,
      password: data.password,
      id: data._id,
    }))
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const driverProfile = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/drivers/get/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    return response.data
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const driverAttendance = async (id) => {
  try {
    if (!token) throw new Error('Authentication token not found')

    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/api/attendance/get-attendence-month-wise?driverId=${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )

    return response.data
  } catch (error) {
    console.log(error.message)
    throw error
  }
}
