import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

export function useFetch() {
    const [loading, setLoading] = useState(false);

    const fetchDataBackend = async (url, data = null, method = "GET", headers = {}, showToast = true) => {
        let loadingToast;
        
        if (showToast) {
            loadingToast = toast.loading("Procesando solicitud...");
        }
        
        setLoading(true);
        
        try {
            const token = sessionStorage.getItem("token");
            const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};
            const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

            const response = await axios({
                method,
                url: `${baseUrl}${url}`,
                headers: {
                    "Content-Type": "application/json",
                    ...authHeaders,
                    ...headers,
                },
                data,
            });

            if (showToast) {
                toast.dismiss(loadingToast);
                toast.success(response?.data?.message || response?.data?.msg || "Operación exitosa");
            }
            
            return response?.data;

        } catch (error) {
            if (showToast) {
                toast.dismiss(loadingToast);
                toast.error(error.response?.data?.error || error.response?.data?.message || "Ocurrió un error inesperado");
            }
            console.error(error);
            return null;
        } finally {
            setLoading(false);
        }
    };

    return { fetchDataBackend, loading };
}