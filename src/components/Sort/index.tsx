import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCreateQueryString } from '@/hooks/useCreateQuery';
import { useMutation } from 'react-query';
const { Option } = Select;

const Sort = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { setQueryString } = useCreateQueryString();



    const [sortOptions, setSortOptions] = useState<string[]>([]);


    const handleSortChange = (values: string[]) => {
        if (values.length === 0) {
            setSortOptions([])
            return
        }
        setSortOptions(values)

    };
    useEffect(() => {
        router.push(`${pathname}?${setQueryString('sort', sortOptions)}`)
 

    }, [sortOptions] )
    const placeholderText = (
        <span className='text-gray-400 italic font-[8px] tracking-tighter '>
            Sort by: Price, Name
        </span>
    );

    return (
        <div className=''>
            <h2 className='text-[12px] uppercase tracking-tighter font-bold'>Sort By</h2>
            <Select
                placeholder={placeholderText}
                mode="multiple"
                bordered={false}

                allowClear
                onChange={handleSortChange}
                value={sortOptions}
                className='w-full '
            >
                <Option className='text-xs tracking-tighter' disabled={sortOptions.includes('-price')} value="price">Price: Low to High</Option>
                <Option className='text-xs tracking-tighter' disabled={sortOptions.includes('price')} value="-price">Price: High to Low</Option>
                <Option className='text-xs tracking-tighter' disabled={sortOptions.includes('-name')} value="name">Name: A to Z</Option>
                <Option className='text-xs tracking-tighter' disabled={sortOptions.includes('name')} value="-name">Name: Z to A</Option>
            </Select>
        </div>
    );
};

export default Sort;