/* v8 ignore start */

import { Gender } from './Gender'
import { User } from './User'
import { Schema, model } from 'mongoose'

const UserSchema = new Schema<User>({
    username: { type: String, required: true },
    email: { type: String, required: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    password: { type: String, required: true },
    gender: { type: String, enum: Gender, required: true },
    interestedCategory: { type: Array<string>, required: true },
    interestedRecipe: { type: Array<string>, required: true },
    uninterestedCategory: { type: Array<string>, required: true },
})

export const UserM = model('user', UserSchema)
/* v8 ignore stop */
