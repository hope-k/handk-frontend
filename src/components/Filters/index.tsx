import React from 'react'
import Category from '../CategoryTree'
import Sort from '../Sort'
import RatingSort from '../RatingFilter/index'
import PriceFilter from '../PriceFilter'
import BrandFilter from '../BrandFilter'

const Filters = () => {


    return (

        <div

            className='pl-1  space-y-3 h-screen overflow-auto  flex flex-col scrollbar scrollbar-w-[5px] scrollbar-h-2 scrollbar-thumb-rounded-md scrollbar-thumb-gray-600 scrollbar-track-gray-200 '

        >
            <Category />
            <BrandFilter />
            <PriceFilter />
            <Sort />
            <RatingSort /> 
        </div>



    )
}

export default Filters