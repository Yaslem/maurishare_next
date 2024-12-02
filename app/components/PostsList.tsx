"use client"

import { useEffect, useState } from "react"
import AnimationWrapper from "./AnimationWrapper"
import PostCard from "./PostCard"
import NoDataMessage from "./NoDataMessage"
import Loader from "./Loader"
import LoadMoreDataBtn from "./LoadMoreDataBtn"
import { useSearchParams, useRouter } from "next/navigation"

export function PostsList({ 
  initialPosts, 
  getPosts, 
  searchPosts 
}: {
  initialPosts: any
  getPosts: any
  searchPosts: any
}) {
  const [posts, setPosts] = useState(initialPosts)
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const category = searchParams.get("category") || "الرئيسية"
  
  async function loadMore() {
    setIsLoading(true)
    const nextPage = posts.data.page + 1
    const newPosts = category === "الرئيسية" 
      ? await getPosts(nextPage)
      : await searchPosts(category, nextPage)
      
    setPosts(prev => ({
      ...newPosts,
      data: {
        ...newPosts.data,
        results: [...prev.data.results, ...newPosts.data.results]
      }
    }))
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
  }, [category])

  if (isLoading) return <Loader />
  if (posts.status === "error") return <NoDataMessage message={posts.message} />

  return (
    <>
      {posts.data.results.map((post: any, i: number) => (
        <AnimationWrapper transition={{ duration: 1, delay: i * .1 }} key={post.id}>
          <PostCard content={post} author={post.author} />
        </AnimationWrapper>
      ))}
      <LoadMoreDataBtn 
        getDataPagination={loadMore} 
        state={posts} 
      />
    </>
  )
}