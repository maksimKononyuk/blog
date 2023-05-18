import { useEffect, useRef } from 'react'
import { PostType } from './pages/Posts'

export const useChatScroll = (dep: PostType[] | null) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight
    }
  }, [dep])

  return ref
}
