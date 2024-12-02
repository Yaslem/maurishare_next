import { Metadata } from "next"
import { redirect } from "next/navigation"
import { getUserAuthenticated } from "@/app/services/auth.server"
import { NotAllowed } from "@/app/components/NotAllowed"
import IndexPostEditPage from "./index"
import Post from "@/app/controllers/Post.server"

interface Props {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const id = (await params).id
    const post = await Post.getPostById({id})
    return {
        title: `تعديل  منشور - ${post.data.title}`,
        description: post.data.des,
        robots: "noindex, nofollow",
        openGraph: {
        title: `تعديل منشور - ${post.data.title}`,
        description: post.data.des,
        url: `${process.env.BASE_URL}/post/edit/${id}`,
        type: "website",
        siteName: "موريشير",
        locale: "ar_MR",
        images: [
            {
                url: `${process.env.BASE_URL}/images/og-image.jpg`,
                width: 1200,
                height: 630,
                alt: "موريشير - منصة المحتوى الموريتاني"
            }
            ]
        },
        twitter: {
            card: "summary_large_image",
            title: `تعديل منشور - ${post.data.title}`,
            description: post.data.des,
            images: [`${process.env.BASE_URL}/images/og-image.jpg`],
        }
    }
}


export async function uploadBanner(img: File) {
  "use server"
  const user = await getUserAuthenticated()
  if (!user) redirect("/auth/signin")
  if (!user.can_create_post) redirect("/")
  const imgUrl = await Post.uploadImgPost(img)
  if(imgUrl) {
    return { status: "success", location: imgUrl }
  }
  return { status: "error", message: "حدث خطأ ما أثناء تحميل الصورة" }
}

export async function updatePost({img, title, des, tags, content, draft, id}: {img: string, title: string, des: string, tags: string[], content: string, draft: boolean, id: string}) {
  "use server"
  const user = await getUserAuthenticated()
  if (!user) redirect("/auth/signin")
  if (!user.can_update_post) redirect("/")

  const processedTags : string[] = tags.length === 0 ? [] : [...tags.toString().split(",")]

  return await Post.edit({ img, title, des, tags: processedTags, content, draft, id, user })
}

export default async function EditPostPage({ params }: Props) {
  const user = await getUserAuthenticated()
  const id = (await params).id
  const post = await Post.getPostById({id})
  if (!user) {
    redirect("/auth/signin")
  }

  if (!user.can_update_post) {
    return <NotAllowed message="عفوا، لقد تم منعك من التعديل، رجاء تواصل مع إدارة الموقع." />
  }

  return <IndexPostEditPage post={post.data} onUpload={uploadBanner} onUpdate={updatePost} user={user} />
}