import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // update if using different port
  withCredentials: true, // important for cookie-based auth
});

export default api;
