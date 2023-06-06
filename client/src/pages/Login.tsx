import React, { FC } from 'react'
import { Navigate } from 'react-router-dom'
import { AuthType } from '../hooks/appHook'
import { useLoginHook } from '../hooks/loginHook'

type PropsType = {
  auth: AuthType
  setAuth: (obj: AuthType) => void
}

export const Login: FC<PropsType> = ({ setAuth, auth }) => {
  const { onChangeInput, loginButtonHandler, email, password } =
    useLoginHook(setAuth)

  if (auth.data._id) {
    return <Navigate to='/' />
  }

  return (
    <div className='register-block'>
      <div>{auth.data._id}</div>
      <div className='register-block_tytle'>Вход в аккаунт</div>
      <div className='register-block_inputs'>
        <input
          type='text'
          placeholder='E-mail'
          value={email}
          onChange={(event) => onChangeInput(event.target.value, 'email')}
        />
        <input
          type='text'
          placeholder='Пароль'
          value={password}
          onChange={(event) => onChangeInput(event.target.value, 'password')}
        />
      </div>
      <button onClick={loginButtonHandler}>Войти</button>
    </div>
  )
}
