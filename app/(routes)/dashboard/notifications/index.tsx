'use client';

import {useState } from "react";
import NotificationCard from "@/app/components/NotificationCard";
import LoadMoreDataBtn from "@/app/components/LoadMoreDataBtn";
import NoDataMessage from "@/app/components/NoDataMessage";
import { userResponse, type notificationResponse } from "@/app/controllers/User.server";
import { type sendResponseServer } from "@/app/helpers/SendResponse.server";
import { type PostResponse, type CommentResponse } from "@/app/controllers/Post.server";

interface NotificationsIndexProps {
    notifications: Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, countAll: number, results: notificationResponse[]} | null>>>;
    onLoadMoreNotifications: (page: number, type: string) => Promise<Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, countAll: number, results: notificationResponse[]} | null>>>>;
    onFilterNotifications: (type: string) => Promise<Awaited<ReturnType<typeof sendResponseServer<{page: number, count: number, countAll: number, results: notificationResponse[]} | null>>>>;
}

export default function NotificationsIndex({
    notifications,
    onLoadMoreNotifications,
    onFilterNotifications,
}: NotificationsIndexProps) {
    const [notificationsList, setNotificationsList] = useState(notifications);
    const [isPending, setIsPending] = useState(false)
    const [filter, setFilter] = useState("الكل");
    const filters = ["الكل", "الإعجابات", "التعليقات", "الردود"];

    const getNameFilter = (name : string) => {
        switch (name) {
            case "الكل":
                return "all"
            case "الإعجابات":
                return "LIKE"
            case "التعليقات":
                return "COMMENT"
            case "الردود":
                return "REPLY"
            default:
                return "all"
        }

    }

    const getDataPagination = async () => {
        setIsPending(true)
        const result = await onLoadMoreNotifications(notificationsList.data ? notificationsList.data.page + 1 : 1, getNameFilter(filter));
        if(result.status === "success" && result.data){
            setNotificationsList((prev : typeof notificationsList) => {
                if(!prev.data || !result.data) return prev
                return {
                    ...prev,
                    data: {
                        ...prev.data,
                        page: result.data.page || prev.data.page,
                        count: result.data.count || prev.data.count,
                        countAll: result.data.countAll || prev.data.countAll,
                        results: [...prev.data.results, ...result.data.results],
                    }
                }
            });
        }
        setIsPending(false)
    };

    const getDataByFilter = async (filterName: string) => {
        const result = await onFilterNotifications(getNameFilter(filterName));
        setNotificationsList(result);
    };

    return (
        <div>
            <h1 className="max-md:hidden">الإشعارات</h1>
            <div className="my-8 flex gap-6">
                {filters.map((filterName: string, i: number) => (
                    <button onClick={() => {
                        setFilter(filterName);
                        getDataByFilter(filterName);
                    }} key={i} className={"py-2 " + (filterName === filter ? "btn-dark" : "btn-light")}>
                        {filterName}
                    </button>
                ))}
            </div>
            {notificationsList?.status !== "error"
                ? notificationsList.data?.results.map((notification: notificationResponse, i: number) => (
                    <NotificationCard key={i} notification={notification as notificationResponse & {user: userResponse, repliedOnComment: CommentResponse | null, reply: CommentResponse | null, comment: CommentResponse | null, post: PostResponse}} />
                ))
                : <NoDataMessage message={"لا توجد إشعارات."} />}
            <LoadMoreDataBtn getDataPagination={getDataPagination} state={notificationsList} isPending={isPending} />
        </div>
    );
}