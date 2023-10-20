

import Image from 'next/image'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import useProductDetail from '@/hooks/useProductDetail'
import CustomImageGallery from '../CustomImageGallery'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import {
    ImageTData,
    InventoryTData,
    SpecificationTData,
    CartTItem,
    CartTAPIItem,
    ProductTData
} from '@/types/shop'
import RatingStar from 'react-rating-stars-component'
import QuantityInput from './QuantityInput'
import { CreditCardIcon, TruckIcon, ShoppingCart, ChevronRight } from 'lucide-react'
import { Breadcrumb } from 'antd';
import CustomTab from './CustomTab'
import { Spinner, RadioGroup, Button } from '@nextui-org/react'
import { CustomRadio } from './CustomRadio'
import chroma from "chroma-js";
import HeartIcon from './HeartIcon'
import { Tooltip, User } from "@nextui-org/react";
import RecommendedProducts from './RecommendedProducts'
import { useCart } from 'react-use-cart'
import { color } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCartAPI } from '@/hooks/useCartAPI'
import { useSession } from 'next-auth/react'
import { useQueryClient } from 'react-query'
import { useWishlist } from '@/hooks/useWishlist'




const ProductDetail = () => {
    const queryClient = useQueryClient()
    const { addItem, setCartMetadata } = useCart()
    const { addCartItemMutation, getCart } = useCartAPI()
    const { data: cart, isLoading: cartLoading } = getCart
    const { addWishlistItemMutation } = useWishlist()
    const { data: session, status } = useSession()
    const imagesContainerRef = useRef<HTMLDivElement>(null);

    const params = useParams()
    const { product_slug } = params
    const { data: product, inventories, defaultInventoryProduct, isLoading } = useProductDetail({ slug: product_slug })


    const [selectedInventory, setSelectedInventory] = useState<InventoryTData | null>(null)
    const [selectedInventoryImages, setSelectedInventoryImages] = useState<ImageTData[] | null | undefined>([])
    const [selectedInventoryIndex, setSelectedInventoryIndex] = useState(0)
    const [scrollPosition, setScrollPosition] = useState(0);
    const [quantityValue, setQuantityValue] = useState<number>(1);



    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)

    //? check if product has size or color attribute
    //todo there might be order attribute besides size and color like memory card quanity 
    //todo so handle that by dynamically getting the attribute name 
    const hasSizeAttribute = selectedInventory?.specification?.some(
        (item) => item.product_attribute.name === 'size'
    )
    const hasColorAttribute = selectedInventory?.specification?.some(
        (item) => item.product_attribute.name === 'color'
    );

    //? get only colors of the product
    const productColors = selectedInventory?.specification?.filter(spec => spec?.product_attribute.name === 'color')
    const productSizes = selectedInventory?.specification?.filter(spec => spec?.product_attribute.name === 'size')
    const productWeight = selectedInventory?.specification?.filter(spec => spec?.product_attribute.name === 'weight')[0]?.attribute_value // todo get rid of weight
    const [selectedAttributes, setSelectedAttributes] = useState<SpecificationTData[]>([])



    const breadcrumbItems = [
        { label: 'Home', link: '/' },
        { label: `${product?.name}`, link: null } // Current page without link
    ];


    useEffect(() => {
        setSelectedInventory(defaultInventoryProduct)
        setSelectedInventoryImages(defaultInventoryProduct?.images)

    }, [defaultInventoryProduct])

    const invalidateCart = async () => {
        // Trigger a refetch of the cart data
        await queryClient.invalidateQueries('/api/cart/')

    };

    useEffect(() => {
        if (addCartItemMutation.isSuccess) {
            toast.success(`Product: ${product?.name} - ${selectedColor ?? ''} - ${selectedSize ?? ''} added to your cart`, {
                className: ' text-[11px] p-0 ', style: {
                    color: 'white',
                    background: 'purple'
                },
                icon: (
                    <svg aria-hidden="true" className="pre-nav-design-icon" focusable="false" viewBox="0 0 24 24" role="img" width="20px" height="20px" fill="none"><path stroke="white" strokeWidth="1" d="M8.25 8.25V6a2.25 2.25 0 012.25-2.25h3a2.25 2.25 0 110 4.5H3.75v8.25a3.75 3.75 0 003.75 3.75h9a3.75 3.75 0 003.75-3.75V8.25H17.5"></path></svg>
                ),
                duration: 2000
            })
            invalidateCart()

        }

    }, [addCartItemMutation.isSuccess])

    //? this is to re render the cart total items in the header case of the localStorage

    useEffect(() => {
        if (cart && !cartLoading) {
            setCartMetadata({
                totalUserItems: cart?.items_count
            })
        }
    }, [cart, cartLoading])
    const invalidateQuery = async () => {
        await queryClient.invalidateQueries({
            queryKey: '/api/products/:slug/',
        })
    }

    useEffect(() => {
        if (addWishlistItemMutation.isSuccess) {
            toast.success(`${product?.name} ${addWishlistItemMutation.data?.product ? 'added to your wishlist' : 'removed from your wishlist'}`, {
                className: ' text-[11px] p-0 ', style: {
                    color: 'white',
                    background: '#d21e7b'
                },
                icon: <HeartIcon filled={true} size={20} />,

                duration: 2000
            })
            invalidateQuery()
            console.log('WISHLIST MUTATION', addWishlistItemMutation)
        }


    }, [addWishlistItemMutation.isSuccess])

    useEffect(() => {
        if (!cartLoading && cart) {
            console.log('REFRESHING LOCAL STORAGE CART...', cart)
            //? doing this to refresh the user-total-items in localstorage to be rendered in header
            localStorage.setItem('Refresh Storage', 'true')
        }
    }, [cartLoading, cart])



    const handleAttributeSelection = (spec: SpecificationTData) => {
        const newSelectedAttributes = [...selectedAttributes]
        // checking if maybe a color attribute is already selected if yes then replace with new selected color 
        const index = newSelectedAttributes.findIndex(item => item?.product_attribute?.name === spec?.product_attribute?.name)

        if (index === -1) {
            newSelectedAttributes.push(spec)
        } else {
            newSelectedAttributes[index] = spec
        }

        setSelectedAttributes(newSelectedAttributes)
    }

    const validateAttributeSelection = () => {
        if (hasColorAttribute && !selectedColor) {
            toast.error('Please select a color', {
                style: {
                    color: 'white',
                    backgroundColor: 'black',
                    fontSize: '12px'
                }
            })
            return false
        }

        if (hasSizeAttribute && !selectedSize) {
            toast.error('Please select a size', {
                style: {
                    color: 'white',
                    backgroundColor: 'black',
                    fontSize: '12px'
                }
            })
            return false
        }
        return true
    }

    const onBuy = () => {
        validateAttributeSelection()
        console.log('---Purchased---')
    }

    const updateCart = async () => {
        const attributesIds = selectedAttributes.map(attr => attr.id)

        if (session?.user) {
            const isValid = validateAttributeSelection()
            if (isValid) {
                await addCartItemMutation.mutateAsync({
                    cartItem: {
                        product_inventory: selectedInventory?.id as number,
                        quantity: quantityValue,
                        cart: localStorage.getItem('cartId') as string,
                        attribute_values: attributesIds as unknown as SpecificationTData[],
                        unit_price: selectedInventory?.retail_price

                        // cart: localStorage.getItem('cartId') as string,
                    },
                })

            }

        } else {
            const isValid = validateAttributeSelection()

            if (isValid) {
                addItem({
                    id: '9399294',
                    price: selectedInventory?.retail_price as number,
                    quantity: quantityValue as number,
                    name: product?.name as string,
                    product: {
                        id: product?.id as number,
                        inventory: {
                            id: selectedInventory?.id as number,
                            specification: selectedAttributes as SpecificationTData[]
                        }
                    }
                }, quantityValue)
            }
        }
    }

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



    const handleAddToWishlist = async () => {
        if (status === 'authenticated') {
            const productId = product?.id as number
            await addWishlistItemMutation.mutateAsync(productId)
            await queryClient.invalidateQueries({
                queryKey: '/api/products/'
            })

        } else {
            toast.error('Sign In to add this product to wishlist', { className: ' text-[11px] p-0 ' })

        }

    }






    return (
        <div className='mb-14 w-full h-full tracking-tighter mt-16'>
            <main className='relative top-4 px-2 md:px-10'>
                <div className='mb-3'>
                    <Breadcrumb separator={<ChevronRight strokeWidth={'1'} />}>
                        {breadcrumbItems.map((item, index) => (
                            <Breadcrumb.Item key={index}>
                                {item.link ? <Link href={item.link}>{item.label}</Link> : item.label}
                            </Breadcrumb.Item>
                        ))}
                    </Breadcrumb>
                </div>


                <div className='flex space-x-3 flex-col md:flex-row bg-slate-50'>
                    {/* THREE COLUMNS */}
                    <section className='relative flex-1 mb-1 md:mb-0 mx-auto'>
                        <CustomImageGallery
                            images={selectedInventoryImages}
                        />
                    </section>

                    <section className=' flex-[2]'>
                        <div className='w-[50%] mx-auto md:mx-0 md:w-[14rem]   relative'>

                            {/* <div onClick={() => handlePrevClick()} className='absolute left-0  -translate-y-1/2 top-1/2 '>
                                <button>
                                    <LeftOutlined className='text-black' />
                                </button>
                            </div>
                            <div onClick={() => handleNextClick()} className='absolute right-0  -translate-y-1/2 top-1/2 '>
                                <button>
                                    <RightOutlined className='text-black' />
                                </button>
                            </div> */}
                            <div ref={imagesContainerRef} style={{ transform: `translateX(-${scrollPosition}px)` }} className=' p-1 relative flex  overflow-x-scroll  scrollbar  scrollbar-thumb-gray-500  scrollbar-thumb-rounded-full scrollbar-h-[2px] pb-2 scroll-smooth'>

                                {inventories?.length > 1 && inventories?.map((inv, index) => {
                                    return (
                                        <div
                                            key={inv?.id}
                                            onClick={() => {
                                                setSelectedInventoryImages(inv?.images)
                                                setSelectedInventoryIndex(index)
                                                setSelectedInventory(inv)
                                            }}
                                            className={'  duration-200 object-fit p-6   transition-all ease-in-out  my-auto relative rounded cursor-pointer mr-1 hover:brightness-90 bg-white ' + (index === selectedInventoryIndex && ' brightness-50 ')}
                                        >
                                            <Image
                                                src={(inv?.images?.find(img => img?.is_feature === true)?.image || inv?.images?.[0]?.image) || '/images/default.png'}
                                                fill
                                                alt={inv?.images?.[0]?.alt_text}
                                                className='object-center object-cover rounded'
                                            />
                                        </div>
                                    )
                                })}

                            </div>
                        </div>

                        <div className='mt-4 flex flex-col space-y-2'>
                            <div className='text-gray-500 '>
                                {
                                    productWeight && (
                                        <h1 className=' text-xs capitalize font-semibold'>
                                            Weight: {productWeight}
                                        </h1>

                                    )
                                }

                                <h1 className='mb-1 text-xs capitalize font-normal'>
                                    Brand: {product?.brand?.name}
                                </h1>

                                <h1 className='text-green-700 text-xs capitalize font-normal'>
                                    324 Sold
                                </h1>


                                <h1 className='text-[17px] font-sans text-gray-700 font-semibold  capitalize'>
                                    {product?.name}
                                </h1>

                            </div>

                            <div className='text-gray-700 '>
                                <h1 className='space-x-1 '>
                                    {/* ghana cedis symbol */}
                                    <span className='text-xs'>&#x20B5;</span>
                                    <span className='text-lg font-bold'>{selectedInventory?.retail_price}</span>

                                </h1>
                            </div>

                        </div>

                        <div className='flex items-center'>
                            <span>
                                <RatingStar
                                    value={1}
                                    count={1}
                                    color='rgb(202 138 4/1)'
                                    size={18}
                                />
                            </span>
                            <span className='text-[11px] text-gray-400 font-light ml-[2px] top-[1px] relative'>
                                {product?.avg_rating}
                            </span>
                        </div>

                        <article>

                            {
                                hasColorAttribute && (
                                    <div className=' mb-2'>
                                        <div className='flex'>
                                            {
                                                productColors?.map((spec, index) => {
                                                    const bgColor = chroma(spec?.attribute_value).desaturate(3)
                                                    return (
                                                        <Tooltip key={index} content={spec?.description} className='text-[10px] rounded-[10px] capitalize' >
                                                            <button
                                                                aria-label={spec?.attribute_value}
                                                                style={{ backgroundColor: bgColor as unknown as string }}
                                                                onClick={() => {
                                                                    handleAttributeSelection(spec);
                                                                    setSelectedColor(spec?.attribute_value)
                                                                }}
                                                                className={` relative appearance-none outline-none rounded-full transition-all duration-700  p-1 mr-2 w-6 h-4  ${selectedColor === spec?.attribute_value && 'w-7 h-7 '}`}
                                                            />
                                                        </Tooltip>
                                                    )
                                                })
                                            }
                                        </div>
                                        <span className='text-xs text-gray-400'>{`Available Color(s)`}</span>
                                    </div>
                                )
                            }


                            {

                                hasSizeAttribute && (
                                    <RadioGroup className='' orientation='horizontal' color='secondary' size='sm' description="Available size(s)">
                                        {
                                            productSizes?.map((spec, index) => (
                                                <div key={index}>
                                                    <CustomRadio onClick={() => {
                                                        handleAttributeSelection(spec)
                                                        setSelectedSize(spec?.attribute_value)
                                                    }}
                                                        value={spec?.attribute_value}
                                                        description={spec?.attribute_value}
                                                    />
                                                </div>
                                            ))
                                        }
                                    </RadioGroup>
                                )
                            }
                        </article>
                    </section>

                    <section className='flex-1  capitalize bg-white font-sans'>
                        <div className='w-full h-full py-4 space-y-1 border-l border-gray-200 rounded-[10px] flex flex-col   px-8'>
                            <span className=' '>set quantity</span>
                            <div>
                                <QuantityInput value={quantityValue} setValue={setQuantityValue} />
                            </div>
                            <h1 className='text-green-700 text-xs capitalize font-semibold'>
                                Stock: 324
                            </h1>

                            <div className='text-sm flex  space-x-1  '>
                                {/* ghana cedis symbol */}
                                <div className='text-gray-500 flex'>
                                    <CreditCardIcon strokeWidth={1} className='w-4 h-4 mr-1' />
                                    <span className='font-normal'> shipping cost: </span>
                                </div>
                                <div className='text-gray-700 font-bold'>
                                    <span>&#x20B5;</span>
                                    <span>20</span>
                                </div>
                            </div>

                            <div className='text-sm flex  space-x-1 '>
                                {/* ghana cedis symbol */}
                                <div className='text-gray-500 flex'>
                                    <TruckIcon strokeWidth={1} className='w-4 h-4 mr-1' />
                                    <span className='font-normal'> estimated delivery: </span>
                                </div>
                                <span className='text-gray-700 font-bold'>3 days</span>
                            </div>

                            <div className=' w-full space-y-2'>
                                <div className='text-[13px]  font-bold flex  space-x-1 '>
                                    {/* ghana cedis symbol */}
                                    <div className='text-gray-700 uppercase flex'>
                                        <span> sub total: </span>
                                    </div>
                                    <div className=''>
                                        <span>&#x20B5;</span>
                                        <span>20</span>
                                    </div>

                                </div>

                                <Button onClick={() => onBuy()} className='w-full text-white p-2 text-[12px] bg-gray-800' >
                                    Buy Now
                                </Button>

                                <Button
                                    isLoading={addCartItemMutation.isLoading}
                                    onClick={() => updateCart()}
                                    endContent={<ShoppingCart className='w-[18px] h-[18px]' />}
                                    variant='bordered'
                                    className='w-full p-2 text-[12px] border border-black'
                                >
                                    Add to Cart
                                </Button>

                                <Button className='rounded-full bg-transparent' isLoading={addWishlistItemMutation.isLoading} onClick={handleAddToWishlist} isIconOnly aria-label="Like">
                                    {
                                        !addWishlistItemMutation.isLoading && <HeartIcon fill={((addWishlistItemMutation?.data?.product) || (product?.is_in_wishlist)) ? '#E87C95' : 'white'} filled={((addWishlistItemMutation?.data?.product) || (product?.is_in_wishlist)) ? true : false} />
                                    }
                                </Button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Reviews and Recommendation */}
                <section className="flex w-full flex-col  justify-center items-center">
                    <CustomTab product={product} />
                </section>
                <RecommendedProducts />
            </main>


        </div>
    )
}

export default ProductDetail