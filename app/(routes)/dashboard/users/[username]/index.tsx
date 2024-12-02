'use client'

import { useState } from 'react'
import AnimationWrapper from '@/app/components/AnimationWrapper'
import InputBox from '@/app/components/InputBox'
import { toast } from 'react-hot-toast'

interface EditProfileFormProps {
  initialData: any,
  onUpdateProfile: (formData: FormData) => Promise<{ status: string | undefined, code: number, message: string, action: string, data: any }>,
  onUploadUserPhoto: (img: File) => Promise<{imgUrl: string}>
}

export default function EditProfileForm({ initialData, onUpdateProfile, onUploadUserPhoto }: EditProfileFormProps) {
  const [permissions, setPermissions] = useState({
    can_create_post: initialData.can_create_post,
    can_update_post: initialData.can_update_post,
    can_delete_post: initialData.can_delete_post,
    can_create_comment: initialData.can_create_comment
  })
  const [bioChars, setBioChars] = useState(150 - (initialData.bio?.length || 0))
  const [loading, setLoading] = useState(false)
  const [img, setImg] = useState({
        imgUrl: `/uploads/${initialData.photo}`,
        newImg: undefined as File | undefined
    })

  const handleUpload = async () => {
    if(img.newImg) {
        setLoading(true)
        toast.loading("يتم رفع الصورة...")
        const response = await onUploadUserPhoto(img.newImg)
        if(response.imgUrl) {
            toast.dismiss()
            setLoading(false)
            setImg({
                imgUrl: "/uploads/" + response.imgUrl,
                newImg: undefined
            })
        }
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    toast.loading("يتم تحديث الملف الشخصي...")
    const formData = new FormData(e.target as HTMLFormElement)
    const response = await onUpdateProfile(formData)
    if(response.status === "success") {
        toast.dismiss()
        toast.success(response.message)
    }
  }

  return (
    <AnimationWrapper>
            <h1 className="max-md:hidden">تعديل الحساب</h1>
            <div className="flex flex-col lg:flex-row items-start py-10 gap-8 lg:gap-10">
                <div className="max-lg:center mb-5 flex flex-col">
                    <label htmlFor="uploadImg" className="relative cursor-pointer bg-grey block w-48 h-48  rounded-full overflow-hidden">
                        <img src={img.imgUrl} />
                    </label>
                    <input onChange={(e : React.ChangeEvent<HTMLInputElement>) => {
                        if(e.target.files) {
                            const img = e.target.files[0]
                            setImg({
                                imgUrl: URL.createObjectURL(img),
                                newImg: img
                            })
                        }
                    }} hidden id="uploadImg" type="file" accept=".jpeg, .png .jpg" />
                    <button onClick={() => handleUpload()} disabled={loading} className="btn-light mt-5 max-lg:center lg:w-full">تحميل</button>
                </div>
                <div className={"flex flex-col w-full gap-4"}>
                    <div className={"flex items-center gap-4 flex-wrap"}>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex gap-3 items-center"}>
                                <i className="fi fi-sr-blog-text"></i>
                                <p>المنشورات</p>
                            </div>
                            <p className={"font-medium"}>{initialData.totalPosts}</p>
                        </div>
                        <div className={"flex flex-col gap-3"}>
                            <div className={"flex gap-3 items-center"}>
                                <i className="fi fi-rr-glasses"></i>
                                <p>القارئون</p>
                            </div>
                            <p className={"font-medium"}>{initialData.totalReads}</p>
                        </div>
                    </div>
                    <hr className={"border border-black/10"}/>
                    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                        <input type="hidden" name="username" value={initialData.username}/>
                        <input type="hidden" name="action" value={"editProfile"}/>
                        <div className={"flex flex-col gap-3"}>
                            <p className={"font-medium"}>الصلاحيات</p>
                            <div className={"flex flex-wrap gap-3"}>
                                <div className={"flex items-center gap-2"}>
                                    <label htmlFor={"can_create_post"}>نشر مقالة</label>
                                    <input defaultChecked={permissions.can_create_post} value={permissions.can_create_post} onChange={e => setPermissions({...permissions, can_create_post: e.target.checked})} name={"can_create_post"} id={"can_create_post"} type={"checkbox"}/>
                                </div>
                                <div className={"flex items-center gap-2"}>
                                    <label htmlFor={"can_update_post"}>تحديث مقالة</label>
                                    <input defaultChecked={permissions.can_update_post} value={permissions.can_update_post} onChange={e => setPermissions({...permissions, can_update_post: e.target.checked})} name={"can_update_post"} id={"can_update_post"} type={"checkbox"}/>
                                </div>
                                <div className={"flex items-center gap-2"}>
                                    <label htmlFor={"can_delete_post"}>حذف مقالة</label>
                                    <input defaultChecked={permissions.can_delete_post} value={permissions.can_delete_post} onChange={e => setPermissions({...permissions, can_delete_post: e.target.checked})} name={"can_delete_post"} id={"can_delete_post"} type={"checkbox"}/>
                                </div>
                                <div className={"flex items-center gap-2"}>
                                    <label htmlFor={"can_create_comment"}>نشر تعليق</label>
                                    <input defaultChecked={permissions.can_create_comment} value={permissions.can_create_comment} onChange={e => setPermissions({...permissions, can_create_comment: e.target.checked})} name={"can_create_comment"} id={"can_create_comment"} type={"checkbox"}/>
                                </div>

                            </div>
                        </div>
                        <hr className={"border border-black/10"}/>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-5">
                                <div>
                                    <InputBox icon="fi-rr-user" value={initialData.name} type="text"
                                              name="name"
                                              placeholder="الاسم"/>
                                </div>
                                <div>
                                    <InputBox icon="fi-rr-envelope" value={initialData.email} type="email"
                                              name="email" placeholder="البريد"/>
                                </div>
                            </div>
                            <InputBox icon="fi-rr-at" value={initialData.username} type="text" name="newUsername"
                                      placeholder="اسم المستخدم"/>
                            <p className="text-dark-grey -mt-3">سنستحدم اسم حسابك للبحث عنك، ورؤية الآخرين لحسابك.</p>
                            <textarea onChange={(e) => {
                                setBioChars(150 - e.target.value.length)
                            }} placeholder="نبذة قصيرة عنك.." defaultValue={initialData.bio} name="bio" maxLength={150}
                                      className="input-box h-64 lg:h-40 resize-none leading-7 mt-5 pr-5"></textarea>
                            <p className="mt-1 text-dark-grey">{bioChars} حرفا متبقيا</p>
                            <p className="text-dark-grey my-6">أضف روابط حساباتك على مواقع التواصل الاجتماعي</p>
                            <div className="md:grid md:grid-cols-2 gap-x-6">
                                {
                                    Object.keys(initialData.socialLinks).map((key, i) => {
                                        let link = initialData.socialLinks[key]
                                        return <InputBox icon={"fi " + (key !== "website" ? `fi-brands-${key}` : "fi-rr-globe") + " text-2xl hover:text-black"}
                                                         dir="ltr" className={"text-left"} type="text" value={link}
                                                         placeholder="https://" key={i} name={key}/>
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