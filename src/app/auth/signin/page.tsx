import React from 'react'
import { getServerSession } from "next-auth/next"


import {
  redirect
} from 'next/navigation'
import SignIn from '@/components/Auth/SignIn';
type Props = {}

const SignInPage = async (props: Props) => {
  const session = await getServerSession()

  if (session) {
    redirect('/')
  }



  return (
    <SignIn/>
   
  )
}

export default SignInPage
