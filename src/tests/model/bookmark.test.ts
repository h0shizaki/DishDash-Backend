import { expect, test } from 'vitest'
import { Bookmark, Record } from '../../model/Bookmark'
import {Types } from 'mongoose'

test('should have the correct properties', () => {
    const objId = new Types.ObjectId('65d5e4938598535be43ecbbd')
    const bookmark: Bookmark = {
        _id: 'someId',
        userId: objId,
        records: [{ recipe: objId , rating: 5 }],
        title: 'Bookmark title',
        thumbnail: 'thumbnailUrl',
    }

    expect(bookmark._id).toEqual('someId')
    expect(bookmark.userId).toEqual(objId)
    expect(bookmark.records).toEqual([{ recipe: objId, rating: 5 }])
    expect(bookmark.title).toEqual('Bookmark title')
    expect(bookmark.thumbnail).toEqual('thumbnailUrl')
})

test('should have the correct properties', () => {
    const objId = new Types.ObjectId('65d5e4938598535be43ecbbd')

    const record: Record = {
        recipe: objId,
        rating: 5,
    }

    expect(record.recipe).toEqual(objId)
    expect(record.rating).toEqual(5)
})
