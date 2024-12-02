import SideNav from "@/app/components/SideNav";
import { getUserAuthenticated } from '@/app/services/auth.server';
import User from '@/app/controllers/User.server';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "الرئيسية",
  description: 'الرئيسية',
  metadataBase: new URL(process.env.BASE_URL || 'https://www.mashrabia.com'),
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUserAuthenticated();
  console.log(user)
  
  const newNotification = await User.getNewNotification(user.username);
  const hasNewNotifications = newNotification.status === "success";

  return (
    <section className="relative flex gap-10 py-0 m-0 max-md:flex-col">
      <SideNav user={user} newNotification={hasNewNotifications} />
      <div className="max-md:-mt-8 mt-5 w-full">
        {children}
      </div>
    </section>
  );
}