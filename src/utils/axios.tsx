import React, { createContext, useContext } from 'react'
import axios from 'axios'
import { getSession } from 'next-auth/react';

export async function http() {
    let token = undefined
    try {

        const API = axios.create({
            baseURL: process.env.NEXT_PUBLIC_API_URL,
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            }

        })
        const session = await getSession()
        if (session) token = session?.user?.access_token    
        if (token) {
            API.defaults.headers.common.Authorization = `Bearer ${token}`
        }
        return API as any
    } catch (err) {
        return err
    }











    //todo: add response interceptor to handle 401 errors


}





