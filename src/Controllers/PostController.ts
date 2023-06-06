import { Request, Response } from 'express'
import PostModel from '../Models/Post.js'
import {
  UserFromDBType,
  RequestWithUserIdAndBody,
  RequestWithUserId
} from '../types/types.js'

type PostType = {
  user: UserFromDBType
}

const hidePasswordHash = (post: PostType) => {
  // Убираем хеш паролея перед отправкой на фронт одного поста
  const { passwordHash, ...userData } = post.user._doc
  return userData
}

export const create = async (req: RequestWithUserIdAndBody, res: Response) => {
  try {
    const doc = new PostModel({
      message: req.body.message,
      mediaUrl: req.body.mediaUrl,
      user: req.userId
    })

    const post = await doc.save()
    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Не удалось создать запись' })
  }
}

export const getAll = async (req: Request, res: Response) => {
  try {
    const count = +req.query.count || 20
    if (count > 20)
      throw new Error('Превышен возвращаемый лимит в 20 сообщений')
    const page = +req.query.page || 1
    const skip = (page - 1) * count
    const totalCount = await PostModel.countDocuments()
    if (!totalCount) {
      return res.json({ posts: [], totalCount })
    }
    if (req.query.page && skip >= totalCount) {
      throw new Error('Запрашиваемой старинины не существует')
    }
    const posts = await PostModel.find()
      .populate('user')
      .skip(skip)
      .limit(count)
      .exec()

    posts.forEach((elem) => {
      // Убираем хеши паролей перед отправкой на фронт массива постов
      const post: PostType = elem as unknown as PostType
      post.user._doc = hidePasswordHash(post)
    })

    return res.json({ posts, totalCount })
  } catch (err) {
    console.log(err)
    return res
      .status(500)
      .json({ message: 'Не удалось получить статьи. ' + err.message })
  }
}

export const getOne = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id

    const post = (await PostModel.findById(postId)
      .populate('user')
      .exec()) as unknown as PostType

    // Убираем хеш паролея перед отправкой на фронт одного поста
    post.user._doc = hidePasswordHash(post)

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Не удалось получить статью' })
  }
}

export const remove = async (req: RequestWithUserId, res: Response) => {
  try {
    const postId = req.params.id

    const post = await PostModel.findOne({ _id: postId, user: req.userId })

    if (post) {
      const deletedPost = await PostModel.findOneAndRemove({ _id: postId })
      if (deletedPost) {
        return res.json({ success: true })
      } else {
        return res.status(404).json({ message: 'Статья не найдена' })
      }
    } else {
      throw new Error('Эта статья не ваша. Вы не имеете права удалять ее!')
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Не удалось удалить статью' })
  }
}

export const update = async (req: RequestWithUserIdAndBody, res: Response) => {
  try {
    const postId = req.params.id

    await PostModel.updateOne(
      { _id: postId },
      {
        message: req.body.message,
        mediaUrl: req.body.mediaUrl,
        user: req.userId
      }
    )

    return res.json({ success: true })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Не удалось обновить статью' })
  }
}
