import { onLoginUser } from '@/actions/auth';
import React from 'react'

type Props={
    children:React.ReactNode
}

const layout = async({children}:Props) => {
    const authenticated=await onLoginUser();
  return (
    <div>layout</div>
  )
}

export default layout