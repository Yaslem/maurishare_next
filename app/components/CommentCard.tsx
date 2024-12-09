"use client"
import { useState } from "react";
import toast from "react-hot-toast";
import getDay from "../common/Date";
import CommentField from "./CommentField";
import { CommentResponse } from "@/app/controllers/Post.server";
import { PostResponse } from "@/app/controllers/Post.server";
import { userResponseInPost } from "./ClientPost";
import { userResponse } from "@/app/controllers/User.server";
import Image from "next/image";

interface CommentCardProps {
    comment: CommentResponse & { commentedBy: userResponse }
    user: userResponseInPost | null
    post: PostResponse
    onReply: ({comment, replyingTo, statusReply}: {comment: string, replyingTo: string, statusReply: "reply" | "repliedOnComment"}) => Promise<{status: string}>
    onDeleteComment: (commentId: string) => Promise<void>
}

const CommentCard = ({ comment, user, post, onReply, onDeleteComment } : CommentCardProps) => {
    const [isReply, setIsReply] = useState({
        statsu: false,
        type: "comment",
        id: ""
    })

    const [isShowReply, setIsShowReply] = useState({
        statsu: false,
        type: "comment",
        id: ""
    })

    const handelDeleteComment = async (commentId : string) => {
        await onDeleteComment(commentId)
    }

    return (
        <div className="w-full">
            <div className="border border-grey my-5 p-6 rounded-md">
                <div className="flex gap-3 items-center mb-8">
                    <Image className="rounded-full w-8 h-8 object-cover" src={`/uploads/${comment.commentedBy.photo}`} alt={comment.commentedBy.name} width={32} height={32}/>
                    <p className="line-clamp-1">{comment.commentedBy.name} @{comment.commentedBy.username}</p>
                    <p className="min-w-fit">{getDay(comment.createdAt)}</p>
                </div>
                <p className="text-base p-2 overflow-auto rounded-e-lg mr-3 border-r-2 border-black/50 bg-grey/80">{comment.content}</p>
                <div className="flex gap-5 justify-between items-center mt-5">
                    <button onClick={() => {
                        if (!user) {
                            toast.error("رجاء سجل الدخول لكي تستطيع الرد على التعليق.")
                        } else {
                            setIsReply({
                                statsu: !isReply.statsu,
                                type: "comment",
                                id: ""
                            })
                        }
                    }} className="underline">{isReply.statsu && isReply.type === "comment" ? "إخفاء" : "رد"}</button>
                    <div className="flex gap-3 items-center">
                        {
                            comment.children.length > 0 &&
                            <button onClick={() => {
                                setIsShowReply({
                                    statsu: !isShowReply.statsu,
                                    type: "comment",
                                    id: ""
                                })
                            }} className="text-sm underline"> {comment.children.length && isShowReply.statsu ? "إخفاء" : "عرض"} الردود ({comment.children.length})</button>
                        }
                        {
                            user
                                ? user.username === comment.commentedBy.username || user.username === post?.author.username
                                    ? <button onClick={() => handelDeleteComment(comment.id)} className="p-2 px-3 rounded-md border border-grey hover:bg-red/30 hover:text-red flex items-center">
                                        <i className="fi fi-rr-trash"></i>
                                    </button>
                                    : null
                                : null
                        }
                    </div>
                </div>
                {
                    isReply.statsu && isReply.type === "comment"
                        ? <div className="mt-8">
                            <CommentField onReply={onReply} statusReply={"reply"} message={`أنت الآن ترد على تعليق @${comment.commentedBy.username}`} placeholder="اترك ردا..." user={user} replyingTo={comment.id} action={"رد"} />
                        </div>
                        : null
                }
                {
                    comment.children.length && isShowReply.statsu
                        ? comment.children.filter((child): child is CommentResponse & { commentedBy: userResponse } => 
                            child.commentedBy !== null
                          ).map((children, i) =>
                            <div key={i} className="border mr-6 border-grey my-5 p-6 rounded-md">
                                <div className="flex gap-3 items-center mb-8">
                                    <Image className="rounded-full w-8 h-8 object-cover" src={`/uploads/${children.commentedBy.photo}`} alt={children.commentedBy.name} width={32} height={32}/>
                                    <p className="line-clamp-1">{children.commentedBy.name} @{children.commentedBy.username}</p>
                                    <p className="min-w-fit">{getDay(children.createdAt)}</p>
                                </div>
                                <p className="text-base p-2 overflow-auto rounded-e-lg mr-3 border-r-2 border-black/50 bg-grey/80">{children.content}</p>
                                <div className="flex gap-5 justify-between items-center mt-5">
                                    <button onClick={() => {
                                        if (!user) {
                                            toast.error("رجاء سجل الدخول لكي تستطيع الرد على التعليق.")
                                        } else {
                                            setIsReply({
                                                statsu: !isReply.statsu,
                                                type: "reply",
                                                id: children.id
                                            })
                                        }
                                    }} className="underline">{isReply.statsu && isReply.type === "reply" && isReply.id === children.id ? "إخفاء" : "رد"}</button>
                                    <div className="flex gap-3 items-center">
                                        {
                                            children.children.length > 0 &&
                                            <button onClick={() => {
                                                setIsShowReply({
                                                    statsu: true,
                                                    type: "reply",
                                                    id: children.id
                                                })
                                            }} className="text-sm underline"> {children.children.length && isShowReply.id === children.id && isShowReply.statsu && isShowReply.type === "reply" ? "إخفاء" : "عرض"} الردود ({children.children.length})</button>
                                        }
                                        {
                                            user
                                                ? user.username === children.commentedBy.username || user.username === post.author.username
                                                    ? <button onClick={() => handelDeleteComment(children.id)} className="p-2 px-3 rounded-md border border-grey hover:bg-red/30 hover:text-red flex items-center">
                                                        <i className="fi fi-rr-trash"></i>
                                                    </button>
                                                    : null
                                                : null
                                        }
                                    </div>

                                </div>
                                {
                                    isReply.statsu && isReply.type === "reply" && isReply.id === children.id
                                        ? <div className="mt-8">
                                            <CommentField statusReply={"repliedOnComment"} onReply={onReply} message={`أنت الآن ترد على رد @${children.commentedBy.username}`} placeholder="اترك ردا..." user={user} replyingTo={children.id} action={"رد"} />
                                        </div>
                                        : null
                                }
                                {
                                    children.children.length && isShowReply.id === children.id && isShowReply.statsu && isShowReply.type === "reply"
                                        ? children.children.filter((child): child is CommentResponse & { commentedBy: userResponse } => 
                                            child.commentedBy !== null
                                          ).map((c, i) =>
                                            <div key={i} className="border mr-4 border-grey my-5 p-6 rounded-md">
                                                <div className="flex gap-3 items-center mb-8">
                                                    <Image className="rounded-full w-8 h-8 object-cover" src={`/uploads/${c.commentedBy.photo}`} alt={c.commentedBy.name} width={32} height={32}/>
                                                    <p className="line-clamp-1">{c.commentedBy.name} @{c.commentedBy.username}</p>
                                                    <p className="min-w-fit">{getDay(c.createdAt)}</p>
                                                </div>
                                                <p className="text-base p-2 overflow-auto rounded-e-lg mr-3 border-r-2 border-black/50 bg-grey/80">{c.content}</p>
                                                <div className="flex gap-5 justify-between items-center mt-5">
                                                    {
                                                        user
                                                            ? user.username === c.commentedBy.username || user.username === post.author.username
                                                                ? <button onClick={() => handelDeleteComment(c.id)} className="p-2 px-3 rounded-md border border-grey hover:bg-red/30 hover:text-red flex items-center">
                                                                    <i className="fi fi-rr-trash"></i>
                                                                </button>
                                                                : null
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        )
                                        : null
                                }
                            </div>
                        )
                        : null
                }
            </div>
        </div>
    )
}
export default CommentCard