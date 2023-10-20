import { http } from "@/utils/axios"
import { APIResponse, CartTAPI, CartTAPIItem, CartTItem } from '@/types/shop'
import { useQuery, useMutation, useInfiniteQuery } from 'react-query'
import { useSession } from "next-auth/react"
import { usePathname } from "next/navigation"
import { useQueryClient } from "react-query"

const fetchCart = async (): Promise<CartTAPI> => {
    const API = await http()
    const { data } = await API.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/`)
    //? localstorage here updates the user-total-items but does not re-render in header cause of no useEffect
    typeof window !== 'undefined' && localStorage.setItem('user-total-items', data?.items_count)
    typeof window !== 'undefined' && localStorage.setItem('cartId', data?.id)

    return data
}
const fetchCartItems = async (pageParam = 1, cartId: string = '') => {
    console.log('QUERY KEY', cartId)
    const API = await http()
    const { data }: APIResponse<any> = await API.get(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartId}/items/?page=${pageParam}`)
    return data
}

const addCartItem = async (args: {
    cartItem: CartTAPIItem;
}) => {
    const { cartItem } = args
    const API = await http()
    const { data } = await API.post(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartItem.cart}/items/`, {
        ...cartItem
    })
    return data
}


const updateApiCartItem = async (args: any) => {
    const { cartItemId, quantity } = args
    const cartId = typeof window !== 'undefined' && localStorage.getItem('cartId') || ""
    const API = await http()
    const { data } = await API.patch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartId}/items/${cartItemId}/`, {
        quantity
    })
    return data
}

const deleteApiCartItem = async (cartItemId: number) => {
    const cartId = typeof window !== 'undefined' && localStorage.getItem('cartId') || ""
    const API = await http()
    const { data } = await API.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/cart/${cartId}/items/${cartItemId}/`)
    return data
}


export function useCartAPI() {
    const queryClient = useQueryClient()
    const { status, data: session } = useSession()
    const pathname = usePathname()

    const cartId = typeof window !== 'undefined' && localStorage.getItem('cartId') || ""
    const getCart = useQuery('/api/cart/', fetchCart, {
        enabled: (status === 'authenticated')
    })


    const addCartItemMutation = useMutation(addCartItem, {

        // onMutate: async (args) => {
        //     let updatedItems: any;
        //     const { cartItem } = args

        //     await queryClient.cancelQueries('/api/cart/items/')
        //     const currentItems: any = queryClient.getQueryData('/api/cart/items/')
        //     if (currentItems) {
        //         updatedItems = {
        //             ...currentItems,
        //             pages: currentItems?.pages?.map((page: { results: any[] }) => ({
        //                 ...page,
        //                 results: page?.results?.push(cartItem)

        //             }))
        //         }
        //     } else {
        //         updatedItems = {
        //             pages: {
        //                 results: [{...addCartItem}]

        //             }
        //         }
        //     }

        //     console.log('ADD ONMUTATE ITEM', updatedItems)
        //     queryClient.setQueryData('/api/cart/items/', updatedItems)
        //     return {
        //         currentItems
        //     }

        // }

    })

    const getCartItems = useInfiniteQuery(['/api/cart/items/'], ({ pageParam }) => fetchCartItems(pageParam, cartId), {
        keepPreviousData: true,

        getNextPageParam: (lastPage, _) => {
            const nextPage = lastPage.next
            return nextPage ? new URL(nextPage).searchParams.get('page') : undefined
        },
        enabled: (pathname === '/cart')

    })

    const updateCartItemMutation = useMutation(updateApiCartItem, {
        onMutate: async (args) => {
            await queryClient.cancelQueries('/api/cart/items/')
            const currentItems: any = queryClient.getQueryData('/api/cart/items/')
            const updatedWithQuantity = {
                ...currentItems,
                pages: currentItems?.pages?.map((page: { results: { id: any }[] }) => ({
                    ...page,
                    results: page.results.map((res: { id: any }) => {
                        if (res.id === args?.cartItemId) {
                            return {
                                ...res,
                                quantity: args?.quantity,
                            };
                        }
                        return res;
                    }),
                })),
            }
            queryClient.setQueryData('/api/cart/items/', updatedWithQuantity)
            return { currentItems }


        }
    })
    const deleteCartItemMutation = useMutation(deleteApiCartItem, {
        onMutate: async (cartItemId) => {
            await queryClient.cancelQueries('/api/cart/items/')
            const currentItems: any = queryClient.getQueryData('/api/cart/items/')
            const updatedItems = {
                ...currentItems,
                pages: currentItems?.pages?.map((page: { results: any[] }) => ({
                    ...page,
                    results: page?.results?.filter((res: { id: number }) => res.id !== cartItemId)

                }))
            }
            queryClient.setQueryData('/api/cart/items/', updatedItems)
            return {
                currentItems
            }




        }

    })




    return {
        getCart,
        getCartItems,
        addCartItemMutation,
        updateCartItemMutation,
        deleteCartItemMutation
    }


}