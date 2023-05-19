import { useState, useCallback } from 'react'
import axios from '../axios'
import { AuthType, UserType } from './appHook'

export const useLoginHook = (setAuth: (auth: AuthType) => void) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onChangeInput = useCallback((value: string, input: string) => {
    if (input === 'email') setEmail(value)
    else setPassword(value)
  }, [])

  const loginButtonHandler = useCallback(async () => {
    try {
      const res = await axios.post<UserType>('/api/auth/login', {
        email,
        password
      })
      const user: UserType = res.data
      setAuth({ data: user, status: 'loaded' })
      if (user.token) window.localStorage.setItem('token', user.token)
    } catch (err) {
      alert('Не верные логин или пароль')
    }
  }, [email, password, setAuth])

  return { onChangeInput, loginButtonHandler, email, password }
}
