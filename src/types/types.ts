export type ResDataErrorType = {
  message: string
}

export type UserCreateType = {
  fullName: string
  email: string
  passwordHash: string
}

export type PostCreateType = {
  message: string
  userId: string
  mediaUrl: string
}
