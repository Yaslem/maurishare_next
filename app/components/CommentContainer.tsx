"use client"

import AnimationWrapper from "./AnimationWrapper";
import CommentField from "./CommentField";
import NoDataMessage from "./NoDataMessage";
import CommentCard from "./CommentCard";
import LoadMoreDataBtn from "./LoadMoreDataBtn";
import {NotAllowed} from "./NotAllowed";
import { type CommentResponse, type PostResponse } from "@/app/controllers/Post.server";
import { userResponseInPost } from "./ClientPost";
import { type sendResponseServer } from "@/app/helpers/SendResponse.server";
import { Dispatch, SetStateAction, useState } from "react";
import { userResponse } from "../controllers/User.server";

interface CommentContainerProps {
    user: userResponseInPost | null;
    comments: Awaited<ReturnType<typeof sendResponseServer<{results: CommentResponse[], page: number, count: number} | null>>>;
    commentWrapper: boolean;
    setCommentWrapper: Dispatch<SetStateAction<boolean>>;
    post: PostResponse | null;
    onComment: (comment: string) => Promise<{status: string}>;
    onReply: ({replyingTo, comment, statusReply}: {replyingTo: string, comment: string, statusReply: "reply" | "repliedOnComment"}) => Promise<{status: string}>;
    onDeleteComment: (commentId: string) => Promise<void>;
    onLoadMore: (page: number) => Promise<void>;
}

const CommentContainer = ({ user, comments, commentWrapper, setCommentWrapper, post, onComment, onReply, onDeleteComment, onLoadMore } : CommentContainerProps) => {
    const [isPending, setIsPending] = useState(false)
    const getDataPagination = async () => {
        if (!comments.data) return;
        setIsPending(true)
        await onLoadMore(comments.data.page + 1)
        setIsPending(false)
    }
    return (
        <section className={"max-sm:w-full fixed " + (commentWrapper ? "!top-0 sm:!left-0" : "!top-[100%] sm:!left-[-100%]") + " duration-700 max-sm:left-0 max-sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-xl p-8 px-8 overflow-x-hidden overflow-y-auto"}>
            <div className="relative">
                <h1 className="text-xl font-semibold">التعليقات</h1>
                <p className="text-xl mt-2 w-[70%] text-dark-grey line-clamp-1">{post?.title}</p>

                <button onClick={() => setCommentWrapper(!commentWrapper)} className="absolute top-0 left-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey">
                    <i className="fi fi-br-cross text-2xl mt-1"></i>
                </button>
            </div>
            <hr className=" border-grey my-8 w-[120%] -mr-10" />
            {
                user?.can_create_comment
                    ? <CommentField replyingTo={post?.id || ''} statusReply={"comment"} onComment={onComment} message={`أنت الآن تعلق على منشور @${post?.author.username}`} placeholder="اترك تعليقا..." user={user} action={"تعليق"} />
                    : <NotAllowed message={"عفوا، لقد تم منعك من التعليق، رجاء تواصل مع إدارة الموقع."} />
            }
            {
                comments.status !== "error" && comments.data
                    ? comments.data.results.filter((comment): comment is CommentResponse & { commentedBy: userResponse } => 
                        comment.commentedBy !== null
                      ).map((comment, i) =>
                        <AnimationWrapper key={i}>
                            {post && <CommentCard 
                                post={post} 
                                user={user} 
                                onReply={onReply} 
                                comment={comment} 
                                onDeleteComment={onDeleteComment} 
                            />}
                        </AnimationWrapper>
                    )
                    : <NoDataMessage message={comments.message} />
            }
            {
                comments.status !== "error" && post && post.activity && post.activity.totalComments > (comments.data?.results.length || 0) && (comments.data?.count || 0) > 5
                    ? <LoadMoreDataBtn isPending={isPending} getDataPagination={getDataPagination} state={comments} />
                    : null
            }
        </section>
    )
}

export default CommentContainer