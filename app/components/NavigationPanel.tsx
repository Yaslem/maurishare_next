'use client'

import AnimationWrapper from "./AnimationWrapper"
import Link from "next/link"
import { useSelector } from "react-redux"
import { logOut } from "@/app/services/auth.server"
import { RootState } from "@/app/redux/store"

const NavigationPanel = () => {
    const user = useSelector((state: RootState) => state.user.data)

    const handleSignOut = async () => {
        await logOut();
    }

    return (
        <AnimationWrapper
            className={"absolute left-0"}
            transition={{duration: 0.2}}
        >
            <div className={"bg-white z-50 fixed left-0 border border-grey w-60 duration-200"}>
                <Link href="/post/create" className={"flex gap-2 link md:hidden pl-8 py-4"}>
                    <i className="fi fi-rr-edit"></i>
                    <p>اكتب</p>
                </Link>

                <Link 
                    href={`/user/${user.username}`} 
                    className={"flex gap-2 link md:hidden pl-8 py-4"}
                >
                    <p>الملف الشخصي</p>
                </Link>

                <Link 
                    href="/dashboard/posts" 
                    className={"flex gap-2 link md:hidden pl-8 py-4"}
                >
                    <p>صفحة التحكم</p>
                </Link>

                <Link 
                    href="/dashboard/edit-profile" 
                    className={"flex gap-2 link md:hidden pl-8 py-4"}
                >
                    <p>الإعدادات</p>
                </Link>

                <span className={"absolute border-t border-grey w-[100%]"}/>

                <button 
                    onClick={handleSignOut}
                    className={"text-right p-4 hover:bg-grey w-full pr-8 py-4"}
                >
                    <h1 className={"font-bold text-xl mb-1"}>تسجيل الخروج</h1>
                    <p className={"text-dark-grey"}>@{user.username}</p>
                </button>
            </div>
        </AnimationWrapper>
    )
}

export default NavigationPanel