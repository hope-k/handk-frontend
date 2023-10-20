import { dehydrate, QueryClient, useQuery, useInfiniteQuery } from "react-query";
import { http } from '@/utils/axios'
import { useRouter, useSearchParams } from "next/navigation";
import {
    CategoryTData,
    ProductTData,
    APIResponse,
    InventoryTData
} from '@/types/shop'


export const fetchProducts = async (pageParam = 1, queryKey: any[]) => {
    let searchResults;
    const {
        searchQuery,
        category,
        price_min,
        price_max,
        sort,
        brands,
        rating,
    } = queryKey[1];



    const API = await http()
    const mainUrl = `/api/products/?category=${category}&price_min=${price_min}&price_max=${price_max}&sort=${sort}&brand=${brands}&page=${pageParam}&rating=${rating}`
    let url = `/api/products/?category=${category}&price_min=${price_min}&price_max=${price_max}&sort=${sort}&brand=${brands}&page=${pageParam}&rating=${rating}`


    // rating separated because it has a default null which causes error when making the req

    if (searchQuery) {
        url = url.concat(`&search=${searchQuery}`)
        const { data: searchedData }: APIResponse<ProductTData> = await API.get(url).then((res: any) => {
            return res

        }).catch((err: any) => {
            return err
        })
        searchResults = searchedData
    }

  

    const { data }: APIResponse<ProductTData> = await API.get(mainUrl)
    return {
        data,
        searchResults
    }
}

export default function useProducts(switchToSearchData: boolean, searchValue: string) {

    const searchParams = useSearchParams()
    const searchQuery = searchValue || searchParams.get('search')
    const category = searchParams.get('category') || ''
    const price_min = searchParams.get('price_min') || ''
    const price_max = searchParams.get('price_max') || ''
    const sort = searchParams.getAll('sort') || ''
    const brands = searchParams.getAll('brand') || ''
    const rating = searchParams.get('rating') || ''
    const queryKey = ['/api/products/', {
        searchQuery,
        category,
        price_min,
        price_max,
        sort,
        brands,
        rating,
        switchToSearchData

    }]

    return useInfiniteQuery(queryKey, ({ pageParam }) => fetchProducts(pageParam, queryKey), {
        keepPreviousData: true,
        staleTime: Infinity,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        getNextPageParam: (lastPage, allPages) => {
            // get search param from the nextPage variable which is a url with the page param for the next page 
            const nextPage = lastPage?.data?.next;
            return nextPage ? new URL(nextPage).searchParams.get('page') : undefined;


        },
        
    })


}

