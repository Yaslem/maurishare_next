'use client'

import Link from "next/link"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import NavigationPanel from "./NavigationPanel"
import { useDispatch } from "react-redux"
import { userActions } from "../redux/slices/userSlice"
import { type User } from "@prisma/client"

interface NavbarProps {
    user: User | null
    newNotification: boolean
}

const Navbar = ({ user, newNotification }: NavbarProps) => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(userActions.setUser(user))
    }, [user, dispatch])

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false)
    const [userNavPanel, setUserNavPanel] = useState(false)

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const value = e.currentTarget.value
        if(e.keyCode === 13 && value.length){
            router.push(`/search/${value}`)
        }
    }

    return (
        <nav className="navbar z-50">
            <Link href="/" className="flex-none">
                <Image 
                    src="/images/logo.png"
                    alt="موريشير"
                    width={180}
                    height={60}
                    className="max-sm:w-[100px] w-[180px] h-auto"
                />
            </Link>

            <div className={`absolute w-full bg-white right-0 top-full mt-0.5 border-b border-grey py-4 px-[5vw] md:border-0 md:block md:relative md:inset-0 md:p-0 md:w-auto md:show ${searchBoxVisibility ? "show" : "hide"}`}>
                <i className="fi fi-rr-search absolute left-[10%] md:pointer-events-none md:right-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                <input 
                    defaultValue={searchParams.get('value') || ''}
                    onKeyDown={handleSearch}
                    type="text"
                    placeholder="بحث"
                    className="w-full md:w-auto bg-grey p-4 pr-6 pl-[12%] md:pl-6 rounded-full placeholder:text-dark-grey md:pr-12"
                />
            </div>

            <div className="flex items-center gap-3 md:gap-6 mr-auto">
                <button
                    onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}
                    className="md:hidden flex items-center justify-center"
                >
                    <i className="fi fi-rr-search text-xl"></i>
                </button>
            </div>

            <Link href="/post/create" className="hidden md:flex gap-2 link">
                <i className="fi fi-rr-edit"></i>
                <p>اكتب</p>
            </Link>
            <Link href="mailto:contact@maurishare.com" className="flex gap-2 link items-center justify-center">
                <i className="fi fi-rr-envelope text-xl"></i>
                <p className="hidden md:block">تواصل معنا</p>
            </Link>

            {user ? (
                <>
                    <Link href="/dashboard/notifications"
                        className="flex items-center justify-center relative">
                        <i className="fi fi-rr-bell text-xl block"></i>
                        {newNotification && (
                            <span className="bg-red w-3 h-3 rounded-full absolute z-10 top-2 left-2" />
                        )}
                    </Link>
                    <div className="relative" 
                        onClick={() => setUserNavPanel(!userNavPanel)} 
                        onBlur={() => {
                            setTimeout(() => {
                                setUserNavPanel(false)
                            }, 200)
                        }}>
                        <button className="w-12 h-12 mt-1">
                            <Image 
                                alt="صورة شخصية"
                                src={`/uploads/${user.photo}`}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover rounded-full"
                            />
                        </button>
                        {userNavPanel && <NavigationPanel />}
                    </div>
                </>
            ) : (
                <>
                    <Link href="/auth/signin" className="btn-dark py-2 flex items-center gap-2">
                        <i className="md:hidden fi fi-rr-enter"></i>
                        <span className="hidden md:block">تسجيل الدخول</span>
                    </Link>
                    <Link href="/auth/signup" className="btn-light py-2 hidden md:block">
                        <i className="fi fi-rr-user-plus"></i>
                        <span className="hidden md:block">حساب جديد</span>
                    </Link>
                </>
            )}
        </nav>
    )
}

export default Navbar