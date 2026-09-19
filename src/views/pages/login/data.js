import axios from 'axios'

export const LoginUser = async (data) => {
  try {
    // Try first login API: VITE_API_CREDENCE_BACKEND
    // Payload: { username, password }
    const { data: response } = await axios.post(
      `${import.meta.env.VITE_API_CREDENCE_BACKEND}/auth/login`,
      data,
    )
    return response
  } catch (error) {
    try {
      // If the first fails, try the worker login API: VITE_API_URL
      // Payload for worker login: { phone: username, password }
      const secondPayload = {
        phone: data.username,
        password: data.password,
      }
      const { data: response } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/worker/login`,
        secondPayload,
      )
      return response
    } catch (secondError) {
      // If both fail, throw the error
      throw secondError.response?.data || secondError || error.response?.data || error
    }
  }
}
