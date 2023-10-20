import React from 'react'
import { useQuery } from 'react-query'
import { CategoryTData } from '@/types/shop'
import { http } from '@/utils/axios'

export const fetchCategory = async (): Promise<CategoryTData[]> => {
    const  API  = await http()
    const { data } = await API.get('/api/category/root/')
    return data
}

const useCategory = () => {
    return useQuery('/api/category/', fetchCategory)
}

export default useCategory