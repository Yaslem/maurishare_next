"use client"

import { useCallback, useEffect, useRef, useState } from "react"
export let activeTapLineRef: React.RefObject<HTMLHRElement>;
export let activeTapRef: React.RefObject<HTMLButtonElement>;
const InPageNavigation = ({ routes, children, defaultHidden = [], defaultActiveIndex = 0 }: { routes: string[], children: React.ReactNode, defaultHidden: string[], defaultActiveIndex: number }) => {
    activeTapLineRef = useRef<HTMLHRElement>(null)
    activeTapRef = useRef<HTMLButtonElement>(null)
    const [width, setWidth] = useState<number | undefined>(undefined)

    const [isResizeEventAdd, setIsResizeEventAdd] = useState(false)
    const [inPageIndex, setInPageIndex] = useState(defaultActiveIndex)
    const changePageState = (btn: HTMLButtonElement, i: number) => {
        const { offsetWidth, offsetLeft, offsetParent } = btn
        if (activeTapLineRef.current) {
            activeTapLineRef.current.style.width = offsetWidth + "px"
            if (offsetParent instanceof HTMLElement) {
                activeTapLineRef.current.style.right = (offsetParent.offsetWidth - offsetWidth - offsetLeft) + "px"
            }
        }
        setInPageIndex(i)
    }

    useEffect(() => {
        if (width && width > 766 && inPageIndex !== defaultActiveIndex && activeTapRef.current) {
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
    }, [width, inPageIndex, isResizeEventAdd, defaultActiveIndex])

    const initializePost = useCallback(() => {
        if (activeTapRef.current) {
            changePageState(activeTapRef.current, defaultActiveIndex)
        }
        setWidth(window.innerWidth)
      }, [defaultActiveIndex])

    useEffect(() => {
        initializePost()
    },[initializePost])

    return (
        <>
            <div className="relative mb-8 bg-white border-b border-grey flex flex-nowrap overflow-hidden">
                {
                    routes.map((route: string, i: number) =>
                        <button ref={i === defaultActiveIndex ? activeTapRef : null} onClick={e => changePageState(e.target as HTMLButtonElement, i)} key={i} className={"p-4 px-5 " + (inPageIndex === i ? "text-black" : "text-dark-grey ") + (defaultHidden.includes(route) ? "md:hidden " : "")}>
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