'use client'

import { toast } from 'react-hot-toast'
import InputBox from '@/app/components/InputBox'
import {useState } from 'react'

export default function ChangePasswordForm({onLogOut, onChangePassword}: {onLogOut: () => Promise<void>, onChangePassword: (formData: FormData) => Promise<{ status: string | undefined, code: number, message: string, action: string, data: any }>}) {
  const [pending, setPending] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setPending(true)
    toast.loading('جاري التغيير...')
    const response = await onChangePassword(formData)
    if (response.status === 'error') {
        toast.dismiss()
      toast.error(response.message)
    } else {
        toast.dismiss()
      toast.success(response.message)
      setTimeout(async () => {
        await onLogOut()
      }, 500)
    }
    setPending(false)
  }

  return (
    <form action={handleSubmit}>
      <InputBox
        className="profile-edit-input"
        icon="fi-rr-unlock"
        placeholder="كلمة المرور الحالية"
        name="currentPassword"
        value=""
        type="password"
      />
      <InputBox
        className="profile-edit-input"
        icon="fi-rr-unlock"
        placeholder="كلمة المرور الجديدة"
        name="newPassword"
        value=""
        type="password"
      />
      <button 
      type="submit"
      disabled={pending}
      className="btn-dark px-10"
    >
      {pending ? 'جاري التغيير...' : 'تغيير كلمة المرور'}
    </button>
    </form>
  )
}