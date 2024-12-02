'use client';

import {useState } from "react";
import NotificationCard from "@/app/components/NotificationCard";
import LoadMoreDataBtn from "@/app/components/LoadMoreDataBtn";
import NoDataMessage from "@/app/components/NoDataMessage";
export default function NotificationsIndex({
    notifications,
    onLoadMoreNotifications,
    onFilterNotifications,

} : {
    notifications: any;
    onLoadMoreNotifications: any;
    onFilterNotifications: any;
}) {
    const [notificationsList, setNotificationsList] = useState(notifications);
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
        }

    }

    const getDataPagination = async () => {
        const result = await onLoadMoreNotifications(notificationsList.data.page + 1, getNameFilter(filter));
        if(result.status === "success"){
            setNotificationsList((prev : any) => ({
                ...prev,
                data: {
                    ...prev.data,
                    results: [...prev.data.results, ...result.data.results],
                },
            }));
        }
        
    };

    const getDataByFilter = async (filterName: string) => {
        const result = await onFilterNotifications(getNameFilter(filterName));
        setNotificationsList(result);
    };

    return (
        <div>
            <h1 className="max-md:hidden">الإشعارات</h1>
            <div className="my-8 flex gap-6">
                {filters.map((filterName, i) => (
                    <button onClick={() => {
                        setFilter(filterName);
                        getDataByFilter(filterName);
                    }} key={i} className={"py-2 " + (filterName === filter ? "btn-dark" : "btn-light")}>
                        {filterName}
                    </button>
                ))}
            </div>
            {notificationsList?.status !== "error"
                ? notificationsList.data.results.map((notification: any, i: number) => (
                    <NotificationCard key={i} notification={notification} />
                ))
                : <NoDataMessage message={"لا توجد إشعارات."} />}
            <LoadMoreDataBtn getDataPagination={getDataPagination} state={notificationsList} />
        </div>
    );
}