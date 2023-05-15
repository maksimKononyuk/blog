import axios from '../axios'
import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Post } from '../components/Post'
import { NewPost } from '../components/NewPost'
import { Pagination } from '../components/Pagination'
import { countPage } from '../Constants'
import { useChatScroll } from '../hooks'
import { getTotalCount } from '../helpers'

export const Posts = ({ auth }) => {
  const [posts, setPosts] = useState(null)
  const [pages, setPages] = useState([])
  // const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [updatePost, setUpdatePost] = useState(null)

  const ref = useChatScroll(posts)

  const createArrFromPageNumber = (pages) => {
    const pagesArr = []
    for (let i = 1; i <= pages; i++) {
      pagesArr.push(i)
    }
    return pagesArr
  }

  // Здесь мы просто получаем totalCount, чтобы определить сколько у нас будет страниц и устанавливаем последнюю страницу текущей. Это позволит при загрузке постов всегда выводить самые свежие)))
  useEffect(() => {
    ;(async () => {
      const lastPage = await getTotalCount()
      setCurrentPage(lastPage)
    })()
  }, [])

  useEffect(() => {
    const getPosts = async () => {
      const res = await axios.get(
        `/api/posts?count=${countPage}&page=${currentPage}`
      )
      const posts = res.data.posts
      const totalCount = res.data.totalCount
      const pages = Math.ceil(totalCount / countPage) // захардкожено получение по 20 сообщений в странице
      // setTotalCount(totalCount)
      setPosts(posts)
      setPages(createArrFromPageNumber(pages))
    }
    getPosts()
  }, [currentPage])

  if (!auth.data) {
    return <Navigate to='/login' />
  }

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
