'use client'
import { useState, useEffect, useCallback } from "react"
import PostEditor from "@/app/components/PostEditor"
import PublishForm from "@/app/components/PublishForm"
import { useDispatch } from "react-redux"
import { postActions } from "@/app/redux/slices/postSlice"
import { type sendResponseServer } from "@/app/helpers/SendResponse.server"
import { type PostResponse } from "@/app/controllers/Post.server"
type Props = {
  onCreate?: ({img, title, des, tags, content, draft}: {img: string, title: string, des: string, tags: string[], content: string, draft: boolean}) => Promise<Awaited<ReturnType<typeof sendResponseServer<PostResponse | null>>>>
  onUpload: (img: File) => Promise<Awaited<{
    status: string;
    message: string | null;
    location: string | null;
}>>
  onUpdate?: ({id, img, title, des, tags, content, draft}: {id: string, img: string, title: string, des: string, tags: string[], content: string, draft: boolean}) => Promise<Awaited<ReturnType<typeof sendResponseServer<PostResponse | null>>>>
}

export default function IndexPostCreatePage({ onCreate, onUpload, onUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [editorState, setEditorState] = useState("editor")
  const dispatch = useDispatch()

  const initializePost = useCallback(() => {
    setIsLoading(false)
    dispatch(postActions.setAction("create"))
    dispatch(postActions.resetPost())
  }, [dispatch])

  useEffect(() => {
    initializePost()
  }, [initializePost])

  if (isLoading) {
    return
  }

  return (
    editorState === "editor" 
      ? <PostEditor setEditorState={setEditorState} onCreate={onCreate} onUpload={onUpload} /> 
      : <PublishForm setEditorState={setEditorState} onCreate={onCreate} onUpdate={onUpdate} />
  )
}