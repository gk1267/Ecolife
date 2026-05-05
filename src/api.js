import axios from 'axios';
const api = axios.create({
    baseURL: 'https://ecolifexyz.vercel.app/api', // Use your actual Vercel link here
});
// Important: This attaches your token for security
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['x-auth-token'] = token;
    }
    return config;
});
export default api;