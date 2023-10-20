import { http } from "@/utils/axios"
import { useQuery, useMutation, useInfiniteQuery } from 'react-query'
import { useSession } from "next-auth/react"
import { ProductTData } from "@/types/shop"

const fetchWishlist = async () => {
    const API = await http()
    const { data } = await API.get(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/`)
    typeof window !== 'undefined' && localStorage.setItem('wishlistId', data?.id)

    return data
}
const fetchWishlistItems = async (pageParam = 1, wishlistId: string = '') => {
    console.log('QUERY KEY Wishlist', wishlistId)
    const API = await http()
    const { data } = await API.get(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${wishlistId}/items/?page=${pageParam}`)
    return data
}

const addWishlistItem = async (productId: ProductTData['id']) => {
    const wishlistId = localStorage.getItem('wishlistId')
    const API = await http()
    const { data } = await API.post(`${process.env.NEXT_PUBLIC_API_URL}/api/wishlist/${wishlistId}/items/`, {
        product: productId,
        wishlist: wishlistId
    })
    return data
}


export function useWishlist() {
    const { status } = useSession()
    const wishlistId = typeof window !== 'undefined' && localStorage.getItem('wishlistId') || ""
    const getWishlist = useQuery('/api/wishlist/', fetchWishlist, {
        enabled: (status === 'authenticated')
    })
    const addWishlistItemMutation = useMutation(addWishlistItem)
    const getWishlistItems = useInfiniteQuery(['/api/wishlist/items/'], ({ pageParam }) => fetchWishlistItems(pageParam, wishlistId), {
        getNextPageParam: (lastPage, _) => {
            const nextPage = lastPage.next
            return nextPage ? new URL(nextPage).searchParams.get('page') : undefined
        },
        enabled: (status === 'authenticated') //todo add path condition for wishlist path
    })




    return {
        getWishlist,
        getWishlistItems,
        addWishlistItemMutation,
    }


}