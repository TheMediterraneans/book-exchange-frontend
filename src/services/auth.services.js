// src/services/auth.services.js
import axios from "axios";

const API_URL = "http://localhost:5005"; 

const api = axios.create({
  baseURL: API_URL
});

// Intercettore per aggiungere il token alle richieste
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signup = (userData) => {
  return api.post("/auth/signup", userData);
};

export const login = (userData) => {
  return api.post("/auth/login", userData);
};

export const verify = () => {
  return api.get("/auth/verify");
};

export const logout = () => {
  localStorage.removeItem("authToken");
};

export const getToken = () => {
  return localStorage.getItem("authToken");
};

export const setToken = (token) => {
  localStorage.setItem("authToken", token);
};