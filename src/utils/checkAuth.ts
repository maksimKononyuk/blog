import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ResDataErrorType } from '../types/types.js'

type JwtType = {
  _id: string
}

interface MyRequest extends Request {
  userId: string
}

export default (req: MyRequest, res: Response, next: () => void) => {
  const token = (req.headers.authorization || '').replace(/Bearer\s?/, '')
  if (token) {
    try {
      const decodedToken = jwt.verify(token, 'secret123') as JwtType
      req.userId = decodedToken._id
      next()
    } catch (err) {
      return res.status(403).json({
        message: 'Нет доступа'
      } as ResDataErrorType)
    }
  } else {
    return res.status(403).json({
      message: 'Нет доступа'
    } as ResDataErrorType)
  }
}
