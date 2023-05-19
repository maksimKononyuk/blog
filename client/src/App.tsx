import './App.css'
import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import { Register } from './pages/Register'
import { Login } from './pages/Login'
import { Posts } from './pages/Posts'
import { useAppHook } from './hooks/appHook'

function App() {
  const { auth, logoutButtonHandler, setAuth } = useAppHook()

  return (
    <>
      <div className='header'>
        <div className='user-name'>
          Пользователь:&nbsp;<span>{auth.data?.fullName}</span>
        </div>
        <div className='header_label'>
          <Link to='/'>
            <button>Главная</button>
          </Link>
        </div>
        <div className='header_buttons'>
          <Link to={!auth.data ? '/login' : '/add_post'}>
            <button>{!auth.data ? 'Войти' : 'Создать пост'}</button>
          </Link>
          {!auth.data ? (
            <Link to='/register'>
              <button>Регистрация</button>
            </Link>
          ) : (
            <div>
              <button onClick={logoutButtonHandler}>Выйти</button>
            </div>
          )}
        </div>
      </div>
      {auth.status === 'loaded' && (
        <div className='content'>
          <Routes>
            <Route
              path='/login'
              element={<Login setAuth={setAuth} auth={auth} />}
            />
            <Route path='/' element={<Posts auth={auth} />} />
            <Route path='/register' element={<Register />} />
            <Route path='/add_post/' element={<div>Добавление поста</div>} />
            <Route path='/posts/' element={<Posts auth={auth} />} />
          </Routes>
        </div>
      )}
    </>
  )
}

export default App
