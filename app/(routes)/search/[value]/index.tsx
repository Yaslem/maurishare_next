'use client'

import { useState } from 'react'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import LoadMoreDataBtn from '@/app/components/LoadMoreDataBtn'
import Loader from '@/app/components/Loader'
import NoDataMessage from '@/app/components/NoDataMessage'
import PostCard from '@/app/components/PostCard'
import UserCard from '@/app/components/UserCard'
import InPageNavigation from '@/app/components/inPageNavigation'
import { type sendResponseServer } from '@/app/helpers/SendResponse.server'
import { type PostResponse } from '@/app/controllers/Post.server'
import { type userResponse } from '@/app/controllers/User.server'

interface SearchIndexProps {
  initialPosts: Awaited<ReturnType<typeof sendResponseServer<{results: PostResponse[], page: number, count: number} | null>>>
  users: Awaited<ReturnType<typeof sendResponseServer<userResponse[] | null>>>
  searchValue: string
  onSearch: ({ value, page }: { value: string, page?: number }) => Promise<Awaited<ReturnType<typeof sendResponseServer<{results: PostResponse[], page: number, count: number} | null>>>>
}

export default function SearchIndex({ initialPosts, users, searchValue, onSearch }: SearchIndexProps) {
  const [postsList, setPostsList] = useState(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  
  async function loadMorePosts() {
    setIsLoading(true)
    if(!postsList.data) return
    const response = await onSearch({ value: searchValue, page: postsList.data.page + 1 })
    if(response.status === "success" && response.data && postsList.data) {
      setPostsList((prev: typeof postsList) => {
        if(!prev.data || !response.data) return prev
        return {
          ...prev,
          data: {
            ...prev.data,
            page: response.data.page || prev.data.page,
            count: response.data.count || prev.data.count,
            results: [...prev.data.results, ...(response.data.results || [])]
          }
        }
      })
    }
    setIsLoading(false)
  }

  const UserCardWrapper = () => (
    <>
      {users.status === "error" ? (
        <NoDataMessage message={users.message} />
      ) : (
        users.data?.map((user: userResponse, i: number) => (
          <AnimationWrapper key={i} transition={{ duration: 1, delay: i * 0.88 }}>
            <UserCard user={user} />
          </AnimationWrapper>
        ))
      )}
    </>
  )

  return (
    <section className="h-cover flex justify-center gap-10">
      <div className="w-full">
        <InPageNavigation 
          routes={[`نتيجة البحث عن "${searchValue}"`, "المستخدمون"]} 
          defaultHidden={["المستخدمون"]}
          defaultActiveIndex={0}
        >
          <>
            {isLoading ? (
              <Loader />
            ) : postsList.status === "error" ? (
              <NoDataMessage message={postsList.message} />
            ) : (
              postsList.data?.results.map((post: PostResponse, i: number) => (
                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                  <PostCard post={post} author={post.author as userResponse} />
                </AnimationWrapper>
              ))
            )}
            
            <LoadMoreDataBtn 
              state={postsList}
              getDataPagination={loadMorePosts}
              isPending={isLoading}
            />
          </>
          <UserCardWrapper />
        </InPageNavigation>
      </div>

      <div className="min-w-[40%] lg:min-w-[350px] max-w-min border-r border-grey pr-8 pt-3 max-md:hidden">
        <h1 className="font-medium text-xl mb-8 flex gap-2">
            <i className="fi fi-rr-user mt-1"></i>
            <span>مستخدمون لهم علاقة بالبحث</span>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  )
}