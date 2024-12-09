'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"

import InputBox from "@/app/components/InputBox"
import AnimationWrapper from "@/app/components/AnimationWrapper"
import Validate from "@/app/helpers/Validate"
import {type sendResponseServer } from "@/app/helpers/SendResponse.server"
import {type ZodFormattedError } from "zod"
import {type userResponse } from "@/app/controllers/User.server"

type UserAuthFormProps = {
    type: 'sign-in' | 'sign-up'
    signIn?: (formData: FormData) => Promise<Awaited<ReturnType<typeof sendResponseServer<ZodFormattedError<{
        email: string;
        password: string;
    }, string> | null>>>>
    signUp?: (formData: FormData) => Promise<Awaited<ReturnType<typeof sendResponseServer<ZodFormattedError<{
        email: string;
        name: string;
        password: string;
    }, string> | null | userResponse>>>>
}

export default function UserAuthForm({ type, signIn, signUp }: UserAuthFormProps) {
    const router = useRouter()
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        try {
            if (type === 'sign-in') {
                const validated = Validate.signIn.safeParse({email: formData.email, password: formData.password})
                if (!validated.success) {
                    const error = validated.error.flatten().fieldErrors
                    return toast.error(Object.values(error)[0]?.[0] ?? 'خطأ في البيانات')
                }

                const result = signIn && (await signIn(new FormData(e.target as HTMLFormElement)))
                console.log(result)
                if (result &&result.status === 'error') {
                    toast.error(result.message)
                } else {
                    toast.success('تم تسجيل الدخول بنجاح')
                    router.push('/dashboard/posts')
                }
            } else {
                const validated = Validate.signUp.safeParse(formData)
                if (!validated.success) {
                    const error = validated.error.flatten().fieldErrors
                    return toast.error(Object.values(error)[0]?.[0] ?? 'خطأ في البيانات')
                }

                const result = signUp && (await signUp(new FormData(e.target as HTMLFormElement)))
                if (result?.status === 'error') {
                    toast.error(result.message)
                } else {
                    toast.success('تم إنشاء الحساب بنجاح')
                    router.push('/auth/signin')
                }
            }
        } catch {
            toast.error('حدث خطأ ما')
        }
    }

    return (
        <AnimationWrapper keyValue={type}>
            <section className="h-cover flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-[80%] max-w-[400px]">
                    <h1 className="text-4xl font-bold text-center mb-12">
                        {type === "sign-in" ? "مرحبا بعودتك" : "انضم لنا اليوم"}
                    </h1>
                    
                    {type === 'sign-up' && (
                        <InputBox
                            onChange={handleChange}
                            icon="fi-rr-user"
                            value={formData.name}
                            type="text"
                            name="name"
                            placeholder="الاسم الكامل"
                        />
                    )}
                    
                    <InputBox
                        onChange={handleChange}
                        icon="fi-rr-envelope"
                        value={formData.email}
                        type="email"
                        name="email"
                        placeholder="البريد الإلكتروني"
                    />
                    
                    <InputBox
                        onChange={handleChange}
                        icon="fi-rr-key"
                        value={formData.password}
                        type="password"
                        name="password"
                        placeholder="كلمة المرور"
                    />

                    <button 
                        type="submit" 
                        className="btn-dark center mt-14"
                    >
                        {type === "sign-in" ? "تسجيل الدخول" : "تسجيل حساب جديد"}
                    </button>

                    <p className="mt-6 text-dark-grey text-xl text-center">
                        {type === "sign-in" ? "ليس لديك حساب ؟" : "لديك حساب ؟"}
                        <Link 
                            href={type === "sign-in" ? "/auth/signup" : "/auth/signin"} 
                            className="underline text-black text-xl mr-1"
                        >
                            {type === "sign-in" ? "انضم إلينا الآن." : "سجل الدخول من هنا."}
                        </Link>
                    </p>
                </form>
            </section>
        </AnimationWrapper>
    )
}