export const dynamic = 'force-dynamic'

import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { revalidatePath } from "next/cache"

import AnimationWrapper from "@/app/components/AnimationWrapper"
import AboutUser from "@/app/components/AboutUser"
import LoadMorePosts from "@/app/components/LoadMorePosts"
import InPageNavigation from "@/app/components/inPageNavigation"
import User from "@/app/controllers/User.server"
import Post from "@/app/controllers/Post.server"
import { getUserAuthenticated } from "@/app/services/auth.server"
import { Metadata } from 'next'

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const username = (await params).username
  const user = await User.getProfile({ username })
  if (!user || user.status === "error") return {}
  
  return {
    title: `${user.data?.name} (@${user.data?.username}) - كاتب في الموقع`,
    description: user.data?.bio || `تعرف على ${user.data?.name}، كاتب محتوى متخصص. قرأ مقالاته وتفاعل مع محتواه.`,
    openGraph: {
      title: `${user.data?.name} (@${user.data?.username})`,
      description: user.data?.bio || "",
      images: [`${process.env.BASE_URL}/uploads/${user.data?.photo}`],
      type: 'profile',
    },
    twitter: {
      card: 'summary',
      title: `${user.data?.name} (@${user.data?.username})`,
      description: user.data?.bio || "",
      images: [`${process.env.BASE_URL}/uploads/${user.data?.photo}`],
    },
    alternates: {
      canonical: `${process.env.BASE_URL}/user/${user.data?.username}`,
    }
  }
}

async function loadMorePosts(username: string, page: number) {
  "use server"
  const posts = await Post.getPostsByUsername({ username, page })
  revalidatePath(`/user/${username}`)
  return posts
}

export default async function UserProfile({ params }: PageProps) {
  const username = (await params).username
  const user = await User.getProfile({ username })
  const initialPosts = await Post.getPostsByUsername({ username, page: 1 })
  const authUser = await getUserAuthenticated()
  
  if (!user || user.status === "error") {
    return notFound()
  }

  return (
    <AnimationWrapper>
      <section className="h-cover md:flex flex-row-reverse items-start gap-5 min-[1100px]:gap-12">
        <div className="flex flex-col max-md:items-center gap-5 min-w-[250px] md:w-[50%] md:pr-8 md:border-r border-grey md:sticky md:top-[100px] md:py-10">
          <Image 
            src={`/uploads/${user.data?.photo}`}
            alt={user.data?.username || ""}
            width={192}
            height={192}
            className="w-48 h-48 bg-grey rounded-full md:w-32 md:h-32"
          />
          <h1 className="text-2xl font-semibold">@{user.data?.username || ""}</h1>
          <p className="text-xl h-6">{user.data?.name || ""}</p>

          <p className="">{user.data?.account?.totalPosts.toLocaleString() || ""} منشورا - {user.data?.account?.totalReads.toLocaleString() || ""} قراءة</p>
          
          {authUser?.username === username && (
            <div className="flex gap-4 mt-2">
              <Link href="/dashboard/edit-profile" className="btn-light rounded-md">
                تعديل الملف الشخصي
              </Link>
            </div>
          )}
          
          <AboutUser 
            name={user.data?.name || ""}
            className="max-md:hidden"
            bio={user.data?.bio || ""}
            socialLinks={user.data?.socialLinks || {}}
            joinedAt={user.data?.createdAt?.toLocaleDateString() || ""}
          />
        </div>

        <div className="max-md:mt-12 w-full">
          <InPageNavigation routes={["المنشورات", "عن المستخدم"]} defaultHidden={["عن المستخدم"]} defaultActiveIndex={0}>
            <LoadMorePosts
              initialPosts={initialPosts}
              loadMoreAction={loadMorePosts}
              username={username}
            />
            <AboutUser 
              className=""
              name={user.data?.name || ""}
              bio={user.data?.bio || ""}
              socialLinks={user.data?.socialLinks || {}}
              joinedAt={user.data?.createdAt?.toLocaleDateString() || ""}
            />
          </InPageNavigation>
        </div>
      </section>
    </AnimationWrapper>
  )
}