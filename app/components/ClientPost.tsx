'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import parse from 'html-react-parser'
import AnimationWrapper from './AnimationWrapper'
import getDay from '../common/Date'
import PostCard from './PostCard'
import PostInteraction from './PostInteraction'
import CommentContainer from './CommentContainer'
import { sendResponseServer } from '@/app/helpers/SendResponse.server'
import { CommentResponse, PostResponse } from '@/app/controllers/Post.server'
import { userResponse } from '@/app/controllers/User.server'
import { notFound } from 'next/navigation'
import toast from 'react-hot-toast'

export interface userResponseInPost extends userResponse {
  can_create_comment: boolean
}

interface ClientPostProps {
  post: PostResponse | null
  similar: PostResponse[] | null
  user: userResponseInPost | null
  isLikeUser: boolean
  initialComments: Awaited<ReturnType<typeof sendResponseServer<{results: CommentResponse[], page: number, count: number} | null>>>
  likePost: (slug: string, like: boolean) => Promise<Awaited<ReturnType<typeof sendResponseServer<null>>>>
  addCommentPost: ({slug, comment}: {slug: string, comment: string}) => Promise<Awaited<ReturnType<typeof sendResponseServer<CommentResponse | null>>>>
  deleteCommentPost: (slug: string, commentId: string) => Promise<Awaited<ReturnType<typeof sendResponseServer<null>>>>
  loadMoreComments: (slug: string, page: number) => Promise<Awaited<ReturnType<typeof sendResponseServer<{results: CommentResponse[], page: number, count: number} | null>>>>
  addReplyCommentPost: ({
    slug,
    replyingTo,
    comment,
    statusReply
  }: {slug: string, replyingTo: string, comment: string, statusReply: "reply" | "repliedOnComment"}) => Promise<Awaited<ReturnType<typeof sendResponseServer<CommentResponse | null>>>>
}

export default function ClientPost({ post, similar, user, isLikeUser, initialComments, likePost, addCommentPost, deleteCommentPost, loadMoreComments, addReplyCommentPost } : ClientPostProps) {
  const [commentsList, setCommentsList] = useState(initialComments)
  const [commentWrapper, setCommentWrapper] = useState(false)

  const handleLike = async () => {
    if (!post) return
    await likePost(post.slug, !isLikeUser)
  }

  const handleAddComment = async (comment : string) => {
    if (user && !user.can_create_comment) return { status: "error" };
    if (!post) return { status: "error" };
    const result = await addCommentPost({slug: post.slug, comment})
    const toastId = toast.loading("يتم إضافة التعليق...")
    if (result.status === 'success') {
      toast.success(result.message)
      setCommentsList((prev) => {
        if (!prev.data) return {
          ...result,
          data: {
            results: [result.data].filter((comment): comment is CommentResponse => comment !== null),
            page: 1,
            count: 1
          }
        };
        return {
          ...prev,
          data: {
            ...prev.data,
            results: [result.data, ...prev.data.results].filter((comment): comment is CommentResponse => comment !== null),
            page: prev.data.page,
            count: prev.data.count
          }
        };
      });
    } else {
      toast.error(result.message)
    }
    toast.dismiss(toastId)
    return {
      status: result.status,
    }
  }

  const handleLoadMoreComments = async (page: number) => {
    if (!post) return
    const newComments = await loadMoreComments(post.slug, page)
    if (newComments.status === 'success' && newComments.data) {
      setCommentsList((prev) => {
        if (!prev.data || !newComments.data) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            results: [...prev.data.results, ...newComments.data.results].filter((comment): comment is CommentResponse => comment !== null),
            page: newComments.data.page,
            count: newComments.data.count
          }
        };
      });
    }
  }

  const handleDeleteComment = async (commentId: string) => {
    if (!post) return
    const toastId = toast.loading("يتم حذف التعليق...")
    const result = await deleteCommentPost(post.slug, commentId)
    if (result.status === 'success') {
      toast.success(result.message)
      setCommentsList((prev: typeof commentsList) => ({
        ...prev,
        data: {
          results: (prev.data?.results ?? [])
            .map((comment: CommentResponse) => {
              if (comment.id === commentId) {
                return null;
              }
              if (comment.children?.length > 0) {
                return {
                  ...comment,
                  children: comment.children.filter((child: CommentResponse) => child.id !== commentId)
                }
              }
              return comment;
            })
            .filter((comment): comment is CommentResponse => comment !== null),
          page: prev.data?.page ?? 1,
          count: prev.data?.count ?? 0
        }
      }))
    } else {
      toast.error(result.message)
    }
    toast.dismiss(toastId)
    return;
  }

  const handleAddReply = async ({comment, replyingTo, statusReply}: {comment: string, replyingTo: string, statusReply: "reply" | "repliedOnComment"}) => {
    if (!post) return { status: "error" };
    const toastId = toast.loading("يتم إضافة الرد...")
    const result = await addReplyCommentPost({slug: post.slug, comment, replyingTo, statusReply})
    if (result.status === 'success' && result.data && result.data.parent) {
      toast.success(result.message)
      setCommentsList((prev) => {
        if (!prev.data || !result.data || !result.data.parent) return prev;
        return {
          ...prev,
          data: {
            ...prev.data,
            results: prev.data.results.map((comment: CommentResponse) => 
              result.data && result.data.parent && comment.id === result.data.parent.id 
                ? {...comment, children: [result.data, ...comment.children].filter((child): child is CommentResponse => child !== null)} 
                : comment
            )
          }
        };
      });
    } else {
      toast.error(result.message)
    } 
    toast.dismiss(toastId)
    return {
      status: result.status,
    }
  }

  if (!post) return notFound()

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
          src={post.banner || ""}
          alt={post.title}
          width={900}
          height={500}
          className="aspect-video"
        />
        
        <div className="mt-12">
          <h2>{post.title}</h2>
          <div className="flex max-sm:flex-col justify-between my-8">
                <div className="flex items-start gap-5">
                    <Image className="w-12 h-12 rounded-full" src={`/uploads/${post.author.photo}`} alt={post.author.name} width={48} height={48}/>
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
          user={user as userResponseInPost}
          post={post as PostResponse & { activity: { totalLikes: number; totalComments: number; } }}
          onLike={handleLike}
        />

        <div className="my-12 blog-page-content">
          {parse(post.content || "")}
        </div>

        {similar && similar.length > 0 && (
          <>
            <hr className="border-grey my-2" />
            <h1 className="text-2xl mt-14 mb-10 font-semibold">المنشورات المشابهة</h1>
            {similar.map((post : PostResponse, i : number) => (
              <AnimationWrapper transition={{duration: 1, delay: i*0.88}} key={i}>
                <PostCard post={post} author={post.author as userResponse} />
              </AnimationWrapper>
            ))}
          </>
        )}
      </div>
    </AnimationWrapper>
  )
}