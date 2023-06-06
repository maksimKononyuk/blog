import { useState, useEffect, useCallback } from 'react'
import { PostType } from '../pages/Posts'
import { useChatScroll } from './chatScrollHook'
import { getTotalCount } from '../helpers'
import axios from '../axios'
import { countPage, socket } from '../Constants'

export const usePostsHook = () => {
  const [posts, setPosts] = useState<PostType[] | null>(null)
  const [pages, setPages] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [updatePost, setUpdatePost] = useState<PostType | null>(null)
  const ref = useChatScroll(posts)

  const createArrFromPageNumber = useCallback((pages: number) => {
    const pagesArr = []
    for (let i = 1; i <= pages; i++) {
      pagesArr.push(i)
    }
    return pagesArr
  }, [])

  // Здесь мы просто получаем totalCount, чтобы определить сколько у нас будет страниц и устанавливаем последнюю страницу текущей. Это позволит при загрузке постов всегда выводить самые свежие)))
  useEffect(() => {
    ;(async () => {
      const lastPage = await getTotalCount()
      setCurrentPage(lastPage)
    })()
  }, [])

  const getPosts = useCallback(async () => {
    const res = await axios.get<{ posts: PostType[]; totalCount: number }>(
      `/api/posts?count=${countPage}&page=${currentPage}`
    )
    const posts = res.data.posts
    const totalCount = res.data.totalCount
    const pages = Math.ceil(totalCount / countPage) // захардкожено получение по 20 сообщений в странице
    // setTotalCount(totalCount)
    setPosts(posts)
    setPages(createArrFromPageNumber(pages))
  }, [currentPage, createArrFromPageNumber])

  useEffect(() => {
    getPosts()
  }, [getPosts])

  useEffect(() => {
    socket.on('newMessage', () => {
      ;(async () => {
        const lastPage = await getTotalCount()
        setCurrentPage(lastPage)
      })()
      getPosts()
    })
  }, [])

  return {
    pages,
    currentPage,
    setCurrentPage,
    ref,
    posts,
    setPosts,
    setUpdatePost,
    updatePost
  }
}
