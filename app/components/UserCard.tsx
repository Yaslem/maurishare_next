import Link from "next/link"
import { type userResponse } from "@/app/controllers/User.server"
import Image from "next/image"


const UserCard = ({user}: {user: userResponse}) => {
    const {name, username, photo} = user
    return (
        <Link href={`/user/${username}`} className="flex gap-5 items-center mb-5">
            <Image src={`/uploads/${photo}`} className="w-14 h-14 rounded-full" alt={name} width={56} height={56} />
            <div>
                <h1 className="font-medium text-xl line-clamp-2">{name}</h1>
                <p className="text-dark-grey">@{username}</p>
            </div>
        </Link>
    )
}
export default UserCard