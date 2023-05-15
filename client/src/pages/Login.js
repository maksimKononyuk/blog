import { useState } from 'react'
import axios from '../axios'
import { Navigate } from 'react-router-dom'

export const Login = ({ setAuth, auth }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onChangeInput = (value, input) => {
    if (input === 'email') setEmail(value)
    else setPassword(value)
  }

  const loginButtonHandler = async () => {
    try {
      const res = await axios.post('/api/auth/login', {
        email,
        password
      })
      const user = res.data
      setAuth((prev) => ({ data: user, status: 'loaded' }))
      window.localStorage.setItem('token', user.token)
    } catch (err) {
      alert('Не верные логин или пароль')
    }
  }

  if (auth.data) {
    return <Navigate to='/' />
  }

  return (
    <div className='register-block'>
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
