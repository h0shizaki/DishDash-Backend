/* v8 ignore start */

import { ObjectId } from 'mongoose'
import { Gender } from './Gender'

export interface User {
    _id?: string | ObjectId
    username: string
    email: string
    firstname: string
    lastname: string
    password: string
    gender: Gender
    interestedCategory?: Array<string>
    interestedRecipe?: Array<string>
    uninterestedRecipe?: Array<string>
}
/* v8 ignore stop */
