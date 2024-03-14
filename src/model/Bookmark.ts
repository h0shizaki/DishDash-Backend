/* v8 ignore start */

import { ObjectId } from 'mongoose'

export interface Bookmark {
    _id?: string | ObjectId
    userId: string
    recipes: Array<Record>
    title: string
    thumbnail?: string
}

export interface Record {
    recipeId: string
    rating: number
}
/* v8 ignore stop */
