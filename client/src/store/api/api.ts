import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { baseUrl } from '../../Constants'
export const api = createApi({
  reducerPath: 'api/api',
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl
  }),
  endpoints: (build) => ({
    getPosts: build.query({
      query: () => ({
        url: 'api/posts'
      })
    })
  })
})
