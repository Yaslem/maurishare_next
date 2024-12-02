import { redirect } from 'next/navigation'
import { Metadata } from 'next'
import UserAuthForm from '@/app/components/UserAuthForm'
import { isAuthenticated } from '@/app/services/auth.server'
import { DEFAULT_LOGIN_REDIRECT } from '@/app/services/routes.server'
import AuthServer from '@/app/controllers/Auth.server'

// Server Action للتعامل مع تسجيل الدخول
async function signIn(formData: FormData) {
  'use server'
  
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  // التحقق من حالة تسجيل الدخول
  const isSignedIn = await isAuthenticated()
  if (isSignedIn) {
    redirect(DEFAULT_LOGIN_REDIRECT)
  }

  try {
    // استدعاء خدمة المصادقة
    const response = await AuthServer.signIn(email, password)
    return response
  } catch (error) {
    return { error: 'فشل تسجيل الدخول' }
  }
}

export const metadata: Metadata = {
  title: "تسجيل الدخول 🔒",
  description: "قم بتسجيل الدخول إلى حسابك للوصول إلى جميع الميزات والخدمات",
  keywords: "تسجيل الدخول, حساب المستخدم, مصادقة, دخول آمن",
  openGraph: {
    title: "تسجيل الدخول إلى حسابك",
    description: "قم بتسجيل الدخول للوصول إلى حسابك الشخصي والوصول إلى جميع الميزات المتاحة",
    type: "website",
    locale: "ar",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "/auth/signin",
  },
}

// مكون الصفحة الرئيسي
export default async function SignInPage() {  
  return <UserAuthForm type="sign-in" signIn={signIn} />
}