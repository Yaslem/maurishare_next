export const dynamic = 'force-dynamic'

import { Metadata } from "next"
import NotificationsIndex from "./index"
import User from "@/app/controllers/User.server"
import { getUserAuthenticated } from "@/app/services/auth.server"
import { redirect } from "next/navigation"

export const metadata : Metadata = {
    title: `الإشعارات - لوحة التحكم | ${process.env.SITE_NAME}`,
    description: "تابع جميع إشعاراتك وتنبيهاتك المهمة في مكان واحد. اطلع على آخر التحديثات والتفاعلات مع حسابك",
    openGraph: {
        title: `الإشعارات - لوحة التحكم | ${process.env.SITE_NAME}`,
        description: "تابع جميع إشعاراتك وتنبيهاتك المهمة في مكان واحد. اطلع على آخر التحديثات والتفاعلات مع حسابك",
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
    },
    alternates: {
        canonical: '/dashboard/notifications'
    }
}

async function loadMoreNotifications(page: number, type: string) {
    "use server"
    const user = await getUserAuthenticated()
    if (!user) redirect('/auth/signin')
    
    return await User.getNotifications({ username: user.username, page, type })

}

async function filterNotifications(type: string) {
    "use server"
    const user = await getUserAuthenticated()
    if (!user) redirect('/auth/signin')
    
    return await User.getNotifications({ username: user.username, type })
}

export default async function NotificationsPage() {
    const user = await getUserAuthenticated()
    const notfication = await User.getNotifications({ username: user.username })
    return (
        <NotificationsIndex notifications={notfication} onLoadMoreNotifications={loadMoreNotifications} onFilterNotifications={filterNotifications} />
    )
}