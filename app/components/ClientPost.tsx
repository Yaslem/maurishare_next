'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import parse from 'html-react-parser'
import AnimationWrapper from './AnimationWrapper'
import getDay from '../common/Date'
import PostCard from './PostCard'
import PostInteraction from './PostInteraction'
import CommentContainer from './CommentContainer'

export default function ClientPost({ post, similar, user, isLikeUser, initialComments, likePost, addCommentPost, deleteCommentPost, loadMoreComments, addReplyCommentPost } : { post: any, similar: any, user: any, isLikeUser: boolean, initialComments: any, likePost: any, addCommentPost: any, deleteCommentPost: any, loadMoreComments: any, addReplyCommentPost: any }) {
  const [commentsList, setCommentsList] = useState(initialComments)
  const [commentWrapper, setCommentWrapper] = useState(false)

  const handleLike = async () => {
    await likePost(post.slug, !isLikeUser)
  }

  const handleAddComment = async (comment : string) => {
    if (!user?.can_create_comment) return
    const result = await addCommentPost(post.slug, comment)
    if (result.status === 'success') {
      setCommentsList((prev : any) => ({
        ...prev,
        data: {
          ...prev.data,
          results: [result.data, ...prev.data.results]
        }
      }))
    }
    return result
  }

  const handleLoadMoreComments = async (page: number) => {
    const newComments = await loadMoreComments(post.slug, page)
    if (newComments.status === 'success') {
      setCommentsList((prev : any) => ({
        ...prev,
        data: {
          ...prev.data,
          results: [...prev.data.results, ...newComments.data.results]
        }
      }))
    }
  }

  const handleDeleteComment = async (id: number) => {
    const result = await deleteCommentPost(post.slug, id)
    if (result.status === 'success') {
      setCommentsList((prev: any) => ({
        ...prev,
        data: {
          ...prev.data,
          results: prev.data.results.map((comment: any) => {
            if (comment.id === id) {
              return null;
            }
            if (comment.children?.length > 0) {
              return {
                ...comment,
                children: comment.children.filter((child: any) => child.id !== id)
              }
            }
            return comment;
          }).filter(Boolean)
        }
      }))
    }
  }

  const handleAddReply = async (data : any) => {
    const result = await addReplyCommentPost(post.slug, data)
    if (result.status === 'success') {
      setCommentsList((prev : any) => ({
        ...prev,
        data: {
          ...prev.data,
          results: prev.data.results.map((comment : any) => comment.id === result.data.parent.id ? {...comment, children: [result.data, ...comment.children]} : comment)
        }
      }))
    }
    return result
  }

  return (
    <AnimationWrapper>
      <CommentContainer 
        comments={commentsList}
        user={user}
        post={post}
        setCommentWrapper={setCommentWrapper}
        commentWrapper={commentWrapper}
        onComment={handleAddComment}
        onReply={handleAddReply}
        onLoadMore={handleLoadMoreComments}
        onDeleteComment={handleDeleteComment}

      />
      
      <div className="max-w-[900px] center py-10 max-lg:px-[5vw]">
        <Image 
          src={post.banner}
          alt={post.title}
          width={900}
          height={500}
          className="aspect-video"
        />
        
        <div className="mt-12">
          <h2>{post.title}</h2>
          <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex items-start gap-5">
                    <img className="w-12 h-12 rounded-full" src={`/uploads/${post.author.photo}`}/>
                    <p>
                        {post.author.name}
                        <br />
                        @<Link className="underline" href={`/user/${post.author.username}`}>{post.author.username}</Link>
                    </p>
                </div>
                <p className="text-dark-grey opacity-75 max-sm:mt-6 max-sm:mr-12 max-sm:pr-5">نُشِر في {getDay(post.publishedAt)}</p>
            </div>
        </div>

        <PostInteraction 
          setCommentWrapper={setCommentWrapper}
          commentWrapper={commentWrapper}
          isLikeUser={isLikeUser}
          user={user}
          post={post}
          onLike={handleLike}
        />

        <div className="my-12 blog-page-content">
          {parse(post.content)}
        </div>

        {similar.length > 0 && (
          <>
            <hr className="border-grey my-2" />
            <h1 className="text-2xl mt-14 mb-10 font-semibold">المنشورات المشابهة</h1>
            {similar.map((post : any, i : number) => (
              <AnimationWrapper transition={{duration: 1, delay: i*0.88}} key={i}>
                <PostCard content={post} author={post.author} />
              </AnimationWrapper>
            ))}
          </>
        )}
      </div>
    </AnimationWrapper>
  )
}