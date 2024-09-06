import axios from 'axios';
import _env from "@/lib/env.js";

const api = axios.create({
    baseURL: _env.API_URL,
    headers: {
    'Content-Type': 'application/json',
    },
});

export default api;