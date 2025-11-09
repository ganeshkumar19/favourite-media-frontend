import axios from "axios";

const api = axios.create({
  baseURL: "https://favourite-media-backend.onrender.com/api", // your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;