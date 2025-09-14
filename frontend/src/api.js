import axios from "axios"
import { ACCESS_TOKEN } from "./constants"


const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL
})

api.interceptors.request.use(
(config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if(token){
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
},

(error) => {
    return Promise.reject(error)
}

)

export default api

export const resetPassword = async (uid, token, newPassword,confirmPassword) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/users/reset_password_confirm/`, {
            uid: uid,
            token: token,
            new_password: newPassword,
            re_new_password:confirmPassword
        });
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error.response.data);
        throw error;
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/users/reset_password/`, {
            email: email
        });
        return response.data;
    } catch (error) {
        console.error('Error requesting password reset:', error.response.data);
        throw error;
    }
};