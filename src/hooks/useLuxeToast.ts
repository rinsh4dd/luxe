"use client";

import { useCallback } from "react";
import { toast } from "sonner";

/**
 * useLuxeToast
 * A custom hook to provide standardized, premium notifications across the Luxe app.
 * Wraps Sonner with pre-configured styles and consistent behaviors.
 */
export const useLuxeToast = () => {
    const success = useCallback((message: string, description?: string) => {
        toast.success(message, {
            description,
            className: "premium-toast success",
        });
    }, []);

    const error = useCallback((message: string, description?: string) => {
        toast.error(message, {
            description,
            className: "premium-toast error",
        });
    }, []);

    const info = useCallback((message: string, description?: string) => {
        toast.info(message, {
            description,
            className: "premium-toast info",
        });
    }, []);

    const promise = useCallback(async <T>(
        promiseFn: Promise<T>,
        {
            loading = "Processing...",
            success = "Action completed successfully",
            error = "Something went wrong",
        }: {
            loading?: string;
            success?: string | ((data: T) => string);
            error?: string | ((err: any) => string);
        }
    ) => {
        return toast.promise(promiseFn, {
            loading,
            success,
            error,
        });
    }, []);

    return { success, error, info, promise };
};
