import { useState, useEffect, FC } from 'react'
import axios from '../axios'
import { countPage } from '../Constants'
import { getTotalCount } from '../helpers'
import { PostType } from '../pages/Posts'

type PropsType = {
  post: PostType
  setPosts: (post: PostType[]) => void
  userId: string
  setUpdatePost: (post: PostType) => void
  setCurrentPage: (page: number) => void
}

export const Post: FC<PropsType> = ({
  post,
  setPosts,
  userId,
  setUpdatePost,
  setCurrentPage
}) => {
  const [date, setDate] = useState('')
  const [isUpdated, setIsUpdated] = useState(false)
  const [isDisabeled, setIsDisabeled] = useState(false)

  const removePostHandler = async () => {
    setIsDisabeled(true)
    try {
      await axios.delete(`/api/posts/${post._id}`)
      const lastPage = await getTotalCount()
      setCurrentPage(lastPage)
      const res = await axios.get(
        `/api/posts?count=${countPage}&page=${lastPage}`
      )
      setPosts(res.data.posts)
    } catch (err) {
      console.log('Не удалось удалить пост')
    }
  }

  const updateHandler = () => {
    setUpdatePost(post)
  }

  useEffect(() => {
    const updatedAt = new Date(post.updatedAt)
    const createdAt = new Date(post.createdAt)
    setIsUpdated(updatedAt.getTime() !== createdAt.getTime())
    const formatedDate = updatedAt.toLocaleString().slice(0, -3)
    setDate(formatedDate)
  }, [post.updatedAt, post.createdAt])

  return (
    <div
      className={
        userId === post.user._id ? 'post-block post-block_self' : 'post-block'
      }
    >
      <div className='post-block_header'>
        <h4 className='post-blok_author'>{post.user.fullName}</h4>
        <h5 className='post-blok_date'>
          {isUpdated && 'Изменено'} {date}
        </h5>
      </div>
      <p className='post-block_message'>{post.message}</p>
      {post.mediaUrl && (
        <a className='post-block_image' href={post.mediaUrl} target='blank'>
          <img src={post.mediaUrl} alt='media' />
        </a>
      )}
      {userId === post.user._id && (
        <div className='post-block_footer'>
          <button onClick={updateHandler}>Изменить</button>
          <button disabled={isDisabeled} onClick={removePostHandler}>
            Удалить
          </button>
        </div>
      )}
    </div>
  )
}
