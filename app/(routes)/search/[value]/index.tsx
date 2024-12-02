'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import LoadMoreDataBtn from '@/app/components/LoadMoreDataBtn'
import Loader from '@/app/components/Loader'
import NoDataMessage from '@/app/components/NoDataMessage'
import PostCard from '@/app/components/PostCard'
import UserCard from '@/app/components/UserCard'
import InPageNavigation from '@/app/components/inPageNavigation'

interface SearchIndexProps {
  initialPosts: any
  users: any
  searchValue: string
  onSearch: ({ value, page }: { value: string, page?: number }) => Promise<{status: "success" | "error", message: string, data: any}>
}

export default function SearchIndex({ initialPosts, users, searchValue, onSearch }: SearchIndexProps) {
  const [postsList, setPostsList] = useState(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  
  async function loadMorePosts() {
    setIsLoading(true)
    const response = await onSearch({ value: searchValue, page: postsList.data.page + 1 })
    if(response.status === "success") {
      setPostsList((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          results: [...prev.data.results, ...response.data.results]
        }
      }))
    }
    setIsLoading(false)
  }

  const UserCardWrapper = () => (
    <>
      {users.status === "error" ? (
        <NoDataMessage message={users.message} />
      ) : (
        users.data.map((user: any, i: number) => (
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
              postsList.data.results.map((post: any, i: number) => (
                <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={i}>
                  <PostCard content={post} author={post.author} />
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
        <h1 className="font-medium text-xl mb-8">
          مستخدمون لهم علاقة بالبحث <i className="fi fi-rr-user mt-1"></i>
        </h1>
        <UserCardWrapper />
      </div>
    </section>
  )
}