import React from 'react'
import { Progress } from "@nextui-org/react";
import RatingStars from 'react-rating-stars-component';

type Props = {}

const ReviewFilter = (props: Props) => {
    const ratingFilter = [
        { name: 'excellent', value: 100 },
        { name: 'good', value: 80 },
        { name: 'average', value: 50 },
        { name: 'below average', value: 40 },
        { name: 'poor', value: 20 }
    ]

    const renderColor = (value: number) => {
        if (value === 100) return 'bg-teal-800'
        if (value === 80) return 'bg-teal-600'
        if (value === 50) return 'bg-yellow-300'
        if (value === 40) return 'bg-red-400'
        if (value === 20) return 'bg-red-600'
    }


    return (
        <div className="flex flex-col w-full items-center">



            {
                ratingFilter.map((item, index) => (
                    <div aria-label={item.name} key={index} className='h-full pb-1 w-full rounded-md md:pr-1  flex cursor-pointer flex-row items-center relative'>
                        <div className='flex flex-row items-center relative'>
                            <RatingStars
                                count={1}
                                value={1}
                                size={18}
                                edit={false}
                                activeColor='black'
                                isHalf={true}
                                color={'#e4e4e4'}
                            />
                            <span className='absolute text-sm top-[1px] -right-2 '>
                                {5 - index}
                            </span>
                        </div>
                        <div className='item-center flex h-full flex-row'>
                            <Progress
                                classNames={{
                                    base: 'h-[6px] absolute right-0 max-w-[15rem]',
                                    indicator: `${renderColor(item.value)}`
                                }}
                                value={item.value}
                            />
                            <span className='absolute -right-3  flex items-center top-[1px] text-sm'>
                                4
                            </span>
                        </div>
                    </div>
                ))
            }

        </div>)
}

export default ReviewFilter