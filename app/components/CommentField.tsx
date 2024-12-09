"use client"

import { useState } from "react"
import toast from "react-hot-toast"
import { userResponseInPost } from "./ClientPost";

interface CommentFieldProps {
    action: string;
    user: userResponseInPost | null;
    replyingTo: string;
    statusReply: "reply" | "comment" | "repliedOnComment";
    placeholder: string;
    message: string;
    onComment?: (comment: string) => Promise<{status: string}>;
    onReply?: ({comment, replyingTo, statusReply}: {comment: string, replyingTo: string, statusReply: "reply" | "repliedOnComment"}) => Promise<{status: string}>;
}
const CommentField = ({ action, user, replyingTo, statusReply, placeholder, message, onComment, onReply } : CommentFieldProps) => {
    const [comment, setComment] = useState("")
    
    const handelComment = async () => {
        if(action === "تعليق"){
            if(!user){
                toast.error("رجاء سجل الدخول لكي تستطيع التعليق على المنشور.")
            } else if(!comment.length){
                toast.error("رجاء اكتب شيئا ما.")
            } else {
                const result = onComment ? await onComment(comment) : null
                if (result && result.status === 'success') {
                    setComment("")
                }
            }
        } else if(action === "رد"){
            if(!user){
                toast.error("رجاء سجل الدخول لكي تستطيع الرد على التعليق.")
            } else if(!comment.length){
                toast.error("رجاء اكتب شيئا ما.")
            } else {
                const result = onReply ? await onReply({
                    comment,
                    replyingTo,
                    statusReply: statusReply as "reply" | "repliedOnComment"
                }) : null
                if (result && result.status === 'success') {
                    setComment("")
                }
                
            }
        }
    }
    return (
        <>
            <p className="text-sm mb-3">{message}</p>
            <textarea onChange={(e) => setComment(e.target.value)} value={comment} className="input-box pr-5 placeholder:text-dark-grey resize-none h-[150px] overflow-auto" placeholder={placeholder}></textarea>
            <button onClick={handelComment} className="btn-dark mt-5 px-10">{action}</button>
        </>
    )
}
export default CommentField