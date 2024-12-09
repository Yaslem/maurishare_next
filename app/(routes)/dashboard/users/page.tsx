export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import UsersIndex from './index'
import { getUserAuthenticated } from '@/app/services/auth.server'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import User, { userResponse } from '@/app/controllers/User.server'

export const metadata: Metadata = {
  title: 'المستخدمون | لوحة التحكم',
  description: 'إدارة المستخدمين في لوحة التحكم - عرض، تعديل، وإدارة صلاحيات المستخدمين',
  keywords: 'لوحة التحكم، إدارة المستخدمين، صلاحيات، حسابات المستخدمين',
  openGraph: {
    title: 'المستخدمون | لوحة التحكم',
    description: 'إدارة المستخدمين في لوحة التحكم - عرض، تعديل، وإدارة صلاحيات المستخدمين',
    type: 'website',
    locale: 'ar_SA',
    siteName: process.env.SITE_NAME || 'اسم الموقع',
  },
  robots: {
    index: false, // لمنع فهرسة صفحات لوحة التحكم
    follow: false
  },
  alternates: {
    canonical: `${process.env.BASE_URL}/dashboard/users`
  }
}

export default async function UsersPage() {
  const user = await getUserAuthenticated() as userResponse & { role: "ADMIN" | "USER" } | null
  
  if (user?.role !== "ADMIN") {
    redirect('/')
  }

  const users = await User.getAllUsers()

  return (
    <AnimationWrapper>
      <h1 className="max-md:hidden">المستخدمون</h1>
      <UsersIndex users={users?.data ?? []} />
    </AnimationWrapper>
  )
}