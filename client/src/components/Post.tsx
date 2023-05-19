import { FC } from 'react'
import { usePostHook } from '../hooks/postHook'
import { PostType } from '../pages/Posts'

type PropsType = {
  post: PostType
  setPosts: (post: PostType[]) => void
  userId: string | null
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
  const { date, isUpdated, isDisabeled, removePostHandler, updateHandler } =
    usePostHook(setCurrentPage, post, setPosts, setUpdatePost)

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
