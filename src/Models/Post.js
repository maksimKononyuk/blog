import { Schema, model, Types } from 'mongoose'

const PostSchema = new Schema(
  {
    message: {
      type: String,
      required: true
    },
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    mediaUrl: String
  },
  {
    timestamps: true
  }
)

export default model('Post', PostSchema)
