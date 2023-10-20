'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Tooltip } from 'antd';
import { Avatar, Spinner, Badge } from '@nextui-org/react'
import { useSession } from 'next-auth/react'
import Link from 'next/link';
import { User2 } from 'lucide-react'
import { motion } from 'framer-motion'
import AuthDropdown from './AuthDropdown';
import { useCart } from 'react-use-cart'

const Header = () => {
    const { data: session, status } = useSession();
    const [totalUniqueItems, setTotalUniqueItems] = useState<number | null>(null)
    const { totalUniqueItems: uniqueItems, metadata } = useCart()
    const userTotalItems = (typeof window !== 'undefined') && localStorage.getItem('user-total-items')

    useEffect(() => {
        uniqueItems && setTotalUniqueItems(uniqueItems)
    }, [uniqueItems])

    
    return (
        <header>
            <div className='px-2 md:px-10  w-full bg-[#ffffff3c] shadow top-0 py-[5px] fixed backdrop-blur-[15px] z-[99]'>
                <div className='flex justify-between items-center h-full relative'>
                    <Link href='/' className='relative w-[75px] h-[45px] border-r border-gray-200'>
                        <Image
                            src='/images/logo.png'
                            alt={'logo'}
                            fill
                            className='object-contain'
                        />
                    </Link>
                    <div>
                        <motion.div layout='position' className='flex ml-auto text-xs font-bold space-x-3 text-[#ccc] tracking-wide'>
                            {/* Cart */}
                            <Link href={'/cart'}>
                                <Badge classNames={{ badge: 'font-light' }} variant='shadow' content={(status === 'authenticated') ? (userTotalItems > 8 ? '8+' : userTotalItems) : totalUniqueItems} color="secondary" shape='circle'>
                                    <div className='flex items-center'>
                                        <svg aria-hidden="true" className="pre-nav-design-icon" focusable="false" viewBox="0 0 24 24" role="img" width="26px" height="26px" fill="none"><path stroke="black" strokeWidth="1" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5"></path></svg>
                                    </div>
                                </Badge>
                            </Link>
                            {/* Wishlist */}
                            <div className='flex items-center  '>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="black" width="26px" height="26px">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>
                            </div>
                            {
                                // user profile
                                status === 'loading' ? (
                                    <div className='flex items-center'>
                                        <Spinner
                                            classNames={{
                                                circle1: "  border-[1px] ",
                                                circle2: "  border-[1px] text-black",
                                            }}
                                            color='current'
                                        />
                                    </div>
                                ) :
                                    (
                                        status === 'authenticated' ? (
                                            <AuthDropdown />
                                        ) : (

                                            <Link href='/auth/signin' className='flex items-center ' >
                                                <User2 width={26} height={26} stroke='black' className='stroke-[1px] ' />
                                            </Link>
                                        )
                                    )
                            }
                        </motion.div>
                    </div>

                </div>
            </div>
        </header>
    )
}



export default Header