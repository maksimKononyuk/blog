import axios from 'axios'
// import { baseUrl } from './Constants'

const instanse = axios
  .create
  //   {
  //   baseURL: baseUrl + 'api'
  // }
  ()

instanse.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem('token')
  return config
})

export default instanse
