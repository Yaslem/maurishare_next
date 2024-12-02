"use client"

import { useFormStatus } from "react-dom"

const LoadMoreDataBtn = ({ state, getDataPagination, isPending }: { state: any, getDataPagination: () => Promise<any>, isPending: boolean }) => {
    if (state !== null && state.status !== "error" && state?.data.count > state?.data.results.length) {
        return (
            <button disabled={isPending} onClick={getDataPagination} className="text-dark-grey p-2 px-3 hover:bg-grey/30 rounded-md flex items-center gap-2">{isPending ? "جاري التحميل..." : "تحميل المزيد"}</button>
        )
    }

}
export default LoadMoreDataBtn