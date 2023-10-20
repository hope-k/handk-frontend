import React from 'react';
import { useCallback } from "react";
import { useSearchParams } from 'next/navigation';

export const useCreateQueryString = () => {
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    const createQueryString = useCallback(
        (name: string, values: any) => {
            if (Array.isArray(values) && values.length === 0) {
                params.delete(name);
                return params.toString();
            }
            if (Array.isArray(values)) {
                params.set(name, values.join(","));
            } else {
                params.set(name, values);
            }
            
            return params.toString();
        },
        [searchParams]
    );

    const setQueryString = (name: string, values: any) => {
        return createQueryString(name, values)



    }

    const hasQuery = params.toString() !== '';
    return {
        setQueryString,
        params,
        hasQuery,
        
    }
}



