'use client';

import { Loader } from '@/components/loader';
import { AuthContextProvider } from '@/context/use-auth-context';
import React from 'react'
import {FormProvider} from 'react-hook-form'

const SignUpFormProvider = () => {
  return (
   <AuthContextProvider>
    <FormProvider>
        <form className='h-full'>
            <div className='flex flex-col justify-between gap-3 h-full'>
            <Loader>
                {children}
            </Loader>

                

            </div>

        </form>

    </FormProvider>
   </AuthContextProvider>
  )
}

export default SignUpFormProvider