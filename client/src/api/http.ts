import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api'
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Normalize error message for UI
    const message = err?.response?.data?.message ?? err.message ?? 'Unknown error';
    return Promise.reject(new Error(message));
  }
);
