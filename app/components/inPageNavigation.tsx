"use client"

import { useEffect, useRef, useState } from "react"
export let activeTapLineRef: any;
export let activeTapRef: any;
const InPageNavigation = ({ routes, children, defaultHidden = [], defaultActiveIndex = 0 }: { routes: any, children: any, defaultHidden: any, defaultActiveIndex: number }) => {
    activeTapLineRef = useRef()
    activeTapRef = useRef()
    let [width, setWidth] = useState<number | undefined>(undefined)

    let [isResizeEventAdd, setIsResizeEventAdd] = useState(false)
    const [inPageIndex, setInPageIndex] = useState(defaultActiveIndex)
    const changePageState = (btn: any, i: number) => {
        const { offsetWidth, offsetLeft, offsetParent } = btn
        activeTapLineRef.current.style.width = offsetWidth + "px"
        activeTapLineRef.current.style.right = (offsetParent.offsetWidth - offsetWidth - offsetLeft) + "px"
        setInPageIndex(i)
    }

    useEffect(() => {
        if (width && width > 766 && inPageIndex !== defaultActiveIndex) {
            changePageState(activeTapRef.current, defaultActiveIndex)
        }

        if (!isResizeEventAdd) {
            window.addEventListener("resize", () => {
                if (!isResizeEventAdd) {
                    setIsResizeEventAdd(true)
                }
                setWidth(window.innerWidth)
            })
        }
    }, [width])

    useEffect(() => {
        changePageState(activeTapRef.current, defaultActiveIndex)
        setWidth(window.innerWidth)
    },[])

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-hidden">
                {
                    routes.map((route: any, i: number) =>
                        <button ref={i === defaultActiveIndex ? activeTapRef : null} onClick={e => changePageState(e.target, i)} key={i} className={"p-4 px-5 " + (inPageIndex === i ? "text-black" : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden " : "")}>
                            {route}
                        </button>
                    )
                }
                <hr className="absolute border bottom-0 duration-300 border-dark-grey" ref={activeTapLineRef} />
            </div>
            {
                Array.isArray(children)
                    ? children[inPageIndex]
                    : children
            }
        </>
    )
}
export default InPageNavigation