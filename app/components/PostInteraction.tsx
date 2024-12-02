"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const PostInteraction = ({ post, user, isLikeUser, commentWrapper, setCommentWrapper, onLike } : { post: any, user: any, isLikeUser: boolean, commentWrapper: boolean, setCommentWrapper: any, onLike: any }) => {
    let [totalLikes, setTotalLikes] = useState(parseInt(post.activity.totalLikes))
    const [isLikedByUser, setIsLikedByUser] = useState(isLikeUser)
    const [location, setLocation] = useState("")
    useEffect(() => {
        setLocation(window.location.href)
    }, [])

    const handeLike = async () => {
        if(user){
            setIsLikedByUser(!isLikedByUser)
            let inc = !isLikedByUser ? totalLikes +=1 : totalLikes-=1
            setTotalLikes(inc)
            await onLike()
            
        } else {
            toast.error("رجاء سجل الدخول لكي تستطيع الإعجاب بالمنشور.")
        }

    }
    return (
        <>
            <hr className="border-grey my-2" />
            <div className="flex gap-6 justify-between">
                <div className="flex gap-3 items-center">
                    <button onClick={handeLike} className={"w-10 h-10 rounded-full flex items-center justify-center " + (isLikedByUser ? "bg-red/20 text-red" : "bg-grey/80")}>
                        <i className={"fi " + (isLikedByUser ? "fi-sr-heart" : "fi-rr-heart")}></i>
                    </button>
                    <p className="text-xl text-dark-grey">{totalLikes}</p>
                    {
                        user 
                            ? <button onClick={() => setCommentWrapper(!commentWrapper)} className="w-10 h-10 rounded-full flex items-center justify-center bg-grey/80">
                                <i className="fi fi-rr-comment-dots"></i>
                            </button>
                            : <p className="text-xl text-dark-grey">التعليقات: </p>
                    }
                    <p className="text-xl text-dark-grey">{post.activity.totalComments}</p>
                </div>
                <div className="flex gap-6 items-center">
                    {
                        user && user.username === post.author.username
                            ? <Link className="underline hover:text-purple" href={`/post/edit/${post.id}`}>
                                تعديل
                            </Link>
                            : null
                    }
                    <Link className="" href={`https://www.facebook.com/sharer/sharer.php?u=${location}`}>
                        <i className="fi fi-brands-facebook text-xl hover:text-facebook"></i>
                    </Link>
                </div>
            </div>
            <hr className="border-grey my-2" />
        </>
    )
}
export default PostInteraction