// API client utilities - authentication, error handling, hooks

import { getAccessToken } from '../auth';
import { useState, useCallback } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3002';

export { BACKEND_URL };

// Authenticated fetch wrapper
export async function authenticatedFetch(url: string, options: RequestInit = {}) {
    const token = await getAccessToken();

    if (!token) {
        throw new Error('No hay token de autenticación disponible');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${BACKEND_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('Has excedido el límite de solicitudes. Por favor, espera un minuto antes de intentar de nuevo.');
        }
        const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
}

// Error class
export class ApiError extends Error {
    constructor(message: string, public status?: number) {
        super(message);
        this.name = 'ApiError';
    }
}

// React hook for API calls
export function useApiCall<T>() {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (apiCall: () => Promise<T>) => {
        try {
            setLoading(true);
            setError(null);
            const result = await apiCall();
            setData(result);
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, execute };
}
