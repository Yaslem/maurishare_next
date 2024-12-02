"use client"

import { useState } from "react"
import toast from "react-hot-toast"

const CommentField = ({ action, user, replyingTo, statusReply, placeholder, message, onComment, onReply } : { action: string, user: any, replyingTo: number, statusReply: string, placeholder: string, message: string, onComment: any, onReply: any }) => {
    let toastId : string;
    const [comment, setComment] = useState("")
    
    const handelComment = async () => {
        if(action === "تعليق"){
            if(!user){
                toast.error("رجاء سجل الدخول لكي تستطيع التعليق على المنشور.")
            } else if(!comment.length){
                toast.error("رجاء اكتب شيئا ما.")
            } else {
                toastId = toast.loading("يتم إضافة التعليق...")
                const result = await onComment(comment)
                if (result.status === 'success') {
                    setComment("")
                    toast.dismiss(toastId)
                }
            }
        } else if(action === "رد"){
            if(!user){
                toast.error("رجاء سجل الدخول لكي تستطيع الرد على التعليق.")
            } else if(!comment.length){
                toast.error("رجاء اكتب شيئا ما.")
            } else {
                toastId = toast.loading("يتم إضافة الرد...")
                const result = await onReply({
                    comment,
                    replyingTo,
                    action: "reply",
                    statusReply
                })
                if (result.status === 'success') {
                    setComment("")
                    toast.dismiss(toastId)
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