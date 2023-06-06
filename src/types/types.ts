import { Request } from 'express'

export interface RequestWithUserId extends Request {
  userId: string
}

export interface RequestWithQuery extends Request {
  query: {
    count: string
    page: string
  }
}

export interface RequestWithUserIdAndBody extends Request {
  userId: string
  body: {
    message: string
    mediaUrl: string
  }
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

export type UserFromDBType = {
  _doc: {
    _id: string
    fullName: string
    email: string
    passwordHash?: string
    createdAt: Date
    updatedAt: Date
  }
}
