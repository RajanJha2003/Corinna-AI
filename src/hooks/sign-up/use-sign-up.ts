'use client';

import { useState } from "react";
import { useToast } from "../use-toast";
import { useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";


export const useSignUpForm=()=>{
    const {toast}=useToast();
    const [loading,setLoading]=useState(false);
    const {signUp,isLoaded,setActive}=useSignUp();

    const router=useRouter();
    const methods=useForm
}