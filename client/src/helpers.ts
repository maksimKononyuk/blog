import axios from './axios'
import { countPage } from './Constants'
import { PostType } from './pages/Posts'

export const getTotalCount = async () => {
  const res = await axios.get<{ posts: PostType[]; totalCount: number }>(
    `/api/posts?count=1&page=1`
  )
  const totalCount = res.data.totalCount
  let lastPage = Math.ceil(totalCount / countPage)
  if (!lastPage) lastPage = 1
  return lastPage
}
