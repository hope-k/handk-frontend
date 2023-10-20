
import React from 'react'
import Products from "@/components/Products"
import { dehydrate, Hydrate } from 'react-query'
import getQueryClient from '@/app/getQueryClient'
import { fetchProducts } from '@/hooks/useProducts';
import { fetchBrand } from '@/hooks/useBrand';
import { fetchCategory } from '@/hooks/useCategory';



export default async function HydrateProducts() {
    const queryClient = getQueryClient()
    const searchParams = new URLSearchParams(window.location.search)
    const category = searchParams.get('category') || ''
    const price_min = searchParams.get('price_min') || ''
    const price_max = searchParams.get('price_max') || ''
    const sort = searchParams.getAll('sort') || ''
    const brands = searchParams.getAll('brand') || ''
    const queryKey = ['/api/products/', {
        category,
        price_min,
        price_max,
        sort,
        brands,

    }]

    await queryClient.prefetchInfiniteQuery(queryKey, ({ pageParam }) => fetchProducts(pageParam, queryKey))
    await queryClient.prefetchQuery(['/api/brands'], fetchBrand)
    await queryClient.prefetchQuery(['/api/categories'], fetchCategory)
    const dehydratedState = dehydrate(queryClient)
    console.log('HERE--------------',  dehydratedState)
    return (
        <Hydrate state={dehydratedState}>
            <Products />
        </Hydrate>
    )
}