/* v8 ignore start */

import { Types } from 'mongoose'
import { Gender } from './Gender'

export interface User {
    _id?: string | Types.ObjectId
    username: string
    email: string
    firstname: string
    lastname: string
    password: string
    gender: Gender
    interestedCategory?: Array<string>
    interestedRecipe?: Array<string>
    uninterestedCategory?: Array<string>
}
/* v8 ignore stop */
