export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserAuthenticated, updateUserAuthenticated } from '@/app/services/auth.server'
import User, { type userResponse } from '@/app/controllers/User.server'
import EditProfileForm from './index'


export async function generateMetadata(): Promise<Metadata> {
  const user = await getUserAuthenticated() as userResponse
  
  return {
    title: `تعديل الملف الشخصي لـ ${user.name} (@${user.username}) - منصة التواصل الاجتماعي`,
    description: `قم بتحديث معلوماتك الشخصية مثل السيرة الذاتية ووسائل التواصل الاجتماعي لـ ${user.name}.`,
    openGraph: {
      url: `${process.env.BASE_URL}/dashboard/edit-profile`,
      title: `تعديل الملف الشخصي لـ ${user.name}`,
      description: `تحديث معلومات الملف الشخصي لـ ${user.name} على منصتنا.`,
      images: [
        {
          url: `${process.env.BASE_URL}/images/profile/${user.username}.jpg`,
          width: 800,
          height: 600,
          alt: `صورة الملف الشخصي لـ ${user.name}`
        }
      ]
    }
  }
}

 async function uploadUserPhoto(img: File) {
  "use server"
  const user = await getUserAuthenticated() as userResponse
  if(!user) return redirect("/auth/signin")
  const imgUrl = await User.uploadImg(img, user.username)
  await updateUserAuthenticated({
    ...user,
    photo: imgUrl
  })
  return { imgUrl }
}

 async function updateProfile(formData: FormData) {
  "use server"
  const user = await getUserAuthenticated() as userResponse
  
  if (!user) {
    redirect('/')
  }
  
  const data = Object.fromEntries(formData)
  return await User.editProfile({
    username: user.username,
    newUsername: data.newUsername as string,
    instagram: data.instagram as string,
    bio: data.bio as string,
    facebook: data.facebook as string,
    twitter: data.twitter as string,
    youtube: data.youtube as string,
    website: data.website as string
  })
}

export default async function EditProfilePage() {
  const user = await getUserAuthenticated() as userResponse
  const userData = await User.getProfile({ username: user.username })

  return (
    <EditProfileForm initialData={userData.data} onUpdateProfile={updateProfile} onUploadUserPhoto={uploadUserPhoto} />
  )
}