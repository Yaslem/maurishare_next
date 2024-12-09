'use client'
import Image from 'next/image'
import { useState } from 'react'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import InputBox from '@/app/components/InputBox'
import { toast } from 'react-hot-toast'
import { type userResponse } from '@/app/controllers/User.server'
import { type sendResponseServer } from '@/app/helpers/SendResponse.server'

interface EditProfileFormProps {
  initialData: userResponse | null,
  onUpdateProfile: (formData: FormData) => Promise<Awaited<ReturnType<typeof sendResponseServer<null>>>>,
  onUploadUserPhoto: (img: File) => Promise<{imgUrl: string}>,
}

export default function EditProfileForm({initialData, onUpdateProfile, onUploadUserPhoto }: EditProfileFormProps) {
  const [bioChars, setBioChars] = useState(150 - (initialData?.bio?.length || 0))
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState({
        imgUrl: `/uploads/${initialData?.photo}`,
        newImg: undefined as File | undefined
    })

  const handleUpload = async () => {
    if(img.newImg) {
        setLoading(true)
        const toastId = toast.loading("يتم رفع الصورة...")
        const response = await onUploadUserPhoto(img.newImg)
        if(response.imgUrl) {
            toast.dismiss(toastId)
            toast.success("تم رفع الصورة بنجاح 👍.")
            setLoading(false)
            setImg({
                imgUrl: "/uploads/" + response.imgUrl,
                newImg: undefined
            })
        }
    } else {
        toast.error("يجب أن تختار صورة")
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const toastId = toast.loading("يتم تحديث الملف الشخصي...")
    const formData = new FormData(e.target as HTMLFormElement)
    const response = await onUpdateProfile(formData)
    if(response.status === "success") {
        setLoading(false)
        toast.dismiss(toastId)
        toast.success(response.message)
    } else {
        setLoading(false)
        toast.dismiss(toastId)
        toast.error(response.message)
    }
  }

  return (
    <AnimationWrapper>
            <h1 className="max-md:hidden">تعديل الحساب</h1>
            <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                <div className="max-lg:center mb-5 flex flex-col">
                    <label htmlFor="uploadImg" className="relative cursor-pointer bg-grey block w-48 h-48  rounded-full overflow-hidden">
                        <Image src={img.imgUrl} alt="user photo" width={192} height={192} />
                    </label>
                    <input onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                        if(e.target.files) {
                            const img = e.target.files[0]
                            const fileSize = img.size / 1024 / 1024
                            if(fileSize > 1) return toast.error("يجب أن لا يكون حجم الصورة أكبر من 1 ميجا")
                            setImg({
                                imgUrl: URL.createObjectURL(img),
                                newImg: img
                            })
                        }
                    }} hidden id="uploadImg" type="file" accept=".jpeg, .png .jpg" />
                    <button onClick={() => handleUpload()} disabled={loading} className="btn-light mt-5 max-lg:center lg:w-full">تحميل</button>
                </div>
                <div className={"flex flex-col w-full gap-4"}>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <input type="hidden" name="action" value={"editProfile"}/>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                <div>
                                    <InputBox disabled={true} icon="fi-rr-user" value={initialData?.name || ""} type="text"
                                              name="name"
                                              placeholder="الاسم"/>
                                </div>
                                <div>
                                    <InputBox disabled={true} icon="fi-rr-envelope" value={initialData?.email || ""} type="email"
                                              name="email" placeholder="البريد"/>
                                </div>
                            </div>
                            <InputBox icon="fi-rr-at" value={initialData?.username || ""} type="text" name="newUsername"
                                      placeholder="اسم المستخدم"/>
                            <p className="text-dark-grey -mt-3">سنستحدم اسم حسابك للبحث عنك، ورؤية الآخرين لحسابك.</p>
                            <textarea onChange={(e) => {
                                setBioChars(150 - e.target.value.length)
                            }} placeholder="نبذة قصيرة عنك.." defaultValue={initialData?.bio || ""} name="bio" maxLength={150}
                                      className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pr-5"></textarea>
                            <p className="mt-1 text-dark-grey">{bioChars} حرفا متبقيا</p>
                            <p className="text-dark-grey my-6">أضف روابط حساباتك على مواقع التواصل الاجتماعي</p>
                            <div className="md:grid md:grid-cols-2 gap-x-6">
                                {
                                    Object.keys(initialData?.socialLinks || {}).map((key, i: number) => {
                                        const socialKey = key as 'twitter' | 'facebook' | 'website' | 'youtube' | 'instagram'
                                        const link = initialData?.socialLinks && initialData?.socialLinks[socialKey]
                                        return <InputBox icon={"fi " + (socialKey !== "website" ? `fi-brands-${socialKey}` : "fi-rr-globe") + " text-2xl hover:text-black"}
                                                         dir="ltr" className={"text-left"} type="text" value={link || ""}
                                                         placeholder="https://" key={i} name={socialKey}/>
                                    })
                                }
                            </div>
                        </div>
                        <button disabled={loading} type="submit" className="btn-dark w-auto px-10">تحديث الملف الشخصي
                        </button>
                    </form>
                </div>
            </div>
        </AnimationWrapper>
  )
}