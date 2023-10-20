import React from 'react'
import { useQuery } from 'react-query'
import { BrandTData } from '@/types/shop'
import { http } from '@/utils/axios'

export const fetchBrand = async (): Promise<BrandTData[]> => {
    const API = await http()
    const { data } = await API.get('/api/brand/')
    return data
}

const useBrand = () => {
    return useQuery('/api/brand/', fetchBrand)
}

export default useBrand