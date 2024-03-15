/* v8 ignore start */

import { ObjectId, Types } from 'mongoose'

export interface Bookmark {
    _id?: string | Types.ObjectId 
    userId: Types.ObjectId | string| ObjectId
    records: Array<Record>
    title: string
    thumbnail?: string
}

export interface Record {
    recipe: Types.ObjectId 
    rating: number
}
/* v8 ignore stop */
