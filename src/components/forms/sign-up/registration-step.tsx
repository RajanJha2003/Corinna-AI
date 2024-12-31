'use client';

import { Spinner } from '@/components/spinner'
import { useAuthContextHook } from '@/context/use-auth-context';
import dynamic from 'next/dynamic'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form';
import TypeSelectionForm from './type-selection-form';


const DetailForm=dynamic(()=>import('./account-details-form'),{
    ssr:false,
    loading: () => <Spinner noPadding={true} />
})

const RegistrationFormStep = () => {
    const {
        register,
        formState: { errors },
        setValue,
      } = useFormContext()
      const { currentStep } = useAuthContextHook()
      const [onOTP, setOnOTP] = useState<string>('')
      const [onUserType, setOnUserType] = useState<'owner' | 'student'>('owner')

      setValue('otp', onOTP)

      switch(currentStep){
        case 1:
            return(
                <TypeSelectionForm register={register} userType={onUserType} setUserType={setOnUserType}   />
            )

            case 2:
              return(
                <DetailForm errors={errors} register={register} />
              )
      }
  return (
    <div>RegistrationFormStep</div>
  )
}

export default RegistrationFormStep