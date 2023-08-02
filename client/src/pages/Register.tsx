import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { UserType } from '../hooks/appHook'
import axios from '../axios'

type AuthDataType = {
  fullName: string
  email: string
  password: string
}

const initialState: AuthDataType = {
  fullName: '',
  email: '',
  password: ''
}

export const Register = () => {
  const [authData, setAuthData] = useState(initialState)
  const [isRegister, setIsRegister] = useState(false)

  const registerHandler = async () => {
    if (authData.fullName && authData.email && authData.password) {
      try {
        const res = await axios.post<UserType>('/api/auth/register', {
          fullName: authData.fullName,
          email: authData.email,
          password: authData.password
        })
        const user = res.data
        if (user) {
          setIsRegister(true)
        }
      } catch (err) {
        alert('Пользователь не был создан')
      }
    }
  }
  if (isRegister) return <Navigate to='/login' />
  return (
    <div className='register-block'>
      <div className='register-block_tytle'>Регистрация</div>
      <div className='register-block_inputs'>
        <input
          type='text'
          placeholder='Полное имя'
          value={authData.fullName}
          onChange={(event) =>
            setAuthData((prev) => ({ ...prev, fullName: event.target.value }))
          }
        />
        <input
          type='text'
          placeholder='E-mail'
          value={authData.email}
          onChange={(event) =>
            setAuthData((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <input
          type='text'
          placeholder='Пароль'
          value={authData.password}
          onChange={(event) =>
            setAuthData((prev) => ({ ...prev, password: event.target.value }))
          }
        />
      </div>
      <button onClick={registerHandler}>Зарегистрироваться</button>
    </div>
  )
}
