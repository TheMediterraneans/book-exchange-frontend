import axios from "axios"

const API_URL = "http://localhost:5005/auth";

export const signup = (userData) => {
    return axios.post(`${API_URL}/signup, userData`)
};

export const login = (credentials) => {
    return axios.post(`${API_URL}/login credentials`)
}