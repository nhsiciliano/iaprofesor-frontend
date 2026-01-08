'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export interface ErrorState {
    hasError: boolean;
    message: string | null;
    code?: string;
    details?: unknown;
}

export interface UseErrorHandlerOptions {
    showToast?: boolean;
    logError?: boolean;
    onError?: (error: Error) => void;
}

const defaultOptions: UseErrorHandlerOptions = {
    showToast: true,
    logError: true,
};

// Parse error to user-friendly message
function parseError(error: unknown): { message: string; code?: string } {
    if (error instanceof Error) {
        // API errors
        if (error.message.includes('token de autenticación')) {
            return { message: 'Tu sesión ha expirado. Por favor, inicia sesión de nuevo.', code: 'AUTH_ERROR' };
        }
        if (error.message.includes('límite de solicitudes')) {
            return { message: 'Demasiadas solicitudes. Espera un momento antes de continuar.', code: 'RATE_LIMIT' };
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            return { message: 'Error de conexión. Verifica tu conexión a internet.', code: 'NETWORK_ERROR' };
        }
        return { message: error.message };
    }

    if (typeof error === 'string') {
        return { message: error };
    }

    return { message: 'Ha ocurrido un error inesperado.' };
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}) {
    const opts = { ...defaultOptions, ...options };
    const [errorState, setErrorState] = useState<ErrorState>({
        hasError: false,
        message: null,
    });

    const handleError = useCallback((error: unknown) => {
        const { message, code } = parseError(error);

        setErrorState({
            hasError: true,
            message,
            code,
            details: error,
        });

        if (opts.logError) {
            console.error('[Error Handler]:', error);
        }

        if (opts.showToast) {
            toast.error(message);
        }

        opts.onError?.(error instanceof Error ? error : new Error(message));
    }, [opts]);

    const clearError = useCallback(() => {
        setErrorState({
            hasError: false,
            message: null,
        });
    }, []);

    const wrapAsync = useCallback(<T,>(asyncFn: () => Promise<T>): Promise<T | undefined> => {
        return asyncFn().catch((error) => {
            handleError(error);
            return undefined;
        });
    }, [handleError]);

    return {
        ...errorState,
        handleError,
        clearError,
        wrapAsync,
    };
}

// Simplified hook for one-off error handling
export function useAsyncError() {
    const { handleError, wrapAsync } = useErrorHandler({ showToast: true });
    return { handleError, wrapAsync };
}
