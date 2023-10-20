
import React, { useState, useEffect, useCallback } from 'react'
import { Tree, Checkbox, Collapse } from 'antd'
import useCategory from '@/hooks/useCategory';
import { motion } from 'framer-motion';
import { ArrowDownOutlined } from '@ant-design/icons';
import { CategoryTData } from '@/types/shop';
import { useCreateQueryString } from '@/hooks/useCreateQuery';
import { useRouter, usePathname } from 'next/navigation';



export default function Category() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: categories } = useCategory()
    


    const { Panel } = Collapse
    const { setQueryString } = useCreateQueryString()



    function handleCategorySelect(categorySlug: CategoryTData['slug']) {
        router.push(`${pathname}?${setQueryString('category', categorySlug)}`)
    }


    function renderPanel(category: CategoryTData) {
        if (category?.children && category?.children?.length > 0) {
            const headerName = <span
                className='font-semibold text-left text-[11px] py-3 uppercase px-10 hover:bg-black rounded-md cursor-pointer hover:text-white transition-all ease-in-out duration-200'
                onClick={() => handleCategorySelect(category?.slug)}
            >
                {category?.name}
            </span>
            return (
                <Panel className=' text-left  hover:bg-slate-100 p-2 transition-all ease-in-out duration-300' collapsible='icon' header={headerName} key={category?.name}>
                    <div className=''>
                        <Collapse
                            ghost
                            expandIcon={({ isActive }) => <ArrowDownOutlined className='p-1' rotate={isActive ? 90 : 0} />}
                            bordered={false}
                            size='small'
                            expandIconPosition='end'
                        >
                            {category?.children?.map((child) => renderPanel(child))}
                        </Collapse>
                    </div>
                </Panel>
            );
        } else {
            const childHeaderName = <span
                className='text-left font-semibold text-[11px] uppercase tracking-tighter py-3  px-[5px] whitespace-nowrap hover:bg-black rounded-md cursor-pointer hover:text-white transition-all ease-in-out duration-200'
                onClick={() => handleCategorySelect(category?.slug)}>
                {category?.name}
            </span>
            return (
                <Panel className=' border-none  no-underline transition-all ease-in-out duration-200'
                    showArrow={false}
                    collapsible='icon'
                    header={childHeaderName}
                    key={category?.name}
                />

            );
        }
    }

    // function onSelect(category) {
    //     const { pathname, query } = router
    //     const categorySlug = category[0]
    //     router.push({
    //         pathname,
    //         query: {
    //             ...query,
    //             category: categorySlug
    //         }
    //     })
    // }

    return (
        <div className='w-full'>
            <h1 className='uppercase text-[12px] font-bold tracking-tighter '> category</h1>
            <Collapse
                ghost
                className='capitalize '
                collapsible='icon'
                expandIcon={({ isActive }) => <ArrowDownOutlined className='p-2' rotate={isActive ? 90 : 0} />}
                bordered={false}
                accordion size='small'
                expandIconPosition='end'>
                {categories?.map((category) => renderPanel(category))}
            </Collapse>
        </div>

    );
}