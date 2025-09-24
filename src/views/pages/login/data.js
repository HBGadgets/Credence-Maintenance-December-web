import axios from "axios"

export const LoginUser = async (data) => {
    try {
        const { data: response } = await axios.post(
            `${import.meta.env.VITE_API_CREDENCE_BACKEND}/auth/login`,
            data
        )
        return response
    } catch (error) {
        throw error.response?.data || error
    }
}
