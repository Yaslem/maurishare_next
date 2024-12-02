import Link from "next/link"
import { toast } from "react-hot-toast"

const ManageDraftPost = ({ post, index, onDeletePost }: { post: any, index: number, onDeletePost: any }) => {
    return (
        <div className="flex gap-5 lg:gap-10 pb-6 border-b mb-6 border-grey">
            <h1 className="blog-index text-center pr-4 md:pr-6 flex-none">
                {index < 10 ? "0" + index : index}
            </h1>
            <div>
                <h1 className="blog-title mb-3">{post.title}</h1>
                <p className="line-clamp-2">{post.des.length ? post.des : "لا يوجد وصف"}</p>
                <div className="flex items-center gap-6 mt-3">
                    <Link className="underline" href={`/post/edit/${post.id}`}>تعديل</Link>
                    <button onClick={async () => {
                        const response = await onDeletePost(post.id)
                        if (response.status === "success") {
                            toast.success(response.message)
                        } else {
                            toast.error(response.message)
                        }
                    }} className="pl-r py-2 underline text-red">حذف</button>
                </div>
            </div>

        </div>
    )
}
export default ManageDraftPost