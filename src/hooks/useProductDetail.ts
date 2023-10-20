import { http } from "@/utils/axios";
import { useQuery } from "react-query";
import { useEffect, useState } from "react";
import {
    ProductTData,
    InventoryTData,
    APIResponse
} from '@/types/shop'

export const fetchProductDetail = async ({ queryKey }: any): Promise<ProductTData> => {
    const slug = queryKey[1];
    const API = await http();
    const { data } = await API.get(`/api/products/${slug}/`);
    return data;

}

export default function useProductDetail({ slug }: any) {
    const [inventories, setInventories] = useState<InventoryTData[]>([]);
    const [defaultInventoryProduct, setDefaultInventoryProduct] = useState<InventoryTData | null>(null);
    const { data, isFetching, isLoading } = useQuery(['/api/products/:slug/', slug], fetchProductDetail);

    useEffect(() => {
        if (!data) return;
        if (data?.inventory?.length > 0) {
            const defaultInventoryProduct: InventoryTData = data?.inventory?.filter(inv => inv.is_default === true)[0] || data?.inventory[0];
            setInventories(data?.inventory);
            setDefaultInventoryProduct(defaultInventoryProduct);
        }
    }, [data])

    return {
        data,
        isFetching,
        isLoading,
        inventories,
        defaultInventoryProduct

    }


}