import express, { Request, Response } from 'express'
import { Server } from 'http'
import { Server as WSServer } from 'socket.io'
import dotenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import multer from 'multer'
import {
  loginValidator,
  postCreateValidator,
  registerValidator
} from './Validator/index.js'
import { handleValidationErrors, checkAuth } from './utils/index.js'
import { PostController, UserController } from './Controllers/index.js'

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

dotenv.config()

mongoose
  .connect(
    // между / и ? указать название базы данных (blog)
    process.env.DBCONNECT
  )
  .then(() => console.log('DB is OK!'))
  .catch((err) => console.log('DB erorr', err))

const app = express()

const PORT = process.env.PORT || 4444

const wsServer = new Server(app)
export const ws = new WSServer(wsServer, {
  cors: {
    origin: 'http://localhost:3000'
  }
})

interface MyRequest extends Request {
  originalnameFile: string
}

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, 'uploads')
  },
  filename: (req: MyRequest, file, cb) => {
    req.originalnameFile = Date.now() + '_' + file.originalname
    cb(null, req.originalnameFile)
  }
})

const upload = multer({ storage })

app.use(express.json())
if (process.env.NODE_ENV === 'development') app.use(cors())
app.use('/', express.static(path.join(__dirname, '../', 'client', 'build')))
app.use('/uploads', express.static('uploads'))

app.get('/api/auth/me', checkAuth, UserController.getMe)
app.post(
  '/api/auth/login',
  loginValidator,
  handleValidationErrors,
  UserController.login
)
app.post(
  '/api/auth/register',
  registerValidator,
  handleValidationErrors,
  UserController.register
)

app.post(
  '/api/upload',
  checkAuth,
  upload.single('file'),
  (req: MyRequest, res: Response) => {
    return res.json({
      url: `uploads/${req.originalnameFile}`
    })
  }
)

app.get('/api/posts', checkAuth, PostController.getAll)
app.get('/api/posts/:id', checkAuth, PostController.getOne)
app.post(
  '/api/posts',
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.create
)
app.delete('/api/posts/:id', checkAuth, PostController.remove)
app.put(
  '/api/posts/:id',
  checkAuth,
  postCreateValidator,
  handleValidationErrors,
  PostController.update
)

app.get('/health/status', (_, res: Response) => {
  return res.status(200).end()
})

app.get('/*', (_, res: Response) => {
  return res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

// app.get('*', (_, res: Response) => {
//   return res.status(404).end()
// })

ws.on('connection', (socket) => {
  console.log(`${socket.id} user подключился`)
  socket.on('disconnect', () => {
    console.log(`${socket.id} user отключился`)
  })
})

wsServer.listen(PORT, () => {
  const uploadDir = path.join(__dirname, '../', 'uploads')
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir)
  }
  console.log(`Server started... PORT ${PORT}`)
})
