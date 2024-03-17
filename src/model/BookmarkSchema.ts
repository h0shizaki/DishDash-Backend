/* v8 ignore start */

import { Bookmark } from './Bookmark'
import { Schema, Types, model } from 'mongoose'

const BookmarkSchema = new Schema<Bookmark>({
    records: [{ recipe: {type: Types.ObjectId, ref: 'recipe' }, rating: Number} ],
    title: { type: String, required: true },
    thumbnail: { type: String, required: false },
    userId: { type: Schema.ObjectId, ref: 'user' , required: true },
})

export const BookmarkM = model('bookmark', BookmarkSchema)
/* v8 ignore stop */
