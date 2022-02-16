import { useRouter } from "next/router"
import { useEffect, useState } from "react"


export const useOnCommmentsPage = (postId: string) => {
    // Track state
    const [onCommentsPage, setOnCommentsPage] = useState(false)

    // Detect path with router
    const router = useRouter() 

    // If router path matches post's comment page path set to true, 
    // otherwise false 
    useEffect(() => {
        if (router.asPath === `/comments/${postId}`) setOnCommentsPage(true)
        else setOnCommentsPage(false)

        return () => {setOnCommentsPage(false)}
    }, [postId])

    return [onCommentsPage, setOnCommentsPage] as const

}