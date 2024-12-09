"use client"

import { useEffect, useState } from "react"
import AnimationWrapper from "./AnimationWrapper"
import PostCard from "./PostCard"
import NoDataMessage from "./NoDataMessage"
import Loader from "./Loader"
import LoadMoreDataBtn from "./LoadMoreDataBtn"
import { useSearchParams } from "next/navigation"
import { type PostResponse } from "@/app/controllers/Post.server"
import { sendResponseServer } from '@/app/helpers/SendResponse.server';
import { type userResponse } from "@/app/controllers/User.server"
export function PostsList({ 
  initialPosts, 
  getPosts, 
  searchPosts 
}: {
  initialPosts: Awaited<ReturnType<typeof sendResponseServer<{
    results: PostResponse[]
    page: number
    count: number
  } | null>>>
  getPosts: (page: number) => Promise<Awaited<ReturnType<typeof sendResponseServer<{
    results: PostResponse[]
    page: number
    count: number
  } | null>>>>
  searchPosts: (tag: string, page: number) => Promise<Awaited<ReturnType<typeof sendResponseServer<{
    results: PostResponse[]
    page: number
    count: number
  } | null>>>>
}) {
  const [posts, setPosts] = useState<Awaited<ReturnType<typeof sendResponseServer<{
    results: PostResponse[]
    page: number
    count: number
  } | null>>>>(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || "الرئيسية"
  
  async function loadMore() {
    setIsLoading(true)
    if (posts.data) {
      const nextPage = posts.data.page + 1
      const newPosts = category === "الرئيسية" 
        ? await getPosts(nextPage)
        : await searchPosts(category, nextPage)

      if (newPosts.data) {
        setPosts((prev: typeof posts) => {
          if (!prev.data) return newPosts;
          return {
            ...newPosts,
            data: {
              ...newPosts.data,
              results: [...prev.data.results, ...(newPosts.data?.results ?? [])],
              page: newPosts.data?.page ?? prev.data.page,
              count: newPosts.data?.count ?? prev.data.count
            }
          };
        });
      } else {
        setPosts(prev => {
          if (!prev.data) return newPosts;
          return {
            ...newPosts,
            data: newPosts.data
          };
        });
      }
    }
    setIsLoading(false)
  }

  useEffect(() => {
    async function fetchPosts() {
      setIsLoading(true)
      const newPosts = category === "الرئيسية"
        ? await getPosts(1)
        : await searchPosts(category, 1)
      setPosts(newPosts)
      setIsLoading(false)
    }

    if (category !== "الرئيسية") {
      fetchPosts()
    } else {
      setPosts(initialPosts)
    }
  }, [category, getPosts, initialPosts, searchPosts])

  if (isLoading) return <Loader />
  if (posts.status === "error") return <NoDataMessage message={posts.message} />

  return (
    <>
      {posts.data?.results.map((post: PostResponse, i: number) => (
        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={post.id}>
          <PostCard post={post} author={post.author as userResponse} />
        </AnimationWrapper>
      ))}
      <LoadMoreDataBtn 
        isPending={isLoading}
        getDataPagination={loadMore} 
        state={{
          ...posts,
          data: {
            results: (posts.data?.results ?? []).map((post: PostResponse) => ({
              ...post,
              author: post.author as userResponse
            })),
            page: posts.data?.page ?? 1,
            count: posts.data?.count || 0
          }
        }} 
      />
    </>
  )
}