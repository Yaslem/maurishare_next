"use client"
import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { userResponse } from "@/app/controllers/User.server"

const SideNav = ({newNotification, user} : {newNotification: boolean, user: userResponse & { role: "ADMIN" | "USER" }}) => {
    const pathname = usePathname()
    const location = usePathname().split("/")[2]
    function getPathName(pathname: string){
        switch (pathname) {
            case "posts":
                return "المنشورات"
        
            default:
                return "صفحة التحكم"
        }
    }
    const [page, setPage] = useState(getPathName(location))
    const [showSideNav, setShowSideNav] = useState(false)
    const activeTapLine = useRef<HTMLHRElement | null>(null)
    const sideBarIcon = useRef<HTMLButtonElement | null>(null)
    const pageStateTap = useRef<HTMLButtonElement | null>(null)

    const changePageState = (e: React.MouseEvent<HTMLButtonElement>) => {
        const { offsetWidth, offsetLeft, offsetParent } = e.target as HTMLButtonElement                    
        if (activeTapLine.current) {
            activeTapLine.current.style.width = offsetWidth + "px"
            if (offsetParent) {
                const parentElement = offsetParent as HTMLElement;
                activeTapLine.current.style.right = (parentElement.offsetWidth - offsetWidth - offsetLeft) + "px"
            } else {
                activeTapLine.current.style.right = "0px";
            }
        }

        if(e.target === sideBarIcon.current){
            setShowSideNav(true)
        } else {
            setShowSideNav(false)
        }
    }
    useEffect(() => {
        setShowSideNav(false)
        if(pageStateTap.current){
            pageStateTap.current.click()
        }
    }, [page])
    return (
        <div className="sticky top-[90px] z-30">
                <div className="md:hidden bg-white py-1 border-b border-grey flex flex-nowrap overflow-y-auto">
                    <button onClick={changePageState} ref={sideBarIcon} className="p-5 capitalize">
                        <i className="fi fi-rr-bars-staggered pointer-events-none"></i>
                    </button>
                    <button onClick={changePageState} ref={pageStateTap} className="p-5 capitalize">
                        {page}
                    </button>
                    <hr ref={activeTapLine} className="absolute bottom-0 duration-500"/>
                </div>
                <div className={"overflow-y-auto h-[calc(100vh-80px-60px)] md:h-cover min-w-[250px] md:sticky top-24 p-6 md:pl-0 md:border-grey md:border-l absolute max-md:top-[64px] bg-white max-md:w-[calc(100%+80px)] max-md:px-16 max-md:-mr-7 duration-500 " + (!showSideNav ? "max-md:opacity-0 max-md:pointer-events-none" : "max-md:opacity-100 max-md:pointer-events-auto")}>
                    <h1 className="text-xl text-dark-grey mb-3 ">صفحة التحكم</h1>
                    <hr  className="border-grey -mr-6 mb-8 ml-6"/>
                    {
                        user.role === "ADMIN"
                            ? <>
                                <Link className={"sidebar-link " + (pathname === "/dashboard/all-posts" ? "active" : "")} href={"/dashboard/all-posts"} onClick={e => setPage((e.currentTarget as HTMLAnchorElement).innerText)}>
                                    <i className="fi fi-rr-border-all"></i>
                                    المنشورات
                                </Link>
                                <Link className={"sidebar-link " + (pathname === "/dashboard/users" ? "active" : "")} href={"/dashboard/users"} onClick={e => setPage((e.currentTarget as HTMLAnchorElement).innerText)}>
                                    <i className="fi fi-rr-users-alt"></i>
                                    المستخدمون
                                </Link>
                            </>
                            : null
                    }
                    <Link className={"sidebar-link " + (pathname === "/dashboard/posts" ? "active" : "")} href={"/dashboard/posts"} onClick={e => setPage((e.currentTarget as HTMLAnchorElement).innerText)}>
                        <i className="fi fi-rr-document"></i>
                        {user.role === "ADMIN" ? "منشوراتي" : "المنشورات"}
                    </Link>
                    <Link className={"sidebar-link " + (pathname === "/dashboard/notifications" ? "active" : "")} href={"/dashboard/notifications"} onClick={e => setPage((e.currentTarget as HTMLAnchorElement).innerText)}>
                        <div className="relative">
                        <i className="fi fi-rr-bell"></i>
                            {
                                newNotification
                                    ? <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-0 right-2" />
                                    : null
                            }
                        </div>
                        الإشعارات
                    </Link>
                    <Link className={"sidebar-link " + (pathname === "/post/create" ? "active" : "")} href={"/post/create"} onClick={e => setPage((e.currentTarget as HTMLAnchorElement).innerText)}>
                        <i className="fi fi-rr-file-edit"></i>
                        اكتب
                    </Link>
                    <h1 className="text-xl text-dark-grey mt-20 mb-3 ">إعدادات الحساب</h1>
                    <hr  className="border-grey -mr-6 mb-8 ml-6"/>
                    <Link className={"sidebar-link " + (pathname === "/dashboard/edit-profile" ? "active" : "")} href={"/dashboard/edit-profile"} onClick={e => setPage((e.currentTarget as HTMLAnchorElement).innerText)}>
                        <i className="fi fi-rr-user"></i>
                        تعديل الملف الشخصي
                    </Link>
                    <Link className={"sidebar-link " + (pathname === "/dashboard/change-password" ? "active" : "")} href={"/dashboard/change-password"} onClick={e => setPage((e.currentTarget as HTMLAnchorElement).innerText)}>
                        <i className="fi fi-rr-lock"></i>
                        تغيير كلمة المرور
                    </Link>
            </div>
        </div>
    )
}
export default SideNav