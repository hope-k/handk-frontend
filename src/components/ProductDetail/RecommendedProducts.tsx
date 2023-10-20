import React from 'react'
import axios from 'axios';
import { useSession, signIn } from 'next-auth/react';

type Props = {}


const RecommendedProducts = (props: Props) => {
  const { data: session, status } = useSession();
  if (session) {
    const { user } = session
  }
  return (
    <div>
      <h1>
        Users who viewed this also viewed
      </h1>
    </div>
  )
}

export default RecommendedProducts

