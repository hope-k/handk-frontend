import React, { useEffect, useState, useCallback } from 'react';
import { InputNumber, Button } from 'antd';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCreateQueryString } from '@/hooks/useCreateQuery';
import { FilterIcon, RefreshCcwDotIcon } from 'lucide-react'

const PriceFilter = () => {
    const router = useRouter();
    const pathname = usePathname();


    const { setQueryString, params } = useCreateQueryString();
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    const handleResetClick = () => {

        setMinPrice('');
        setMaxPrice('');

        // delete from url and reset the url by pushing to pathname and updated params

        params.delete('price_min');
        params.delete('price_max');
        router.push(`${pathname}?${params.toString()}`)



    };

    const handleFilter = () => {

        if (minPrice === '' && maxPrice === '') return

        // first set the query string sets the price_min
        setQueryString('price_min', minPrice);

        // then this sets the price_max and returns the complete query string which includes price_min
        const completeQuery = `${setQueryString('price_max', maxPrice)}`;


        router.push(`${pathname}?${completeQuery}`)


    }







    return (
        <div>
            <h2 className='tracking-tight font-bold uppercase mb-1 text-[12px]'>Price</h2>
            <div className='flex flex-row relative'>
                <div className='flex flex-col justify-center items-center '>
                    <input
                        onChange={(e) => {
                            setMinPrice(e.target.value)
                        }}
                        placeholder='Min Price'
                        className="bg-gray-100 h-5 w-16 text-[10px] tracking-tighter    placeholder-shown:text-xs  pl-2  hover:bg-[#e5e5e5]  text-gray-800 rounded-[7px]   transition-all duration-300 focus:outline-none focus:bg-[#e5e5e5] relative border "
                    />
                    <button className='bg-gray-100 text-xs mt-2  uppercase text-[7px]  rounded-[7px] p-1' onClick={handleFilter} >
                        <FilterIcon className='stroke-[1px] w-4 h-4' />
                    </button>
                </div>
                <span style={{ margin: '0 10px' }}>-</span>
                <div className='flex flex-col justify-center items-center '>
                    <input
                        onChange={(e) => {
                            setMaxPrice(e.target.value)
                        }}
                        placeholder='Max Price'
                        className="bg-gray-100 h-5  w-16 text-[10px] tracking-tighter   placeholder-shown:text-xs  pl-2  hover:bg-[#e5e5e5]  text-gray-800 rounded-[7px]   transition-all duration-300 focus:outline-none focus:bg-[#e5e5e5] relative border "
                    />
                    <button className='text-xs mt-2  bg-gray-100 uppercase text-[7px]  rounded-[7px]  p-1' onClick={handleResetClick} >
                        <RefreshCcwDotIcon className='stroke-[1px] w-4 h-4' />
                    </button>
                </div>

            </div>
            
        </div>
    );
};

export default PriceFilter;