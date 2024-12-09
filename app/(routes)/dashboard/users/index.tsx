'use client'

import Link from 'next/link'
import Image from 'next/image'
import { type userResponse } from '@/app/controllers/User.server'
import NoDataMessage from '@/app/components/NoDataMessage'


const TABLE_HEADERS = ["الصورة", "الاسم", "اسم المستخدم", "البريد", "خيارات"]

export default function UsersIndex({ users }: { users: userResponse[] }) {
  return (
    <div className="overflow-auto w-full border border-black/10 mt-4 rounded-lg">
      {
        users.length === 0 ? (  
          <NoDataMessage message="لا يوجد مستخدمين" />
        ) : (
          <table className="w-full">
        <thead>
          <tr>
            {TABLE_HEADERS.map((name: string, i: number) => (
              <th 
                key={name}
                className={`
                  text-center border-black/10 bg-black/5 p-2 border-b
                  ${i === 0 ? "rounded-tr-lg" : ""}
                  ${i === TABLE_HEADERS.length - 1 ? "rounded-tl-lg" : ""}
                `}
              >
                {name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user: userResponse) => (
            <tr key={user.username} className="odd:border-b border-black/10">
              <td className="p-2">
                <Image 
                  src={`/uploads/${user.photo}`}
                  alt={user.name}
                  width={48}
                  height={48}
                  className="rounded-full object-cover w-16 h-16 overflow-hidden"
                />
              </td>
              <td className="p-2">{user.name}</td>
              <td className="p-2 underline">
                <Link href={`/user/${user.username}`}>@{user.username}</Link>
              </td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">
                <Link 
                  href={`/dashboard/users/${user.username}`} 
                  className="btn-dark flex items-center justify-center"
                >
                  عرض
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
          </table>
        )
      }
    </div>
  )
}