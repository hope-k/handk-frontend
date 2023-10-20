import { use, useEffect, useState } from 'react';
import { Collapse, Checkbox, Input } from 'antd';
import type { CheckboxChangeEvent } from 'antd/es/checkbox';
import useBrand from '@/hooks/useBrand';
import { useCreateQueryString } from '@/hooks/useCreateQuery';
import { useRouter, usePathname } from 'next/navigation';
import { useMutation } from 'react-query';
import { ChevronDown } from 'lucide-react';
const { Panel } = Collapse;

const BrandFilter = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: brands } = useBrand()
  const { setQueryString, params } = useCreateQueryString()
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  const collapseHeader = <h1 className=' flex absolute top-5 -left-[1px] text-white font-bold text-[12px] tracking-tighter uppercase'>Brands</h1>

  const onCheck = (e: CheckboxChangeEvent) => {
    const brand = e.target.value;

    // Toggle the checkbox value by adding or removing the brand from the array
    if (e.target.checked) {
      setSelectedBrands((prev) => [...prev, brand])
    } else {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand))
    }
  };
  //TODO CHECK VALUES OF SELECTED BRANDS
  useEffect(() => {
    router.push(`${pathname}?${setQueryString('brand', selectedBrands)}`)
  }, [selectedBrands])



  return (
    <div className="my-3">
      <Collapse
        expandIcon={({ isActive }) => <ChevronDown size={22} color="#ffffff" strokeWidth={0.5} absoluteStrokeWidth />
        }
        expandIconPosition='right' size='large' bordered={false} className='bg-black  rounded-none w-full text-white'>
        <Panel header={collapseHeader} key="1">
          <div className=' w-full'>
            {
              brands?.map((brand: { name: any; }, index: any) => (
                <Checkbox onChange={onCheck} key={index} value={brand?.name} className="flex text-[11px] tracking-tighter uppercase justify-start text-white  mx-auto p-2  hover:bg-[#ccc] rounded-md  ">
                  {brand?.name}
                </Checkbox>
              ))
            }
          </div>
        </Panel>
      </Collapse>
    </div>
  );
};

export default BrandFilter;