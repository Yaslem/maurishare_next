import Link from "next/link"
import getDay from "@/app/common/Date"
import Image from "next/image"
import { type PostResponse } from "@/app/controllers/Post.server"

const MinimalPost = ({ post, index }: { post: PostResponse, index: number }) => {
    const { slug, publishedAt, title, author: { name, photo, username } } = post
    return (
        <Link href={`/post/${slug}`} className="flex gap-5 mb-8">
            <h1 className="blog-index">{index < 10 ? "0" + (index + 1) : (index + 1)}</h1>
            <div>
                <div className="flex gap-2 items-center mb-7">
                    <Image src={"/uploads/" + photo} className="w-6 h-6 rounded-full" alt={name} width={100} height={100}/>
                    <p className="line-clamp-1">{name} @{username}</p>
                    <p className="min-h-fit">{getDay(publishedAt)}</p>
                </div>
                <h1 className="blog-title">{title}</h1>
            </div>
        </Link>
    )
}
export default MinimalPost