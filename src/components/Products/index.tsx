import React, { useEffect, useState, useRef } from 'react'
import Product from '../Product'
import useProducts from '@/hooks/useProducts'
import Filters from '../Filters'
import { motion, AnimatePresence } from 'framer-motion'
import { Drawer, Radio, Space } from 'antd';
import InfiniteScroll from 'react-infinite-scroll-component';
import { RotatingLines, InfinitySpin } from 'react-loader-spinner'
import { useCreateQueryString } from '@/hooks/useCreateQuery'
import { usePathname, useRouter } from 'next/navigation'
import { CartTItem, APITCart, ImageTData, InventoryTData, ProductTData, CartTAPI, } from '@/types/shop'
import Image from 'next/image'
import RatingStars from 'react-rating-stars-component'
import { url } from 'inspector'
import { XIcon, FilterIcon } from 'lucide-react'
import type { Metadata } from 'next'
import { Card, Skeleton } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { useCartAPI } from '@/hooks/useCartAPI'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import { useCart } from 'react-use-cart'
import { useWishlist } from '@/hooks/useWishlist'
import Link from 'next/link'



const Products = () => {
    const { setCartMetadata } = useCart()

    const { getCart } = useCartAPI()
    const { getWishlist } = useWishlist()
    const { data: cart, isLoading: cartLoading } = getCart
    const { data: wishlist, isLoading: wishlistLoading } = getWishlist


    const { data: session, status } = useSession()
    //? useInfiniteQuery has pages in its data object

    const [switchToSearchData, setSwitchToSearchData] = useState(false)

    const { params, hasQuery, setQueryString } = useCreateQueryString()
    const pathname = usePathname()
    const router = useRouter()
    const [search, setSearch] = useState<string | null>('')
    const searchInput = useRef<HTMLInputElement>(null)

    const { data, isError, isLoading, isFetching, fetchNextPage, hasNextPage } = useProducts(switchToSearchData, search as string)

    const products = data?.pages?.flatMap((page) => page.data?.results);
    const searchData = data?.pages?.flatMap((page) => page.data?.results);
    const searchDataForContainer = data?.pages?.flatMap((page) => page.searchResults?.results);

    useEffect(() => {
        const urlSearchQuery = search
        if (search) {
            router.push(`${pathname}?${setQueryString('search', search)}`)
        }

    }, [search])

    useEffect(() => {
        if (!search) {
            params.delete('search')
            router.push(`${pathname}?${params.toString()}`)
        }

    }, [search])




    // useEffect(() => {
    //     if (cartId) {
    //         const cartItems = getCartItems.refetch({
    //             queryKey: ['/api/cart/items/', cartId]
    //         })
    //         cartItems.then((res) => {
    //             console.log('NEW CART ITEMS', res.data)
    //         })
    //     }

    // }, [cartId])



    // INITIALIZE CART
    useEffect(() => {
        if (!cartLoading && cart) {
            console.log('INITIALIZING CART...', cart)
            setCartMetadata({
                totalUserItems: cart?.items_count
            })
        }
    }, [cartLoading, cart])

    // INITIALIZE WISHLIST
    useEffect(() => {
        if (!wishlistLoading && wishlist) {
            console.log('INITIALIZING.WISHLIST..', wishlist)
            localStorage.setItem('wishlistId', wishlist?.id)
        }
    }, [wishlist, wishlistLoading])



    const [showFilters, setShowFilters] = useState(false)
    const [duration, setDuration] = useState(0.3)
    const [showMobileFilters, setShowMobileFilters] = useState(false)

    const drawerCloseIcon = (
        <div className='p-2'>
            <XIcon size={20} />
        </div>
    )


    const toggleFilter = () => {
        setShowFilters(!showFilters)
    }
    const toggleMobileFilter = () => {
        setShowMobileFilters(!showMobileFilters)
    }
    // ! when setting a property say x on initial, make sure to set the same for open and exit otherwise the animation might have problems 
    const filtersVariant = {
        initial: {
            maxWidth: '0%',
            visibility: 'hidden'

        },
        open: {
            maxWidth: '20%',
            visibility: 'visible'

        }
    }


    function renderProducts() {
        if (switchToSearchData === true) {
            return (
                !isFetching || !isLoading &&
                    searchData && searchData.length > 0 ? searchData?.map((product) => (
                        <Product key={product?.id} product={product as ProductTData} duration={duration} />
                    )) : <div className='text-center text-2xl font-bold'>No search results</div>
            )
        }

        if (switchToSearchData === false) {

            if (products && products.length === 0) {
                return (
                    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className='text-center text-lg font-extralight border border-gray-300 rounded-lg bg-slate p-3'>No Products Available</motion.div>
                )
            }

            return (
                products?.length && products?.map((product) => (
                    <Product key={product?.id} product={product as ProductTData} duration={duration} />
                ))
            )
        }

    }

    const handleSwitchData = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        if (searchDataForContainer && searchDataForContainer.length === 0) return
        if (!search) return
        router.push(`${pathname}?${setQueryString('search', search)}`)
        const urlSearchQuery = params.has('search')
        if (urlSearchQuery) {
            setSwitchToSearchData(true)
        } else {
            setSwitchToSearchData(false)
        }
        //empty the search input ref value to empty
        searchInput.current!.value = ''
    }

    const handleClearFilters = () => {
        router.push('/')
        setSearch('')
        searchInput.current!.value = ''
        if (switchToSearchData) setSwitchToSearchData(false)
    }





    return (
        <>

            <div className=' flex  md:space-x-3 justify-between items-center w-full mt-20   my-6 '>
                <div className='md:px-3 flex  '>
                    <button
                        onClick={toggleFilter}
                        className='hidden  relative md:flex space-x-1 border  px-3 py-1 md:border-none md:py-0 md:px-0 rounded-[10px] '
                    >
                        <svg aria-hidden="true" className="icon-filter-ds" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" strokeWidth="1.3" d="M21 8.25H10m-5.25 0H3"></path><path stroke="currentColor" strokeWidth="1.5" d="M7.5 6v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clip-rule="evenodd"></path><path stroke="currentColor" strokeWidth="1.5" d="M3 15.75h10.75m5 0H21"></path><path stroke="currentColor" strokeWidth="1.5" d="M16.5 13.5v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clip-rule="evenodd"></path></svg>

                    </button>

                    {/* Mobile Filter Button */}

                    {
                        search ? null :
                            <button
                                onClick={toggleMobileFilter}
                                className='flex md:hidden relative ml-1  md:space-x-1 border   md:border-none md:py-0 md:px-0 rounded-[10px] '
                            >
                                <div className='my-auto'>
                                    <svg aria-hidden="true" className="icon-filter-ds" focusable="false" viewBox="0 0 24 24" role="img" width="24px" height="24px" fill="none"><path stroke="currentColor" strokeWidth="1.3" d="M21 8.25H10m-5.25 0H3"></path><path stroke="currentColor" strokeWidth="1.5" d="M7.5 6v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clip-rule="evenodd"></path><path stroke="currentColor" strokeWidth="1.5" d="M3 15.75h10.75m5 0H21"></path><path stroke="currentColor" strokeWidth="1.5" d="M16.5 13.5v0a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" clip-rule="evenodd"></path></svg>
                                </div>
                            </button>
                    }
                    {
                        hasQuery && (
                            <motion.button
                                initial={{
                                    opacity: 0,
                                    x: -30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0

                                }}
                                onClick={handleClearFilters}

                                className='bg-black hidden md:block text-white text-[8px] md:text-[10px] italic tracking-tighter uppercase ml-8 p-1 '>
                                Clear filters
                            </motion.button>
                        )
                    }
                    {
                        switchToSearchData && (
                            <motion.button
                                initial={{
                                    opacity: 0,
                                    x: 30
                                }}
                                whileInView={{
                                    opacity: 1,
                                    x: 0

                                }}

                                className='text-gray-500 text-md  mono tracking-tighter capitalize ml-8 p-1 '>
                                {`Results for "${search}"`}
                            </motion.button>
                        )
                    }
                </div>
                {/* SEARCH INPUT */}
                <div className={`relative  md:px-3 ${search ? 'mx-auto' : 'mr-1'}`}>
                    <form onSubmit={handleSwitchData}>
                        <input
                            className="bg-gray-100  peer  w-[95vw]  md:w-[80vw] text-sm tracking-normal  placeholder-shown:w-72 placeholder-ring placeholder-shown:text-xs  pl-12   hover:bg-[#e5e5e5]  text-gray-800 rounded-[10px] h-[2rem]   transition-all duration-300 focus:outline-none focus:bg-[#e5e5e5] relative"
                            type="text"
                            placeholder="Search"
                            onChange={e => setSearch(e.target.value)}
                            ref={searchInput}
                        />
                        {/* Search icon */}
                        {
                            (isLoading) && (
                                <div className='absolute overflow-hidden  bottom-0 -left-8 '>
                                    <Spinner
                                        classNames={{
                                            circle1: "  border-[1px] ",
                                            circle2: "  border-[1px] text-black",
                                        }}
                                        size='sm' color="current"
                                    />
                                </div>

                            )
                        }
                        <button type='submit' className="cursor-pointer transition-all absolute bottom-0  flex items-center  hover:bg-black bg-gray-300 rounded-[10px] h-[33px] w-[33px] p-1 stroke-slate-900 hover:stroke-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.3">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>
                        </button>

                        {/* Search Result Container */}

                        <motion.div
                            transition={{
                                type: 'spring',
                                mass: 0.2,
                                damping: 25,
                                stiffness: 100,
                                duration: .55
                            }}
                            className={(!search && 'border-none ') + " backdrop-blur-[15px] border-b border-l border-r border-gray-300 shadow-md md:w-[80vw]  pb-1 peer-placeholder-shown:pb-0  bg-[#ffffff3f]  w-[95vw] peer-placeholder-shown:w-72 h-[40vh] peer-placeholder-shown:h-0   absolute top-10   transition-all duration-400  z-[81] md:right-[12px] rounded-[10px] overflow-auto scrollbar scrollbar-w-[4px] scrollbar-thumb-gray-600 scrollbar-thumb-rounded-[10px]"}>
                            {


                                <div className='flex flex-col'>
                                    {
                                        isFetching ? (
                                            <div className='ml-1 mt-1'>
                                                <Spinner
                                                    classNames={{
                                                        circle1: "  border-[1px] ",
                                                        circle2: "  border-[1px] text-black",
                                                    }}
                                                    size='sm'
                                                    color="current"
                                                />
                                            </div>
                                        ) :

                                            (searchDataForContainer && searchDataForContainer.length === 0) ?
                                                <h1 className='tracking-tighter text-[13px] md:text-sm text-black absolute top-2 left-2'>
                                                    No results for
                                                    {`  "${search}"`}
                                                </h1>
                                                :
                                                searchDataForContainer?.map((product, index) => {
                                                    const defaultInventoryProduct = product?.inventory?.find((inv) => inv.is_default == true) || product?.inventory[0];
                                                    const featureImage = defaultInventoryProduct?.images?.find((img) => img.is_feature === true) || defaultInventoryProduct?.images[0];
                                                    return (
                                                        <Link key={index} href={`/product/${product?.slug}`}>
                                                            <motion.div
                                                                initial={{
                                                                    opacity: 0,
                                                                    y: 15,
                                                                    scale: 0.99
                                                                }}
                                                                whileInView={{
                                                                    opacity: 1,
                                                                    y: 0,
                                                                    scale: 1
                                                                }}
                                                                viewport={{
                                                                    once: false
                                                                }}
                                                                transition={{
                                                                    type: 'spring',
                                                                    mass: 0.1,
                                                                    stiffness: 45,
                                                                    damping: 5,
                                                                    duration: .12
                                                                }}
                                                                className='flex mt-[4px] rounded-[10px] h-[60px] snap-center mx-1 bg-[#2a292941] max-w-lg relative'
                                                            >
                                                                <div className='flex flex-row items-start space-x-1  h-full w-full'>
                                                                    <div className='h-[60px] w-[60px] relative'>
                                                                        <Image
                                                                            src={featureImage?.image || '/images/default.png'}
                                                                            alt={product?.name as string}
                                                                            fill
                                                                            className='object-cover rounded-bl-[10px] rounded-tl-[10px] h-full w-full'
                                                                        />
                                                                    </div>
                                                                    <div className='tracking-tighter flex '>
                                                                        <div className='w-fit '>
                                                                            <h1 className='text-[14px]  text-gray-800'>{product?.name}</h1>
                                                                            <span className='text-[11px] text-gray-600'>&#x20B5; {product?.min_price}</span>
                                                                        </div>
                                                                        <div className='absolute right-4 bottom-4 '>
                                                                            <RatingStars
                                                                                count={5}
                                                                                value={product?.avg_rating as number}
                                                                                size={15}
                                                                                edit={false}
                                                                                activeColor='black'
                                                                                color={'#e4e4e4'}
                                                                            />
                                                                        </div>

                                                                    </div>
                                                                </div>
                                                            </motion.div>
                                                        </Link>
                                                    )
                                                })


                                    }





                                </div>

                            }
                        </motion.div>
                    </form>


                </div>




            </div >

            <div className='flex w-full h-full  relative md:flex-row flex-col '>

                {
                    //! to create the shrink and scale effect,
                    //! hide the filters and make the product
                    //! Col occupy 12 cols
                    /* Left Side - Filters */
                }

                <>

                    <motion.div
                        variants={filtersVariant}
                        className={`md:max-w-[20%] hidden md:block lg:space-y-3 custom-scrollbar h-screen sticky left-0 top-0 ${showFilters && 'mr-2'} `}
                        initial='initial'
                        animate={showFilters ? 'open' : 'initial'}
                        exit='initial'
                        transition={{
                            ease: 'easeInOut',
                            duration: duration

                        }}

                    >
                        <Filters />
                    </motion.div>


                </>


                {/* Responsive filters */}
                <Drawer
                    placement={'bottom'}
                    closable={true}
                    onClose={toggleMobileFilter}
                    open={showMobileFilters}
                    key={'bottom'}
                    className='md:hidden '
                    height={'100%'}
                    closeIcon={drawerCloseIcon}

                >
                    {
                        hasQuery && (
                            <motion.button
                                initial={{
                                    x: -30
                                }}
                                whileInView={{
                                    x: 0
                                }}
                                onClick={() => router.push(`${pathname}`)}

                                className='bg-black text-white text-[9px] md:hidden relative bottom-6 md:text-[10px] italic tracking-tighter uppercase ml-8 p-1 '>
                                Clear filters
                            </motion.button>
                        )
                    }
                    <Filters />
                </Drawer>




                {/* Right Side - Products */}
                <InfiniteScroll
                    dataLength={products?.length as number || 0}
                    next={() => fetchNextPage()}
                    hasMore={hasNextPage as boolean}

                    loader={
                        <h4>
                            {
                                isFetching ? (
                                    <div className=' mx-auto w-[100px] mb-5 relative right-7 '>
                                        <InfinitySpin
                                            width='80'
                                            color="black"

                                        />
                                    </div>
                                ) : null}
                        </h4>
                    }



                >
                    <div

                        className='mx-auto relative md:px-10 px-1 w-full h-full flex flex-col sm:grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 '
                    >
                        {renderProducts()}

                    </div>
                </InfiniteScroll>
            </div>
        </>




    )
}
// ${showFilters ? '  p-4  ' : ' p-0  md:mx-10  mx-[1px]   '}`

export default Products