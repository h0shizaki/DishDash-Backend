/* v8 ignore start */

import { Bookmark } from './Bookmark'
import { Schema, model } from 'mongoose'

const BookmarkSchema = new Schema<Bookmark>({
    recipes: { type: [{ recipeId: String, rating: Number }], required: true },
    title: { type: String, required: true },
    thumbnail: { type: String, required: false },
    userId: { type: String, required: true },
})

export const BookmarkM = model('bookmark', BookmarkSchema)
/* v8 ignore stop */
