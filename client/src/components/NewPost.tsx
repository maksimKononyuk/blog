import { useState, useRef, useEffect, FC } from 'react'
import axios from '../axios'
import sendIcon from '../assets/send.png'
import { countPage } from '../Constants'
import { getTotalCount } from '../helpers'
import { PostType } from '../pages/Posts'

type PropsType = {
  currentPage: number
  setCurrentPage: (page: number) => void
  setPosts: (posts: PostType[]) => void
  updatePost: PostType | null
  setUpdatePost: (post: PostType | null) => void
}

export const NewPost: FC<PropsType> = ({
  currentPage,
  setCurrentPage,
  setPosts,
  updatePost,
  setUpdatePost
}) => {
  const [textOfPost, setTextOfPost] = useState('')
  const [fileUrl, setFileUrl] = useState('')

  const inputFile = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (updatePost) setTextOfPost(updatePost.message)
  }, [updatePost])

  const changeTextHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextOfPost(event.target.value)
  }

  const sendHandler = async () => {
    const sendingPost = textOfPost.trim()
    setTextOfPost('')
    if (updatePost) {
      await axios.put(`/api/posts/${updatePost._id}`, {
        message: sendingPost,
        mediaUrl: fileUrl
      })
      setUpdatePost(null)
    } else {
      if (sendingPost !== '') {
        await axios.post('/api/posts', {
          message: sendingPost,
          mediaUrl: fileUrl
        })
      }
    }
    const res = await axios.get<{ posts: PostType[] }>(
      `/api/posts?count=${countPage}&page=${currentPage}`
    )
    setPosts(res.data.posts)
    const lastPage = await getTotalCount()
    setCurrentPage(lastPage)
    setFileUrl('')
  }

  const chooseFileForSend = () => {
    inputFile.current?.click()
  }

  const changeInputFileHandler = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const formData = new FormData()
      if (event.target.files) formData.append('file', event.target.files[0])
      const res = await axios.post<{ url: string }>('/api/upload', formData)
      const fileUrl = res.data.url
      setFileUrl(fileUrl)
    } catch (err) {
      console.log('Проблема при загрузке файла', err)
      alert('Файл не загружен')
    }
  }

  const ctrlEnterHandler = (event: React.KeyboardEvent) => {
    if ((event.keyCode === 10 || event.keyCode === 13) && event.ctrlKey) {
      sendHandler()
    }
  }

  return (
    <div className='new-post-block'>
      <div className='new-post-block_choose-files'>
        <span onClick={chooseFileForSend}>{String.fromCodePoint(0x1f4ce)}</span>
        <input
          ref={inputFile}
          type={'file'}
          hidden
          onChange={changeInputFileHandler}
        />
      </div>
      <textarea
        placeholder='Введите сообщение...'
        value={textOfPost}
        onChange={changeTextHandler}
        onKeyDown={ctrlEnterHandler}
      />
      <div className='new-post-block_send'>
        <img src={sendIcon} alt='Отправить' onClick={sendHandler} />
      </div>
    </div>
  )
}
