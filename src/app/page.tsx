'use client'
import React from 'react'
import Products from "@/components/Products"
import { dehydrate, Hydrate } from 'react-query'
import getQueryClient from '@/app/getQueryClient'
import { fetchProducts } from '@/hooks/useProducts';
import type { Metadata } from 'next'
import HydrateProducts from './hydrateProducts'

export const metadata: Metadata = {
  title: 'H&Ks',
  description: 'E-commerce website for H&K'
}



export default function Home() {
  return (
      <Products />
  )
}
