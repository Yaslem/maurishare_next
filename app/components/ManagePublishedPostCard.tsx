import { useState } from "react"
import getDay from "@/app/common/Date"
import Link from "next/link";
import { toast } from "react-hot-toast";
import { PostResponse } from "@/app/controllers/Post.server";
import { sendResponseServer } from "@/app/helpers/SendResponse.server";
import { userResponse } from "@/app/controllers/User.server";
import Image from "next/image";
interface ManagePublishedPostCardProps {
    post: PostResponse
    user: userResponse & { can_delete_post: boolean, role: string } | null
    onPublishPost?: (postId: string, isPublished: boolean) => Promise<Awaited<ReturnType<typeof sendResponseServer<{postId: string} | null>>>>
    onDeletePost?: (postId: string) => Promise<void>
}

const ManagePublishedPostCard = ({ post, user = null, onPublishPost, onDeletePost }: ManagePublishedPostCardProps) => {
    const [isPending, setIsPending] = useState(false)
    const [showState, setShowState] = useState(false)

    return (
        <>
            <div className="flex gap-10 border-b mb-6 max-md:px-4 border-grey pb-6 items-center">
                <Image className="max-md:hidden lg:hidden xl:block w-28 h-28 flex-none bg-grey object-cover" src={post.banner ?? ""} alt={post.title} width={112} height={112}/>
                <div className="flex flex-col justify-between py-2 w-full min-w-[300px]">
                    <div>
                        <Link className="blog-title mb-4 hover:underline" href={`/post/${post.slug}`}>{post.title}</Link>
                        <p className="line-clamp-1">نُشر في {getDay(post.publishedAt)}</p>
                    </div>
                    <div className="flex items-center gap-6 mt-3">
                        <Link href={`/post/edit/${post.id}`}>تعديل</Link>
                        <button onClick={() => setShowState(!showState)} className="pl-r py-2 underline lg:hidden">الحالة</button>
                        {
                            user?.can_delete_post
                                ? <button disabled={isPending} onClick={async () => {
                                    if (onDeletePost) {
                                        await onDeletePost(post.id);
                                    }
                                }} className="pl-r py-2 underline text-red">حذف</button>
                                : null
                        }
                        {
                            user?.role === "ADMIN"
                                ? <button disabled={isPending} onClick={async () => {
                                    setIsPending(true)
                                    const response = onPublishPost ? await onPublishPost(post.id, !post.isPublished) : null
                                    if (response?.status === "success") {
                                        toast.success(response.message)
                                    } else {
                                        toast.error(response?.message ?? "حدث خطأ ما")
                                    }
                                    setIsPending(false)
                                }} className={"p-2 rounded-lg " + (post.isPublished ? "bg-black" : "bg-red") + " font-medium text-sm text-white"}>{post.isPublished ? "منشور" : "غير منشور"}</button>
                                : <div className={"p-2 rounded bg-black/10 gap-2 flex items-center"}>
                                    {
                                        post.isPublished
                                            ? <i className="fi fi-rr-assept-document text-black"></i>
                                            : <i className="fi fi-rr-lock text-red"></i>

                                    }
                                    <span className={"text-sm font-medium " + (post.isPublished ? "text-black" : "text-red")}>{post.isPublished ? "منشور" : "غير منشور"}</span>
                                </div>
                        }
                    </div>
                </div>
                <div className="max-lg:hidden">
                    <PostState state={post.activity as {totalLikes: number, totalComments: number, totalReads: number, totalParentComments: number} | null}/>
                </div>
            </div>
            {
                showState
                    ? <div>
                        <PostState state={post.activity as {totalLikes: number, totalComments: number, totalReads: number, totalParentComments: number} | null}/>
                    </div>
                    : null
            }
        </>
    )
}

const PostState = ({state}: {state: {totalLikes: number, totalComments: number, totalReads: number, totalParentComments: number} | null}) => {
    function getValueName(value: string) {
        switch (value) {
            case "totalLikes":
                return "الإعجابات"
            case "totalComments":
                return "التعليقات"
            case "totalReads":
                return "المشاهدات"
            case "totalParentComments":
                return "الردود"
        }
    }
    return (
        <div className="flex gap-2 max-lg:mb-6 max-lg:pb-6 border-grey max-lg:border-b">
            {
                state && Object.keys(state).map((info: string, i: number) => {
                    const value = info as "totalLikes" | "totalComments" | "totalReads" | "totalParentComments"
                    return <div key={i} className={"flex flex-col items-center w-full h-full justify-center p-4 px-6 " + (i !== 0 ? "border-r border-grey" : null)}>
                        <h1 className="text-xl lg:text-2xl mb-2">{state[value].toLocaleString()}</h1>
                        <p className="max-lg:text-dark-grey">{getValueName(value)}</p>
                    </div>;
                })
            }
        </div>
    )
}
export default ManagePublishedPostCard