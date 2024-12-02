'use client'

import { useEffect, useState } from "react"
import PostEditor from "@/app/components/PostEditor"
import PublishForm from "@/app/components/PublishForm"
import { useDispatch } from "react-redux"
import { postActions } from "@/app/redux/slices/postSlice"

type Props = {
  onUpload: (data: any) => Promise<any>
  onUpdate: (data: any) => Promise<any>
  post: any
}

export default function IndexPostEditPage({post, onUpload, onUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [editorState, setEditorState] = useState("editor")
  const dispatch = useDispatch()
  
  useEffect(() => {
    dispatch(postActions.setAction("edit"))
    dispatch(postActions.setId(post.id))
    dispatch(postActions.setTitle(post.title))
    dispatch(postActions.setContent(post.content))
    dispatch(postActions.setDes(post.des))
    dispatch(postActions.setImg(post.banner))
    dispatch(postActions.setDraft(!post.isPublished))
    dispatch(postActions.setTags(post.tags.map((tag: any) => tag.name)))
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return
  }

  return (
    editorState === "editor" 
      ? <PostEditor setEditorState={setEditorState} onUpdate={onUpdate} onUpload={onUpload} /> 
      : <PublishForm setEditorState={setEditorState} onUpdate={onUpdate} />
  )
}