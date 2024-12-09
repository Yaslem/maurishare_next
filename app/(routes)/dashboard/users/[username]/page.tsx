export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserAuthenticated } from '@/app/services/auth.server'
import User, { userResponse } from '@/app/controllers/User.server'
import EditProfileForm from './index'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const username = (await params).username
  const userData = await User.getProfileByAdmin({ username })
  
  if (!userData.data) {
    return {
      title: "لا يوجد مستخدم",
      description: "لا يوجد مستخدم بهذا الاسم"
    }
  }
  
  return {
    title: `معلومات ${userData.data.name} (@${userData.data.username}) - لوحة التحكم`,
    description: `صفحة إدارة حساب ${userData.data.name} - ${userData.data.bio || 'عضو في منصتنا'}`,
    openGraph: {
      title: `معلومات ${userData.data.name} (@${userData.data.username})`,
      description: userData.data.bio || `صفحة إدارة حساب ${userData.data.name}`,
      type: 'profile',
      url: `${process.env.BASE_URL}/dashboard/users/${userData.data.username}`,
      images: [
        {
          url: userData.data.photo || `${process.env.BASE_URL}/default-avatar.png`,
          width: 200,
          height: 200,
          alt: `صورة ${userData.data.name}`
        }
      ]
    },
    twitter: {
      card: 'summary',
      title: `معلومات ${userData.data.name} (@${userData.data.username})`,
      description: userData.data.bio || `صفحة إدارة حساب ${userData.data.name}`,
      images: [userData.data.photo || `${process.env.BASE_URL}/default-avatar.png`]
    },
    robots: {
      index: false,
      follow: false
    }
  }
}

async function uploadUserPhoto(img: File) {
  "use server"
  const user = await getUserAuthenticated() as userResponse & { role: "ADMIN" | "USER" } | null
  
  if (!user) {
    return redirect('/auth/signin')
  }
  
  if (user?.role !== "ADMIN") {
    return redirect('/')
  }

  const imgUrl = await User.uploadImg(img, user.username)
  return { imgUrl }
}

async function updateProfile(formData: FormData) {
  "use server"
  const user = await getUserAuthenticated() as userResponse & { role: "ADMIN" | "USER" } | null
  
  if (!user || user.role !== "ADMIN") {
    return redirect('/auth/signin')
  }
  
  const data = Object.fromEntries(formData)
  
  try {
    return await User.editProfileByAdmin({
      can_update_post: data.can_update_post === "true",
      can_create_post: data.can_create_post === "true",
      can_delete_post: data.can_delete_post === "true",
      can_create_comment: data.can_create_comment === "true",
      username: data.username as string,
      newUsername: data.newUsername as string,
      instagram: data.instagram as string,
      bio: data.bio as string,
      facebook: data.facebook as string,
      twitter: data.twitter as string,
      youtube: data.youtube as string,
      website: data.website as string,
      name: data.name as string,
      email: data.email as string
    })
  } catch {
    return redirect('/')
  }
}

export default async function EditProfilePage({ params }: PageProps) {
  const user = await getUserAuthenticated() as userResponse & { role: "ADMIN" | "USER" } | null
  
  if (!user || user.role !== "ADMIN") {
    return redirect('/')
  }

  const username = (await params).username
  const userData = await User.getProfileByAdmin({ username })
  if (!userData || !userData.data) {
    return redirect('/')
  }

  return (
    <EditProfileForm initialData={userData.data as userResponse & { can_create_post: boolean, can_update_post: boolean, can_delete_post: boolean, can_create_comment: boolean, totalPosts: number, totalReads: number }} onUpdateProfile={updateProfile} onUploadUserPhoto={uploadUserPhoto} />
  )
}