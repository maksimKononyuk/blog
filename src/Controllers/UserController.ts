import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import UserModel from '../Models/User.js'
import {
  ResDataErrorType,
  UserCreateType,
  UserModelType,
  RequestWithUserId,
  UserFromDBType
} from '../types/types.js'

interface RequestWithBody extends Request {
  body: UserCreateType
}

export const register = async (req: RequestWithBody, res: Response) => {
  try {
    const { password, fullName, email } = req.body
    console.log(password, fullName, email)
    const candidate = await UserModel.findOne({ email: req.body.email })
    if (candidate) {
      return res.status(400).json({
        message: 'Такой пользователь уже существует!'
      } as ResDataErrorType)
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const doc = new UserModel<UserModelType>({
      email,
      fullName,
      passwordHash: hash
    })

    const user = await doc.save()

    const token = jwt.sign(
      {
        _id: user._id
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    )

    //здесь мы просто вытаскиваем из объекта документа свойство passwordHash, чтоб не передавать его на фронт
    const { passwordHash, ...userData } = user //user._doc TODO
    return res.json({ ...userData, token })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Не удалось зарегистрироваться' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const user = (await UserModel.findOne({
      email: req.body.email
    })) as UserFromDBType
    if (!user) {
      return res.status(403).json({ message: 'Неверный логин или пароль' })
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user._doc.passwordHash //user._doc.passwordHash TODO
    )
    if (!isValidPass) {
      return res
        .status(403)
        .json({ message: 'Неверный логин или пароль' } as ResDataErrorType)
    }

    const token = jwt.sign(
      {
        _id: user._doc._id
      },
      'secret123',
      {
        expiresIn: '30d'
      }
    )
    //здесь мы просто вытаскиваем из объекта документа свойство passwordHash, чтоб не передавать его на фронт
    const { passwordHash, ...userData } = user._doc

    return res.json({ ...userData, token })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Не удалось авторизоваться' })
  }
}

export const getMe = async (req: RequestWithUserId, res: Response) => {
  try {
    const user = await UserModel.findOne({ _id: req.userId })
    if (!user) {
      return res.status(404).json({
        message: 'Пользователь не найден'
      })
    }

    //здесь мы просто вытаскиваем из объекта документа свойство passwordHash, чтоб не передавать его на фронт
    const { passwordHash, ...userData } = user //user._doc TODO

    return res.json({ ...userData })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Нет доступа' })
  }
}
