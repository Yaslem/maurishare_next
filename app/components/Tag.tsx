"use client"
import toast from "react-hot-toast"
import { useDispatch, useSelector } from "react-redux"
import { postActions } from "@/app/redux/slices/postSlice"
import { RootState } from "@/app/redux/store"

const Tag = ({tag, tagIndex}: {tag: string, tagIndex: number}) => {
    const post = useSelector((state: RootState) => state.post)
    const dispatch = useDispatch()

    const handelDeleteTag = () => {
        const tags = post.tags.filter((t: string) => t !== tag)
        dispatch(postActions.setTags(tags))
    }

    const handelEditTag = (e: React.KeyboardEvent) => {        
        if(e.keyCode === 13){
            e.preventDefault()
            const currentTag = (e.target as HTMLElement).innerText
            const tags = [...post.tags ] 
            if(currentTag.length){   
                tags[tagIndex] = currentTag
            } else {
                toast.error(`الوسم لا يمكن أن يكون فارغا.`);
                (e.target as HTMLElement).innerText = tags[tagIndex]
            }
            dispatch(postActions.setTags(tags));
            (e.target as HTMLElement).setAttribute("contentEditable", "false")
        }
    }

    const handelAddEditable = (e: React.MouseEvent<HTMLParagraphElement>) => {
        (e.target as HTMLElement).setAttribute("contentEditable", "true");
        (e.target as HTMLElement).focus()
    }

    return (
        <div className={"relative p-2 mt-2 ml-2 px-5 bg-white rounded-full inline-block hover:bg-opacity-50 pl-8"}>
            <p className={"outline-none"} onKeyDown={handelEditTag} onClick={handelAddEditable}>{tag}</p>
            <button onClick={handelDeleteTag} className={"mt-[2px] rounded-full absolute left-3 top-1/2 -translate-y-1/2"}>
                <i className={"fi fi-br-cross text-sm pointer-events-none"}></i>
            </button>
        </div>
    )
}
export default Tag