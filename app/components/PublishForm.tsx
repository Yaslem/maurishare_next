'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useEffect, useState, useTransition } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import Tag from '@/app/components/Tag'
import { postActions } from '@/app/redux/slices/postSlice'

interface PublishFormProps {
  setEditorState: (state: string) => void
  onCreate?: (data: any) => Promise<any>
  onUpdate?: (data: any) => Promise<any>
}

const PublishForm = ({ setEditorState, onCreate, onUpdate }: PublishFormProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const dispatch = useDispatch()
  const post = useSelector((state: any) => state.post)
  console.log(post)
  
  const characterLimit = 200
  const tagLimit = 10
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const loadingToast = toast.loading(post.action === 'create' ? "يتم النشر..." : "يتم التعديل...")
    startTransition(async () => {
      const result = await (post.action === 'create' ? onCreate && onCreate({...post}) : onUpdate && onUpdate({...post, draft: false}))
      
      toast.dismiss(loadingToast)
      if (result.status === 'error') {
        toast.error(result.message)
      } else {
        toast.success(result.message)
        router.push(`/post/${result.data.slug}`)
      }
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const target = e.target as HTMLInputElement
      const tag = target.value.trim()

      if (post.tags.length < tagLimit) {
        if (!post.tags.includes(tag) && tag.length) {
          dispatch(postActions.setTags([...post.tags, tag]))
        } else {
          toast.error(`الوسم ${tag} موجود بالفعل.`)
        }
      } else {
        toast.error(`أعلى وسوم يمكنك إضافتها هي ${tagLimit} أوسم`)
      }
      target.value = ''
    }
  }

  return (
    <AnimationWrapper>
      <section className="relative">
        <button 
          onClick={() => setEditorState('editor')} 
          className="w-12 h-12 absolute left-[5vw]"
        >
          <i className="fi fi-br-cross"></i>
        </button>

        <div className="min-h-screen grid items-center lg:grid-cols-2 lg:gap-4 py-16">
          <div className="overflow-hidden">
            <p className="text-dark-grey">مراجعة</p>
            <div className="w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4">
              <Image 
                src={post.img} 
                alt={post.title}
                width={800}
                height={450}
                className="object-cover"
              />
            </div>
            <h1 className="text-4xl font-medium mt-2 leading-tight line-clamp-2">
              {post.title}
            </h1>
            <p className="line-clamp-2 text-xl leading-tight mt-4">
              {post.des}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="border-grey lg:border-1 lg:pr-8">
            <div className="space-y-6">
              <div>
                <p className="text-dark-grey mb-2">عنوان المنشور</p>
                <input
                  type="text"
                  value={post.title}
                  onChange={e => dispatch(postActions.setTitle(e.target.value))}
                  className="input-box pr-4"
                  placeholder="عنوان المنشور"
                />
              </div>

              <div>
                <p className="text-dark-grey mb-2">وصف قصير للمنشور</p>
                <textarea
                  value={post.des}
                  onChange={e => dispatch(postActions.setDes(e.target.value))}
                  className="h-40 resize-none leading-7 input-box pr-4"
                  maxLength={characterLimit}
                />
                <p className="mt-1 text-dark-grey text-sm text-left">
                  {characterLimit - post.des.length} حرفا متبقيا
                </p>
              </div>

              <div>
                <p className="text-dark-grey mb-2">الوسوم</p>
                <div className="relative input-box pr-2 py-2 pb-4">
                  <input
                    type="text"
                    onKeyDown={handleKeyDown}
                    placeholder="الوسم"
                    className="sticky input-box top-0 right-0 pr-4 pb-3 bg-white focus:bg-white"
                  />
                  {post.tags.map((tag: string, i: number) => (
                    <Tag key={i} tagIndex={i} tag={tag} />
                  ))}
                </div>
                <p className="mt-1 text-dark-grey text-sm text-left">
                  {tagLimit - post.tags.length} وسما متبقيا
                </p>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="px-8 btn-dark"
              >
                {post.action === 'create' ? 'نشر' : post.draft ? 'تعديل ونشر' : 'تعديل'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </AnimationWrapper>
  )
}

export default PublishForm