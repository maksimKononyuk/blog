import { useState, useEffect, useCallback } from 'react'
import { getTotalCount } from '../helpers'
import axios from '../axios'
import { PostType } from '../pages/Posts'
import { countPage } from '../Constants'

export const usePostHook = (
  setCurrentPage: (lastPage: number) => void,
  post: PostType,
  setPosts: (posts: PostType[]) => void,
  setUpdatePost: (post: PostType) => void
) => {
  const [date, setDate] = useState('')
  const [isUpdated, setIsUpdated] = useState(false)
  const [isDisabeled, setIsDisabeled] = useState(false)

  useEffect(() => {
    const updatedAt = new Date(post.updatedAt)
    const createdAt = new Date(post.createdAt)
    setIsUpdated(updatedAt.getTime() !== createdAt.getTime())
    const formatedDate = updatedAt.toLocaleString().slice(0, -3)
    setDate(formatedDate)
  }, [post.updatedAt, post.createdAt])

  const removePostHandler = useCallback(async () => {
    setIsDisabeled(true)
    try {
      await axios.delete(`/api/posts/${post._id}`)
      const lastPage = await getTotalCount()
      setCurrentPage(lastPage)
      const res = await axios.get<{ posts: PostType[] }>(
        `/api/posts?count=${countPage}&page=${lastPage}`
      )
      setPosts(res.data.posts)
    } catch (err) {
      console.log('Не удалось удалить пост')
    }
  }, [post._id, setCurrentPage, setPosts])

  const updateHandler = useCallback(() => {
    setUpdatePost(post)
  }, [post, setUpdatePost])

  return { date, isUpdated, isDisabeled, removePostHandler, updateHandler }
}
