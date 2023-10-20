import React, { useState, useEffect } from 'react'
import QuantityInput from '../ProductDetail/QuantityInput'
import Image from 'next/image'
import { Trash, XIcon } from 'lucide-react'
import { CartTAPI, CartTAPIItem } from '@/types/shop'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@nextui-org/react'
import { useCartAPI } from '@/hooks/useCartAPI'
import { toast, IconTheme } from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { useCart } from 'react-use-cart'
import chroma from "chroma-js";
import Link from 'next/link'

type Props = {
    cartItem: CartTAPIItem;
}

export default function CartItem({ cartItem }: Props) {
    const [value, setValue] = useState(cartItem?.quantity)
    const { deleteCartItemMutation, getCart, updateCartItemMutation } = useCartAPI()
    const queryClient = useQueryClient()
    const { data: cart, isLoading: cartLoading } = getCart

    const handleItemDelete = async () => {
        await deleteCartItemMutation.mutateAsync(cartItem?.id as number)
    }

    const handleCartItemUpdate = async () => {
        const args = {
            cartItemId: cartItem?.id,
            quantity: value
        }
        await updateCartItemMutation.mutateAsync(args)
    }

    useEffect(() => {
        handleCartItemUpdate()
    }, [value])


    const invalidateQueries = async () => {
        await queryClient.invalidateQueries('/api/cart/items/')
        await queryClient.invalidateQueries('/api/cart/')

    }


    useEffect(() => {
        if (deleteCartItemMutation.isSuccess) {

            invalidateQueries()
        }

    }, [deleteCartItemMutation.isSuccess])

    useEffect(() => {
        if (deleteCartItemMutation.isError) {
            toast.error(`Something went wrong. Try again`, {
                className: ' text-[11px] p-0 ', style: {
                    color: 'white',
                    background: 'red'
                },
                duration: 2000
            })
        }

    }, [deleteCartItemMutation.isError])

    useEffect(() => {
        if (updateCartItemMutation.isSuccess) {
            invalidateQueries()
        }

    }, [updateCartItemMutation.isSuccess])




    return (
        <motion.div layout='position' initial={{
            opacity: 0,
            y: 15,
        }}
            whileInView={{
                opacity: 1,
                y: 0,
            }}
            viewport={{
                once: false
            }}
            exit={{
                opacity: 0,
                y: '-100%'

            }}
            transition={{
                type: 'spring',
                mass: 0.1,
                stiffness: 45,
                damping: 5,
                duration: .25
            }} className="rounded-lg min-w-full relative">
            <div className="justify-between font-sans mb-[2px] rounded-lg bg-white  border-t-[1px] border-b-[1px] p-1 sm:flex sm:justify-between ">
                <Link href={`/product/${cartItem?.product_slug}`}>
                    <div className='flex gap-3'>
                        <div className='relative w-[130px] rounded-lg  h-[90px]'>
                            <Image className='object-cover rounded-lg' fill src="/images/default.png" alt="product-image" />
                        </div>

                        <div >
                            <h2 className="text-md font-semibold tracking-normal text-gray-800">{cartItem.product_name}</h2>
                            <div className="mt-1 text-xs text-gray-700 capitalize">

                                {
                                    cartItem?.specification?.some(item => item.product_attribute.name === 'color') && (
                                        <div className=' mb-2'>
                                            <div className=''>
                                                <span className='font-light font-sans'>Color:</span>
                                                {
                                                    cartItem?.specification?.filter(item => item?.product_attribute?.name === 'color')?.map((spec, index) => {
                                                        const bgColor = chroma(spec?.attribute_value).desaturate(3)
                                                        return (
                                                            <div key={index}>
                                                                <button
                                                                    style={{ backgroundColor: bgColor as unknown as string }}

                                                                    className={` relative appearance-none outline-none rounded-full transition-all duration-700  p-1 mr-2 w-4 h-3 `}
                                                                />
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                                {
                                    cartItem?.specification?.some(item => item?.product_attribute?.name === 'size') && (
                                        <h4 className='font-light font-sans'>Size: <span className='font-semibold text-black ml-2'>{cartItem?.specification?.filter(item => item.product_attribute.name === 'size')[0].attribute_value}</span> </h4>
                                    )
                                }
                                <h4 className='font-light font-sans'>Quantity: <span className='font-semibold text-black ml-2'><span className='text-gray-500 text-[8px] mr-1'>x</span>{cartItem?.quantity}</span> </h4>
                            </div>
                        </div>

                    </div>
                </Link>
                <div className=" flex justify-between md:justify-around md:space-x-4 items-center ">
                    <div>
                        <QuantityInput value={value} setValue={setValue} />
                    </div>
                    <div className="flex items-center space-x-4">

                        {
                            (cartItem?.unit_price && cartItem?.sale_price) ? (
                                <div className='block whitespace-nowrap'>
                                    <div className="font-semibold">
                                        <span>&#x20B5; </span>
                                        <span>{cartItem?.sale_price}</span>
                                    </div>
                                    <div className="font-normal space-x-1 flex items-center text-xs text-gray-500">
                                        <div className='line-through'>
                                            <span>&#x20B5; </span>
                                            <span>{cartItem?.unit_price}</span>
                                        </div>
                                        <span className='text-red-500'>({cartItem?.discount_percentage}% off)</span>
                                    </div>

                                </div>
                            ) :
                                (
                                    <div className="font-semibold">
                                        <span>&#x20B5; </span>
                                        <span>{cartItem?.unit_price}</span>
                                    </div>
                                )
                        }

                        <span className='p-1 rounded-lg'>
                            <Button className='bg-transparent' onPress={() => handleItemDelete()} isLoading={deleteCartItemMutation.isLoading} isIconOnly size='sm'>
                                {!deleteCartItemMutation.isLoading && <XIcon className='text-white stroke-red-600 stroke-[1px]' size={20} />}
                            </Button>
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}