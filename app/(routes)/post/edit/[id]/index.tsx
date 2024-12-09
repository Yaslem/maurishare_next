'use client'

import { useCallback, useEffect, useState } from "react"
import PostEditor from "@/app/components/PostEditor"
import PublishForm from "@/app/components/PublishForm"
import { useDispatch } from "react-redux"
import { postActions } from "@/app/redux/slices/postSlice"
import { sendResponseServer } from "@/app/helpers/SendResponse.server"
import { PostResponse } from "@/app/controllers/Post.server"

type Props = {
  onUpload: (img: File) => Promise<{location: string | null, status: "success" | "error"}>
  onUpdate?: ({id, img, title, des, tags, content, draft}: {id: string, img: string, title: string, des: string, tags: string[], content: string, draft: boolean}) => Promise<Awaited<ReturnType<typeof sendResponseServer<PostResponse | null>>>>
  post: PostResponse | null
}

export default function IndexPostEditPage({post, onUpload, onUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [editorState, setEditorState] = useState("editor")
  const dispatch = useDispatch()

  const initializePost = useCallback(() => {
    setIsLoading(false)
    if(post){
      dispatch(postActions.setAction("edit"))
      dispatch(postActions.setId(post.id))
      dispatch(postActions.setTitle(post.title))
      dispatch(postActions.setContent(post.content))
      dispatch(postActions.setDes(post.des))
      dispatch(postActions.setImg(post.banner))
      dispatch(postActions.setDraft(!post.isPublished))
      dispatch(postActions.setTags(post.tags.map((tag: {name: string}) => tag.name)))
    }
    setIsLoading(false)
  }, [dispatch, post])
  
  useEffect(() => {
    initializePost()
  }, [initializePost])

  if (isLoading) {
    return
  }

  return (
    editorState === "editor" 
      ? <PostEditor setEditorState={setEditorState} onUpdate={onUpdate} onUpload={onUpload} /> 
      : <PublishForm setEditorState={setEditorState} onUpdate={onUpdate} />
  )
}