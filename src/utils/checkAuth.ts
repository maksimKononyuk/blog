import { NextFunction, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ResDataErrorType, RequestWithUserId } from '../types/types.js'

type JwtType = {
  _id: string
}

export default (req: RequestWithUserId, res: Response, next: NextFunction) => {
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
