export const dynamic = 'force-dynamic'
import { redirect } from 'next/navigation'
import { getUserAuthenticated } from '@/app/services/auth.server'
import Post from '@/app/controllers/Post.server'
import DashboardAllPostsIndex from './index'
import { Metadata } from 'next'
import { revalidatePath } from 'next/cache'
import { type userResponse } from '@/app/controllers/User.server'

export async function generateMetadata(): Promise<Metadata> {
  const posts = await Post.getPostsByAdmin({ page: 1 })
  return {
    title: "الرئيسية - المنشورات" + ` (${posts.data?.count ?? 0})`,
    description: "إدارة جميع المنشورات والمسودات في لوحة التحكم",
    robots: "noindex, nofollow",
    openGraph: {
      title: "الرئيسية - المنشورات",
      description: "إدارة جميع المنشورات والمسودات في لوحة التحكم",
      type: 'website',
      locale: 'ar_SA',
    },
    twitter: {
      card: 'summary',
      title: "الرئيسية - المنشورات",
      description: "إدارة جميع المنشورات والمسودات في لوحة التحكم",
    },
    alternates: {
      canonical: '/dashboard/all-posts'
    }
  }
}

async function searchPosts(value: string, page: number) {
  "use server"
  const posts = await Post.searchQuery({ value, page })
  const drafts = await Post.searchDraftQuery({ value, page })
  return { posts, drafts }
}

async function loadMorePosts(page: number) {
  "use server"
  return await Post.getPostsByAdmin({ page })
}

async function loadMoreDrafts(page: number) {
  "use server"
  return await Post.getPostsDraftByAdmin({ page })
}

async function deletePost(postId: string) {
  "use server"
  const user = await getUserAuthenticated() as userResponse & {can_delete_post: boolean}
  if (!user.can_delete_post) redirect("/dashboard/posts")
  const response = await Post.delete({ postId, user })
  if (response.status === "success") {
    revalidatePath("/dashboard/all-posts")
  }
  return
}

async function publishPost(postId: string, value: boolean) {
  "use server"
  const response = await Post.publish({ postId, value })
  if (response.status === "success") {
    revalidatePath("/dashboard/all-posts")
  }
  return response
}

export default async function DashboardAllPostsPage() {
  const user = await getUserAuthenticated() as userResponse & {role: string}
  
  if (user.role !== "ADMIN") {
    redirect("/")
  }

  const posts = await Post.getPostsByAdmin({ page: 1 })
  const drafts = await Post.getPostsDraftByAdmin({ page: 1 })

  return <DashboardAllPostsIndex onSearch={searchPosts} onLoadMorePosts={loadMorePosts} onLoadMoreDrafts={loadMoreDrafts} onDeletePost={deletePost} onPublishPost={publishPost} initialPosts={posts} initialDrafts={drafts} user={user} />
}