import { Bookmark, Record } from '../model/Bookmark'
import { IBookMark } from './interface/IBookMart'
import { BookmarkM } from '../model/BookmarkSchema'
import { Types } from 'mongoose'
import '../model/RecipeSchema'

export class BookmarkService implements IBookMark {
    async findAllBookmarkFolder(userId: string): Promise<Bookmark[]> {
        const res = await BookmarkM.find({ userId: new Types.ObjectId(userId) })
            .populate('records.recipe')
            .exec()
        return res
    }
    async find(id: string): Promise<Bookmark | null> {
        const res = await BookmarkM.findOne({ _id: new Types.ObjectId(id) })
            .populate('records.recipe')
            .exec()
        return res
    }
    async save(bookmark: Bookmark): Promise<Bookmark> {
        const newBookmark = new BookmarkM(bookmark)
        const res = await newBookmark.save()
        return res
    }
    async update(id: string, bookmark: Bookmark): Promise<Bookmark | null> {
        const filter = { _id: id }

        const res = await BookmarkM.findByIdAndUpdate(filter, bookmark, {
            new: true,
            upsert: true,
        })
        return res
    }

    async appendRecord(id: string, record: Record): Promise<boolean | null> {
        const bookmark = await this.find(id)
        if (!bookmark) throw new Error('Bookmark not found')
        try{
            if (bookmark.records.length >= 1) {
                let isDuplicate = false;
                bookmark.records.forEach(async rec => {
                    if (rec.recipe._id.toString() === record.recipe.toString()) {
                        isDuplicate = true
                        rec.rating = record.rating
                        await this.update(id, bookmark)
                        return true
                    } 
                })

                if(!isDuplicate) {
                    bookmark.records.push(record)
                    await this.update(id, bookmark)
                    return true
                }

            } else {
                bookmark.records.push(record)
                await this.update(id, bookmark)
                return true
            }
    
            return true
        }catch(e){
            console.error(e);
            return false
        }
        
    }

    async removeRecord(id: string, recipeId: string): Promise<boolean | null> {
        const bookmark = await this.find(id)
        const filter = { _id: id }
        if (!bookmark) throw new Error('Bookmark not found')
        await BookmarkM.updateOne(filter, { "$pull": { "records": { "recipe": recipeId } }} )
        return true
    }
}