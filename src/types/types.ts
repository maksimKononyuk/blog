import { Request } from 'express'

export interface RequestWithUserId extends Request {
  userId: string
}

export type ResDataErrorType = {
  message: string
}

export type UserCreateType = {
  fullName: string
  email: string
  password: string
}

export type UserModelType = {
  fullName: string
  email: string
  passwordHash: string
}

export type PostCreateType = {
  message: string
  userId: string
  mediaUrl: string
}
