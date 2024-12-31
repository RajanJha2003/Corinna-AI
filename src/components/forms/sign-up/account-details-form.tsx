import React from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

type Props={
    register:UseFormRegister<FieldValues>
    errors:FieldErrors<FieldValues>
}

const AccountDetailsForm = ({register,errors}:Props) => {
  return (
    <>
    <h2 >Account Details</h2>
    </>
  )
}

export default AccountDetailsForm