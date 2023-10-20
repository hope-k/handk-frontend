import React, { useEffect, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { motion, AnimatePresence } from 'framer-motion'
import { ImageTData } from '@/types/shop';
import { ChevronRightCircle, ChevronLeftCircle } from 'lucide-react'
import { Image } from "@nextui-org/react";


// ! HANDLE WHEN NO IMAGES AVAILABLE

const CustomImageGallery = ({ images }: any) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevClick = () => {
        setCurrentIndex(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
    };

    const handleNextClick = () => {
        setCurrentIndex(currentIndex === images.length - 1 ? 0 : currentIndex + 1);
    };

    useEffect(() => {
        setCurrentIndex(0)
        console.log('images-->', images)
    }, [images])


    return (

        <motion.section className='h-full w-full '>
            <div className='flex relative flex-row-reverse'>
                <motion.div key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }} // Add a delay of 0.5 seconds
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }} className='border border-gray-100 h-[400px] w-[300px] overflow-hidden relative rounded-tr-[10px] rounded-br-[10px] '
                >
                    <Image
                        src={images ? images[currentIndex]?.image : '/images/default.png'}
                        alt={images ? images[currentIndex]?.alt_text : 'default'}
                        className=' object-center object-scale-down hover:scale-[1.05] transition-all ease duration-[5000ms] relative rounded w-full h-full'
                    />
                    <div className='absolute bottom-2 left-9 space-x-1 '>
                        <button onClick={handlePrevClick} className='rounded-full p-1'>
                            <ChevronLeftCircle className='text-xl stroke-[1px]' />
                        </button>
                        <button onClick={handleNextClick} className='rounded-full  p-1'>
                            <ChevronRightCircle className=' text-xl stroke-[1px]' />
                        </button>
                    </div>
                </motion.div>

                {/* Current Item Images */}
                <div className='flex flex-wrap  min-w-[70px] flex-col p-[2px] rounded-tl-[10px] rounded-bl-[10px] bg-gray-200 overflow-auto scrollbar scrollbar-w-1 scrollbar-thumb-slate-600'>
                    {
                        images && images?.length > 0 && images?.map((image: ImageTData, index: number) => (
                            <div
                                key={index}
                                className={'mb-[3px] duration-200 transition-all ease-in-out h-[65px] w-[65px] relative  cursor-pointer hover:scale-[0.95] transition-all ease-in-out duration-500 hover:brightness-90 ' + (index === currentIndex ? ' brightness-75 scale-[0.97]' : '')}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <Image
                                    src={image?.image || '/images/default.png'}
                                    alt={image?.alt_text}
                                    className=' object-center object-cover  relative  rounded-[10px]'
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        </motion.section>
    );
};

export default CustomImageGallery;