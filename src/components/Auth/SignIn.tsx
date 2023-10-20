'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Input, Button, Spinner } from "@nextui-org/react";
import * as Yup from 'yup'
import { Formik, Form, Field } from 'formik';
import { motion } from 'framer-motion'
import { signIn } from 'next-auth/react'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation';
import Link from 'next/link'
import PageTransition from '@/app/pageTransition';
import { useQueryClient } from 'react-query';

type Props = {}
type FormValues = {
    email: string;
    password: string;
}

const SignIn = (props: Props) => {
    const searchParams = useSearchParams()
    useEffect(() => {
        if (searchParams.has('error')) {
            toast.error(`Something went wrong. Try Again: ${searchParams.get('error')}`, {
                id: 'loading', className: ' text-[11px] p-0 ', style: {
                    color: 'white',
                    background: 'red'
                }
            })
        }

    }, [searchParams])

    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const images = [
        '/signin/1.jpeg',
        '/signin/2.jpeg',
        '/signin/3.jpeg',
        '/signin/4.jpeg',
        '/signin/5.jpeg',
    ]
    const randomImage = images[Math.floor(Math.random() * images.length)]
    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        password: Yup.string().required('Password is required'),
    });

    const queryClient = useQueryClient()


    async function handleSignIn(values: FormValues) {
        toast.custom(<div className=' flex space-x-1 items-center justify-center rounded-lg backdrop-blur-[15px] p-1 text-[11px] border border-gray-300  bg-[#ffffff3f]'>
            <Spinner
                classNames={{
                    circle1: "  border-[1px] text-green-800 ",
                    circle2: "  border-[1px] text-green-800",
                }}
                size='sm' color="current"
            /> <span> Signing in...</span>
        </div>,
            { id: 'signin' }
        )
        setLoading(true)
        const { email, password } = values;
        const result = await signIn('credentials', {
            redirect: false,
            callbackUrl: '/',
            email: email,
            password: password
        })
        setLoading(false)

        if (result && result.error) {
            toast.error(result.error, {
                id: 'signin', className: ' text-[11px] p-0 ', style: {
                    color: 'white',
                    background: 'red'
                }
            })
        } else {
            toast.success('Signed In', {
                id: 'signin', className: ' text-[11px] p-0 ', style: {
                    color: 'white',
                    background: 'green'
                }
            })
            await queryClient.invalidateQueries({
                queryKey: '/api/products/'
            })
            router.push('/')


        }
    }

    async function handleGoogleSignIn() {
        toast.loading('Signing In with Google...', { className: ' text-[11px] p-0', id: 'loading' })
        setLoading(true)
        const result = await signIn('google')
        setLoading(false)
        result && console.log('result-->', result)
        if (result && result.error) {
            toast.error(result.error, {
                id: 'loading', className: ' text-[11px] p-0', style: {
                    color: 'white',
                    background: 'red'
                }
            })
        }


        router.push('/')



    }






    return (
        <PageTransition>
            <div className="flex pb-9 w-full h-full mt-20 items-center relative  max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg dark:bg-gray-800 lg:max-w-4xl">
                <div className="hidden bg-cover lg:block lg:w-1/2 lg:h-full relative" >
                    <div className='relative h-screen w-full'>
                        <Image
                            src={randomImage}
                            alt="logo"
                            fill
                            className='object-cover w-full h-full'
                        />
                    </div>
                </div>

                <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
                    <div className="flex justify-center mx-auto">
                        <div className="w-7 h-7 sm:h-[80px] sm:w-[180px] relative">
                            <Image
                                src={'/signin/signinlogo.png'}
                                alt="logo"
                                fill
                                className='object-cover w-full h-full'
                            />
                        </div>
                    </div>

                    <h3 className="mt-3 capitalize tracking-wider font-bold text-xs text-center text-gray-500 dark:text-gray-200">
                        Welcome back!
                    </h3>

                    <button onClick={() => handleGoogleSignIn()} className="flex items-center  mt-4 text-gray-600 transition-colors duration-300  border rounded-full dark:border-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                        <span className="ml-[2px] my-[2px] bg-slate-200 rounded-full p-1">
                            <svg className="w-6 h-6" viewBox="0 0 40 40">
                                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107" />
                                <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00" />
                                <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50" />
                                <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2" />
                            </svg>
                        </span>
                        <span className="w-5/6 px-4  font-light text-[12px] text-center capitalize">Sign in with Google</span>
                    </button>

                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 lg:w-1/4"></span>

                        <button className="text-[11px] text-center text-gray-500 uppercase dark:text-gray-400 hover:underline">
                            or login
                            with email
                        </button>

                        <span className="w-1/5 border-b dark:border-gray-400 lg:w-1/4 "></span>
                    </div>
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSignIn}
                    >

                        {
                            ({ values, errors, touched, isSubmitting }) => (
                                <Form>
                                    <div className="mt-4 ">
                                        <Field
                                            className='font-thin'
                                            as={Input}
                                            type='email'
                                            name='email'
                                            label="Email"
                                            variant='underlined'
                                            value={values.email}
                                            size='sm'
                                            isClearable={true}
                                            classNames={{
                                                label: 'font-light text-[11px]',

                                            }}
                                        />
                                        {
                                            errors.email && touched.email ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    whileInView={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -10 }}
                                                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                                                    className='text-[10px] text-red-500 capitalize'
                                                >
                                                    {errors.email}
                                                </motion.div>
                                            ) : null
                                        }
                                    </div>
                                    <div className="mt-4">
                                        <Field
                                            as={Input}
                                            className='font-thin'
                                            type='password'
                                            label="Password"
                                            name='password'
                                            value={values.password}
                                            variant='underlined'
                                            size='sm'
                                            isClearable
                                            classNames={{
                                                label: 'font-light text-[11px]'

                                            }}
                                        />
                                        {errors.password && touched.password ? (
                                            <motion.div
                                                initial={{ opacity: 0, y: 10 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ duration: 0.45, ease: 'easeInOut' }}
                                                className='text-[10px] text-red-500 capitalize'
                                            >
                                                {errors.password}
                                            </motion.div>
                                        ) : null
                                        }

                                    </div>

                                    <div className="mt-6">
                                        <Button isLoading={isSubmitting} disabled={isSubmitting} type='submit' className="disabled:opacity-70 w-full text-xs px-5 py-3  font-medium tracking-wide text-white capitalize transition-colors duration-300 transhtmlForm bg-gray-800 rounded-lg focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
                                            Sign In
                                        </Button>
                                    </div>
                                </Form>
                            )
                        }
                    </Formik>

                    <div className="flex items-center justify-between mt-4">
                        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>

                        <Link href='/auth/signup' className="text-[11px] text-gray-500 uppercase dark:text-gray-400 hover:underline">create an account</Link>

                        <span className="w-1/5 border-b dark:border-gray-600 md:w-1/4"></span>
                    </div>
                </div>
            </div>
        </PageTransition >
    )
}

export default SignIn
