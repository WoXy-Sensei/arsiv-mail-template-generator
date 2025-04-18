import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_DEEPSEEK_API_URL}`,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "max-age=3600",
  },
});

export default instance;
