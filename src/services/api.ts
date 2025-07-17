import axios from "axios";

const api = axios.create({
  baseURL: "https://insumo-backend.onrender.com/api",
});

export default api;
