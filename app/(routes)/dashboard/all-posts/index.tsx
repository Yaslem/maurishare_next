'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'react-hot-toast'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import ManageDraftPost from '@/app/components/ManageDraftPost'
import ManagePublishedPostCard from '@/app/components/ManagePublishedPostCard'
import NoDataMessage from '@/app/components/NoDataMessage'
import InPageNavigation from '@/app/components/inPageNavigation'
import LoadMoreDataBtn from '@/app/components/LoadMoreDataBtn'

export default function DashboardAllPostsIndex({ onSearch, onLoadMorePosts, onLoadMoreDrafts, onDeletePost, onPublishPost, initialPosts, initialDrafts, user }: { onSearch: any, onLoadMorePosts: any, onLoadMoreDrafts: any, onDeletePost: any, onPublishPost: any, initialPosts: any, initialDrafts: any, user: any }) {
  const router = useRouter()
  const [postsList, setPostsList] = useState(initialPosts)
  const [draftsList, setDraftsList] = useState(initialDrafts)
  const [value, setValue] = useState("")
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    setPostsList(initialPosts)
    setDraftsList(initialDrafts)
  }, [initialPosts, initialDrafts])

  const handleSearch = async () => {
    if (!value.length) return
    setIsSearching(true)
    try {
      const { posts, drafts } = await onSearch(value)
      setPostsList(posts)
      setDraftsList(drafts)
    } catch (error) {
      toast.error("حدث خطأ في البحث")
    }
    setIsSearching(false)
  }

  const handleLoadMorePosts = async () => {
    try {
      const newPosts = await onLoadMorePosts(postsList.data.page + 1)
      setPostsList((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          page: newPosts.data.page,
          results: [...prev.data.results, ...newPosts.data.results]
        }
      }))
    } catch (error) {
      toast.error("حدث خطأ في تحميل المزيد من المنشورات")
    }
  }

  const handleLoadMoreDrafts = async () => {
    try {
      const newDrafts = await onLoadMoreDrafts(draftsList.data.page + 1)
      setDraftsList((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          page: newDrafts.data.page,
          results: [...prev.data.results, ...newDrafts.data.results]
        }
      }))
    } catch (error) {
      toast.error("حدث خطأ في تحميل المزيد من المسودات")
    }
  }

  return (
    <>
      <h1 className="max-md:hidden">المنشورات</h1>
      <div className="relative max-md:mt-5 md:mt-8 mb-10">
        <input
          value={value}
          onChange={(e: any) => {
            const newValue = e.target.value
            setValue(newValue)
            if (!newValue) {
              setPostsList(initialPosts)
              setDraftsList(initialDrafts)
            }
          }}
          onKeyDown={(e: any) => e.key === 'Enter' && handleSearch()}
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
      >
        {postsList.status !== "error" ? (
          <>
            {postsList.data.results.map((post: any, i: number) => (
              <AnimationWrapper key={post.id} transition={{ delay: i * 0.04 }}>
                <ManagePublishedPostCard onPublishPost={onPublishPost} onDeletePost={onDeletePost} user={user} post={post} />
              </AnimationWrapper>
            ))}
            <LoadMoreDataBtn
              getDataPagination={handleLoadMorePosts}
              state={postsList}
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
                draftsList.data.results.map((post: any, i: number) => (
                  <AnimationWrapper key={i} transition={{ delay: i * 0.04 }}>
                    <ManageDraftPost onDeletePost={onDeletePost} post={post} index={i + 1} />
                  </AnimationWrapper>
                ))
              }
              <LoadMoreDataBtn getDataPagination={handleLoadMoreDrafts} state={draftsList} />
            </>
          ) : (
            <NoDataMessage message={"لا توجد مسودات"} />
          )
        }
      </InPageNavigation>
    </>
  )
}