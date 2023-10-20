import React, { useState, useEffect } from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure, RadioGroup, Tooltip } from "@nextui-org/react";
import { motion } from 'framer-motion'
import { ShoppingCart } from "lucide-react";
import { ProductTData, InventoryTData, SpecificationTData } from "@/types/shop";
import { CustomRadio } from "@/components/ProductDetail/CustomRadio";
import chroma from "chroma-js";
import { Plus, Ban } from 'lucide-react'
import { useCart } from "react-use-cart";
import { toast } from 'react-hot-toast'
import { useSession } from "next-auth/react";
import { useCartAPI } from "@/hooks/useCartAPI";


type Props = {
    product: ProductTData
    defaultProductInventory: InventoryTData
}

export default function AddToCartModal({ product, defaultProductInventory }: Props) {
    const MotionButton = motion(Button)
    const { addCartItemMutation, getCart } = useCartAPI()
    const { data: cart } = getCart
    const { data: session } = useSession()
    const { addItem, setCartMetadata } = useCart()
    const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

    const hasSizeAttribute = defaultProductInventory?.specification?.some(
        (item) => item.product_attribute.name === 'size'
    )
    const hasColorAttribute = defaultProductInventory?.specification?.some(
        (item) => item.product_attribute.name === 'color'
    );
    const hasWeightAttribute = defaultProductInventory?.specification?.some(
        (item) => item.product_attribute.name === 'weight'
    );

    const productColors = defaultProductInventory?.specification?.filter(spec => spec?.product_attribute.name === 'color')
    const productSizes = defaultProductInventory?.specification?.filter(spec => spec?.product_attribute.name === 'size')
    const productWeight = defaultProductInventory?.specification?.filter(spec => spec?.product_attribute.name === 'weight')[0]?.attribute_value
    const [selectedAttributes, setSelectedAttributes] = useState<SpecificationTData[]>([])

    const handleAttributeSelection = (spec: SpecificationTData) => {
        const newSelectedAttributes = [...selectedAttributes]
        const index = newSelectedAttributes.findIndex(item => item?.product_attribute?.name === spec?.product_attribute?.name)
        console.log('NEW INDEX', index)

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

    const updateCart = async () => {
        if (session?.user) {
            const isValid = validateAttributeSelection()
            if (isValid) {
                const attributesIds = selectedAttributes.map(attr => attr.id)

                await addCartItemMutation.mutateAsync({
                    cartItem: {
                        product_inventory: defaultProductInventory?.id as number,
                        quantity: 1,
                        cart: localStorage.getItem('cartId') as string,
                        attribute_values: attributesIds as unknown as SpecificationTData[],
                        unit_price: defaultProductInventory?.retail_price
                        // cart: localStorage.getItem('cartId') as string,
                    },
                })



                onClose()
            }
        } else {
            const isValid = validateAttributeSelection()
            if (isValid) {
                addItem({
                    id: Math.random().toString() as string,
                    price: defaultProductInventory?.retail_price as number,
                    quantity: 1,
                    name: product?.name as string,
                    product: {
                        id: product?.id as number,
                        inventory: {
                            id: defaultProductInventory?.id as number,
                            specification: selectedAttributes as SpecificationTData[]
                        }
                    }
                }, 1)
            }
        }


    }


    const [selectedColor, setSelectedColor] = useState<string | null>(null)
    const [selectedSize, setSelectedSize] = useState<string | null>(null)
    const refreshCart = async () => {
        // Trigger a refetch of the cart data
       await getCart.refetch()
     

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
            refreshCart()
        }

    }, [addCartItemMutation.isSuccess])
    useEffect(() => {
        addCartItemMutation.isError && toast.error('Something went wrong, try again', {
            className: ' text-[11px] p-0 ', style: {
                color: 'white',
                background: 'red'
            },
            duration: 4000
        })

    }, [addCartItemMutation.isError])

    return (
        <>
            <Button isLoading={addCartItemMutation.isLoading} isIconOnly onPress={onOpen} className="bg-purple-500 relative  rounded-full p-2 ">
                {
                    !addCartItemMutation.isLoading && <ShoppingCart className=' stroke-[1]   stroke-white' />
                }
            </Button>

            <Modal
                isOpen={isOpen}
                placement='bottom-center'
                onOpenChange={onOpenChange}
                backdrop="opaque"
            >
                <ModalContent >
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{product?.name}</ModalHeader>
                            <ModalBody>
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
                            </ModalBody>
                            <ModalFooter>
                                <Button endContent={<Ban className="w-4 h-4 stroke-[1px]" />} color="danger" variant="light" onPress={onClose}>
                                    Cancel
                                </Button>
                                <Button isLoading={addCartItemMutation.isLoading} className="bg-black text-white" endContent={<Plus className="w-4 h-4 stroke-[1px]" />} color="primary" onPress={() => updateCart()}>
                                    Add to Cart
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
