import { expect, test } from 'vitest'
import { Bookmark, Record } from '../../model/Bookmark'

test('should have the correct properties', () => {
    const bookmark: Bookmark = {
        _id: 'someId',
        userId: 'userId1',
        recipes: [{ recipeId: 'recipeId1', rating: 5 }],
        title: 'Bookmark title',
        thumbnail: 'thumbnailUrl',
    }

    expect(bookmark._id).toEqual('someId')
    expect(bookmark.userId).toEqual('userId1')
    expect(bookmark.recipes).toEqual([{ recipeId: 'recipeId1', rating: 5 }])
    expect(bookmark.title).toEqual('Bookmark title')
    expect(bookmark.thumbnail).toEqual('thumbnailUrl')
})
test('should have the correct properties', () => {
    const record: Record = {
        recipeId: 'recipeId1',
        rating: 5,
    }

    expect(record.recipeId).toEqual('recipeId1')
    expect(record.rating).toEqual(5)
})
