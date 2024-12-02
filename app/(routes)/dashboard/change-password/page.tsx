export const dynamic = 'force-dynamic'
import { Metadata } from 'next'
import { getUserAuthenticated, logOut } from '@/app/services/auth.server'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import { redirect } from 'next/navigation'
import ChangePasswordForm from './index'
import User from '@/app/controllers/User.server'

export const metadata: Metadata = {
  title: 'تغيير كلمة المرور - حساب المستخدم',
  description: 'قم بتحديث كلمة مرور حسابك بسهولة وأمان باستخدام هذه الصفحة.',
}

async function changePassword(formData: FormData) {
  "use server"
  const user = await getUserAuthenticated()
  if (!user) {
    redirect('/auth/signin')
  }
  return await User.changePassword(user.username, formData.get('newPassword') as string, formData.get('currentPassword') as string)
}

async function handleLogOut(){
  "use server"
  await logOut()
}

export default async function ChangePasswordPage() {
  return (
    <AnimationWrapper>
      <h1 className="max-md:hidden">تغيير كلمة المرور لحسابك</h1>
      <div className="py-10 w-full md:max-w-[400px]">
        <ChangePasswordForm onLogOut={handleLogOut} onChangePassword={changePassword} />
      </div>
    </AnimationWrapper>
  )
}