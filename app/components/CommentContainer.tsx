"use client"

import AnimationWrapper from "./AnimationWrapper";
import CommentField from "./CommentField";
import NoDataMessage from "./NoDataMessage";
import CommentCard from "./CommentCard";
import LoadMoreDataBtn from "./LoadMoreDataBtn";
import {NotAllowed} from "./NotAllowed";

const CommentContainer = ({ user, comments, commentWrapper, setCommentWrapper, post, onComment, onReply, onDeleteComment, onLoadMore } : { user: any, comments: any, commentWrapper: boolean, setCommentWrapper: any, post: any, onComment: any, onReply: any, onDeleteComment: any, onLoadMore: any }) => {
    
    const getDataPagination = async () => {
        await onLoadMore(comments.data.page + 1)
    }
    return (
        <section className={"max-sm:w-full fixed " + (commentWrapper ? "!top-0 sm:!left-0" : "!top-[100%] sm:!left-[-100%]") + " duration-700 max-sm:left-0 max-sm:top-0 w-[30%] min-w-[350px] h-full z-50 bg-white shadow-xl p-8 px-8 overflow-x-hidden overflow-y-auto"}>
            <div className="relative">
                <h1 className="text-xl font-semibold">التعليقات</h1>
                <p className="text-xl mt-2 w-[70%] text-dark-grey line-clamp-1">{post.title}</p>

                <button onClick={() => setCommentWrapper(!commentWrapper)} className="absolute top-0 left-0 flex justify-center items-center w-12 h-12 rounded-full bg-grey">
                    <i className="fi fi-br-cross text-2xl mt-1"></i>
                </button>
            </div>
            <hr className=" border-grey my-8 w-[120%] -mr-10" />
            {
                user?.can_create_comment
                    ? <CommentField replyingTo={post.id} statusReply={"comment"} onReply={() => {}} onComment={onComment} message={`أنت الآن تعلق على منشور @${post.author.username}`} placeholder="اترك تعليقا..." user={user} action={"تعليق"} />
                    : <NotAllowed message={"عفوا، لقد تم منعك من التعليق، رجاء تواصل مع إدارة الموقع."} />
            }
            {
                comments.status !== "error"
                    ? comments.data.results.map((comment : any, i : number) =>
                        <AnimationWrapper key={i}>
                            <CommentCard post={post} user={user} onReply={onReply} comment={comment} onDeleteComment={onDeleteComment} />
                        </AnimationWrapper>
                    )
                    : <NoDataMessage message={comments.message} />
            }
            {
                comments.status !== "error" && post.activity.totalComments > comments.data.results.length && comments.data.count > 5
                    ? <LoadMoreDataBtn getDataPagination={getDataPagination} state={comments} />
                    : null
            }
        </section>
    )
}

export default CommentContainer