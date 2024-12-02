export const dynamic = 'force-dynamic'

import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import DashboardPostsIndex from './index'
import Post from "@/app/controllers/Post.server"
import { getUserAuthenticated } from '@/app/services/auth.server'
import { revalidatePath } from 'next/cache'

 async function searchPosts(value: string) {
  "use server"
  const user = await getUserAuthenticated()
  if (!user) redirect('/auth/signin')
  return {
    posts: await Post.searchQueryByUser({ value, page: 1, user }),
    drafts: await Post.searchDraftQueryByUser({ value, page: 1, user })
  }
}

  async function deletePost(postId: string) {
  "use server"
  const user = await getUserAuthenticated()
  if (!user) redirect('/auth/signin')

  const response = await Post.delete({ 
    postId, 
    user
  })
  if (response.status === "success") {
    revalidatePath('/dashboard/posts')
  }
  return response
}

 async function loadMorePosts({ 
  type, 
  page, 
  username 
}: {
  type: 'posts' | 'drafts'
  page: number
  username: string
}) {
  "use server"
  if (type === 'posts') {
    return await Post.getPostsByUsername({ 
      username, 
      page 
    })
  }

  return await Post.getPostsDraftByUsername({ 
    username, 
    page 
  })
}

export async function generateMetadata(): Promise<Metadata> {
  const user = await getUserAuthenticated()
  return {
    title: `لوحة التحكم - المنشورات | ${user.name}`,
    description: `إدارة المنشورات والمسودات الخاصة بـ ${user.name}. قم بتحرير، حذف وإدارة جميع مقالاتك من مكان واحد.`,
    robots: "noindex, nofollow",
    openGraph: {
      title: `لوحة التحكم - المنشورات | ${user.name}`,
      description: `إدارة المنشورات والمسودات الخاصة بـ ${user.name}`,
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: `لوحة التحكم - المنشورات | ${user.name}`,
      description: `إدارة المنشورات والمسودات الخاصة بـ ${user.name}`,
    }
  }
}

export default async function DashboardPostsPage({
  searchParams,
}: {
  searchParams: { tap?: string }
}) {

  const user = await getUserAuthenticated()
  if (!user) redirect('/auth/signin')
  const posts = await Post.getPostsByUsername({ page: 1, username: user.username })
  const drafts = await Post.getPostsDraftByUsername({ page: 1, username: user.username })

  return (
    <DashboardPostsIndex 
      onSearchPost={searchPosts}
      onLoadMorePosts={loadMorePosts}
      onDeletePost={deletePost}
      initialPosts={posts}
      initialDrafts={drafts}
      user={user}
      defaultTab={searchParams.tap === 'draft' ? 1 : 0}
    />
  )
}