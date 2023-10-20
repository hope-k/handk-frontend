import React, { useState } from 'react'
import { useCreateQueryString } from '@/hooks/useCreateQuery'
import { useRouter, usePathname } from 'next/navigation'
import RatingStars from 'react-rating-stars-component'

const RatingSort = () => {
    const { setQueryString, params } = useCreateQueryString()
    const router = useRouter()
    const pathname = usePathname()

    return (
        <div>
            <div className='flex flex-col  '>
                <h1 className='text-[12px] uppercase tracking-tighter font-bold'>Sort By Rating</h1>
                {
                    Array.from({ length: 5 }, (_, i) => (
                        <div key={i} className='flex items-center relative  peer' onClick={() => router.push(`${pathname}?${setQueryString('rating', i+1)}`)}>
                            <RatingStars
                                count={5}
                                value={i + 1}
                                size={22}
                                edit={false}
                                activeColor='black'
                                isHalf={true}
                                classNames={'text-center max-w-fit cursor-pointer'}
                                color={'#e4e4e4'}
                            />
                            <p className='text-[10px] absolute font-bold   ml-24 upp tracking-tighter my-auto '> & Up</p>
                        </div>
                    ))
                }
            </div>
        </div >
    )
}
//  color={'#e4e4e4'}
// value = {
//     i === 0 ? 1 :
//     i === 1 ? 2 :
//         i === 2 ? 3 :
//             i === 3 ? 4 :
//                 i === 4 ? 5 : 0
//                                     }


export default RatingSort