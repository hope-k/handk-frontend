'use client'

import React, { useState, useEffect } from 'react'
import CartItem from './CartItem'
import { useCartAPI } from '@/hooks/useCartAPI'
import { CartTAPI } from '@/types/shop'
import { Breadcrumb } from 'antd';
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { Spinner } from '@nextui-org/react'
import { useQueryClient } from 'react-query'
import { Button } from '@nextui-org/react'
import { useCart } from 'react-use-cart'
import { AnimatePresence, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import InfiniteScroll from 'react-infinite-scroll-component'



const Cart = () => {
    const { setCartMetadata } = useCart()
    const pathname = usePathname()

    const { getCartItems, getCart } = useCartAPI()
    const queryClient = useQueryClient()
    const { data: cart, isLoading: cartLoading } = getCart
    const { data, isLoading, hasNextPage, fetchNextPage } = getCartItems
    const cartItems = data?.pages?.flatMap(page => page.results)
    const breadcrumbItems = [
        { label: 'Home', link: '/' },
        { label: `Cart`, link: ' /cart' } // Current page without link
    ];

    useEffect(() => {
        if (cart && !cartLoading) {
            setCartMetadata({
                totalUserItems: cart?.items_count
            })
        }
    }, [cart, cartLoading])


    if (isLoading) return (
        <div className='flex overflow-hidden  bottom-0 -left-8 h-screen w-full items-center justify-center'>
            <Spinner
                classNames={{
                    circle1: "  border-[1px] ",
                    circle2: "  border-[1px] text-black",
                }}
                size='lg'
                color="current"
            />
        </div>
    )

    return (
        <div className="h-full w-full relative pt-20">
            <div className='mb-3 mx-20'>
                <Breadcrumb separator={<ChevronRight strokeWidth={'1'} />}>
                    {breadcrumbItems.map((item, index) => (
                        <Breadcrumb.Item className='font-sans' key={index}>
                            {item.link ? <Link href={item.link}>{item.label}</Link> : item.label}
                        </Breadcrumb.Item>
                    ))}
                </Breadcrumb>
            </div>
            <div className='flex text-[13px] font-light mt-3 mb-10 font-sans text-[#ccc] capitalize justify-center flex-row items-center space-x-3'>
                <div className={(pathname === '/cart' ? 'text-purple-700' : 'text-[#ccc]')}>
                    shopping bag
                </div>
                <span className='h-[1px] rounded-full w-[6rem] bg-gray-200'></span>
                <div className=''>
                    delivery address
                </div>
                <span className='h-[1px] rounded-full w-[6rem] bg-gray-200'></span>
                <div>
                    payment
                </div>
            </div>
            <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0 h-full w-full">
                {/* cart item */}
                <div className='flex h-full flex-col w-full' >
                    <div className='text-xs text-red-500 font-normal mb-2 flex font-sans justify-end'>
                        Please update your cart, some products are out of stock
                    </div>
                    <InfiniteScroll
                        dataLength={cartItems?.length as number || 0}
                        next={() => fetchNextPage()}
                        hasMore={hasNextPage as boolean}
                        loader={
                            <div>
                                <Spinner
                                    classNames={{
                                        circle1: "  border-[1px] ",
                                        circle2: "  border-[1px] text-black",
                                    }}
                                    size='sm' color="current"
                                />
                            </div>
                        }


                    >
                        <div className='overflow-hidden'>
                            <AnimatePresence>
                                {
                                    (cartItems?.length !== 0) ?
                                        cartItems?.map((cartItem, i) => (
                                            <CartItem key={i} cartItem={cartItem} />

                                        )) :
                                        <div className='font-sans flex items-center flex-col justify-center font-light'>Cart is empty</div>
                                }
                            </AnimatePresence>
                        </div>
                    </InfiniteScroll>

                </div>

                {/* sub total */}
                <div className="sticky border-l-[1px] mt-6 h-full  top-20 bg-white p-6 md:mt-0 md:w-1/3 ">
                    <span className='text-green-600 mb-[1px] text-xs font-thin'>Get &#x20B5;10 off on Orders Over &#x20B5;100</span>
                    <div className='flex max-w-full'>
                        <input placeholder='Apply code:' className='min-w-[4rem] placeholder:text-[13px] placeholder:pl-3 placeholder:font-sans  rounded-l-lg outline-none appearance-none bg-gray-100 border-gray-300 border-[1px]  p-1' type="text" />
                        <Button className='rounded-r-lg text-[13px]' radius='none' color='secondary'>
                            Apply
                        </Button>
                    </div>

                    <div className='mt-10 w-full font-sans font-normal'>
                        <h1 className='  text-xs uppercase border-b pb-2 mb-3'>Order Details: </h1>
                        <div className='space-y-1 mb-5 font-thin'>
                            <div className='flex justify-between text-sm text-gray-700 '>
                                <h1>
                                    Order total:
                                </h1>
                                <span>
                                    &#x20B5; {cart?.cart_total_price}
                                </span>
                            </div>
                            <div className='flex justify-between text-sm text-gray-700'>
                                <span>
                                    Discount:
                                </span>
                                <span>
                                    &#x20B5; {cart?.cart_total_price}
                                </span>
                            </div>
                            <div className='flex justify-between text-sm text-gray-700'>
                                <span>
                                    Delivery Charges:
                                </span>
                                <span className='text-green-700'>
                                    Free
                                </span>
                            </div>
                            <div className='flex justify-between text-sm text-gray-700'>
                                <span>
                                    Coupon Discount:
                                </span>
                                <span>
                                    &#x20B5; 12
                                </span>
                            </div>

                        </div>
                        <div className='space-y-3 '>
                            <div className='flex justify-between text-[13px] uppercase font-bold'>
                                <span className='font-bold'>
                                    Sub total:
                                </span>
                                <span>
                                    &#x20B5; {cart?.cart_total_price}
                                </span>
                            </div>
                            <div>
                                <Link href='/cart/delivery-address/'>
                                    <button type='button' className='w-full text-[13px] bg-purple-600 p-2 text-white rounded-lg' >
                                        Proceed to Checkout
                                    </button>
                                </Link>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}

export default Cart