'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { postActions } from '@/app/redux/slices/postSlice';
import { Editor } from '@tinymce/tinymce-react';

const PostEditor = ({ setEditorState, onUpdate, onCreate, onUpload }: { setEditorState: (state: string) => void, onUpdate?: (data: any) => Promise<any>, onCreate?: (data: any) => Promise<any>, onUpload: (data: any) => Promise<any> }) => {
    const dispatch = useDispatch();
    const post = useSelector((state: any) => state.post);
    console.log(post)
    const [loadingToast, setLoadingToast] = useState<string | null>(null);
    const router = useRouter()
    const handleBannerUpload = async (e: any) => {
        const img = e.target.files[0];
        if (img) {
            setLoadingToast(toast.loading("يتم تحميل الصورة..."));
            dispatch(postActions.setImg(URL.createObjectURL(img)));
            

            const response = await onUpload(img)
            if(response.status === "error") {
                toast.error(response.message)
                return
            }

            if (response.location) {
                toast.success("تم تحميل الصورة بنجاح 👍.");
                console.log(response.location)
                dispatch(postActions.setImg(`/uploads/${response.location}`));
                console.log(post.img)
            }
            toast.dismiss(loadingToast || "")
        }
    };

    const handleTitleChange = (e: any) => {
        dispatch(postActions.setTitle(e.target.value));
        let input = e.target;
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
        if(response.status === "error") {
            toast.error(response.message)
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
                                <img className="w-full h-full object-cover" src={post.img} />
                            ) : (
                                <img className="w-full h-full object-cover" src="/images/default_banner.png" />
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
                            images_upload_handler: handleBannerUpload as any,
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