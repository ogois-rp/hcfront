// src/axiosInstance.js
import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Backend server URL
  timeout: 1000, // Optional timeout
  headers: { 'Content-Type': 'application/json' }, // Optional headers
})

export default axiosInstance
