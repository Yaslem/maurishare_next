'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-hot-toast'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import ManageDraftPost from '@/app/components/ManageDraftPost'
import ManagePublishedPostCard from '@/app/components/ManagePublishedPostCard'
import NoDataMessage from '@/app/components/NoDataMessage'
import InPageNavigation from '@/app/components/inPageNavigation'
import LoadMoreDataBtn from '@/app/components/LoadMoreDataBtn'
import { type sendResponseServer } from '@/app/helpers/SendResponse.server'
import { type PostResponse } from '@/app/controllers/Post.server'
import { type userResponse } from '@/app/controllers/User.server'

interface DashboardAllPostsProps {
  onSearch: (value: string, page: number) => Promise<
  {
    posts: Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, results: PostResponse[]} | null>>>,
    drafts: Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, results: PostResponse[]}| null>>>
  }
  >,
  onLoadMorePosts: (page: number) => Promise<Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, results: PostResponse[]} | null>>>>,
  onLoadMoreDrafts: (page: number) => Promise<Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, results: PostResponse[]}| null>>>>,
  onDeletePost: (postId: string) => Promise<void>,
  onPublishPost: (postId: string, value: boolean) => Promise<Awaited<ReturnType<typeof sendResponseServer<{postId: string} | null>>>>,
  initialPosts: Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, results: PostResponse[]} | null>>>,
  initialDrafts: Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, results: PostResponse[]}| null>>>,
  user: userResponse
}

export default function DashboardAllPostsIndex({ onSearch, onLoadMorePosts, onLoadMoreDrafts, onDeletePost, onPublishPost, initialPosts, initialDrafts, user }: DashboardAllPostsProps) {
  const [postsList, setPostsList] = useState(initialPosts)
  const [draftsList, setDraftsList] = useState(initialDrafts)
  const [value, setValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [isPending, setIsPending] = useState(false)

  useEffect(() => {
    setPostsList(initialPosts)
    setDraftsList(initialDrafts)
  }, [initialPosts, initialDrafts])

  const handleSearch = async () => {
    if (!value.length) return
    setIsSearching(true)
    try {
      const { posts, drafts } = await onSearch(value, 1)
      setPostsList(posts)
      setDraftsList(drafts)
    } catch {
      toast.error("حدث خطأ في البحث")
    }
    setIsSearching(false)
  }

  const handleLoadMorePosts = async () => {
    setIsPending(true)
    try {
      const newPosts = await onLoadMorePosts(postsList.data ? postsList.data.page + 1 : 1)
      setPostsList((prev: typeof postsList) => {
        if (!newPosts.data || !prev.data) return prev
        return {
          ...prev,
          data: {
            ...prev.data,
            page: newPosts.data.page || prev.data.page,
            count: newPosts.data.count || prev.data.count,
            results: [...prev.data.results, ...newPosts.data.results]
          }
        }
      })
    } catch {
      toast.error("حدث خطأ في تحميل المزيد من المنشورات")
    }
    setIsPending(false)
  }

  const handleLoadMoreDrafts = async () => {
    setIsPending(true)
    try {
      const newDrafts = await onLoadMoreDrafts(draftsList.data ? draftsList.data.page + 1 : 1)
      setDraftsList((prev: typeof draftsList) => {
        if (!newDrafts.data || !prev.data) return prev
        return {
          ...prev,
          data: {
            ...prev.data,
            page: newDrafts.data.page || prev.data.page,
            count: newDrafts.data.count || prev.data.count,
            results: [...prev.data.results, ...newDrafts.data.results]
          }
        }
      })
    } catch {
      toast.error("حدث خطأ في تحميل المزيد من المسودات")
    }
    setIsPending(false)
  }

  return (
    <>
      <h1 className="max-md:hidden">المنشورات</h1>
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value
            setValue(newValue)
            if (!newValue) {
              setPostsList(initialPosts)
              setDraftsList(initialDrafts)
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
          type="text"
          placeholder="بحث عن منشورات"
          className="w-full bg-grey p-4 pr-12 rounded-full placeholder:text-dark-grey"
          disabled={isSearching}
        />
        <i className="fi fi-rr-search absolute left-[10%] md:pointer-events-none md:right-5 top-1/2 text-xl text-dark-grey -translate-y-1/2" />
      </div>

      <InPageNavigation
        defaultActiveIndex={0}
        routes={["المنشورة", "المسودة"]}
        defaultHidden={[]}
      >
        {postsList.status !== "error" ? (
          <>
            {postsList.data?.results.map((post: PostResponse, i: number) => (
              <AnimationWrapper key={post.id} transition={{ delay: i * 0.04 }}>
                <ManagePublishedPostCard onPublishPost={onPublishPost} onDeletePost={onDeletePost} user={user as userResponse & { can_delete_post: boolean, role: string }} post={post} />
              </AnimationWrapper>
            ))}
            <LoadMoreDataBtn
              getDataPagination={handleLoadMorePosts}
              state={postsList}
              isPending={isPending}
            />
          </>
        ) : (
          <NoDataMessage message="لا توجد منشورات" />
        )}
        
        {
          draftsList.status !== "error"
          ? (
            <>
              {
                draftsList.data?.results.map((post: PostResponse, i: number) => (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <ManageDraftPost onDeletePost={onDeletePost} post={post} index={i + 1} />
                  </AnimationWrapper>
                ))
              }
              <LoadMoreDataBtn getDataPagination={handleLoadMoreDrafts} state={draftsList} isPending={isPending} />
            </>
          ) : (
            <NoDataMessage message={"لا توجد مسودات"} />
          )
        }
      </InPageNavigation>
    </>
  )
}