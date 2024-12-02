"use client"

import { useEffect, useState } from "react"
import AnimationWrapper from "./AnimationWrapper"
import PostCard from "./PostCard"
import NoDataMessage from "./NoDataMessage"
import LoadMoreDataBtn from "./LoadMoreDataBtn"

export default function LoadMorePosts({ initialPosts, loadMoreAction, username }: { initialPosts: any, loadMoreAction: (username: string, page: number) => Promise<any>, username: string }) {
  const [posts, setPosts] = useState(initialPosts)
  const [isLoading, setIsLoading] = useState(false)

  async function loadMore() {
    setIsLoading(true)
    const newPosts = await loadMoreAction(username, posts.data.page + 1)
    
    if (newPosts.status !== "error") {
      setPosts((prev: any) => ({
        ...newPosts,
        data: {
          ...newPosts.data,
          results: [...prev.data.results, ...newPosts.data.results]
        }
      }))
    }
    setIsLoading(false)
  }

  return (
    <>
      {posts.status === "error" ? (
        <NoDataMessage message={posts.message} />
      ) : (
        <>
          {posts.data.results.map((post: any, i: number) => (
            <AnimationWrapper 
              transition={{ duration: 1, delay: i * 0.1 }} 
              key={post.id}
            >
              <PostCard content={post} author={post.author} />
            </AnimationWrapper>
          ))}
          <LoadMoreDataBtn isPending={isLoading} state={posts} getDataPagination={loadMore} />
        </>
      )}
    </>
  )
}