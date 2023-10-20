import React from 'react';
import {ChevronLeft, ChevronRight} from 'lucide-react'




export default function QuantityInput({ value, setValue }: any) {
    


    return (
        <div className='flex items-center relative w-[6rem] '>
            <button onClick={() => setValue((prev: number) => prev !== 1 ? (prev - 1) : 1)} className='bg-slate-200/50 h-4 active:scale-[.85] ease-in duration-75 transition-all   rounded-l-full font-bold  text-red-300 absolute left-[2px] text-center flex items-center justify-center'>
                <ChevronLeft strokeWidth={'1'}/>
            </button> 
            <input value={value} onChange={e => setValue(e.target.value)} className='appearance-none outline-none border border-gray-300 h-[19px]  rounded-full text-center w-full' />
            <button onClick={() => setValue((prev: number) => prev + 1)} className='h-4 bg-purple-300/50 active:scale-[.85]  ease-in duration-75 transition-all  rounded-r-full absolute right-[2px] text-gray-600 text-center flex items-center justify-center'>
                <ChevronRight strokeWidth={'1'} />
            </button>
        </div>


    );
}