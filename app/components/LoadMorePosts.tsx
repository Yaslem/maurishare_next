"use client"

import { useState } from "react"
import AnimationWrapper from "./AnimationWrapper"
import PostCard from "./PostCard"
import NoDataMessage from "./NoDataMessage"
import LoadMoreDataBtn from "./LoadMoreDataBtn"
import { sendResponseServer } from "../helpers/SendResponse.server"
import { PostResponse } from "../controllers/Post.server"
import { userResponse } from "../controllers/User.server"

interface LoadMorePostsProps {
    initialPosts: Awaited<ReturnType<typeof sendResponseServer<{results: PostResponse[], page: number, count: number} | null>>>;
    loadMoreAction: (username: string, page: number) => Promise<Awaited<ReturnType<typeof sendResponseServer<{results: PostResponse[], page: number, count: number} | null>>>>;
    username: string;
}

export default function LoadMorePosts({ initialPosts, loadMoreAction, username }: LoadMorePostsProps) {
  const [posts, setPosts] = useState(initialPosts)
  const [isLoading, setIsLoading] = useState(false)

  async function loadMore() {
    setIsLoading(true)
    const newPosts = await loadMoreAction(username, posts.data ? posts.data.page + 1 : 1)
    
    if (newPosts.status !== "error") {
      setPosts((prev: typeof posts) => {
        if (prev.data && newPosts.data) {
          return {
            ...newPosts,
            data: {
              ...newPosts.data,
              results: [...prev.data.results, ...newPosts.data.results]
            }
          }
        }
        return prev
      })
    }
    setIsLoading(false)
  }

  return (
    <>
      {posts.status === "error" ? (
        <NoDataMessage message={posts.message} />
      ) : (
        <>
          {posts.data?.results.map((post: PostResponse, i: number) => (
            <AnimationWrapper 
              transition={{ duration: 1, delay: i * 0.1 }} 
              key={post.id}
            >
              <PostCard post={post} author={post.author as userResponse} />
            </AnimationWrapper>
          ))}
          {posts.data ? (
            <LoadMoreDataBtn isPending={isLoading} state={posts} getDataPagination={loadMore} />
          ) : null}
        </>
      )}
    </>
  )
}