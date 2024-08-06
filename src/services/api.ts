import { AppError } from "@utils/AppError";
import axios from "axios";

const api = axios.create({
    //Clube
    baseURL: "http://10.0.1.168:3333",
    //Casa
    //baseURL: "http://192.168.0.109:3333",
    timeout: 5000,
});

api.interceptors.response.use(response => response, error => {
    if (error.response && error.response.data) {
        const msgError = error.response.data.message === undefined ? "Erro no servidor." : error.response.data.message;
        return Promise.reject(new AppError(msgError));
    } else {
        return Promise.reject(error);
    }
});

export { api };

/*
api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
})

api.interceptors.request.use((config) => {
    return config;
}, (error) => {
    return Promise.reject(error);
})
*/