import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8000", // or your FastAPI URL
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // or however you store it
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
