'use client'

import {
  UserRegistrationProps,
  UserRegistrationSchema,
} from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { onCompleteUserRegistration } from '@/actions/auth'
import { useToast } from '../use-toast'

export const useSignUpForm = () => {
  const { toast } = useToast()
  const [loading, setLoading] = useState<boolean>(false)
  const { signUp, isLoaded, setActive } = useSignUp()
  const router = useRouter()
  const methods = useForm<UserRegistrationProps>({
    resolver: zodResolver(UserRegistrationSchema),
    defaultValues: {
      type: 'owner',
    },
    mode: 'onChange',
  })

  const onGenerateOTP = async (
    email: string,
    password: string,
    onNext: React.Dispatch<React.SetStateAction<number>>
  ) => {
    if (!isLoaded) return

    try {
      if (!email || !password) {
        toast({
          title: 'Error',
          description: 'Email and password are required.',
        })
        return
      }

      // Attempt to create a Clerk user
      const response = await signUp.create({
        emailAddress: email,
        password: password,
      })
      
      console.log('Clerk SignUp Response:', response)

      // Prepare for email verification
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      onNext((prev) => prev + 1)
    } catch (error: any) {
      console.error('SignUp Error:', error)
      toast({
        title: 'Error',
        description:
          error?.errors?.[0]?.longMessage || 'An unexpected error occurred.',
      })
    }
  }

  const onHandleSubmit = methods.handleSubmit(
    async (values: UserRegistrationProps) => {
      if (!isLoaded) return

      try {
        setLoading(true)
        const completeSignUp = await signUp.attemptEmailAddressVerification({
          code: values.otp,
        })

        console.log('Verification Response:', completeSignUp)

        if (completeSignUp.status !== 'complete') {
          toast({
            title: 'Error',
            description: 'Invalid OTP. Please try again.',
          })
          setLoading(false)
          return
        }

        if (!signUp.createdUserId) {
          toast({
            title: 'Error',
            description: 'User creation failed. Please try again.',
          })
          setLoading(false)
          return
        }

        // Register user in the database
        const registered = await onCompleteUserRegistration(
          values.fullname,
          signUp.createdUserId,
          values.type
        )

        if (registered?.status == 200 && registered.user) {
          await setActive({
            session: completeSignUp.createdSessionId,
          })
          toast({
            title: 'Success',
            description: 'Registration complete!',
          })
          router.push('/dashboard')
        } else {
          toast({
            title: 'Error',
            description: 'Failed to register user. Try again.',
          })
        }
      } catch (error: any) {
        console.error('Final Registration Error:', error)
        toast({
          title: 'Error',
          description:
            error?.errors?.[0]?.longMessage || 'Registration process failed.',
        })
      } finally {
        setLoading(false)
      }
    }
  )

  return {
    methods,
    onHandleSubmit,
    onGenerateOTP,
    loading,
  }
}
