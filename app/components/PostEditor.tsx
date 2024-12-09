'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '@/app/redux/slices/postSlice';
import { Editor } from '@tinymce/tinymce-react';
import { RootState } from '@/app/redux/store';
import { type sendResponseServer } from '@/app/helpers/SendResponse.server';
import { type PostResponse } from '@/app/controllers/Post.server';
import Image from 'next/image';


interface PostEditorProps {
    setEditorState: (state: string) => void
    onCreate?: ({img, title, des, tags, content, draft}: {img: string, title: string, des: string, tags: string[], content: string, draft: boolean}) => Promise<Awaited<ReturnType<typeof sendResponseServer<PostResponse | null>>>>
    onUpload: (img: File) => Promise<Awaited<{
        status: string;
        location: string | null;
    }>>
    onUpdate?: ({id, img, title, des, tags, content, draft}: {id: string, img: string, title: string, des: string, tags: string[], content: string, draft: boolean}) => Promise<Awaited<ReturnType<typeof sendResponseServer<PostResponse | null>>>>
  }

const PostEditor = ({ setEditorState, onUpdate, onCreate, onUpload }: PostEditorProps) => {
    const dispatch = useDispatch();
    const post = useSelector((state: RootState) => state.post);
    const [loadingToast, setLoadingToast] = useState<string | null>(null);
    const router = useRouter()
    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;
        const img = files[0];
        const fileSize = img.size / 1024 / 1024;
        if (fileSize > 1) return toast.error("يجب أن لا يكون حجم الصورة أكبر من 1 ميجا");
        if (img) {
            const toastId = toast.loading("يتم تحميل الصورة...")
            dispatch(postActions.setImg(URL.createObjectURL(img)));
            const response = await onUpload(img)
            if(response.status === "error") {
                toast.dismiss(toastId || "")
                toast.error("حدث خطأ ما")
                return
            }

            if (response.location) {
                toast.dismiss(toastId || "")
                toast.success("تم تحميل الصورة بنجاح 👍.");
                dispatch(postActions.setImg(`/uploads/${response.location}`));
            }
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(postActions.setTitle(e.target.value));
        const input = e.target;
        input.style.height = "auto";
        input.style.height = input.scrollHeight + "px";
    };

    const handlePublishEvent = () => {
        if (!post.img.length) {
            return toast.error("أدرج صورة المنشور");
        }
        if (!post.title.length) {
            return toast.error("اكتب عنوان المنشور");
        }
        if (!post.content.length) {
            return toast.error("اكتب شيئا ما");
        }
        setEditorState("publish");
    };

    const handleDraft = async () => {
        setLoadingToast(toast.loading("يتم الحفظ..."));
        const response = await (post.action === "create" ? onCreate && onCreate({...post, draft: true}) : onUpdate && onUpdate({...post, draft: true}))
        if(response?.status === "error") {
            toast.error("حدث خطأ ما")
            return
        }
        toast.dismiss(loadingToast || "")
        toast.success("تم الحفظ كمسودة");
        router.push(`/dashboard/posts`)
    };

    return (
        <>
            <nav className="navbar">
                <p className="max-md:hidden font-medium text-black line-clamp-1 w-full">
                    {post.title.length ? post.title : post.action === "create" ? "منشور جديد" : "تعديل منشور"}
                </p>

                <div className="flex gap-4 mr-auto">
                    <button onClick={handlePublishEvent} className="py-2 btn-dark">
                        {post.action === "create" ? "نشر" : post.draft ? "تعديل ونشر" : "تعديل"}
                    </button>
                    <button onClick={handleDraft} className="py-2 btn-light">
                        حفظ كمسودة
                    </button>
                </div>
            </nav>
            <section>
                <div className="mx-auto max-w-[900px] w-full">
                    <div className="relative aspect-video hover:opacity-80 bg-white border-4 border-grey">
                        <label htmlFor="uploadBanner">
                            {post.img.length ? (
                                <Image className="w-full h-full object-cover" src={post.img} alt={post.title} width={360} height={200}/>
                            ) : (
                                <Image className="w-full h-full object-cover" src="/images/default_banner.png" alt="default banner" width={360} height={200}/>
                            )}
                            <input
                                className="opacity-0 absolute inset-0"
                                onChange={handleBannerUpload}
                                id="uploadBanner"
                                type="file"
                                accept=".png, .jpg, .jpeg"
                            />
                        </label>
                    </div>
                    <textarea
                        defaultValue={post.title}
                        onChange={handleTitleChange}
                        className="text-4xl font-semibold w-full h-20 outline-none resize-none mt-10 leading-tight placeholder:opacity-40"
                        placeholder="عنوان المنشور"
                    ></textarea>
                    <hr className="w-full opacity-10 my-5" />
                    <Editor
                        apiKey="jc310rvlu02i8ml51knh2pn1fdeh6xr8o1b21fsffsrlu4p2"
                        onEditorChange={(newValue) => {
                            dispatch(postActions.setContent(newValue));
                        }}
                        init={{
                            plugins: 'anchor autolink directionality charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount',
                            toolbar: 'undo redo | blocks fontsize | bold italic underline strikethrough | link image imageupload media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat | ltr rtl',
                            language_url: "/lang/tinymce/ar.js",
                            language: "ar",
                            directionality: "rtl",
                            images_upload_handler: async (blobInfo) => {
                                const response = await onUpload(new File([blobInfo.blob()], blobInfo.filename()));
                                if (response.status === "error") throw new Error("حدث خطأ ما");
                                return `/uploads/${response.location}`;
                            },
                            image_caption: true,
                            image_title: true,
                            placeholder: "ابدأ بكتابة منشورك"
                        }}
                        value={post.content}
                    />
                </div>
            </section>
        </>
    );
};

export default PostEditor;