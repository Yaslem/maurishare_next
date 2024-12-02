'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import ManageDraftPost from '@/app/components/ManageDraftPost'
import ManagePublishedPostCard from '@/app/components/ManagePublishedPostCard'
import NoDataMessage from '@/app/components/NoDataMessage' 
import InPageNavigation from '@/app/components/inPageNavigation'
import LoadMoreDataBtn from '@/app/components/LoadMoreDataBtn'

export default function DashboardPostsIndex({ 
  onSearchPost,
  onDeletePost,
  onLoadMorePosts,
  initialPosts, 
  initialDrafts, 
  user,
  defaultTab 
}: {
  onSearchPost: any,
  onDeletePost: any,
  onLoadMorePosts: any,
  initialPosts: any,
  initialDrafts: any,
  user: any,
  defaultTab: number
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [drafts, setDrafts] = useState(initialDrafts)
  const [searchValue, setSearchValue] = useState('')
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const handleSearch = async (value: string) => {
    if (!value.trim()) {
      setPosts(initialPosts)
      setDrafts(initialDrafts)
      return
    }

    console.log(value)

    startTransition(async () => {
      const result = await onSearchPost(value)
      setPosts(result.posts)
      setDrafts(result.drafts)
    })
  }

  const handleDelete = async (postId: string) => {
    if (!user.can_delete_post) return

    startTransition(async () => {
      const result = await onDeletePost(postId)
      
      if (result.status === 'error') {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.refresh()
    })
  }

  const handleLoadMore = async (type: 'posts' | 'drafts', page: number) => {
    startTransition(async () => {
      const result = await onLoadMorePosts({
        type,
        page,
        username: user.username
      })

      if (type === 'posts') {
        setPosts((prev : any) => ({
          ...prev,
          data: {
            ...prev.data,
            page: result.data.page,
            results: [...prev.data.results, ...result.data.results]
          }
        }))
      } else {
        setDrafts((prev : any) => ({
          ...prev,
          data: {
            ...prev.data,
            page: result.data.page,
            results: [...prev.data.results, ...result.data.results]
          }
        }))
      }
    })
  }

  return (
    <>
      <h1 className="max-md:hidden">المنشورات</h1>
      
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          type="text"
          placeholder="بحث عن منشورات"
          className="w-full bg-grey p-4 pr-12 rounded-full placeholder:text-dark-grey"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value)
            handleSearch(e.target.value)
          }}
        />
        <i className="fi fi-rr-search absolute left-[10%] md:pointer-events-none md:right-5 top-1/2 text-xl text-dark-grey -translate-y-1/2" />
      </div>

      <InPageNavigation 
        defaultActiveIndex={defaultTab} 
        routes={["المنشورة", "المسودة"]}
      >
        {posts.status !== "error" ? (
          <>
            {posts.data.results.map((post : any, i : number) => (
              <AnimationWrapper key={post.id} transition={{ delay: i * 0.04 }}>
                <ManagePublishedPostCard 
                  user={user} 
                  post={post}
                  onDeletePost={() => handleDelete(post.id)}
                />
              </AnimationWrapper>
            ))}
            <LoadMoreDataBtn
              getDataPagination={() => handleLoadMore('posts', posts.data.page + 1)}
              state={posts}
            />
          </>
        ) : (
          <NoDataMessage message="لا توجد منشورات" />
        )}

        {drafts.status !== "error" ? (
          <>
            {drafts.data.results.map((post : any, i : number) => (
              <AnimationWrapper key={post.id} transition={{ delay: i * 0.04 }}>
                <ManageDraftPost 
                  post={post} 
                  index={i + 1}
                  onDeletePost={() => handleDelete(post.id)}
                />
              </AnimationWrapper>
            ))}
            <LoadMoreDataBtn
              getDataPagination={() => handleLoadMore('drafts', drafts.data.page + 1)}
              state={drafts}
            />
          </>
        ) : (
          <NoDataMessage message="لا توجد مسودات" />
        )}
      </InPageNavigation>
    </>
  )
}