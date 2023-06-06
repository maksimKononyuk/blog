import { FC, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Post } from '../components/Post'
import { NewPost } from '../components/NewPost'
import { Pagination } from '../components/Pagination'
import { UserType, AuthType } from '../hooks/appHook'
import { usePostsHook } from '../hooks/postsHook'

export type PostType = {
  _id: string
  message: string
  user: UserType
  mediaUrl: string
  createdAt: Date
  updatedAt: Date
}

type PropsType = {
  auth: AuthType
}

export const Posts: FC<PropsType> = ({ auth }) => {
  const navigate = useNavigate()
  const {
    pages,
    currentPage,
    setCurrentPage,
    ref,
    posts,
    setPosts,
    setUpdatePost,
    updatePost
  } = usePostsHook(auth)
  useEffect(() => {
    if (!auth.data._id) {
      navigate('/login')
    }
  }, [])

  return (
    <div className='posts-block'>
      <Pagination
        pages={pages}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className='posts-block_posts' ref={ref}>
        {posts === null
          ? 'Posts is loading.... Please wait'
          : posts.length === 0
          ? 'Пока нет ни одного поста. Будьте первым, создайте пост!'
          : posts.map((elem) => {
              return (
                <Post
                  key={elem._id}
                  post={elem}
                  setCurrentPage={setCurrentPage}
                  setPosts={setPosts}
                  userId={auth.data._id}
                  setUpdatePost={setUpdatePost}
                />
              )
            })}
      </div>
      <NewPost
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setPosts={setPosts}
        updatePost={updatePost}
        setUpdatePost={setUpdatePost}
      />
    </div>
  )
}
