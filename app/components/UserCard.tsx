import Link from "next/link"

const UserCard = ({user}: {user: any}) => {
    const {name, username, photo} = user
    return (
        <Link href={`/user/${username}`} className="flex gap-5 items-center mb-5">
            <img src={`/uploads/${photo}`} className="w-14 h-14 rounded-full" />
            <div>
                <h1 className="font-medium text-xl line-clamp-2">{name}</h1>
                <p className="text-dark-grey">@{username}</p>
            </div>
        </Link>
    )
}
export default UserCard