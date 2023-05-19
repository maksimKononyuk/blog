import { Schema, model } from 'mongoose'

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    passwordHash: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default model('User', UserSchema)
