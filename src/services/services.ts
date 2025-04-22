import axios from "axios";
import {BASE_URL} from "./baseRouting.ts";

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
});

export default api;