export const dynamic = 'force-dynamic'

import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getUserAuthenticated } from "@/app/services/auth.server"
import { NotAllowed } from "@/app/components/NotAllowed"
import IndexPostCreatePage from "./index"
import Post from "@/app/controllers/Post.server"
import { userResponse } from "@/app/controllers/User.server"

export const metadata: Metadata = {
    title: "كتابة منشور جديد | موريشير - منصة المحتوى الموريتاني",
    description: "انشر محتواك على موريشير، المنصة الموريتانية الرائدة للمحتوى العربي. شارك مقالاتك، أفكارك، وخبراتك مع مجتمع متفاعل من القراء والكتاب الموريتانيين",
    keywords: "موريشير، منصة نشر، مدونة، كتابة المقالات، محتوى موريتاني، نشر المحتوى، مقالات عربية",
    robots: "index, follow",
    alternates: {
        canonical: `${process.env.BASE_URL}/post/create`
    },
    openGraph: {
        title: "كتابة منشور جديد | موريشير - منصة المحتوى الموريتاني",
        description: "انشر محتواك على موريشير، المنصة الموريتانية الرائدة للمحتوى العربي. شارك مقالاتك، أفكارك، وخبراتك مع مجتمع متفاعل من القراء والكتاب الموريتانيين",
        url: `${process.env.BASE_URL}/post/create`,
        type: "website",
        siteName: "موريشير",
        locale: "ar_MR",
        images: [
            {
                url: `${process.env.BASE_URL}/images/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "موريشير - منصة النشر الموريتانية الرائدة",
                type: "image/jpeg"
            }
        ]
    },
    twitter: {
        card: "summary_large_image",
        title: "كتابة منشور جديد | موريشير",
        creator: "@maurishare",
        site: "@maurishare",
        description: "انشر محتواك على موريشير، المنصة الموريتانية الرائدة للمحتوى العربي",
        images: [{
            url: `${process.env.BASE_URL}/images/og-image.jpg`,
            alt: "موريشير - منصة النشر الموريتانية الرائدة"
        }]
    }
}


async function uploadBanner(img: File) {
  "use server"
  const user = await getUserAuthenticated() as userResponse & {can_create_post: boolean}
  if (!user) redirect("/auth/signin")
  if (!user.can_create_post) redirect("/")
  const imgUrl = await Post.uploadImgPost(img)
  if(imgUrl) {
    return { status: "success", location: imgUrl, message: null }
  }
  return { status: "error", message: "حدث خطأ ما أثناء تحميل الصورة", location: null }
}

async function createPost({img, title, des, tags, content, draft}: {img: string, title: string, des: string, tags: string[], content: string, draft: boolean}) {
  "use server"
  const user = await getUserAuthenticated() as userResponse & {can_create_post: boolean}
  if (!user) redirect("/auth/signin")
  if (!user.can_create_post) redirect("/")
  
  const processedTags : string[] = tags.length === 0 ? [] : [...tags.toString().split(",")]

  return await Post.create({ 
    img, 
    title, 
    des, 
    tags: processedTags, 
    content, 
    draft, 
    user 
  })
}

async function updatePost({img, title, des, tags, content, draft, id}: {img: string, title: string, des: string, tags: string[], content: string, draft: boolean, id: string}) {
  "use server"
  const user = await getUserAuthenticated() as userResponse & {can_create_post: boolean}
  if (!user) redirect("/auth/signin")
  if (!user.can_create_post) redirect("/")

  const processedTags : string[] = tags.length === 0 ? [] : [...tags.toString().split(",")]

  return await Post.edit({ img, title, des, tags: processedTags, content, draft, id, user })
}

export default async function CreatePostPage() {
  const user = await getUserAuthenticated() as userResponse & {can_create_post: boolean}
  if (!user) {
    redirect("/auth/signin")
  }

  if (!user.can_create_post) {
    return <NotAllowed message="عفوا، لقد تم منعك من النشر، رجاء تواصل مع إدارة الموقع." />
  }

  return <IndexPostCreatePage onCreate={createPost} onUpload={uploadBanner} onUpdate={updatePost} />
}