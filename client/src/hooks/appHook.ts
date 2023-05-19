import { useEffect, useState, useCallback } from 'react'
import axios from '../axios'

export type UserType = {
  _id: string | null
  fullName: string | null
  email: string | null
  createdAt: Date | null
  updatedAt: Date | null
  token: string | null
}

export type AuthType = {
  data: UserType
  status: string
}

const initialState: UserType = {
  _id: null,
  fullName: null,
  email: null,
  createdAt: null,
  updatedAt: null,
  token: null
}

export const useAppHook = () => {
  const [auth, setAuth] = useState<AuthType>({
    data: initialState,
    status: 'loading'
  })
  useEffect(() => {
    const authMe = async () => {
      try {
        const res = await axios.get<UserType>('/api/auth/me')
        setAuth({ data: res.data, status: 'loaded' })
      } catch (err) {
        setAuth({ data: initialState, status: 'loaded' })
        console.log('Ошибка авторизации')
      }
    }
    authMe()
  }, [])

  const logoutButtonHandler = useCallback(() => {
    if (window.confirm('Вы действительно хотите выйти из аккаунта?'))
      setAuth({ data: initialState, status: 'loaded' })
    window.localStorage.removeItem('token')
  }, [])

  return { auth, logoutButtonHandler, setAuth }
}
