import { body } from 'express-validator'

export const postCreateValidator = [
  body('message', 'Введите сообщение')
    .isLength({
      min: 1
    })
    .isString(),
  body('mediaUrl', 'Неверная ссылка на медиа').optional().isString()
]
