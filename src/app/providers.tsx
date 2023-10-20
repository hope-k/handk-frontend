"use client";

import React from "react";
import { QueryClientProvider, QueryClient } from "react-query";
import { ReactQueryDevtools } from 'react-query/devtools'
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider } from "next-auth/react";
import { CartProvider, useCart } from "react-use-cart";



function Providers({ children }: React.PropsWithChildren) {
    const [client] = React.useState(new QueryClient());

    return (
        <SessionProvider>
            <CartProvider>
                <NextUIProvider>
                    <QueryClientProvider client={client}>
                        {children}
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </NextUIProvider>
            </CartProvider>
        </SessionProvider>
    );
}

export default Providers;
