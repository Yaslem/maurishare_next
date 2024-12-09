"use client"
import { type PostResponse, type CommentResponse } from "@/app/controllers/Post.server";
import { notificationResponse, type userResponse } from "@/app/controllers/User.server";

interface LoadMoreDataBtnProps {
    isPending: boolean;
    state: {
        data: { results: PostResponse[] | CommentResponse[] | userResponse[] | notificationResponse[]; page: number; count: number; } | null;
        action: string;
        status: "success" | "error";
        code: number;
        message: string;
    };
    getDataPagination: () => Promise<void>
}
const LoadMoreDataBtn = ({ state, getDataPagination, isPending }: LoadMoreDataBtnProps) => {
    if (state !== null && state.status !== "error" && state?.data?.count && state?.data?.results.length && state?.data?.count > state?.data?.results.length) {
        return (
            <button disabled={isPending} onClick={getDataPagination} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">{isPending ? "جاري التحميل..." : "تحميل المزيد"}</button>
        )
    }

}
export default LoadMoreDataBtn