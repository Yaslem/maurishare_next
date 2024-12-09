import Link from 'next/link';
import getDay from '../common/Date';
import Image from 'next/image';
import { type PostResponse } from '@/app/controllers/Post.server';
import { type userResponse } from '@/app/controllers/User.server';
const PostCard = ({ post, author }: { post: PostResponse, author: userResponse }) => {
    const { slug, publishedAt, title, des, banner } = post
    const { name, photo, username } = author

    return (
        <div className='flex items-center gap-8 border-b border-grey pb-5 mb-4'>
                <div className="w-full">
                    <div className="flex gap-2 mb-7">
                        <Link href={`/user/${username}`} className='flex gap-2 items-center mb-7'>
                            <Image src={"/uploads/" + photo} className="w-6 h-6 rounded-full" alt={name} width={100} height={100}/>
                            <p className="line-clamp-1">{name} @{username}</p>
                        </Link>
                        <p className="min-h-fit">{getDay(publishedAt)}</p>
                    </div>
                    <Link href={`/post/${slug}`}>
                        <h1 className='blog-title'>{title}</h1>
                        <p className='my-3 text-xl leading-7 max-sm:hidden md:max-[1100px]:hidden line-clamp-2'>{des}</p>
                    </Link>
                </div>
                <Link href={`/post/${slug}`} className='h-28 aspect-square bg-grey'>
                    <Image src={banner || ""} className='w-full h-full aspect-square object-cover' alt={title} width={100} height={100}/>
                </Link>
            </div>
    )
}
export default PostCard