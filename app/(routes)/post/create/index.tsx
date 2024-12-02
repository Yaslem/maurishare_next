'use client'
import { useState, useEffect } from "react"
import PostEditor from "@/app/components/PostEditor"
import PublishForm from "@/app/components/PublishForm"
import { useDispatch } from "react-redux"
import { postActions } from "@/app/redux/slices/postSlice"

type Props = {
  user: any // قم بتحديد نوع المستخدم حسب التطبيق
  onCreate?: (data: any) => Promise<any>
  onUpload: (data: any) => Promise<any>
  onUpdate?: (data: any) => Promise<any>
}

export default function IndexPostCreatePage({ onCreate, onUpload, onUpdate, user }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [editorState, setEditorState] = useState("editor")
  const dispatch = useDispatch()

  useEffect(() => {
    setIsLoading(false)
    dispatch(postActions.setAction("create"))
    dispatch(postActions.resetPost())
  }, [])

  if (isLoading) {
    return
  }

  return (
    editorState === "editor" 
      ? <PostEditor setEditorState={setEditorState} onCreate={onCreate} onUpload={onUpload} /> 
      : <PublishForm setEditorState={setEditorState} onCreate={onCreate} onUpdate={onUpdate} />
  )
}