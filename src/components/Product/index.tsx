import Link from 'next/link'
import React, { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import RatingStars from 'react-rating-stars-component'
import { motion, AnimatePresence } from 'framer-motion'
import { ProductTData, InventoryTData, ImageTData } from '@/types/shop';
import { features } from 'process'
import { ShoppingCart } from 'lucide-react'
import { CartProvider, useCart } from "react-use-cart";
import AddToCartModal from './AddToCartModal'
import { Button } from '@nextui-org/react'
import HeartIcon from '@/components/ProductDetail/HeartIcon'
import { useWishlist } from '@/hooks/useWishlist'
import { toast } from 'react-hot-toast'
import useProducts from '@/hooks/useProducts'
import { useQueryClient } from 'react-query'
import { useSession } from 'next-auth/react'



type Props = {
    product: ProductTData;
    duration: number,
}

const Product = ({ product, duration }: Props) => {
    const { status } = useSession()
    const { addItem, items } = useCart()
    const [invImgIndex, setInvImgIndex] = useState<number | null>(null)
    const [mouseOverImage, setMouseOverImage] = useState(false)
    const [inventoryImages, setInventoryImages] = useState<ImageTData[]>([])
    const [featureImage, setFeatureImage] = useState<ImageTData>({} as ImageTData)
    const [defaultInventoryProduct, setDefaultInventoryProduct] = useState<InventoryTData>({} as InventoryTData)
    const { addWishlistItemMutation } = useWishlist()


    useEffect(() => {
        const defaultInventoryProduct: InventoryTData = product?.inventory?.find(inv => inv.is_default == true) || product?.inventory[0];

        const featureImage = defaultInventoryProduct?.images?.find((img) => img.is_feature === true) || defaultInventoryProduct?.images[0];
        if (defaultInventoryProduct) {
            setInventoryImages(defaultInventoryProduct?.images)
            setFeatureImage(featureImage)
            setDefaultInventoryProduct(defaultInventoryProduct)
        }
    }, [])




    function handleMouseOverImage() {
        setMouseOverImage(true)
    }
    function handleMouseLeaveImage() {
        setMouseOverImage(false)
    }
    const handleMouseOverInvImg = useCallback((index: number, image: ImageTData) => {
        //! we do this to set the index only if its not already the current index 
        if (index !== invImgIndex) {
            setInvImgIndex(index)
        }
        setFeatureImage(image)
    }, [invImgIndex])

    function handleMouseLeaveInvImg() {
        setInvImgIndex(null)
    }

    const queryClient = useQueryClient()
    const handleAddToWishlist = async () => {
        if (status === 'authenticated') {
            const productId = product?.id as number
            await addWishlistItemMutation.mutateAsync(productId)
        }else{
            toast.error('Sign In to add this product to wishlist', { className: ' text-[11px] p-0 ' })

        }
    }

    const invalidateQuery = async () => {
        await queryClient.invalidateQueries({
            queryKey: '/api/products/',
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
        }


    }, [addWishlistItemMutation.isSuccess])



    return (
        <motion.div layout transition={{ duration: duration, ease: 'easeInOut' }} className='mb-6 px-1 sm:p-0' >
            <div
                onMouseOver={handleMouseOverImage}
                onMouseLeave={handleMouseLeaveImage}
                onMouseOut={handleMouseLeaveImage}
                className=' w-full mx-auto rounded-lg overflow-hidden  bg-gray-100 shadow-none  border-none ' >

                {
                    // todo: on hover on the card, show inventory images where the product title is
                    //todo: on hover on the inventory image, show the image in the feature image
                    //? using onMouseOver because i want to show the inventory images on hover of the card and its children
                }

                {
                    /*
                    .//!the div around next image has to have relative cause "fill" is absolute
                        .//! using AnimatePresence to animate when image is removed from tree
                     */
                }
                <motion.div onTouchStart={() => setMouseOverImage(true)} className='h-80 w-full relative transition duration-200 ease-in-out'>
                    <Link href={`/product/${product?.slug}`} className='transition-all rounded-sm duration-1000 ease-in-out'>
                        <Image
                            src={featureImage?.image || '/images/default.png'}
                            alt={product?.name}
                            fill
                            className={'min-w-full rounded-sm object-fill hover:brightness-90 hover:scale-[0.98] transition-all duration-400 ease-in-out hover:rounded-lg' + (mouseOverImage && ' brightness-90 scale-[0.98] rounded-lg ')}
                        />

                    </Link>
                    {
                        mouseOverImage && (

                            <motion.div animate={{ opacity: 1 }} transition={{ duration: 1, type: 'just' }} className=' p-[2px] opacity-0 right-4 backdrop-blur-[15px]  bg-[#6b6b6b49] top-5 md:top-2 absolute gap-2 flex flex-col shadow-xl   rounded-lg'>
                                {/* Add to wishlist   */}
                                <motion.div initial={{ y: -15, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} >
                                    <Button onClick={handleAddToWishlist} isLoading={addWishlistItemMutation.isLoading} className='p-2 rounded-full' isIconOnly color="danger" aria-label="Like">
                                        {
                                            !addWishlistItemMutation.isLoading && <HeartIcon fill={((addWishlistItemMutation?.data?.product) || (product?.is_in_wishlist)) ? '#E87C95' : '#ccc'} filled={((addWishlistItemMutation?.data?.product) || (product?.is_in_wishlist)) ? true : false} />
                                        }
                                    </Button>
                                </motion.div>

                                {/* Add to cart */}
                                <motion.div
                                    initial={{ y: 15, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    className='rounded-full'
                                >
                                    <AddToCartModal defaultProductInventory={defaultInventoryProduct} product={product} />
                                </motion.div>
                            </motion.div>

                        )
                    }
                </motion.div>


                <div className='h-[120px] w-[500px] relative'>
                    <div className=' px-0 absolute bottom-0 left-0 right-0  pl-1'>
                        <Link href={`/product/${product?.slug}`}>
                            <div className={`text-start capitalize `}>
                                {
                                    (inventoryImages?.length > 1 && mouseOverImage) ? (
                                        <div className='flex space-x-1 left-0 bottom-[4.5rem] absolute z-50'>
                                            {
                                                inventoryImages?.length >= 1 && inventoryImages?.slice(0, 3).map(
                                                    (image, index) => {
                                                        const isHovered = index === invImgIndex

                                                        return (
                                                            <motion.div
                                                                key={index}
                                                                className={`h-[36px] w-[36px] relative ${isHovered && 'border-[1px] border-black rounded '}`}
                                                                initial={{
                                                                    y: 30,
                                                                    opacity: 0
                                                                }}
                                                                whileInView={{
                                                                    y: 0,
                                                                    opacity: 1
                                                                }}
                                                                transition={{
                                                                    type: 'spring',
                                                                    duration: .45
                                                                }}
                                                                onMouseOver={() => handleMouseOverInvImg(index, image)}
                                                                onMouseLeave={handleMouseLeaveInvImg}
                                                            >
                                                                <Image
                                                                    src={image?.image} // change as string when you remove aliasInvImages
                                                                    fill
                                                                    alt={image?.image}
                                                                    className='object-cover object-center relative rounded'
                                                                />

                                                            </motion.div>
                                                        )
                                                    }
                                                )
                                            }
                                            {
                                                inventoryImages?.length >= 1 && (
                                                    <span className='relative flex items-center mx-2 text-[#607686] tracking-tighter text-xs'>
                                                        <span>+</span>
                                                        {
                                                            inventoryImages?.slice(3, inventoryImages?.length)?.length
                                                        }
                                                    </span>
                                                )
                                            }

                                        </div>

                                    ) : <h4 className='max-w-[75%]  text-gray-600 tracking-tighter bottom-2 text-[13px] relative'>{product?.name}</h4>

                                }
                            </div>
                            <div className='text-start relative'>
                                <div className='my-1 relative bottom-3 max-w-fit flex items-center'>
                                    <RatingStars
                                        count={5}
                                        value={product?.avg_rating}
                                        size={20}
                                        edit={false}
                                        activeColor='black'
                                        isHalf={true}
                                        classNames={'text-center max-w-fit'}
                                        color={'#e4e4e4'}
                                    />
                                    <span className='text-[10px] ml-2 tracking-tighter text-gray-500'>
                                        {`(${product?.total_rating})`}
                                    </span>
                                </div>
                            </div>

                            <div className='text-start  space-x-28 flex  font-light tracking-tighter relative bottom-4 '>
                                <div>
                                    <span className='text-xs'>&#x20B5; </span>
                                    <span className='text-md'>{product?.min_price}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div >
        </motion.div>
    )
}

export default Product