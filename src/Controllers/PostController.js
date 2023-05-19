import PostModel from '../Models/Post.js'

const hidePasswordHash = (post) => {
  // Убираем хеш паролея перед отправкой на фронт одного поста
  const { passwordHash, ...userData } = post.user._doc
  return userData
}

export const create = async (req, res) => {
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

export const getAll = async (req, res) => {
  try {
    const count = req.query.count || 20
    if (count > 20)
      throw new Error('Превышен возвращаемый лимит в 20 сообщений')
    const page = req.query.page || 1
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

    posts.forEach((post) => {
      // Убираем хеши паролей перед отправкой на фронт массива постов
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

export const getOne = async (req, res) => {
  try {
    const postId = req.params.id

    const post = await PostModel.findById(postId).populate('user').exec()

    // Убираем хеш паролея перед отправкой на фронт одного поста
    post.user._doc = hidePasswordHash(post)

    return res.json(post)
  } catch (err) {
    console.log(err)
    return res.status(500).json({ message: 'Не удалось получить статью' })
  }
}

export const remove = async (req, res) => {
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

export const update = async (req, res) => {
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
