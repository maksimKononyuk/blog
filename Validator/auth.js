import { body } from 'express-validator'

export const registerValidator = [
  body('email', 'Некорректный email').isEmail(),
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({
    min: 5
  }),
  body('fullName', 'Имя должно состоять минимум из 3 символов').isLength({
    min: 3
  })
]

export const loginValidator = [
  body('email', 'Некорректный email').isEmail(),
  body('password', 'Пароль должен содержать минимум 5 символов').isLength({
    min: 5
  })
]
