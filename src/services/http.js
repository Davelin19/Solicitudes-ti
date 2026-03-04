import axios from "axios";

const http = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    },
});

// Agregar un interceptor para incluir credenciales en cada solicitud
http.interceptors.request.use((config => {
    const userData = localStorage.getItem("userData");
    if (userData) {
        const user = JSON.parse(userData);
        if (user.token) {
            config.headers.Authorization = `Bearer ${user.token}`;
        }
    }
    return config;
}), (error) => {
    return Promise.reject(error);
});


// Agregar un interceptor para manejar respuestas

http.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem("userData");
        window.location.href = "/";
    }
    return Promise.reject(error);
});

export default http;
